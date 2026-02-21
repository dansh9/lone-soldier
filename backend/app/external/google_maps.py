import logging
import random

logger = logging.getLogger(__name__)


class GoogleMapsClient:
    """Stub for Google Maps Distance Matrix API."""

    async def get_distance_km(
        self,
        origin_lat: float,
        origin_lon: float,
        dest_lat: float,
        dest_lon: float,
    ) -> float:
        logger.info(
            f"[STUB] Google Maps distance: ({origin_lat},{origin_lon}) -> ({dest_lat},{dest_lon})"
        )
        return round(random.uniform(1.0, 45.0), 1)
