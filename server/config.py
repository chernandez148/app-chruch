# Standard library imports

# Remote library imports
import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from redis import Redis
from flask_jwt_extended import JWTManager

# Instantiate app, set attributes
app = Flask(__name__)

# Configure CORS with flask_cors
CORS(app, resources={r"/*": {"origins": "https://wpeeogg-anonymous-8081.exp.direct"}})

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://hsjhphmy_chernandez:Extra004!@50.87.233.139:3306/hsjhphmy_wotw'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'connect_args': {
        'connect_timeout': 28800
    }
}
app.config['JWT_TOKEN_LOCATION'] = ['headers']
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['SECRET_KEY'] = 'gr6ru6r66565669tyufhdjtrsytdt5yy6r67565rkydje56u756rt'
app.json.compact = False

# Define metadata, instantiate db
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
db.init_app(app)
jwt = JWTManager(app)

# Configure Redis for token blacklist
redis_host = os.getenv('REDIS_HOST', 'localhost')
redis_port = os.getenv('REDIS_PORT', 6379)
redis_db = Redis(host=redis_host, port=redis_port, db=0)

# Instantiate REST API
api = Api(app)

# Your other configurations and routes