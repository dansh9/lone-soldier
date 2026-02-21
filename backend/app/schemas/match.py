import uuid
from datetime import datetime

from pydantic import BaseModel, Field

from app.models.enums import MatchStatus
from app.schemas.request import RequestResponse
from app.schemas.scanned_post import ScannedPostResponse


class MatchUpdate(BaseModel):
    status: MatchStatus | None = None
    coordinator_notes: str | None = None


class ManualMatchCreate(BaseModel):
    request_id: uuid.UUID
    post_id: uuid.UUID | None = None
    # For free-text manual matches (no existing post)
    item_description: str | None = Field(None, max_length=500)
    donor_contact: str | None = Field(None, max_length=200)
    location: str | None = Field(None, max_length=300)


class MatchResponse(BaseModel):
    id: uuid.UUID
    request_id: uuid.UUID
    post_id: uuid.UUID
    score: float
    distance_km: float | None
    status: MatchStatus
    coordinator_notes: str | None
    notified_at: datetime | None
    created_at: datetime
    resolved_at: datetime | None

    model_config = {"from_attributes": True}


class MatchDetailResponse(MatchResponse):
    request: RequestResponse
    post: ScannedPostResponse
