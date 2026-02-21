import enum


class RequestStatus(str, enum.Enum):
    OPEN = "open"
    MATCH_FOUND = "match_found"
    PENDING_ACCEPTANCE = "pending_acceptance"
    FULFILLED = "fulfilled"
    EXPIRED = "expired"


class Urgency(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class MatchStatus(str, enum.Enum):
    PENDING_REVIEW = "pending_review"
    COORDINATOR_APPROVED = "coordinator_approved"
    SOLDIER_NOTIFIED = "soldier_notified"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    EXPIRED = "expired"


class Platform(str, enum.Enum):
    AGORA = "agora"
    TELEGRAM = "telegram"
    FACEBOOK = "facebook"
    WHATSAPP = "whatsapp"
    YAD2 = "yad2"
    MANUAL = "manual"
