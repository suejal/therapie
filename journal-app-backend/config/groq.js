const { GroqClient } = require("groq-sdk");

const groq = new GroqClient({
  apiKey: process.env.GROQ_API_KEY,
});

module.exports = groq;