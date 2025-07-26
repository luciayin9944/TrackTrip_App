# TrackTrip_App

This is a secure full-stack expense tracking application built with React for the frontend, Flask for the backend, and a PostgreSQL database. Users can register, log in, and manage their traveling expenses with full CRUD functionality. The backend provides robust APIs with authentication, secure access control, filtering, categorization, and analytical features like summary and percentage breakdowns.


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



## 🛠️ Set Up

  ###  Prerequisites: Install PostgreSQL and pgAdmin

  1. Install PostgreSQL
  2. Install pgAdmin
  3. Create a database
     - After installation, create a new database for the app (e.g., tracktrip_db).

```bash
   psql -U postgres
   CREATE DATABASE tracktrip_db;
```

 4. Update database configuration
    - In your Flask app config (or .env file), update the database URI:
```bash
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:<yourpassword>@localhost:5432/tracktrip_db'
```
Replace <yourpassword> with your actual PostgreSQL password.


 ### Clone the repository
   ```bash
   git https://github.com/luciayin9944/TrackTrip_App.git
   cd TrackTrip_App
  ```


### Set Up the Backend

    ```bash
    pipenv install && pipenv shell
    cd server
    export FLASK_APP=app.py
    flask db init
    flask db migrate -m "initial migration"
    flask db upgrade head
    python seed.py
    ```

Run the Flask server:

    ```bash
    python run.py
    ```

### Start the Frontend
In another terminal, from the client directory:

    ```bash
    cd client
    npm install
    npm run dev
    ```
