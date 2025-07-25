# app.py
from flask import Flask, request, jsonify, make_response
from flask_restful import Api, Resource
from config import db, bcrypt, jwt, Config
from flask_cors import CORS
from sqlalchemy.exc import IntegrityError
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from models import User, Trip, Expense, UserSchema, TripSchema, ExpenseSchema


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

    @app.route('/')
    def index():
        return {'message': 'Backend is running'}, 200

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
            access_token = create_access_token(identity=user.id)
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
    
    

