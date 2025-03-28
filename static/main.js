document.addEventListener('DOMContentLoaded', () => {
    const socket = io.connect('https://flaskchat-production.up.railway.app/');
    let uid = null;
    let userScrolled = false;
    let newMessageNotification = false; // Flag new message notifications

    // Check if there's already a saved UID in localStorage
    uid = localStorage.getItem('userUID');
    console.log('Retrieved UID from localStorage:', uid); // Debug log
    
    if (!uid) {
        uid = socket.id;
        localStorage.setItem('userUID', uid);  // Save the UID in localStorage for future sessions
        console.log('Generated and saved UID:', uid); // Debug log
    }
    
    // Display UID on the page
    document.getElementById('user-uid').textContent = uid;

    socket.on('connect', () => {
        console.log("Connected to socket server!");  // Debug log
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
        // Update the userScrolled flag based on the position of the user's scroll
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
            console.log("Sending message: " + message);  // Debug log
            socket.emit('new_message', { message: message, uid: uid });
            newMessageNotification = true; // Set the flag when sending new messages
            notificationBanner.style.display = 'none';
        }
        messageInput.value = '';
    }

    socket.on('message_received', data => {
        console.log("Received message: ", data);  // Debug log
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message-div');
        messageDiv.innerHTML = `<span class="uid">${data.uid}: </span>${data.message}`;
        messagesDiv.appendChild(messageDiv);

        if (!userScrolled) {
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }

        // Do not show notifications if the message is from the sender or if the user has self-scrolled
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
