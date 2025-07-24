## models.py

from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from marshmallow import Schema, fields
from config import db, bcrypt


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String)

    trips = db.relationship('Trip', back_populates='user', cascade='all, delete-orphan')

    @hybrid_property
    def password_hash(self):
        raise AttributeError('Password hashes may not be viewed.')

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

    def __repr__(self):
        return f'User {self.username}, ID {self.id}'


class Trip(db.Model):
    __tablename__ = 'trips'

    id = db.Column(db.Integer, primary_key=True)
    destination = db.Column(db.String, nullable=False)
    budget = db.Column(db.Float, nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship('User', back_populates='trips')

    expenses = db.relationship('Expense', back_populates='trip', cascade='all, delete-orphan')


class Expense(db.Model):
    __tablename__ = 'expenses'

    id = db.Column(db.Integer, primary_key=True)
    expense_item = db.Column(db.String, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.Date, nullable=False)
    category = db.Column(db.String, nullable=False, server_default='Other')

    trip_id = db.Column(db.Integer, db.ForeignKey('trips.id'))
    trip = db.relationship('Trip', back_populates='expenses')

    @validates("category")
    def validate_category(self, key, value):
        allowed = {'Flight', 'Transportation', 'Accommodation', 'Food', 'Tickets', 'Shopping', 'Other'}
        if value not in allowed:
            raise ValueError(f"Invalid category: {value}")
        return value
    


class UserSchema(Schema):
    id = fields.Int()
    username = fields.Str()
    trips = fields.List(fields.Nested(lambda: TripSchema(exclude=("user",))))


class TripSchema(Schema):
    id = fields.Int()
    destination = fields.Str()
    budget = fields.Float()
    start_date = fields.Date()
    end_date = fields.Date()
    user = fields.Nested(lambda: UserSchema(exclude=("trips",)))

    expenses = fields.List(fields.Nested(lambda: ExpenseSchema(exclude=("trip",))))




class ExpenseSchema(Schema):
    id = fields.Int()
    expense_item = fields.Str()
    amount = fields.Float()
    date = fields.Date()
    category = fields.Str()
    trip = fields.Nested(lambda: TripSchema(exclude=("expenses",)))


