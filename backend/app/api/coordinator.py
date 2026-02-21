from datetime import datetime, timezone

from fastapi import APIRouter, Depends, Query
from sqlalchemy import case, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models.enums import MatchStatus, RequestStatus
from app.models.match import Match
from app.models.request import Request
from app.schemas.match import MatchDetailResponse
from app.schemas.request import RequestResponse

router = APIRouter()


@router.get("/feed", response_model=dict)
async def coordinator_feed(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
):
    """Matches pending coordinator review, newest first."""
    result = await db.execute(
        select(Match)
        .where(Match.status == MatchStatus.PENDING_REVIEW)
        .options(selectinload(Match.request), selectinload(Match.post))
        .order_by(Match.created_at.desc())
        .limit(limit)
        .offset(offset)
    )
    matches = result.scalars().all()
    return {
        "data": [MatchDetailResponse.model_validate(m) for m in matches],
        "meta": {"limit": limit, "offset": offset},
    }


@router.get("/requests", response_model=dict)
async def open_requests(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
):
    """Open requests sorted by age (oldest first) with aging info."""
    result = await db.execute(
        select(Request)
        .where(Request.status == RequestStatus.OPEN)
        .order_by(Request.created_at.asc())
        .limit(limit)
        .offset(offset)
    )
    requests = result.scalars().all()

    now = datetime.now(timezone.utc)
    data = []
    for r in requests:
        resp = RequestResponse.model_validate(r).model_dump()
        age_hours = (now - r.created_at).total_seconds() / 3600
        resp["age_hours"] = round(age_hours, 1)
        if age_hours < 24:
            resp["age_level"] = "fresh"
        elif age_hours < 72:
            resp["age_level"] = "aging"
        elif age_hours < 168:
            resp["age_level"] = "old"
        else:
            resp["age_level"] = "critical"
        data.append(resp)

    return {"data": data, "meta": {"limit": limit, "offset": offset}}


@router.get("/fulfilled", response_model=dict)
async def fulfilled_requests(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
):
    """Fulfilled requests for reporting, newest first."""
    result = await db.execute(
        select(Request)
        .where(Request.status == RequestStatus.FULFILLED)
        .order_by(Request.fulfilled_at.desc())
        .limit(limit)
        .offset(offset)
    )
    requests = result.scalars().all()
    return {
        "data": [RequestResponse.model_validate(r) for r in requests],
        "meta": {"limit": limit, "offset": offset},
    }


@router.get("/analytics", response_model=dict)
async def analytics(db: AsyncSession = Depends(get_db)):
    """Dashboard analytics aggregations."""
    # Total counts by status
    status_counts = await db.execute(
        select(Request.status, func.count(Request.id)).group_by(Request.status)
    )
    by_status = {row[0].value: row[1] for row in status_counts.all()}

    # Average time to match (for fulfilled requests)
    avg_ttm = await db.execute(
        select(
            func.avg(
                func.extract("epoch", Request.fulfilled_at - Request.created_at) / 3600
            )
        ).where(Request.status == RequestStatus.FULFILLED)
    )
    avg_time_to_match_hours = avg_ttm.scalar()

    # Match rate (fulfilled / total)
    total = sum(by_status.values()) if by_status else 0
    fulfilled = by_status.get("fulfilled", 0)
    match_rate = (fulfilled / total * 100) if total > 0 else 0

    # Top unmet categories
    unmet = await db.execute(
        select(Request.category, func.count(Request.id))
        .where(Request.status == RequestStatus.OPEN)
        .group_by(Request.category)
        .order_by(func.count(Request.id).desc())
        .limit(10)
    )
    top_unmet = [{"category": row[0], "count": row[1]} for row in unmet.all()]

    # Source performance
    source_stats = await db.execute(
        select(
            Match.status,
            func.count(Match.id),
        ).group_by(Match.status)
    )
    match_by_status = {row[0].value: row[1] for row in source_stats.all()}

    return {
        "data": {
            "requests_by_status": by_status,
            "avg_time_to_match_hours": round(avg_time_to_match_hours, 1)
            if avg_time_to_match_hours
            else None,
            "match_rate_percent": round(match_rate, 1),
            "top_unmet_categories": top_unmet,
            "matches_by_status": match_by_status,
            "total_requests": total,
            "total_fulfilled": fulfilled,
        }
    }
