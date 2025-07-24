from datetime import date
from app import create_app
from config import db
from models import User, Trip, Expense

app = create_app()

with app.app_context():
    # db.create_all()
    
    # clear table
    Expense.query.delete()
    Trip.query.delete()
    User.query.delete()
    db.session.commit()

    # users
    user1 = User(username="alice")
    user1.password_hash = "password123" 

    user2 = User(username="bob")
    user2.password_hash = "secure456"

    db.session.add_all([user1, user2])
    db.session.commit()

    # trips
    trip1 = Trip(
        destination="Paris",
        budget=3000.0,
        start_date=date(2025, 7, 20),
        end_date=date(2025, 7, 30),
        user=user1
    )

    trip2 = Trip(
        destination="Tokyo",
        budget=4000.0,
        start_date=date(2025, 8, 5),
        end_date=date(2025, 8, 15),
        user=user2
    )

    db.session.add_all([trip1, trip2])
    db.session.commit()

    # expenses
    expense1 = Expense(
        expense_item="Flight to Paris",
        amount=1200.0,
        date=date(2025, 7, 20),
        category="Flight",
        trip=trip1
    )

    expense2 = Expense(
        expense_item="Hotel in Paris",
        amount=800.0,
        date=date(2025, 7, 21),
        category="Accommodation",
        trip=trip1
    )

    expense3 = Expense(
        expense_item="Sushi dinner",
        amount=100.0,
        date=date(2025, 8, 6),
        category="Food",
        trip=trip2
    )

    expense4 = Expense(
        expense_item="Shinkansen Ticket",
        amount=150.0,
        date=date(2025, 8, 7),
        category="Transportation",
        trip=trip2
    )

    db.session.add_all([expense1, expense2, expense3, expense4])
    db.session.commit()

    print("✅ Database successfully seeded.")