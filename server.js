const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('.'));

app.post('/api/chat', async (req, res) => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: "You are a Therapy AI here to help the user the resolve thier problems and if they have suisidal thoughts help them calm down, short responses, talk like a therapist"
    });

    try {
        const chat = model.startChat({
            generationConfig: {
                temperature: 0.85,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 8192
            }
        });
        
        const result = await chat.sendMessage(req.body.message);
        const response = await result.response.text();
        res.json({ response });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get response' });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));