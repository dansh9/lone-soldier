from fastapi import APIRouter

from app.api.admin import router as admin_router
from app.api.coordinator import router as coordinator_router
from app.api.matches import router as matches_router
from app.api.requests import router as requests_router
from app.api.soldiers import router as soldiers_router

router = APIRouter()

router.include_router(soldiers_router, prefix="/soldiers", tags=["soldiers"])
router.include_router(requests_router, prefix="/requests", tags=["requests"])
router.include_router(matches_router, prefix="/matches", tags=["matches"])
router.include_router(coordinator_router, prefix="/coordinator", tags=["coordinator"])
router.include_router(admin_router, prefix="/admin", tags=["admin"])
