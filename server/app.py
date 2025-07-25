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
    api.add_resource(Signup, '/signup', endpoint='signup')
    api.add_resource(WhoAmI, '/me', endpoint='me')
    api.add_resource(Login, '/login', endpoint='login')
    api.add_resource(TripsIndex, '/trips', endpoint='trips')
    api.add_resource(TripDetail, '/trips/<int:id>', endpoint='trip_detail')
    api.add_resource(ExpensesIndex, '/expenses', endpoint='expenses')
    api.add_resource(ExpenseDetail, '/expenses/<int:id>', endpoint='expense_detail')
    api.add_resource(CategorySummary, '/trips/<int:trip_id>/summary')

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
        

class ExpensesIndex(Resource):
    ## Pagination
    @jwt_required()
    def get(self):
        curr_user_id = get_jwt_identity()

        # GET /expenses?trip_id=3&page=1&per_page=5
        page = request.args.get("page", 1, type=int)
        per_page = request.args.get("per_page", 5, type=int)
        trip_id = request.args.get("trip_id", type=int)

        trip = Trip.query.filter_by(id=trip_id, user_id=curr_user_id).first()
        if not trip:
            return {"error": "Trip not found"}, 404
        
        #all expense records of this trip
        query = Expense.query.filter_by(trip_id=trip_id)

        pagination = query.order_by(Expense.date.desc()).paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        expenses = pagination.items
        result = ExpenseSchema(many=True).dump(expenses)

        return jsonify({
            "expenses": result,
            "page": page,
            "per_page": per_page,
            "total_pages": pagination.pages,
            "total_items": pagination.total
        })

    @jwt_required()
    def post(self):
        curr_user_id = get_jwt_identity()
        data = request.get_json()

        trip_id = data.get("trip_id")
        expense_item=data.get("expense_item")
        amount = data.get("amount")
        category = data.get("category")
        date_str = data.get("date")

        trip = Trip.query.filter_by(id=trip_id, user_id=curr_user_id).first()
        if not trip:
            return {"error": "Trip not found or unauthorized"}, 404
        
        try:
            date = datetime.strptime(date_str, "%Y-%m-%d").date()
        except Exception:
            return {"error": "Invalid date format. Use YYYY-MM-DD"}, 400
        
        new_expense = Expense(
            trip_id = trip_id,
            expense_item = expense_item,
            amount = amount,
            category = category,
            date = date
        )

        try:
            db.session.add(new_expense)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500
        
        result = ExpenseSchema().dump(new_expense)
        return result, 201
    

class ExpenseDetail(Resource):
    @jwt_required()
    def delete(self, id):
        expense = Expense.query.get(id)

        if not expense:
            return {"error": "Expense not found"}, 404

        try:
            db.session.delete(expense)
            db.session.commit()
            return {"message": "Expense deleted successfully"}, 200
        except Exception as e:
            return {"error": str(e)}, 500
        
    
    @jwt_required()
    def patch(self, id):
        expense = Expense.query.filter_by(id=id).first()

        if not expense:
            return {'error': 'Expense not found or not yours'}, 404

        data = request.get_json()

        expense.expense_item = data.get("expense_item", expense.expense_item)
        expense.amount = data.get("amount", expense.amount)
        expense.date = datetime.strptime(data["date"], "%Y-%m-%d").date() if "date" in data else expense.date
        expense.category = data.get("category", expense.category)

        try:
            # db.session.add(expense)       
            db.session.commit()  
            return ExpenseSchema().dump(expense), 200 
        except ValueError as e:
            return {"errors": [str(e)]}, 400
        except Exception as e:
            db.session.rollback()



class CategorySummary(Resource):
    @jwt_required()
    def get(self, trip_id):  ##get trip_id from URL
        curr_user_id = get_jwt_identity()

        trip = Trip.query.filter_by(id=trip_id, user_id=curr_user_id).first()
        if not trip:
            return {"error": "Trip not found"}, 404
        
        ## get expense records under this trip
        query = Expense.query.filter_by(trip_id=trip_id)

        results = query.with_entities(
            Expense.category,
            func.sum(Expense.amount).label("total")
        ).group_by(Expense.category).all()
        
        return jsonify([
            {"category": category, "total": float(total)} for category, total in results
        ])


# class ExpenseDetail(Resource):
#     @jwt_required()
#     def delete(self, id):
#         curr_user_id = get_jwt_identity()
#         expense = Expense.query.get(id)

#         if not expense:
#             return {"error": "Expense not found"}, 404
        
#         trip = Trip.query.get(expense.trip_id)
#         if not trip or trip.user_id != curr_user_id:
#             return {"error": "Unauthorized to delete this expense"}, 403
        
#         try:
#             db.session.delete(expense)
#             db.session.commit()
#             return {"message": "Expense deleted successfully"}, 200
#         except Exception as e:
#             return {"error": str(e)}, 500
        
    
#     @jwt_required()
#     def patch(self, id):
#         curr_user_id = get_jwt_identity()
#         expense = Expense.query.get(id)

#         if not expense:
#             return {'error': 'Expense not found or not yours'}, 404
        
#         trip = Trip.query.get(expense.trip_id)
#         if not trip or trip.user_id != curr_user_id:
#             return {"error": "Unauthorized to edit this expense"}, 403
        
#         data = request.get_json()

#         expense.expense_item = data.get("expense_item", expense.expense_item)
#         expense.amount = data.get("amount", expense.amount)
#         expense.date = datetime.strptime(data["date"], "%Y-%m-%d").date() if "date" in data else expense.date
#         expense.category = data.get("category", expense.category)

#         try:
#             db.session.commit()
#             return ExpenseSchema().dump(expense), 200
#         except ValueError as e:
#             return {"errors": [str(e)]}, 400
#         except Exception as e:
#             db.session.rollback()
        

    






