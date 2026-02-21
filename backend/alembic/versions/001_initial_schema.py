"""Initial schema — standard PostgreSQL (no PostGIS)

Revision ID: 001
Revises:
Create Date: 2025-01-01 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # --- soldiers ---
    op.create_table(
        "soldiers",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("name", sa.String(200), nullable=False),
        sa.Column("phone", sa.String(20), nullable=False, unique=True),
        sa.Column("email", sa.String(200), nullable=True),
        sa.Column("idf_unit", sa.String(100), nullable=True),
        sa.Column("idf_base", sa.String(100), nullable=True),
        sa.Column("apartment_address", sa.String(500), nullable=False),
        sa.Column("latitude", sa.Float(), nullable=True),
        sa.Column("longitude", sa.Float(), nullable=True),
        sa.Column("language", sa.String(5), nullable=False, server_default="he"),
        sa.Column("verified", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("contact_method", sa.String(20), nullable=False, server_default="whatsapp"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
    )

    # --- requests ---
    op.create_table(
        "requests",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column(
            "soldier_id",
            sa.Uuid(),
            sa.ForeignKey("soldiers.id"),
            nullable=False,
        ),
        sa.Column("category", sa.String(100), nullable=False),
        sa.Column("item_name", sa.String(200), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column(
            "urgency",
            sa.String(20),
            nullable=False,
            server_default="medium",
        ),
        sa.Column("dimensions", sa.String(100), nullable=True),
        sa.Column("photo_url", sa.String(500), nullable=True),
        sa.Column(
            "status",
            sa.String(30),
            nullable=False,
            server_default="open",
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
        sa.Column("fulfilled_at", sa.DateTime(timezone=True), nullable=True),
    )

    # --- scanned_posts ---
    op.create_table(
        "scanned_posts",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("source_platform", sa.String(20), nullable=False),
        sa.Column("external_id", sa.String(200), nullable=False),
        sa.Column("raw_text", sa.Text(), nullable=False),
        sa.Column("extracted_item", sa.String(200), nullable=True),
        sa.Column("extracted_category", sa.String(100), nullable=True),
        sa.Column("extracted_condition", sa.String(50), nullable=True),
        sa.Column("location_text", sa.String(300), nullable=True),
        sa.Column("latitude", sa.Float(), nullable=True),
        sa.Column("longitude", sa.Float(), nullable=True),
        sa.Column("contact_info", sa.String(200), nullable=True),
        sa.Column("post_date", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "scraped_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
        sa.Column("dedup_hash", sa.String(64), nullable=False, unique=True),
        sa.Column(
            "is_available", sa.Boolean(), nullable=False, server_default=sa.text("true")
        ),
    )
    op.create_index("ix_scanned_posts_dedup_hash", "scanned_posts", ["dedup_hash"])

    # --- matches ---
    op.create_table(
        "matches",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column(
            "request_id",
            sa.Uuid(),
            sa.ForeignKey("requests.id"),
            nullable=False,
        ),
        sa.Column(
            "post_id",
            sa.Uuid(),
            sa.ForeignKey("scanned_posts.id"),
            nullable=False,
        ),
        sa.Column("score", sa.Float(), nullable=False),
        sa.Column("distance_km", sa.Float(), nullable=True),
        sa.Column(
            "status",
            sa.String(30),
            nullable=False,
            server_default="pending_review",
        ),
        sa.Column("coordinator_notes", sa.Text(), nullable=True),
        sa.Column("notified_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
        sa.Column("resolved_at", sa.DateTime(timezone=True), nullable=True),
        sa.UniqueConstraint("request_id", "post_id", name="uq_request_post"),
    )


def downgrade() -> None:
    op.drop_table("matches")
    op.drop_index("ix_scanned_posts_dedup_hash", table_name="scanned_posts")
    op.drop_table("scanned_posts")
    op.drop_table("requests")
    op.drop_table("soldiers")
