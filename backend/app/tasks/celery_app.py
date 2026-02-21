from celery import Celery
from celery.schedules import crontab

from app.config import settings

celery_app = Celery(
    "lone_soldier",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Asia/Jerusalem",
    enable_utc=True,
    task_track_started=True,
    task_acks_late=True,
    worker_prefetch_multiplier=1,
)

# Periodic tasks
celery_app.conf.beat_schedule = {
    "scan-donation-sources": {
        "task": "app.tasks.scanning.run_scan_cycle",
        "schedule": crontab(
            minute=0, hour=f"*/{settings.SCAN_INTERVAL_HOURS}"
        ),
    },
}

# Auto-discover tasks
celery_app.autodiscover_tasks(["app.tasks"])
