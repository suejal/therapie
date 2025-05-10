# Therapie - AI-Enhanced Journaling Application

Therapie is a modern, full-stack journaling application designed to help users track their emotional well-being through AI-powered insights and analytics. The application combines secure user authentication, intuitive journal management, and advanced AI analysis to provide a comprehensive mental wellness tool.

## 🚀 Features

- **Secure User Authentication**: JWT-based authentication system with encrypted passwords
- **Journal Management**: Create, read, update, and delete personal journal entries
- **Mood Tracking**: Tag entries with emotional states to track patterns over time
- **AI-Powered Insights**: 
  - Automated mood analysis using Groq's LLM API
  - Personalized therapeutic recommendations based on journal content
  - Weekly emotional pattern visualization
- **Responsive Design**: Seamless experience across desktop and mobile devices

## 💻 Technology Stack

### Backend
- **Node.js & Express.js**: Fast, unopinionated web framework
- **MongoDB & Mongoose**: NoSQL database for flexible data storage
- **JWT Authentication**: Secure token-based user sessions
- **Groq AI Integration**: Advanced large language model for journal analysis
- **RESTful API Architecture**: Clean, maintainable API endpoints

### Frontend
- **React.js**: Component-based UI development
- **React Router**: Seamless client-side routing
- **Axios**: Promise-based HTTP client
- **Framer Motion**: Smooth animations and transitions
- **Recharts**: Responsive data visualization components

## 🧠 AI Capabilities

Therapie leverages cutting-edge AI to provide users with meaningful insights:

1. **Sentiment Analysis**: Automatically detects emotional tone in journal entries
2. **Personalized Recommendations**: Suggests actionable steps based on identified emotional patterns
3. **Therapeutic Insights**: Provides compassionate, therapy-inspired responses to journal content
4. **Trend Visualization**: Tracks emotional patterns over time with intuitive charts

## 🔒 Security & Privacy

- Passwords are securely hashed using bcrypt
- All API routes are protected with JWT authentication
- Sensitive user data is never exposed to the frontend
- Environment variables secure API keys and database credentials

## 🌟 Why Therapie Stands Out

- **Combines Technology & Wellness**: Bridges the gap between mental health and technology
- **Data-Driven Insights**: Provides users with actionable information about their emotional patterns
- **Modern Tech Stack**: Built with industry-standard technologies valued by employers
- **Scalable Architecture**: Designed to handle growing user bases and additional features

## 🚀 How to run

```bash
# Clone the repository
git clone https://github.com/yourusername/therapie.git

# Install backend dependencies
cd therapie/journal-app-backend
npm install

# Install frontend dependencies
cd ../journal-app-frontend
npm install

# Run the application (from root directory)
npm run dev

*backend server might not be up 24/7 as i lack the resources for that at the moment
```

## 📝 Future Enhancements

- Mobile application using React Native
- Additional AI models for more specialized insights
- Social features for community support

---
