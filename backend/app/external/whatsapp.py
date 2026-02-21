import logging
import time

logger = logging.getLogger(__name__)


class WhatsAppClient:
    """Stub for WhatsApp Business API. Logs messages instead of sending."""

    async def send_message(self, phone: str, message: str) -> dict:
        logger.info(f"[STUB] WhatsApp message to {phone}: {message[:100]}...")
        return {
            "status": "stub_sent",
            "phone": phone,
            "message_id": f"stub_{phone}_{int(time.time())}",
        }
