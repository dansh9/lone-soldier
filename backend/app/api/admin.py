import asyncio

from fastapi import APIRouter

from app.tasks.scanning import _run_scan

router = APIRouter()


@router.post("/trigger-scan", response_model=dict)
async def trigger_scan():
    """Manually trigger a scanning cycle (dev/admin convenience)."""
    await _run_scan()
    return {"data": {"status": "scan_complete"}}
