from flask import Flask, render_template, request, jsonify, session
app = Flask(__name__)
app.config['SECRET_KEY'] = 'asl;dkf;alskdfj'

from boggle import Boggle

boggle_game = Boggle()

app.route('/')
def homepage():
    board = boggle_game.make_board()

    return render_template('index.html', board=board)



