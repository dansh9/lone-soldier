import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.database import Base
from app.models.enums import RequestStatus, Urgency


class Request(Base):
    __tablename__ = "requests"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    soldier_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("soldiers.id"))
    category: Mapped[str] = mapped_column(String(100))
    item_name: Mapped[str] = mapped_column(String(200))
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    urgency: Mapped[Urgency] = mapped_column(default=Urgency.MEDIUM)
    dimensions: Mapped[str | None] = mapped_column(String(100), nullable=True)
    photo_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    status: Mapped[RequestStatus] = mapped_column(default=RequestStatus.OPEN)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    fulfilled_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    soldier: Mapped["Soldier"] = relationship(back_populates="requests")
    matches: Mapped[list["Match"]] = relationship(back_populates="request")
