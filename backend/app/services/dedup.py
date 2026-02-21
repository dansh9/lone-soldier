import hashlib
import re


def normalize_text(text: str) -> str:
    """Normalize text for dedup comparison: lowercase, strip whitespace, remove punctuation."""
    text = text.lower().strip()
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"[^\w\s]", "", text)
    return text


def compute_dedup_hash(platform: str, external_id: str, raw_text: str) -> str:
    """Compute SHA-256 hash for dedup. Uses platform + external_id + normalized text."""
    normalized = normalize_text(raw_text)
    content = f"{platform}:{external_id}:{normalized}"
    return hashlib.sha256(content.encode("utf-8")).hexdigest()
