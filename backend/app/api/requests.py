import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models.enums import RequestStatus
from app.models.request import Request
from app.models.soldier import Soldier
from app.schemas.match import MatchResponse
from app.schemas.request import RequestCreate, RequestResponse, RequestStatusUpdate

router = APIRouter()


@router.post("", response_model=dict, status_code=201)
async def create_request(body: RequestCreate, db: AsyncSession = Depends(get_db)):
    # Verify soldier exists
    result = await db.execute(select(Soldier).where(Soldier.id == body.soldier_id))
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Soldier not found")

    request = Request(**body.model_dump())
    db.add(request)
    await db.commit()
    await db.refresh(request)
    return {"data": RequestResponse.model_validate(request)}


@router.get("/{request_id}", response_model=dict)
async def get_request(request_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Request)
        .where(Request.id == request_id)
        .options(selectinload(Request.matches))
    )
    request = result.scalar_one_or_none()
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")

    matches = [MatchResponse.model_validate(m) for m in request.matches]
    return {
        "data": {
            **RequestResponse.model_validate(request).model_dump(),
            "matches": [m.model_dump() for m in matches],
        }
    }


@router.get("", response_model=dict)
async def list_requests(
    soldier_id: uuid.UUID | None = Query(None),
    status: RequestStatus | None = Query(None),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
):
    query = select(Request)
    if soldier_id:
        query = query.where(Request.soldier_id == soldier_id)
    if status:
        query = query.where(Request.status == status)
    query = query.order_by(Request.created_at.desc()).limit(limit).offset(offset)

    result = await db.execute(query)
    requests = result.scalars().all()
    return {
        "data": [RequestResponse.model_validate(r) for r in requests],
        "meta": {"limit": limit, "offset": offset},
    }


@router.patch("/{request_id}/status", response_model=dict)
async def update_request_status(
    request_id: uuid.UUID,
    body: RequestStatusUpdate,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Request).where(Request.id == request_id))
    request = result.scalar_one_or_none()
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")

    request.status = body.status
    if body.status == RequestStatus.FULFILLED:
        request.fulfilled_at = datetime.now(timezone.utc)

    await db.commit()
    await db.refresh(request)
    return {"data": RequestResponse.model_validate(request)}
