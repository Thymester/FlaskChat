from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import secrets  # Import the 'secrets' module for secure key generation
import os  # To fetch the correct port in production

app = Flask(__name__)
app.config['SECRET_KEY'] = secrets.token_hex(32)  # Generate a 256-bit secret key
socketio = SocketIO(app, cors_allowed_origins="*")  # Enable CORS for WebSocket connections

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('new_message')
def handle_new_message(data):
    message = data['message']
    uid = data['uid']
    emit('message_received', {'message': message, 'uid': uid}, broadcast=True)

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=int(os.environ.get('PORT', 5000)))  # Use socketio.run for WebSocket support
