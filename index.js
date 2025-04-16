const express = require('express');
const fetch = require('node-fetch');
const app = express();
require('dotenv').config();

app.use(express.json());

const DISCORD_WEBHOOK = process.env.WEBHOOK_URL;
const AUTH_TOKEN = process.env.AUTH_TOKEN;

app.post('/log', async (req, res) => {
    const { content, embeds, token } = req.body;

    if (token !== AUTH_TOKEN) {
        return res.status(403).json({ error: 'Invalid token.' });
    }

    try {
        const response = await fetch(DISCORD_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content, embeds })
        });

        return res.status(200).json({ status: 'Success' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to send webhook.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Webhook proxy running on port ${PORT}`));
