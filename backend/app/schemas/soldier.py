import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class SoldierCreate(BaseModel):
    name: str = Field(..., max_length=200)
    phone: str = Field(..., max_length=20)
    email: str | None = Field(None, max_length=200)
    idf_unit: str | None = Field(None, max_length=100)
    idf_base: str | None = Field(None, max_length=100)
    apartment_address: str = Field(..., max_length=500)
    language: str = Field("he", max_length=5)
    contact_method: str = Field("whatsapp", max_length=20)


class SoldierUpdate(BaseModel):
    name: str | None = Field(None, max_length=200)
    email: str | None = Field(None, max_length=200)
    idf_unit: str | None = Field(None, max_length=100)
    idf_base: str | None = Field(None, max_length=100)
    apartment_address: str | None = Field(None, max_length=500)
    language: str | None = Field(None, max_length=5)
    contact_method: str | None = Field(None, max_length=20)


class SoldierResponse(BaseModel):
    id: uuid.UUID
    name: str
    phone: str
    email: str | None
    idf_unit: str | None
    idf_base: str | None
    apartment_address: str
    language: str
    verified: bool
    contact_method: str
    created_at: datetime

    model_config = {"from_attributes": True}
