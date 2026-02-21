from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/lone_soldier"
    DATABASE_URL_SYNC: str = "postgresql://postgres:postgres@localhost:5432/lone_soldier"

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # Anthropic
    ANTHROPIC_API_KEY: str = ""
    LLM_MODEL: str = "claude-sonnet-4-20250514"

    # Application
    APP_ENV: str = "development"
    SECRET_KEY: str = "change-me-in-production"
    CORS_ORIGINS: str = "http://localhost:3000"
    PORT: int = 8000

    # Scanning Agent
    SCAN_INTERVAL_HOURS: int = 4
    MATCH_SCORE_THRESHOLD: float = 0.5

    # External service stubs
    USE_REAL_SCRAPERS: bool = False
    USE_REAL_MAPS: bool = False
    USE_REAL_WHATSAPP: bool = False

    # Real service keys (only used when USE_REAL_* = True)
    GOOGLE_MAPS_API_KEY: str = ""
    WHATSAPP_API_TOKEN: str = ""
    WHATSAPP_PHONE_NUMBER_ID: str = ""
    TELEGRAM_BOT_TOKEN: str = ""
    TELEGRAM_CHANNEL_IDS: str = ""

    # Celery
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/1"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
