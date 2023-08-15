// static/main.js
document.addEventListener('DOMContentLoaded', () => {
    const socket = io.connect('http://' + document.domain + ':' + location.port);
    let uid = null;
    let userScrolled = false;
    let newMessageNotification = false; // Flag for new message notification

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
        // Update the userScrolled flag based on scroll position
        userScrolled = messagesDiv.scrollTop < messagesDiv.scrollHeight - messagesDiv.clientHeight - 10;

        // Show/hide the notification banner based on the flag
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
            newMessageNotification = true; // Set flag when sending a message
            notificationBanner.style.display = 'none'; // Hide banner after sending
        }
        messageInput.value = '';
    }

    socket.on('message_received', data => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message-div');
        messageDiv.innerHTML = `<span class="uid">${data.uid}: </span>${data.message}`;
        messagesDiv.appendChild(messageDiv);

        // Scroll to the last message only if user hasn't manually scrolled up
        if (!userScrolled) {
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }

        // Do not show notification if the message is from the sender or if the user has manually scrolled up
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