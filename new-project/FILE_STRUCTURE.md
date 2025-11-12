# AI Project Planner - File Structure and Naming Convention

## File Renaming Summary

### Backend Files
| Old Name | New Name | Role |
|----------|----------|------|
| `app.py` | `main.py` | Main FastAPI application entry point with all API endpoints |

### Frontend Components
| Old Name | New Name | Role |
|----------|----------|------|
| `ChatPanel.jsx` | `ChatInterface.jsx` | Interactive chat interface for conversational AI |
| `GanttChart.jsx` | `ProjectTimeline.jsx` | Project timeline visualization with Gantt chart |
| `HomePage.jsx` | `LandingPage.jsx` | Landing/home page with metaverse theme |
| `DocsPage.jsx` | `DocumentationPage.jsx` | Documentation and help page |

## File Descriptions

### Backend (`new-project/backend/`)

#### `main.py`
**Role:** Main FastAPI Backend Application

**Purpose:** 
- Serves as the entry point for the backend API server
- Handles all REST API endpoints for chat and project planning
- Integrates with Groq AI for intelligent project plan generation
- Manages data validation and serialization using Pydantic models

**Key Features:**
- `/api/chat` - Conversational AI endpoint
- `/api/generate-plan` - Project plan generation with Gantt data
- `/api/projects/{id}/tasks/{id}` - Task update endpoint
- Comprehensive error handling and logging
- Fallback task generation if AI fails

**Dependencies:**
- FastAPI - Web framework
- Groq - AI/LLM integration
- Pydantic - Data validation
- python-dotenv - Environment configuration

---

### Frontend (`new-project/frontend/src/components/`)

#### `ChatInterface.jsx`
**Role:** Conversational AI Chat Component

**Purpose:**
- Provides interactive chat UI for gathering project requirements
- Communicates with backend `/api/chat` endpoint
- Manages conversation state and message history
- Triggers Gantt chart generation when ready

**Key Features:**
- Real-time AI conversation
- Auto-scroll to latest messages
- Loading states and error handling
- Keyboard shortcuts (Enter to send)
- Generate Gantt Chart button

**Props:**
- `onPlanGenerated(plan)` - Callback when plan is generated
- `isGenerating` - Loading state flag
- `setIsGenerating(bool)` - Update loading state

---

#### `ProjectTimeline.jsx`
**Role:** Project Timeline Visualization Component

**Purpose:**
- Displays interactive Gantt chart with project tasks
- Shows task dependencies, durations, and assignments
- Provides progress tracking with milestones
- Displays team member workload breakdown

**Key Features:**
- Interactive task checkboxes (mark complete/incomplete)
- Color-coded bars by team member
- Timeline with start/end dates
- Progress overview with percentage
- Milestone tracking (0%, 25%, 50%, 75%, 100%)
- Team member cards with individual progress
- Collapsible sections (progress tracker, team view)

**Props:**
- `plan` - Complete project plan object with tasks

**State Management:**
- Uses `useState` for tasks and visibility toggles
- Uses `useEffect` to sync with plan prop changes

---

#### `LandingPage.jsx`
**Role:** Landing/Home Page Component

**Purpose:**
- First page users see when visiting the application
- Showcases features and benefits
- Provides navigation to planner and documentation
- Uses metaverse-inspired design theme

**Key Features:**
- Hero section with call-to-action
- Feature cards explaining capabilities
- "How It Works" section
- Links to documentation and GitHub
- Animated background effects
- Responsive design

**Props:**
- `onGetStarted()` - Navigate to planner
- `onNavigateToDocs()` - Navigate to documentation

---

#### `DocumentationPage.jsx`
**Role:** Documentation and Help Page

**Purpose:**
- Comprehensive documentation for users
- API endpoint reference
- Setup instructions
- FAQ section
- Usage examples

**Key Features:**
- Overview of features
- Step-by-step usage guide
- Technical stack information
- API endpoint documentation
- Setup instructions for backend and frontend
- Frequently asked questions

**Props:**
- `onBack()` - Navigate back to home

---

## Component Hierarchy

```
App.jsx (Main Application)
├── LandingPage.jsx (Home view)
├── DocumentationPage.jsx (Docs view)
└── Planner View
    ├── ChatInterface.jsx (Left panel)
    └── ProjectTimeline.jsx (Right panel)
```

## Data Flow

```
User Input → ChatInterface → Backend API → AI Processing
                                              ↓
                                         Project Plan
                                              ↓
                                      ProjectTimeline
                                              ↓
                                    Visual Gantt Chart
```

## Naming Conventions

### Components
- Use PascalCase for component names
- Name should describe the component's primary role
- Avoid generic names like "Panel" or "Chart"
- Use descriptive names like "ChatInterface" or "ProjectTimeline"

### Files
- Component files use `.jsx` extension
- Backend files use `.py` extension
- Configuration files use appropriate extensions (`.json`, `.env`, etc.)

### Functions
- Use camelCase for function names
- Prefix event handlers with `handle` (e.g., `handleSend`, `handleGenerateGantt`)
- Use descriptive names that indicate the action

### Variables
- Use camelCase for variables
- Use descriptive names (avoid single letters except in loops)
- Boolean variables should be prefixed with `is`, `has`, `should` (e.g., `isGenerating`, `hasError`)

## Comments and Documentation

All files now include:
- File-level documentation explaining purpose and role
- Function/method documentation with parameters and return values
- Inline comments for complex logic
- Section headers for code organization
- Props documentation for React components

## Environment Variables

### Backend (`.env`)
```
GROQ_API_KEY=your_groq_api_key_here
```

### Frontend (`.env`)
```
VITE_API_URL=http://localhost:8000
```

## Running the Application

### Backend
```bash
cd new-project/backend
python3 main.py
```

### Frontend
```bash
cd new-project/frontend
npm run dev
```

## Future Improvements

Potential file additions:
- `utils/` - Utility functions
- `hooks/` - Custom React hooks
- `constants/` - Application constants
- `types/` - TypeScript type definitions
- `services/` - API service layer
- `styles/` - Global styles and themes
