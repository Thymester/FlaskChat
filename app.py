import hashlib
import secrets
from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = secrets.token_hex(32)
socketio = SocketIO(app)

# Maintain a dictionary to store color codes for UIDs
uid_color_mapping = {}

# Function to log messages to a file
def log_message(message, uid):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    hashed_message = hashlib.sha256(message.encode()).hexdigest()  # Hash the message
    formatted_message = f"[{timestamp}] UID: {uid}\n\tHashed Message: {hashed_message}\n\n"
    with open('message_log.txt', 'a') as file:
        file.write(formatted_message)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/privacy_policy')
def privacy_policy():
    return render_template('privacy-policy.html')

@socketio.on('connect')
def handle_connect():
    # Generate a random color code for the UID
    color_code = '#' + secrets.token_hex(3)
    uid = request.sid  # Use the original SID as UID
    uid_color_mapping[uid] = color_code
    
    # Emit the UID to the client
    emit('color_assigned', {'uid': uid, 'color': color_code})

@socketio.on('new_message')
def handle_new_message(data):
    message = data['message']
    uid = hashlib.sha256(str(data['uid']).encode()).hexdigest()  # Hash the incoming UID
    
    # Log the message
    log_message(message, uid)

    emit('message_received', {'message': message, 'uid': uid, 'color': uid_color_mapping[data['uid']]}, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True)
