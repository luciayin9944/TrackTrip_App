# TrackTrip_App


This is a secure full-stack expense tracking application built with React (frontend) and Flask (backend). Users can register, log in, and manage their traveling expenses with full CRUD functionality. The backend provides robust APIs with authentication, secure access control, filtering, categorization, and analytical features like summary and percentage breakdowns.


## 🔐 Features
- Full Authentication by JWT
- User-owned Expenses Resource: Only the owner can view, create, update, or delete their data
- CRUD Operations for expenses
- Date-Based Filtering: Filter expenses by date range
- Total Spending Calculation: Instantly see how much user’ve spent on a trip and how much the budget remains.
- Expense Categories: Supports categories like Flight, Food, Transportation etc.
- Expense Summary View:
    - Calculates the total per category
    - Displays percentage breakdowns for visual analysis
- Pagination Support for large datasets




## 🧠 Tech Stack
🔧 Backend
- Flask: RESTful API Framework
- Flask-SQLAlchemy: ORM for database interaction
- Flask-Migrate: Handles database migrations
- Marshmallow: Schema validation & serialization
- JWT: Authentication
- PostgreSQL/pgAdmin: Database

🎨 Frontend
- React: Frontend library
- Axios: For making API requests
- React Router: For client-side routing
- Recharts: For category percentage visualizations



## Set Up

 Clone the repository
   ```bash
   git https://github.com/luciayin9944/TrackTrip_App.git
   cd TrackTrip_App
  ```


To get set up, run:

    ```bash
    pipenv install && pipenv shell
    cd server
    export FLASK_APP=app.py
    flask db init
    flask db migrate -m "initial migration"
    flask db upgrade head
    python seed.py
    ```

You can run the Flask server with:

    ```bash
    python run.py
    ```
And you can run React in another terminal from the project root directory with:

    ```bash
    npm install
    npm run dev
    ```
