import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.soldier import Soldier
from app.schemas.soldier import SoldierCreate, SoldierResponse, SoldierUpdate

router = APIRouter()


@router.post("", response_model=dict, status_code=201)
async def create_soldier(body: SoldierCreate, db: AsyncSession = Depends(get_db)):
    # Check for duplicate phone
    existing = await db.execute(
        select(Soldier).where(Soldier.phone == body.phone)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Phone number already registered")

    soldier = Soldier(**body.model_dump())
    db.add(soldier)
    await db.commit()
    await db.refresh(soldier)
    return {"data": SoldierResponse.model_validate(soldier)}


@router.get("/{soldier_id}", response_model=dict)
async def get_soldier(soldier_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Soldier).where(Soldier.id == soldier_id))
    soldier = result.scalar_one_or_none()
    if not soldier:
        raise HTTPException(status_code=404, detail="Soldier not found")
    return {"data": SoldierResponse.model_validate(soldier)}


@router.patch("/{soldier_id}", response_model=dict)
async def update_soldier(
    soldier_id: uuid.UUID,
    body: SoldierUpdate,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Soldier).where(Soldier.id == soldier_id))
    soldier = result.scalar_one_or_none()
    if not soldier:
        raise HTTPException(status_code=404, detail="Soldier not found")

    updates = body.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(soldier, field, value)

    await db.commit()
    await db.refresh(soldier)
    return {"data": SoldierResponse.model_validate(soldier)}
