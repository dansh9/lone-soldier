from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import datetime


@dataclass
class RawPost:
    external_id: str
    platform: str
    text: str
    post_date: datetime | None = None
    location_text: str | None = None
    contact_info: str | None = None


class BaseScraper(ABC):
    @abstractmethod
    async def fetch_recent_posts(self, since_hours: int = 6) -> list[RawPost]:
        ...
