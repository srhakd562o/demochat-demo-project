// chatdetail.js
const express = require('express');
const router = express.Router();
const fs = require('fs');

router.get('/', (req, res, next) => {
    const username = req.query.username || 'Guest'; // Get username from query parameter
    
    // Read previous messages from file...
    let messages = [];
    try {
        messages = fs.readFileSync('messages.txt', 'utf8').split('\n').filter(msg => msg.trim() !== '');
    } catch (error) {
        console.error('Error reading messages:', error);
    }

    // Generate HTML for previous messages
    const previousMessagesHTML = messages.map(msg => `<div>${msg.trim()}</div>`).join('');

    // Render the page with username, previous messages, and input form
    res.send(`
        <script>
            // Save username to local storage
            localStorage.setItem('username', '${username}');
        </script>
        <h1>Welcome ${username}</h1>
        <div id="messages">
            ${previousMessagesHTML}
        </div>
        <form action="/send-message?username=${encodeURIComponent(username)}" method="POST"> <!-- Include username in form action -->
            <label>Message:</label>
            <input type="text" name="message">
            <button type="submit">Send</button>
        </form>
    `);
});

router.post('/send-message', (req, res, next) => {
    const username = req.query.username || 'Guest'; // Get username from query parameter
    const message = req.body.message;
    
    // Check if message is provided
    if (!message) {
        res.status(400).send('<h1>Please enter a message to send</h1>');
        return;
    }
    
    // Append the message to the file with the username
    const data = `${username}: ${message}\n`;
    fs.appendFile('messages.txt', data, (err) => {
        if (err) {
            console.error('Error saving message:', err);
            res.status(500).send('<h1>Error saving message</h1>');
        } else {
            // Redirect back to the root page with the username query parameter
            res.redirect(`/?username=${encodeURIComponent(username)}`);
        }
    });
});

module.exports = router;
