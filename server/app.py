# app.py
from flask import Flask
from config import db, bcrypt, jwt, Config
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config.from_object(Config)

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    with app.app_context():
        from models import User, Trip, Expense
        # db.create_all()

    
    @app.route('/')
    def hello():
        return {"message": "Hello from Flask!"}
    

    # from routes import api_bp
    # app.register_blueprint(api_bp)

    return app