import json
import logging

import anthropic

from app.config import settings

logger = logging.getLogger(__name__)

EXTRACTION_PROMPT = """You are extracting structured data from a free-text post offering household items for free or for donation in Israel.

Post text:
{raw_text}

Extract the following as JSON:
- item_name: The specific item being offered (e.g., "IKEA MALM desk", "Samsung washing machine")
- category: One of: furniture, appliance, kitchenware, bedding, electronics, storage, lighting, bathroom, other
- condition: One of: new, like_new, good, fair, poor, unknown
- location: The location mentioned in the post (city/neighborhood), or null
- is_free: boolean, whether the item is offered for free
- contact: Any contact info mentioned (phone number, name), or null

Return ONLY valid JSON, no markdown, no explanation. If you cannot determine a field, use null."""


async def extract_item(raw_text: str) -> dict:
    """Extract structured item data from a free-text donation post using Claude."""
    if not settings.ANTHROPIC_API_KEY:
        logger.warning("No ANTHROPIC_API_KEY set — returning mock extraction")
        return _mock_extraction(raw_text)

    try:
        client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
        message = client.messages.create(
            model=settings.LLM_MODEL,
            max_tokens=300,
            messages=[
                {
                    "role": "user",
                    "content": EXTRACTION_PROMPT.format(raw_text=raw_text),
                }
            ],
        )
        response_text = message.content[0].text.strip()

        # Parse JSON from response
        parsed = json.loads(response_text)
        return _validate_extraction(parsed)

    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse LLM JSON response: {e}")
        return _mock_extraction(raw_text)
    except Exception as e:
        logger.error(f"LLM extraction failed: {e}")
        return _mock_extraction(raw_text)


def _validate_extraction(data: dict) -> dict:
    """Validate and normalize extracted data."""
    valid_categories = {
        "furniture", "appliance", "kitchenware", "bedding",
        "electronics", "storage", "lighting", "bathroom", "other",
    }
    valid_conditions = {"new", "like_new", "good", "fair", "poor", "unknown"}

    category = data.get("category", "other")
    if category not in valid_categories:
        category = "other"

    condition = data.get("condition", "unknown")
    if condition not in valid_conditions:
        condition = "unknown"

    return {
        "item_name": data.get("item_name"),
        "category": category,
        "condition": condition,
        "location": data.get("location"),
        "is_free": data.get("is_free", True),
        "contact": data.get("contact"),
    }


def _mock_extraction(raw_text: str) -> dict:
    """Fallback mock extraction when LLM is unavailable."""
    text_lower = raw_text.lower()

    # Simple keyword-based category detection
    category = "other"
    if any(w in text_lower for w in ["desk", "table", "chair", "sofa", "bed", "שולחן", "כיסא", "ספה", "מיטה", "ארון"]):
        category = "furniture"
    elif any(w in text_lower for w in ["washing", "fridge", "microwave", "מכונת כביסה", "מיקרוגל", "מקרר"]):
        category = "appliance"
    elif any(w in text_lower for w in ["pot", "pan", "dish", "kitchen", "סירים", "מטבח"]):
        category = "kitchenware"
    elif any(w in text_lower for w in ["mattress", "pillow", "sheet", "מזרן"]):
        category = "bedding"
    elif any(w in text_lower for w in ["lamp", "light", "מנורה"]):
        category = "lighting"

    # Extract first ~30 chars as item name
    item_name = raw_text[:50].split(".")[0].split("!")[0].strip()

    return {
        "item_name": item_name,
        "category": category,
        "condition": "unknown",
        "location": None,
        "is_free": True,
        "contact": None,
    }
