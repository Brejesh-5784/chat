# 🤖 AI Project Planner

> A modern chatbot + project planner with interactive Gantt chart visualization. Built with React, FastAPI, and Groq AI.

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://chatplanner.netlify.app)
[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR_BADGE_ID/deploy-status)](https://app.netlify.com/sites/chatplanner/deploys)

**🌐 Live Demo:** [https://chatplanner.netlify.app](https://chatplanner.netlify.app)

---

## 🚀 Quick Start

**Try it now:** Visit [chatplanner.netlify.app](https://chatplanner.netlify.app)

**Deploy your own:** See [new-project/START_HERE.md](./new-project/START_HERE.md) for deployment instructions.

## 📁 Project Structure

```
.
├── netlify.toml                    # Netlify configuration
├── .gitignore                      # Git ignore rules
├── .netlifyignore                  # Netlify deployment exclusions
├── README.md                       # This file
└── new-project/                    # Main project directory
    ├── frontend/                   # React frontend (Vite)
    │   ├── src/
    │   │   ├── components/         # React components
    │   │   ├── App.jsx            # Main app
    │   │   └── main.jsx           # Entry point
    │   ├── package.json
    │   └── vite.config.js
    ├── backend/                    # Python FastAPI backend
    │   ├── netlify/
    │   │   └── functions/
    │   │       └── api.py         # Serverless function
    │   ├── requirements.txt       # Python dependencies
    │   └── runtime.txt            # Python version
    └── Documentation/              # Guides and docs
        ├── START_HERE.md
        ├── QUICKSTART.md
        └── DEPLOY_NETLIFY.md
```

## ✨ Features

- 🤖 **AI-Powered Planning** - Chat naturally with AI to create comprehensive project plans
- 📊 **Interactive Gantt Chart** - Visual timeline with task dependencies and progress tracking
- 🎨 **Modern UI** - Beautiful gradient design with smooth animations and responsive layout
- ⚡ **Real-time Updates** - Instant plan generation and visualization
- 📅 **Smart Scheduling** - Automatic task dependency management and date calculations
- 👥 **Team Management** - Track team members, assignments, and workload distribution
- 🎯 **Priority Levels** - High, medium, and low priority task classification
- 📈 **Progress Tracking** - Visual progress indicators and milestone tracking
- 🔄 **Task Dependencies** - Automatic scheduling based on task relationships
- 💾 **No Database Required** - Fully client-side with serverless backend

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide Icons** - Beautiful icon library
- **date-fns** - Date manipulation library

### Backend
- **FastAPI** - Modern Python web framework
- **Groq AI** - LLaMA 3.3 70B model for intelligent planning
- **Python 3.9+** - Programming language
- **Mangum** - ASGI adapter for serverless
- **Netlify Functions** - Serverless deployment platform

### Infrastructure
- **Netlify** - Hosting and serverless functions
- **GitHub** - Version control and CI/CD
- **Global CDN** - Fast content delivery worldwide

## 🚀 Deployment

This project is deployed on **Netlify** with automatic CI/CD from GitHub.

**Live Site:** [https://chatplanner.netlify.app](https://chatplanner.netlify.app)

### Deploy Your Own (5 Minutes)

1. **Fork this repository**
   ```bash
   # Clone your fork
   git clone https://github.com/YOUR_USERNAME/chat.git
   cd chat
   ```

2. **Verify setup**
   ```bash
   bash new-project/verify-netlify-setup.sh
   ```

3. **Deploy to Netlify**
   - Go to [app.netlify.com](https://app.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Select your GitHub repository
   - Netlify auto-detects settings from `netlify.toml`
   - Add environment variable: `GROQ_API_KEY` (get from [console.groq.com](https://console.groq.com))
   - Click "Deploy site"

4. **Done!** Your site will be live in ~2 minutes

📚 **Detailed Guide:** See [new-project/QUICKSTART.md](./new-project/QUICKSTART.md)

## 💻 Local Development

### Prerequisites
- Node.js 16+ and npm
- Python 3.9+
- Groq API key ([Get one free](https://console.groq.com))

### Backend Setup

```bash
# Navigate to backend
cd new-project/backend

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Add your GROQ_API_KEY to .env

# Run development server
python app.py
```

Backend runs at: **http://localhost:8000**

### Frontend Setup

```bash
# Navigate to frontend
cd new-project/frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend runs at: **http://localhost:3000**

### Test the Application

1. Open http://localhost:3000
2. Click "Get Started"
3. Chat: "Build a website in 30 days with 5 people"
4. Click "Generate Gantt Chart"
5. See your project timeline!

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [START_HERE.md](./new-project/START_HERE.md) | Your starting point - overview and quick links |
| [QUICKSTART.md](./new-project/QUICKSTART.md) | 5-minute deployment guide |
| [DEPLOY_NETLIFY.md](./new-project/DEPLOY_NETLIFY.md) | Detailed deployment instructions |
| [DEPLOYMENT_CHECKLIST.md](./new-project/DEPLOYMENT_CHECKLIST.md) | Pre-deployment verification checklist |
| [NETLIFY_MIGRATION_COMPLETE.md](./new-project/NETLIFY_MIGRATION_COMPLETE.md) | Migration details from Vercel to Netlify |

## 🔐 Environment Variables

### Production (Netlify)
Set in Netlify Dashboard → Site settings → Environment variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `GROQ_API_KEY` | Your Groq API key from [console.groq.com](https://console.groq.com) | ✅ Yes |

### Local Development
Create `new-project/backend/.env`:
```bash
GROQ_API_KEY=your_groq_api_key_here
```

## 🎯 Usage Examples

### Example Prompts

Try these in the chat interface:

- "Build an e-commerce website in 6 weeks with a team of 4"
- "Create a mobile app for iOS and Android in 2 months"
- "Launch a marketing campaign in 30 days with 3 people"
- "Develop a SaaS product with authentication, dashboard, and payments in 90 days"
- "Research project on AI with 5 researchers over 12 weeks"

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api` | GET | Health check and API info |
| `/api/debug` | GET | Debug endpoint (check environment) |
| `/api/chat` | POST | Chat with AI assistant |
| `/api/generate-plan` | POST | Generate project plan with Gantt data |
| `/api/projects/{id}/tasks/{id}` | PUT | Update task details |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./new-project/LICENSE) file for details.

## 🙏 Acknowledgments

- **Groq** - For providing fast LLM inference
- **Netlify** - For serverless hosting and functions
- **FastAPI** - For the excellent Python web framework
- **React** - For the powerful UI library

## 📧 Contact & Support

- **Live Demo:** [https://chatplanner.netlify.app](https://chatplanner.netlify.app)
- **Issues:** [GitHub Issues](https://github.com/Brejesh-5784/chat/issues)
- **Repository:** [github.com/Brejesh-5784/chat](https://github.com/Brejesh-5784/chat)

---

<div align="center">

**Made with ❤️ using React, FastAPI, and Groq AI**

[Live Demo](https://chatplanner.netlify.app) • [Documentation](./new-project/START_HERE.md) • [Report Bug](https://github.com/Brejesh-5784/chat/issues)

</div>
