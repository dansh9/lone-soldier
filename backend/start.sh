#!/bin/sh
set -e

echo "Running database migrations..."
alembic upgrade head

echo "Starting Celery worker + beat in background..."
celery -A app.tasks.celery_app worker -B --loglevel=info --concurrency=2 &

echo "Starting FastAPI server on port ${PORT:-8000}..."
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
