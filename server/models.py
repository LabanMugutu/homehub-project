from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), nullable=False) 
    phone = db.Column(db.String(20))
    gender = db.Column(db.String(20))
    dob = db.Column(db.String(20))
    properties = db.relationship('Property', backref='owner', lazy=True)
    maintenance_requests = db.relationship('MaintenanceRequest', backref='tenant', lazy=True)

    def to_dict(self):
        return { 'id': self.id, 'full_name': self.full_name, 'email': self.email, 'role': self.role, 'phone': self.phone, 'gender': self.gender, 'dob': self.dob }

class Property(db.Model):
    __tablename__ = 'properties'
    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100))
    price = db.Column(db.Float)
    status = db.Column(db.String(20), default='under_review')
    requests = db.relationship('MaintenanceRequest', backref='property', lazy=True)
    
    def to_dict(self):
        return { 'id': self.id, 'title': self.title, 'location': self.location, 'price': self.price, 'status': self.status }

class MaintenanceRequest(db.Model):
    __tablename__ = 'maintenance_requests'
    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(db.Integer, db.ForeignKey('properties.id'), nullable=False)
    tenant_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    priority = db.Column(db.String(20), default='medium') 
    status = db.Column(db.String(20), default='pending') 
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return { 'id': self.id, 'title': self.title, 'description': self.description, 'priority': self.priority, 'status': self.status, 'date': self.created_at.strftime('%Y-%m-%d'), 'property_title': self.property.title if self.property else "Unknown", 'tenant_name': self.tenant.full_name if self.tenant else "Unknown" }