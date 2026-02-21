import uuid
from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.database import Base
from app.models.enums import MatchStatus


class Match(Base):
    __tablename__ = "matches"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    request_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("requests.id"))
    post_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("scanned_posts.id"))
    score: Mapped[float] = mapped_column(Float)
    distance_km: Mapped[float | None] = mapped_column(Float, nullable=True)
    status: Mapped[MatchStatus] = mapped_column(default=MatchStatus.PENDING_REVIEW)
    coordinator_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    notified_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    resolved_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    request: Mapped["Request"] = relationship(back_populates="matches")
    post: Mapped["ScannedPost"] = relationship(back_populates="matches")

    __table_args__ = (
        UniqueConstraint("request_id", "post_id", name="uq_request_post"),
    )
