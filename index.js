const express = require("express");
const fetch = require("node-fetch");

const app = express();
const port = 8080;

// Fetch environment variables
const webhookUrl = process.env.WEBHOOK_URL;
const authToken = process.env.AUTH_TOKEN;

app.use(express.json());

// Handle the POST request
app.post("/log", (req, res) => {
    const { token, content, embeds } = req.body;

    // Check if the token matches the one stored in the environment
    if (token !== authToken) {
        return res.status(403).send("Forbidden: Invalid token.");
    }

    // Send the webhook
    fetch(webhookUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, embeds }),
    })
        .then((response) => {
            if (response.ok) {
                return res.status(200).send("Webhook sent successfully!");
            } else {
                return res.status(500).send("Failed to send webhook.");
            }
        })
        .catch((error) => {
            return res.status(500).send(`Error: ${error.message}`);
        });
});

// Start the server
app.listen(port, () => {
    console.log(`Proxy running on port ${port}`);
});
