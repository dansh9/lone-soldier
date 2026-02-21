import asyncio
import logging
from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.database import async_session
from app.external.whatsapp import WhatsAppClient
from app.models.enums import MatchStatus
from app.models.match import Match
from app.models.request import Request
from app.models.soldier import Soldier
from app.tasks.celery_app import celery_app

logger = logging.getLogger(__name__)


def _format_match_notification(match: Match) -> str:
    """Format a match notification message for the soldier."""
    post = match.post
    request = match.request

    distance_info = (
        f"📍 ~{match.distance_km:.1f}km from your apartment"
        if match.distance_km
        else ""
    )

    return (
        f"🎉 Match found for your request: {request.item_name}!\n\n"
        f"Item: {post.extracted_item or 'Donated item'}\n"
        f"Condition: {post.extracted_condition or 'Unknown'}\n"
        f"Location: {post.location_text or 'Not specified'}\n"
        f"{distance_info}\n\n"
        f"Reply YES to accept or NO to skip."
    )


async def _send_notifications():
    """Send notifications for coordinator-approved matches."""
    whatsapp = WhatsAppClient()

    async with async_session() as db:
        result = await db.execute(
            select(Match)
            .where(Match.status == MatchStatus.COORDINATOR_APPROVED)
            .where(Match.notified_at.is_(None))
            .options(
                selectinload(Match.request),
                selectinload(Match.post),
            )
        )
        matches = result.scalars().all()

        for match in matches:
            # Load soldier via request
            soldier_result = await db.execute(
                select(Soldier).where(Soldier.id == match.request.soldier_id)
            )
            soldier = soldier_result.scalar_one_or_none()
            if not soldier:
                continue

            message = _format_match_notification(match)
            await whatsapp.send_message(soldier.phone, message)

            match.status = MatchStatus.SOLDIER_NOTIFIED
            match.notified_at = datetime.now(timezone.utc)

        await db.commit()
        logger.info(f"Sent {len(matches)} match notifications")


@celery_app.task(name="app.tasks.notifications.send_notifications")
def send_notifications():
    """Celery task wrapper for sending notifications."""
    asyncio.run(_send_notifications())
