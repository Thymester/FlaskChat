# app.py
from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import secrets  # Import the 'secrets' module for secure key generation

app = Flask(__name__)
app.config['SECRET_KEY'] = secrets.token_hex(32)  # Generate a 256-bit secret key
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('new_message')
def handle_new_message(data):
    message = data['message']
    uid = data['uid']

    emit('message_received', {'message': message, 'uid': uid}, broadcast=True)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
