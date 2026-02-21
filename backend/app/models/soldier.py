import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.database import Base


class Soldier(Base):
    __tablename__ = "soldiers"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(200))
    phone: Mapped[str] = mapped_column(String(20), unique=True)
    email: Mapped[str | None] = mapped_column(String(200), nullable=True)
    idf_unit: Mapped[str | None] = mapped_column(String(100), nullable=True)
    idf_base: Mapped[str | None] = mapped_column(String(100), nullable=True)
    apartment_address: Mapped[str] = mapped_column(String(500))
    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    language: Mapped[str] = mapped_column(String(5), default="he")
    verified: Mapped[bool] = mapped_column(Boolean, default=False)
    contact_method: Mapped[str] = mapped_column(String(20), default="whatsapp")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    requests: Mapped[list["Request"]] = relationship(back_populates="soldier")
