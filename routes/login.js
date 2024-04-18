// login.js
const express = require('express');
const router = express.Router();

router.get('/loginP', (req, res, next) => {
    res.send(`
        <form action="/login/prod" method="POST">
            <label>Enter your username:</label>
            <input type="text" name="username">
            <button type="submit">Login</button>
        </form>
    `);
});

router.post('/prod', (req, res, next) => {
    const username = req.body.username;
    if (username) {
        // Redirect to the root page ("/") with the username as a query parameter
        res.redirect(`/?username=${encodeURIComponent(username)}`);
    } else {
        res.send('<h1>Please enter a username</h1>');
    }
});

module.exports = router;
