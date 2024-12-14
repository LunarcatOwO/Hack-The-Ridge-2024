// 1. Import dependencies
const express = require('express');
const path = require('path');  // Add path import
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();  // Loads API key from .env file

// 2. Create Express app
const app = express();
app.use(express.json());
app.use(express.static('public')); // Move static files to public folder

// 3. Define routes
app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'chat.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 4. Define chat endpoint
app.post('/api/chat', async (req, res) => {
    // Initialize Gemini AI with API key
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Configure the model with therapy-specific instructions
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: "You are a Therapy AI here to help the user the resolve thier problems and if they have suisidal thoughts help them calm down, short responses, talk like a therapist" // Sets AI behavior
    });

    try {
        // Start chat session with specific generation settings
        const chat = model.startChat({
            generationConfig: {
                temperature: 0.85,    // Controls randomness
                topP: 0.95,          // Nucleus sampling
                topK: 40,            // Top-k sampling
                maxOutputTokens: 8192 // Max response length
            }
        });
        
        // Send user message and get response
        const result = await chat.sendMessage(req.body.message);
        const response = await result.response.text();
        res.json({ response });
    } catch (error) {
        // Error handling
        res.status(500).json({ error: 'Failed to get response' });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));