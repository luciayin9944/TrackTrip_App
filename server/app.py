# app.py
from flask import Flask, request, jsonify, make_response
from flask_restful import Api, Resource
from config import db, bcrypt, jwt, Config
from flask_cors import CORS
from sqlalchemy.exc import IntegrityError
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from models import User, Trip, Expense, UserSchema, TripSchema, ExpenseSchema
from datetime import datetime
from sqlalchemy import func


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    CORS(app)
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    api = Api(app)

    # API resources
    api.add_resource(Signup, '/signup')
    api.add_resource(Login, '/login')
    api.add_resource(WhoAmI, '/me')
    api.add_resource(TripsIndex, '/trips')
    api.add_resource(TripDetail, '/trips/<int:id>')

    # @app.route('/')
    # def index():
    #     return {'message': 'Backend is running'}, 200

    return app


    
class Signup(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        if not username or not password:
            return {'errors': ['Missing username or password']}, 400

        user = User(username=username)
        user.password_hash = password

        try:
            db.session.add(user)
            db.session.commit()
            access_token = create_access_token(identity=str(user.id))
            response = make_response(jsonify(token=access_token, user=UserSchema().dump(user)), 200)
            return response
        except IntegrityError:
            db.session.rollback()
            return {'errors': ['Username already exists']}, 422


class WhoAmI(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if user:
            return UserSchema().dump(user), 200
        return {'errors': ['User not found']}, 404
    

class Login(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        user = User.query.filter_by(username=username).first()

        if user and user.authenticate(password):
            access_token = create_access_token(identity=str(user.id))
            response = make_response(jsonify(token=access_token, user=UserSchema().dump((user))), 200)
            return response
        return {'errors': ['Invalid username or password']}, 401
    
    

# filter trips
def filter_trips_by_date_range(user_id, year=None, month=None):
    query = Trip.query.filter_by(user_id=user_id)

    try:
        if year:
            year = int(year)
        if month:
            month = int(month)

        if year and month:
            start_date = datetime(year, month, 1)
            end_date = datetime(year + 1, 1, 1) if month == 12 else datetime(year, month + 1, 1)
            query = query.filter(Trip.start_date < end_date, Trip.end_date >= start_date)
        elif year:
            start_date = datetime(year, 1, 1)
            end_date = datetime(year + 1, 1, 1)
            query = query.filter(Trip.start_date < end_date, Trip.end_date >= start_date)
    except ValueError:
        raise ValueError("Invalid year or month")

    return query.order_by(Trip.end_date.desc()).all()


class TripsIndex(Resource):
    @jwt_required()
    def get(self):
        curr_user_id = get_jwt_identity()
        year = request.args.get("year")
        month = request.args.get("month")

        try:
            trips = filter_trips_by_date_range(curr_user_id, year, month)
        except ValueError:
            return {"error": "Invalid year or month"}, 400

        result = [
            {
                "id": t.id,
                "destination": t.destination,
                "budget": t.budget,
                "start_date": t.start_date,
                "end_date": t.end_date
            }
            for t in trips
        ]
        return jsonify({"trips": result})
    
    
    @jwt_required()
    def post(self):
        data = request.get_json()

        try:
            start_date = datetime.strptime(data["start_date"], "%Y-%m-%d").date()
            end_date = datetime.strptime(data["end_date"], "%Y-%m-%d").date()
        except (KeyError, ValueError):
            return {"errors": ["Invalid or missing info."]}, 400

        new_trip = Trip(
            destination = data.get("destination"),
            budget = data.get("budget"),
            start_date = start_date,
            end_date = end_date,
            user_id = get_jwt_identity()
        )

        try:
            db.session.add(new_trip)
            db.session.commit()
            return TripSchema().dump(new_trip), 201
        except IntegrityError:
            return {'errors': ['Trip creation failed.']}, 422

        
class TripDetail(Resource):
    @jwt_required()
    def get(self, id):
        curr_user_id = get_jwt_identity()
        trip = Trip.query.get(id)

        if not trip:
            return {"error": "Trip not found"}, 404      
        print(curr_user_id)
        print(trip.user_id)
        
        if trip.user_id != int(curr_user_id):
            return {"error": "Unauthorized"}, 403      
        return TripSchema().dump(trip), 200
        