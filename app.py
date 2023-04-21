import json
from flask import Flask, jsonify, render_template, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root@localhost:3306/real_estate'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


class HomeOwner(db.Model):
    __tablename__ = "homeowner"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Home(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    owner = db.Column(db.Integer, db.ForeignKey('homeowner.id'))
    category = db.Column(db.String(50))
    zipcode = db.Column(db.String(10))
    address = db.Column(db.String(200))
    description = db.Column(db.String(500))
    price = db.Column(db.Float)
    sq_footage = db.Column(db.Float)
    num_beds = db.Column(db.Integer)
    num_baths = db.Column(db.Integer)
    year_built = db.Column(db.Integer)
    image_url = db.Column(db.String(500))
    availability = db.Column(db.String(20))

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.route("/home")
def home():
    return render_template('homes.html')


@app.route("/add_home")
def add_homehtml():
    homeowners = HomeOwner.query.all()
    return render_template('add_home.html', homeowners=[owner.as_dict() for owner in homeowners])


@app.route("/update_home/<int:id>/")
def update_homehtml(id):
    homeowners = HomeOwner.query.all()
    home = Home.query.filter_by(id=id).first()
    return render_template('update_home.html', home=home, homeowners=[owner.as_dict() for owner in homeowners])


@app.route('/api/homes/', methods=['POST'])
def add_home():
    data = json.loads(request.data)
    new_home = Home(
        owner=data['owner'],
        category=data['category'],
        zipcode=data['zipcode'],
        address=data['address'],
        description=data['description'],
        price=data['price'],
        sq_footage=data['sqft'],
        num_beds=data['bedrooms'],
        num_baths=data['bathrooms'],
        year_built=data['year_built'],
        image_url=data['imageUrl'],
        availability=data['availability'])
    db.session.add(new_home)
    db.session.commit()
    return jsonify({'message': 'Home added successfully!'}), 201


@app.route('/api/homeowner/', methods=['POST'])
def add_homeowner():
    data = json.loads(request.data)
    new_owner = HomeOwner(
        name=data['name'],
    )
    db.session.add(new_owner)
    db.session.commit()
    return jsonify({'message': 'HomeOwner added successfully!'}), 201


@app.route('/api/homes/', methods=['GET'])
def get_homes():
    homes = Home.query.all()
    if not homes:
        return jsonify({'message': 'No homes found.', 'status': 202}), 202
    return jsonify({'homes': [home.as_dict() for home in homes], 'status': 200}), 200


@app.route('/api/homes/category/<string:category>/', methods=['GET'])
def get_homes_by_category(category):
    homes = Home.query.filter_by(category=category).all()
    if not homes:
        return jsonify({'message': 'No homes found in this category.', 'status': 202}), 202
    return jsonify({'homes': [home.as_dict() for home in homes], 'status': 200}), 200


@app.route('/api//homes/zipcode/<string:zipcode>', methods=['GET'])
def get_homes_by_zipcode(zipcode):
    homes = Home.query.filter_by(zipcode=zipcode).all()
    if not homes:
        return jsonify({'message': 'No homes found in this zipcode.', 'status': 202}), 202
    return jsonify({'homes': [home.as_dict() for home in homes], "status": 200}), 200


@app.route('/api/homes/search')
def search_homes():
    max_price = request.args.get('maxPrice')
    square_footage = request.args.get('squareFootage')
    num_beds = request.args.get('numBeds')
    num_baths = request.args.get('numBaths')

    # Perform database query using search criteria
    homes = Home.query.filter(Home.price <= max_price, Home.sq_footage >= square_footage,
                              Home.num_beds >= num_beds, Home.num_baths >= num_baths).all()
    if not homes:
        return jsonify({'message': 'No homes found for this filter.', 'status': 202}), 202
    return jsonify({'homes': [home.as_dict() for home in homes], "status": 200}), 200


@app.route('/api/homes/<int:id>/', methods=['GET'])
def get_home(id):
    # Find the home with the given ID
    home = Home.query.get(id)

    # Return error if home not found
    if not home:
        return jsonify({'error': 'Home not found'})

    return jsonify(home.as_dict())


@app.route('/api/homes/<int:home_id>/', methods=['PUT'])
def update_home(home_id):
    # Find the home with the given ID
    home = Home.query.get(home_id)

    # Return error if home not found
    if not home:
        return jsonify({'message': 'Home not found.'})

    # Update home information
    # home.owner = request.json.get('owner', home.owner)
    home.address = request.json.get('address', home.address)
    home.description = request.json.get('description', home.description)
    home.price = request.json.get('price', home.price)
    home.square_footage = request.json.get(
        'sqft', home.sq_footage)
    home.num_beds = request.json.get('bedrooms', home.num_beds)
    home.num_baths = request.json.get('bathrooms', home.num_baths)
    home.year_built = request.json.get('year_built', home.year_built)
    home.image_url = request.json.get('imageUrl', home.image_url)
    home.availability = request.json.get('availability', home.availability)

    # Update database
    db.session.commit()

    return jsonify({'message': 'Home updated successfully.'})


@app.route('/api/homes/<int:home_id>/', methods=['DELETE'])
def delete_home(home_id):
    # Find the home with the given ID
    home = Home.query.get(home_id)

    # Return error if home not found
    if not home:
        return jsonify({'error': 'Home not found'})

    # Delete home from database
    db.session.delete(home)
    db.session.commit()

    return jsonify({'message': 'Home deleted successfully'})
