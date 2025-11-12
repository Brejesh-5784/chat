# AI Project Planner

A modern chatbot + project planner with Gantt chart visualization. Built with React, FastAPI, and Groq AI.

## Features

- 🤖 **AI-Powered Planning**: Chat naturally with AI to create project plans
- 📊 **Interactive Gantt Chart**: Visual timeline with task dependencies
- 🎨 **Modern UI**: Beautiful gradient design with smooth animations
- ⚡ **Real-time Updates**: Instant plan generation and visualization
- 📅 **Smart Scheduling**: Automatic task dependency management
- 👥 **Team Management**: Track team members and assignments

## Tech Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- Lucide Icons
- date-fns

**Backend:**
- FastAPI
- Groq AI (LLaMA 3.3)
- Python 3.9+

## Setup

### Backend

1. Navigate to backend directory:
```bash
cd new-project/backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Add your Groq API key to `.env`:
```
GROQ_API_KEY=your_api_key_here
```

5. Run the server:
```bash
python app.py
```

Backend will run on `http://localhost:8000`

### Frontend

1. Navigate to frontend directory:
```bash
cd new-project/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Run development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## Usage

1. Open `http://localhost:3000` in your browser
2. Chat with the AI assistant about your project
3. Describe your goals, timeline, and requirements
4. AI will generate a comprehensive project plan
5. View the interactive Gantt chart with task dependencies
6. Click on tasks to see detailed information

## Example Prompts

- "Build an e-commerce website in 6 weeks with a team of 4"
- "Create a mobile app for iOS and Android in 2 months"
- "Launch a marketing campaign in 30 days"
- "Develop a SaaS product with authentication, dashboard, and payments"

## API Endpoints

- `GET /` - Health check
- `POST /api/chat` - Chat with AI assistant
- `POST /api/generate-plan` - Generate project plan
- `PUT /api/projects/{project_id}/tasks/{task_id}` - Update task

## Project Structure

```
new-project/
├── backend/
│   ├── app.py              # FastAPI application
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # Environment template
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.jsx         # Main app component
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Key Differences from Original

1. **Completely New UI**: Modern gradient design with purple/indigo theme
2. **Enhanced Backend**: Better task dependency logic and date calculations
3. **Interactive Gantt**: Click tasks for details, color-coded by priority
4. **Real-time Chat**: Conversational AI planning assistant
5. **Better Data Model**: Includes descriptions, priorities, milestones
6. **Responsive Design**: Works on all screen sizes

## License

MIT
