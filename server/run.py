# run.py
from app import create_app
from config import db
from flask_migrate import Migrate
import os

os.environ['FLASK_APP'] = 'run.py'

app = create_app()
migrate = Migrate(app, db)

if __name__ == '__main__':
    app.run(port=5000, debug=True)