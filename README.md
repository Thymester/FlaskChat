# Chat App

This app is a real-time chat platform that uses Socket.IO to enable instant messaging between users. When the page loads, each user connects to the server and receives a unique ID. Users can send messages by typing into an input field and pressing Enter or clicking a send button. Messages appear in a chat window, and the app automatically scrolls to display new messages unless the user has scrolled up.

A notification banner alerts users to new messages when they’re not viewing the latest content, but it disappears if the user scrolls up or sends a message. This design ensures users are always aware of new interactions while also respecting their manual scroll position.

## Features

- **Real-time Messaging**: Messages are sent and received in real-time, allowing for seamless communication between users.
  
- **Unique User IDs**: Each user is assigned a unique identifier (UID) upon connection, which is displayed in the interface.

- **New Message Notification**: Users receive notifications for new messages when they are scrolled up in the chat history.

## Technologies Used

- **Flask**: A lightweight web framework for Python used for handling server-side logic and routing.
  
- **Socket.IO**: A library that enables real-time bidirectional event-based communication between web clients and servers.

- **HTML/CSS/JavaScript**: Front-end development technologies for structuring the interface and handling client-side behavior.

## Usage

1. **Homepage**: Upon accessing the application, users are greeted with a welcoming message and their unique user ID displayed.

2. **Messaging Interface**: Users can type messages into the input field provided and click the "Send" button or press Enter to send messages.

3. **Real-Time Communication**: Messages are instantly sent and displayed to other users connected to the chat.

4. **New Message Notification**: Users receive notifications for new messages if they are scrolled up in the chat history, ensuring they don't miss any messages.

## Deployment

To deploy this application locally, follow these steps:

1. Clone the repository to your local machine.
2. Install the required dependencies.
3. Run the Flask application using.
4. Access the application in your web browser.

## Credits

This application was created by Thymester/Tyler and is available under the [Apache License 2.0](LICENSE). 

## Contributions

Contributions are welcome! Feel free to submit pull requests or open issues for any improvements or bug fixes.

## Feedback

If you have any feedback or suggestions, please feel free to contact us. We'd love to hear from you!
