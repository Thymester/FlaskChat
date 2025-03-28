from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import secrets  # Import the 'secrets' module for secure key generation
import os  # To fetch the correct port in production
import logging  # To enable better error logging

# Configure logging for debugging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)

# Generate a secure 256-bit secret key for session management
app.config['SECRET_KEY'] = secrets.token_hex(32)

# Set CORS to only allow connections from known origins
# It's better to restrict CORS to your front-end domain for production
CORS_ALLOWED_ORIGINS = os.environ.get('CORS_ALLOWED_ORIGINS', '*')  # Default to '*' for testing

socketio = SocketIO(app, cors_allowed_origins=CORS_ALLOWED_ORIGINS, logger=True, engineio_logger=True)

@app.route('/')
def index():
    return render_template('index.html')

# Handle incoming WebSocket messages
@socketio.on('new_message')
def handle_new_message(data):
    message = data['message']
    uid = data['uid']
    logging.debug(f"Received message: {message} from UID: {uid}")
    emit('message_received', {'message': message, 'uid': uid}, broadcast=True)

# Handle new socket connections
@socketio.on('connect')
def handle_connect():
    logging.debug('Client connected')
    emit('connected', {'status': 'Connected successfully'})

# Handle socket disconnections
@socketio.on('disconnect')
def handle_disconnect():
    logging.debug('Client disconnected')

# Run the Flask app with SocketIO support in production-ready mode
if __name__ == "__main__":
    # Ensure the correct port is used
    port = int(os.environ.get('PORT', 5000))  # Use environment variable PORT or fallback to 5000
    host = '0.0.0.0'  # Listen on all available IP addresses

    logging.info(f"Running Flask app on {host}:{port} with WebSocket support")
    socketio.run(app, host=host, port=port, debug=True, use_reloader=False)  # Run the app with WebSocket support
