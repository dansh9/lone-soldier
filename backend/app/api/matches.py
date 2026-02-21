import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models.enums import MatchStatus, Platform, RequestStatus
from app.models.match import Match
from app.models.request import Request
from app.models.scanned_post import ScannedPost
from app.schemas.match import (
    ManualMatchCreate,
    MatchDetailResponse,
    MatchResponse,
    MatchUpdate,
)
from app.services.dedup import compute_dedup_hash

router = APIRouter()


@router.get("", response_model=dict)
async def list_matches(
    status: MatchStatus | None = Query(None),
    request_id: uuid.UUID | None = Query(None),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
):
    query = select(Match)
    if status:
        query = query.where(Match.status == status)
    if request_id:
        query = query.where(Match.request_id == request_id)
    query = query.order_by(Match.created_at.desc()).limit(limit).offset(offset)

    result = await db.execute(query)
    matches = result.scalars().all()
    return {
        "data": [MatchResponse.model_validate(m) for m in matches],
        "meta": {"limit": limit, "offset": offset},
    }


@router.get("/{match_id}", response_model=dict)
async def get_match(match_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Match)
        .where(Match.id == match_id)
        .options(selectinload(Match.request), selectinload(Match.post))
    )
    match = result.scalar_one_or_none()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    return {"data": MatchDetailResponse.model_validate(match)}


@router.patch("/{match_id}", response_model=dict)
async def update_match(
    match_id: uuid.UUID,
    body: MatchUpdate,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Match)
        .where(Match.id == match_id)
        .options(selectinload(Match.request))
    )
    match = result.scalar_one_or_none()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")

    updates = body.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(match, field, value)

    # Update related request status based on match status
    if body.status == MatchStatus.ACCEPTED:
        match.resolved_at = datetime.now(timezone.utc)
        match.request.status = RequestStatus.FULFILLED
        match.request.fulfilled_at = datetime.now(timezone.utc)
    elif body.status == MatchStatus.REJECTED:
        match.resolved_at = datetime.now(timezone.utc)
    elif body.status == MatchStatus.COORDINATOR_APPROVED:
        match.request.status = RequestStatus.PENDING_ACCEPTANCE

    await db.commit()
    await db.refresh(match)
    return {"data": MatchResponse.model_validate(match)}


@router.post("/manual", response_model=dict, status_code=201)
async def create_manual_match(
    body: ManualMatchCreate,
    db: AsyncSession = Depends(get_db),
):
    # Verify request exists
    result = await db.execute(select(Request).where(Request.id == body.request_id))
    request = result.scalar_one_or_none()
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")

    post_id = body.post_id

    # If no existing post, create one from free text
    if not post_id and body.item_description:
        raw_text = body.item_description
        post = ScannedPost(
            source_platform=Platform.MANUAL,
            external_id=f"manual-{uuid.uuid4().hex[:8]}",
            raw_text=raw_text,
            extracted_item=body.item_description,
            extracted_category=request.category,
            location_text=body.location,
            contact_info=body.donor_contact,
            dedup_hash=compute_dedup_hash("manual", raw_text, raw_text),
        )
        db.add(post)
        await db.flush()
        post_id = post.id
    elif post_id:
        result = await db.execute(
            select(ScannedPost).where(ScannedPost.id == post_id)
        )
        if not result.scalar_one_or_none():
            raise HTTPException(status_code=404, detail="Post not found")
    else:
        raise HTTPException(
            status_code=400,
            detail="Must provide either post_id or item_description",
        )

    match = Match(
        request_id=body.request_id,
        post_id=post_id,
        score=1.0,  # Manual matches get perfect score
        status=MatchStatus.COORDINATOR_APPROVED,
    )
    db.add(match)

    request.status = RequestStatus.PENDING_ACCEPTANCE
    await db.commit()
    await db.refresh(match)
    return {"data": MatchResponse.model_validate(match)}
