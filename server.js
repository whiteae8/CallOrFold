const express = require('express');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const port = 63342;
//const newport = window.location.port;
//console.log(`The HTML file is hosted on port ${newport}`);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Endpoint to execute PokerStove command
app.post('/execute-pokerstove', (req, res) => {
    const { command } = req.body;

    // Execute PokerStove command
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing command: ${error.message}`);
            res.status(500).json({ error: 'Error executing command' });
            return;
        }
        if (stderr) {
            console.error(`Error in command execution: ${stderr}`);
        }
        // Send output back to client
        res.json({ output: stdout });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
