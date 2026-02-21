"""Seed development data for testing. Run with: python -m app.seed.seed_data"""

import asyncio
import uuid

from sqlalchemy import text

from app.database import async_session
from app.models.enums import RequestStatus, Urgency
from app.models.request import Request
from app.models.soldier import Soldier


async def seed():
    async with async_session() as db:
        # Check if data already exists
        result = await db.execute(text("SELECT COUNT(*) FROM soldiers"))
        count = result.scalar()
        if count > 0:
            print(f"Database already has {count} soldiers. Skipping seed.")
            return

        # Create soldiers
        soldiers = [
            Soldier(
                id=uuid.UUID("11111111-1111-1111-1111-111111111111"),
                name="Alex Johnson",
                phone="+972501111111",
                email="alex@example.com",
                idf_unit="Golani",
                idf_base="Camp Regavim",
                apartment_address="23 Dizengoff St, Tel Aviv",
                language="en",
                verified=True,
                contact_method="whatsapp",
            ),
            Soldier(
                id=uuid.UUID("22222222-2222-2222-2222-222222222222"),
                name="Maria Rodriguez",
                phone="+972502222222",
                email="maria@example.com",
                idf_unit="8200",
                idf_base="Glilot",
                apartment_address="15 HaNassi Blvd, Beer Sheva",
                language="en",
                verified=True,
                contact_method="whatsapp",
            ),
            Soldier(
                id=uuid.UUID("33333333-3333-3333-3333-333333333333"),
                name="David Kim",
                phone="+972503333333",
                idf_unit="Paratroopers",
                idf_base="Camp Tzrifin",
                apartment_address="8 Ben Yehuda, Jerusalem",
                language="he",
                verified=False,
                contact_method="sms",
            ),
        ]

        for s in soldiers:
            db.add(s)
        await db.flush()

        # Create requests
        requests = [
            Request(
                soldier_id=soldiers[0].id,
                category="furniture",
                item_name="Desk",
                description="Need a desk for my room, around 120cm wide",
                urgency=Urgency.HIGH,
                dimensions="120x60 cm",
                status=RequestStatus.OPEN,
            ),
            Request(
                soldier_id=soldiers[0].id,
                category="appliance",
                item_name="Microwave",
                description="Basic microwave for heating food",
                urgency=Urgency.MEDIUM,
                status=RequestStatus.OPEN,
            ),
            Request(
                soldier_id=soldiers[1].id,
                category="appliance",
                item_name="Washing machine",
                description="Any working washing machine",
                urgency=Urgency.CRITICAL,
                status=RequestStatus.OPEN,
            ),
            Request(
                soldier_id=soldiers[1].id,
                category="bedding",
                item_name="Bed frame and mattress",
                description="Single bed, any condition as long as it's clean",
                urgency=Urgency.HIGH,
                status=RequestStatus.OPEN,
            ),
            Request(
                soldier_id=soldiers[2].id,
                category="furniture",
                item_name="Wardrobe",
                description="Closet for clothes, medium size",
                urgency=Urgency.MEDIUM,
                status=RequestStatus.OPEN,
            ),
            Request(
                soldier_id=soldiers[2].id,
                category="kitchenware",
                item_name="Kitchen set",
                description="Pots, pans, basic cooking utensils",
                urgency=Urgency.LOW,
                status=RequestStatus.OPEN,
            ),
        ]

        for r in requests:
            db.add(r)

        await db.commit()
        print(f"Seeded {len(soldiers)} soldiers and {len(requests)} requests.")


if __name__ == "__main__":
    asyncio.run(seed())
