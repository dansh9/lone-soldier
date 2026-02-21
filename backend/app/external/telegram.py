import json
import logging
from datetime import datetime
from pathlib import Path

from app.external.base import BaseScraper, RawPost

logger = logging.getLogger(__name__)


class TelegramScraper(BaseScraper):
    """Stub scraper for Telegram channels. Returns sample data."""

    async def fetch_recent_posts(self, since_hours: int = 6) -> list[RawPost]:
        logger.info("[STUB] Telegram scraper called — returning sample posts")
        sample_file = Path(__file__).parent.parent / "seed" / "sample_posts.json"
        data = json.loads(sample_file.read_text(encoding="utf-8"))
        return [
            RawPost(
                external_id=p["id"],
                platform="telegram",
                text=p["text"],
                post_date=datetime.fromisoformat(p["date"]) if p.get("date") else None,
                location_text=p.get("location"),
                contact_info=p.get("contact"),
            )
            for p in data
            if p.get("source") == "telegram"
        ]
