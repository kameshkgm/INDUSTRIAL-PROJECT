const express = require('express');
const twilio = require('twilio');
const cors = require('cors');

const app = express();
const port = 3001;

const accountSid = 'AC99738b833b74e6942583d3e13a24f416';
const authToken = '5f8f23f66bd7a8c3bbda0fc323dc1098';
const client = twilio(accountSid, authToken);

let lastMessageSentTime = null;

app.use(express.json());
app.use(cors());

app.post('/send-message', async (req, res) => {
    const { body } = req.body;

    const currentTime = new Date().getTime();
    // Check if two minutes have passed since last message
    if (!lastMessageSentTime || currentTime - lastMessageSentTime >= 120000) {
        try {
            console.log('Sending message...');
            const message = await client.messages.create({
                body: body,
                from: 'whatsapp:+14155238886',
                to: 'whatsapp:+917010103712'
            });
            console.log('Message sent successfully:', message.sid);
            // Update last message sent time only if message is sent successfully
            lastMessageSentTime = currentTime;
            res.status(200).json({ success: true, message: 'Message sent successfully', sid: message.sid });
        } catch (error) {
            console.error('Failed to send message:', error);
            res.status(500).json({ success: false, message: 'Failed to send message', error: error.message });
        }
    } else {
        console.log('Message cannot be sent yet. Please try again later.');
        res.status(400).json({ success: false, message: 'Message cannot be sent yet. Please try again later.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
