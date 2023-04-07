from flask import Flask, render_template, request
import json

app = Flask(__name__)


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.route("/games")
def games():
    return render_template('games.html')


@app.route("/get_games/")
def get_games():
    data = {}
    with open('games.json', 'r') as f:
        data = json.load(f)
    # print(data)
    return data


@app.route("/add_game/",  methods=['POST'])
def add_games():
    try:
        if request.method == 'POST':
            with open('games.json', 'r+') as f:
                data = json.load(f)
                new_game = json.loads(request.data)
                data["games"].append(new_game)
                f.seek(0)
                json.dump(data, f, indent=2)
            return "Game Added Successfully!!"
    except:
        return "Something went wrong."
