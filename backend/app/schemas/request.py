import uuid
from datetime import datetime

from pydantic import BaseModel, Field

from app.models.enums import RequestStatus, Urgency


class RequestCreate(BaseModel):
    soldier_id: uuid.UUID
    category: str = Field(..., max_length=100)
    item_name: str = Field(..., max_length=200)
    description: str | None = None
    urgency: Urgency = Urgency.MEDIUM
    dimensions: str | None = Field(None, max_length=100)
    photo_url: str | None = Field(None, max_length=500)


class RequestStatusUpdate(BaseModel):
    status: RequestStatus


class RequestResponse(BaseModel):
    id: uuid.UUID
    soldier_id: uuid.UUID
    category: str
    item_name: str
    description: str | None
    urgency: Urgency
    dimensions: str | None
    photo_url: str | None
    status: RequestStatus
    created_at: datetime
    fulfilled_at: datetime | None

    model_config = {"from_attributes": True}
