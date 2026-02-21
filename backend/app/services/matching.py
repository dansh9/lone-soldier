import logging
from difflib import SequenceMatcher
from datetime import datetime, timezone

from app.models.request import Request
from app.models.scanned_post import ScannedPost

logger = logging.getLogger(__name__)

WEIGHTS = {
    "category": 0.35,
    "item_name": 0.25,
    "distance": 0.20,
    "condition": 0.10,
    "recency": 0.10,
}

CONDITION_SCORES = {
    "new": 1.0,
    "like_new": 0.9,
    "good": 0.7,
    "fair": 0.5,
    "poor": 0.3,
    "unknown": 0.5,
}


def compute_match_score(
    request: Request,
    post: ScannedPost,
    distance_km: float | None = None,
) -> float:
    """Compute a weighted match score between a request and a scanned post."""
    scores = {}

    # Category match (exact = 1.0, no match = 0.0)
    scores["category"] = (
        1.0 if request.category == post.extracted_category else 0.0
    )

    # Item name similarity (fuzzy match)
    req_name = (request.item_name or "").lower()
    post_name = (post.extracted_item or "").lower()
    scores["item_name"] = SequenceMatcher(None, req_name, post_name).ratio()

    # Distance score (inverse, capped at 50km)
    if distance_km is not None and distance_km <= 50:
        scores["distance"] = 1.0 - (distance_km / 50.0)
    else:
        scores["distance"] = 0.3  # Unknown distance gets neutral score

    # Condition score
    scores["condition"] = CONDITION_SCORES.get(
        post.extracted_condition or "unknown", 0.5
    )

    # Recency score (newer = better, decay over 14 days)
    if post.post_date:
        post_date = post.post_date
        if post_date.tzinfo is None:
            post_date = post_date.replace(tzinfo=timezone.utc)
        age_days = (datetime.now(timezone.utc) - post_date).days
        scores["recency"] = max(0.0, 1.0 - (age_days / 14.0))
    else:
        scores["recency"] = 0.5

    total = sum(scores[k] * WEIGHTS[k] for k in WEIGHTS)

    logger.debug(
        f"Match score for request={request.item_name} vs post={post.extracted_item}: "
        f"{total:.3f} (breakdown: {scores})"
    )

    return round(total, 4)
