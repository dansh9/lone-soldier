import asyncio
import logging
from datetime import datetime, timezone

from sqlalchemy import select

from app.config import settings
from app.database import async_session
from app.external.agora import AgoraScraper
from app.external.base import RawPost
from app.external.google_maps import GoogleMapsClient
from app.external.telegram import TelegramScraper
from app.models.enums import MatchStatus, Platform, RequestStatus
from app.models.match import Match
from app.models.request import Request
from app.models.scanned_post import ScannedPost
from app.services.dedup import compute_dedup_hash
from app.services.llm_extractor import extract_item
from app.services.matching import compute_match_score
from app.tasks.celery_app import celery_app

logger = logging.getLogger(__name__)


async def _run_scan():
    """Full scanning pipeline: ingest → dedup → extract → match → store."""
    start = datetime.now(timezone.utc)
    logger.info("Starting scan cycle...")

    # 1. INGEST from all sources
    scrapers = [AgoraScraper(), TelegramScraper()]
    all_posts: list[RawPost] = []
    for scraper in scrapers:
        try:
            posts = await scraper.fetch_recent_posts(
                since_hours=settings.SCAN_INTERVAL_HOURS
            )
            all_posts.extend(posts)
            logger.info(
                f"Ingested {len(posts)} posts from {scraper.__class__.__name__}"
            )
        except Exception as e:
            logger.error(f"Scraper {scraper.__class__.__name__} failed: {e}")

    if not all_posts:
        logger.info("No new posts ingested. Scan cycle complete.")
        return

    maps_client = GoogleMapsClient()
    new_posts_count = 0
    new_matches_count = 0

    async with async_session() as db:
        for raw_post in all_posts:
            # 2. DEDUP
            dedup_hash = compute_dedup_hash(
                raw_post.platform, raw_post.external_id, raw_post.text
            )
            existing = await db.execute(
                select(ScannedPost).where(ScannedPost.dedup_hash == dedup_hash)
            )
            if existing.scalar_one_or_none():
                logger.debug(f"Duplicate post skipped: {raw_post.external_id}")
                continue

            # 3. EXTRACT using LLM
            extracted = await extract_item(raw_post.text)

            # Store as ScannedPost
            platform_enum = Platform(raw_post.platform)
            post = ScannedPost(
                source_platform=platform_enum,
                external_id=raw_post.external_id,
                raw_text=raw_post.text,
                extracted_item=extracted.get("item_name"),
                extracted_category=extracted.get("category"),
                extracted_condition=extracted.get("condition"),
                location_text=raw_post.location_text or extracted.get("location"),
                contact_info=raw_post.contact_info or extracted.get("contact"),
                post_date=raw_post.post_date,
                dedup_hash=dedup_hash,
            )
            db.add(post)
            await db.flush()
            new_posts_count += 1

            # 4. MATCH against open requests
            open_requests = await db.execute(
                select(Request).where(Request.status == RequestStatus.OPEN)
            )
            for request in open_requests.scalars().all():
                # Get distance (stub returns random)
                distance = await maps_client.get_distance_km(0, 0, 0, 0)

                score = compute_match_score(request, post, distance_km=distance)

                if score >= settings.MATCH_SCORE_THRESHOLD:
                    match = Match(
                        request_id=request.id,
                        post_id=post.id,
                        score=score,
                        distance_km=distance,
                        status=MatchStatus.PENDING_REVIEW,
                    )
                    db.add(match)
                    new_matches_count += 1

                    # Update request status if first match
                    if request.status == RequestStatus.OPEN:
                        request.status = RequestStatus.MATCH_FOUND

        await db.commit()

    elapsed = (datetime.now(timezone.utc) - start).total_seconds()
    logger.info(
        f"Scan cycle complete in {elapsed:.1f}s: "
        f"{len(all_posts)} ingested, {new_posts_count} new posts, "
        f"{new_matches_count} new matches"
    )


@celery_app.task(name="app.tasks.scanning.run_scan_cycle")
def run_scan_cycle():
    """Celery task wrapper for the async scanning pipeline."""
    asyncio.run(_run_scan())
