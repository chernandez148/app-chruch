import os
import jwt
from datetime import datetime, timedelta

# Remote library imports
from flask import jsonify, make_response, request, session, abort
from flask_restful import Api, Resource

# Local imports
from config import app, db, api, redis_db
from models import Employee, Message, TimeCard
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token

import bcrypt

class Index(Resource):
    def get(self):
        return jsonify(message="Hello World")

api.add_resource(Index, '/')

class Register(Resource):
    def post(self):
        data = request.get_json()

        # Check if all required fields are present in the JSON data
        required_fields = ['first_name', 'last_name', 'role', 'email', 'phone_number', '_password_hash']
        for field in required_fields:
            if field not in data:
                return {'error': 'Bad Request', 'message': f'Missing required field: {field}'}, 400

        # Hash the password
        hashed_password = bcrypt.hashpw(data['_password_hash'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        # Create a new Employee instance
        new_user = Employee(
            first_name=data['first_name'],
            last_name=data['last_name'],
            role=data['role'],
            email=data['email'],
            phone_number=data['phone_number'],
            _password_hash=hashed_password,
        )

        # Optional fields: supervisor_id and supervisor
        if 'supervisor_id' in data:
            new_user.supervisor_id = data['supervisor_id']

        try:
            db.session.add(new_user)
            db.session.commit()
            session['user_id'] = new_user.id
            return make_response(new_user.to_dict(), 200)

        except Exception as e:
            print(e)
            return make_response({'error': 'Unprocessable Entity'}, 422)

api.add_resource(Register, '/register')


class Login(Resource):
    def post(self):
        try:
            data = request.get_json()
            if not data or 'email' not in data or 'password' not in data:
                return {'error': 'Bad Request', 'message': 'Email and password are required'}, 400

            email = data['email']
            password = data['password']

            # Check if user exists and authenticate
            check_user = Employee.query.filter(Employee.email == email).first()
            if not check_user or not check_user.authenticate(password):
                return {'error': 'Unauthorized', 'message': 'Invalid email or password'}, 401

            # Generate tokens for the authenticated user
            access_token, refresh_token = self.generate_tokens(check_user.id)

            # Return response with tokens and user details
            response = make_response(jsonify({
                'access_token': access_token,
                'refresh_token': refresh_token,
                'user': check_user.to_dict(rules={'-_password_hash', 'timecards'})
            }), 200)
            response.headers['Access-Control-Allow-Origin'] = '*'  # Update with your allowed origin
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
            response.headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type'

            return response

        except Exception as e:
            app.logger.error(f"Error during login: {e}")
            return {'error': 'Internal Server Error', 'message': 'An unexpected error occurred'}, 500

    def generate_tokens(self, user_id):
        access_payload = {
            'sub': user_id,  # Set user_id as the subject
            'exp': datetime.utcnow() + timedelta(hours=48)  # Access token expiration time (adjust as needed)
        }
        refresh_payload = {
            'sub': user_id,  # Set user_id as the subject
            'exp': datetime.utcnow() + timedelta(days=30)  # Refresh token expiration time (adjust as needed)
        }
        access_token = jwt.encode(access_payload, app.config['SECRET_KEY'], algorithm='HS256')
        refresh_token = jwt.encode(refresh_payload, app.config['SECRET_KEY'], algorithm='HS256')

        return access_token, refresh_token

api.add_resource(Login, '/login')

class Timesheet(Resource):
    def post(self):
        data = request.get_json()
        
        # Create a new Timecard instance
        new_timecard = TimeCard(
            date=data['date'],
            clocked_in=data['clocked_in'],
            clocked_out=data['clocked_out'],
            notes=data.get('notes', ''),  # Optional field, default to empty string if not provided
            employee_id=data['employee_id'],
        )

        try:
            db.session.add(new_timecard)
            db.session.commit()
            return make_response(new_timecard.to_dict(), 200)
        except Exception as e:
            db.session.rollback()
            return make_response({'error': str(e)}, 500)

# Add the resource to the API with its endpoint
api.add_resource(Timesheet, '/timesheet')


if __name__ == '__main__':
    app.run(debug=True)