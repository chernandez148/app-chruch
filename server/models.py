from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
import bcrypt

from config import db  # Assuming db is correctly configured in config.py

class Employee(db.Model, SerializerMixin):
    __tablename__ = 'employees'

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    role = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone_number = db.Column(db.String(14), nullable=False)
    _password_hash = db.Column(db.String(128), nullable=False)

    supervisor_id = db.Column(db.Integer, db.ForeignKey('employees.id'))

    supervisor = db.relationship('Employee', remote_side=[id], backref='subordinates', uselist=False)
    timecards = db.relationship('TimeCard', backref='employee', uselist=True)
    messages_received = db.relationship('Message', foreign_keys='Message.receiver_id',
                                         backref='message_receiver', lazy=True,
                                         overlaps="message_receiver")
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    @property
    def password(self):
        return self._password_hash 

    @password.setter
    def password(self, password):
        self._password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def authenticate(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self._password_hash.encode('utf-8'))

    @validates('email')
    def validate_email(self, key, email):
        assert '@' in email, 'Invalid email address'
        return email

    def __repr__(self):
        return f"<Employee(id={self.id}, email='{self.email}')>"

    serialize_rules = ('-created_at', '-updated_at', '-messages_received', '-timecards', '-supervisor', '-supervisor_id')

class TimeCard(db.Model, SerializerMixin):
    __tablename__ = 'timecards'

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(10), nullable=False)
    clocked_in = db.Column(db.String(5))
    clocked_out = db.Column(db.String(5))
    notes = db.Column(db.String(150))

    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'), nullable=False)

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    serialize_rules = ('-created_at', '-updated_at', '-employee_id')

class Message(db.Model, SerializerMixin):
    __tablename__ = 'messages'

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(255), nullable=False)

    sender_id = db.Column(db.Integer, db.ForeignKey('employees.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('employees.id'), nullable=False)

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    serialize_rules = ('-created_at', '-updated_at', '-sender_id', '-receiver_id')

    sender = db.relationship('Employee', foreign_keys=[sender_id], backref=db.backref('sent_messages', lazy=True))
    receiver = db.relationship('Employee', foreign_keys=[receiver_id], backref=db.backref('received_messages', lazy=True),
                               overlaps="message_receiver,messages_received")


