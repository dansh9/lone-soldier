import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.database import Base
from app.models.enums import Platform


class ScannedPost(Base):
    __tablename__ = "scanned_posts"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    source_platform: Mapped[Platform]
    external_id: Mapped[str] = mapped_column(String(200))
    raw_text: Mapped[str] = mapped_column(Text)
    extracted_item: Mapped[str | None] = mapped_column(String(200), nullable=True)
    extracted_category: Mapped[str | None] = mapped_column(String(100), nullable=True)
    extracted_condition: Mapped[str | None] = mapped_column(String(50), nullable=True)
    location_text: Mapped[str | None] = mapped_column(String(300), nullable=True)
    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    contact_info: Mapped[str | None] = mapped_column(String(200), nullable=True)
    post_date: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    scraped_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    dedup_hash: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    is_available: Mapped[bool] = mapped_column(Boolean, default=True)

    matches: Mapped[list["Match"]] = relationship(back_populates="post")
