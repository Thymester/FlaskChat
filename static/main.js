// static/main.js
document.addEventListener('DOMContentLoaded', () => {
    const socket = io.connect('http://' + document.domain + ':' + location.port);
    let uid = null;
    let userScrolled = false;
    let newMessageNotification = false; // Flag new message notifications

    socket.on('connect', () => {
        uid = socket.id;
        document.getElementById('user-uid').textContent = uid;
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
        // Update the userScrolled flag based on the position of the users scroll
        userScrolled = messagesDiv.scrollTop < messagesDiv.scrollHeight - messagesDiv.clientHeight - 10;

        // Show/hide notification banners based on the flag
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
            newMessageNotification = true; // Set the flag when sending new messages
            notificationBanner.style.display = 'none';
        }
        messageInput.value = '';
    }

    socket.on('message_received', data => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message-div');
        messageDiv.innerHTML = `<span class="uid">${data.uid}: </span>${data.message}`;
        messagesDiv.appendChild(messageDiv);

        if (!userScrolled) {
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }

        // Do not show notifications if the message is from the sender and or if the user has self scrolled
        if (data.uid === uid || userScrolled) {
            newMessageNotification = false;
            notificationBanner.style.display = 'none';
        }

        // Show notification banner for the recipient
        if (data.uid !== uid && userScrolled) {
            notificationBanner.style.display = 'block';
        }
    });
});
