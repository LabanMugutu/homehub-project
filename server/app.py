from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from models import db, User, Property, MaintenanceRequest
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///homehub.db' 
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'dev-secret-key'

CORS(app)
db.init_app(app)
jwt = JWTManager(app)

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if User.query.filter_by(email=data.get('email')).first():
        return jsonify({"message": "Email already exists"}), 400
    new_user = User(full_name=data.get('full_name'), email=data.get('email'), password_hash=data.get('password'), role=data.get('role', 'tenant'))
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User created"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get('email')).first()
    if user and user.password_hash == data.get('password'):
        token = create_access_token(identity={'id': user.id, 'role': user.role})
        return jsonify({"token": token, "role": user.role, "name": user.full_name}), 200
    return jsonify({"message": "Invalid credentials"}), 401

@app.route('/maintenance', methods=['GET'])
@jwt_required()
def get_maintenance():
    requests = MaintenanceRequest.query.all()
    return jsonify([r.to_dict() for r in requests]), 200

@app.route('/maintenance/<int:id>/status', methods=['PATCH'])
@jwt_required()
def update_maintenance_status(id):
    data = request.get_json()
    req = MaintenanceRequest.query.get_or_404(id)
    req.status = data.get('status')
    db.session.commit()
    return jsonify({"message": "Status updated"}), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        if not User.query.filter_by(email="admin@homehub.com").first():
            db.session.add(User(full_name="Super Admin", email="admin@homehub.com", password_hash="admin123", role="admin"))
            db.session.commit()
    app.run(debug=True, port=5000)