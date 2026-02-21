import uuid
from datetime import datetime

from pydantic import BaseModel

from app.models.enums import Platform


class ScannedPostResponse(BaseModel):
    id: uuid.UUID
    source_platform: Platform
    external_id: str
    raw_text: str
    extracted_item: str | None
    extracted_category: str | None
    extracted_condition: str | None
    location_text: str | None
    contact_info: str | None
    post_date: datetime | None
    scraped_at: datetime
    is_available: bool

    model_config = {"from_attributes": True}
