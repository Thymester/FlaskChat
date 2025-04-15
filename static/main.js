// static/main.js
document.addEventListener('DOMContentLoaded', () => {
    const socket = io.connect('http://' + document.domain + ':' + location.port);
    let uid = null;
    let userScrolled = false;
    let newMessageNotification = false;

    socket.on('connect', () => {
        uid = socket.id;
        document.getElementById('user-uid').textContent = uid;
    });

    socket.on('color_assigned', function(data) {
        const uid = data.uid;
        const color = data.color;
    
        // Display the UID and color in your UI
        document.getElementById('user-uid').textContent = 'Your UID: ' + uid;
        document.getElementById('user-uid').style.color = color; // Optional: color the UID text
    });

    const messagesDiv = document.getElementById('messages');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const notificationBanner = document.getElementById('notification-banner');

    sendButton.onclick = sendMessage;

    messageInput.addEventListener('keydown', event => {
        if (event.keyCode === 13) {
            sendMessage();
            event.preventDefault();
        }
    });

    messagesDiv.addEventListener('scroll', () => {
        userScrolled = messagesDiv.scrollTop < messagesDiv.scrollHeight - messagesDiv.clientHeight - 10;

        if (newMessageNotification && userScrolled) {
            notificationBanner.style.display = 'block';
        } else {
            notificationBanner.style.display = 'none';
        }
    });

    function sendMessage() {
        const message = messageInput.value;
        if (message.trim() !== '') {
            socket.emit('new_message', { message: message, uid: uid });
            newMessageNotification = true;
            notificationBanner.style.display = 'none';
        }
        messageInput.value = '';
    }

    socket.on('message_received', data => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message-div');
        messageDiv.innerHTML = `<span class="uid" style="color:${data.color}">${data.uid}: </span>${data.message}`;
        messagesDiv.appendChild(messageDiv);

        if (!userScrolled) {
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }

        if (data.uid === uid || userScrolled) {
            newMessageNotification = false;
            notificationBanner.style.display = 'none';
        }

        if (data.uid !== uid && userScrolled) {
            notificationBanner.style.display = 'block';
        }
    });
});
