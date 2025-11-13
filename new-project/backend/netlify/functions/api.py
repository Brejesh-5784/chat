"""
Netlify Function Entry Point for AI Project Planner Backend
============================================================

This file serves as the entry point for Netlify Functions.
It wraps the FastAPI application to work with Netlify's serverless environment.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import os
import json
import re
from datetime import datetime, timedelta

# Load environment variables for local development
try:
    from dotenv import load_dotenv
    load_dotenv()
    print("✅ Environment variables loaded from .env")
except ImportError:
    print("⚠️  python-dotenv not installed, using system environment variables")
except Exception as e:
    print(f"⚠️  Error loading .env: {str(e)}")

# Lazy import for Groq to avoid initialization issues
_groq_client = None

def get_groq_client():
    """Lazy initialization of Groq client to avoid cold start issues"""
    global _groq_client
    if _groq_client is None:
        try:
            from groq import Groq
            api_key = os.environ.get("GROQ_API_KEY") or os.getenv("GROQ_API_KEY")
            if not api_key:
                print("❌ GROQ_API_KEY not found in environment")
                print(f"Available env vars: {list(os.environ.keys())}")
                raise ValueError("GROQ_API_KEY not found in environment")
            print(f"✅ GROQ_API_KEY found (length: {len(api_key)})")
            _groq_client = Groq(api_key=api_key)
            print("✅ Groq client initialized successfully")
        except Exception as e:
            print(f"❌ Error initializing Groq client: {str(e)}")
            raise
    return _groq_client


# Initialize FastAPI app
app = FastAPI(
    title="AI Project Planner API",
    description="Backend API for AI-powered project planning",
    version="2.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================================
# DATA MODELS
# ============================================================================

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    project_context: Optional[Dict] = None

class Task(BaseModel):
    id: str
    name: str
    description: str = ""
    assignee: str
    start_date: str
    end_date: str
    duration_days: int
    dependencies: List[str] = []
    progress: int = 0
    priority: str = "medium"
    status: str = "pending"

class ProjectPlan(BaseModel):
    project_id: str
    project_name: str
    description: str
    start_date: str
    end_date: str
    total_duration_days: int
    tasks: List[Task]
    team_members: List[str]
    milestones: List[Dict] = []


# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.get("/")
@app.get("/api")
def root():
    """Health check endpoint"""
    return {
        "status": "AI Project Planner API",
        "version": "2.0",
        "platform": "Netlify Functions",
        "endpoints": {
            "chat": "/api/chat",
            "generate_plan": "/api/generate-plan",
            "update_task": "/api/projects/{project_id}/tasks/{task_id}"
        }
    }

@app.get("/api/debug")
def debug():
    """Debug endpoint to check environment"""
    import sys
    return {
        "status": "ok",
        "python_version": sys.version,
        "groq_api_key_set": bool(os.environ.get("GROQ_API_KEY")),
        "groq_api_key_length": len(os.environ.get("GROQ_API_KEY", "")),
        "environment_vars": list(os.environ.keys())
    }


@app.post("/api/chat")
async def chat(request: ChatRequest):
    """Conversational AI endpoint for gathering project requirements"""
    
    try:
        groq_client = get_groq_client()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Groq client initialization failed: {str(e)}")
    
    try:
        completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": """You are a concise project planning assistant.

CRITICAL RULES:
- Keep responses to 2-3 sentences MAX
- Be direct and to the point
- Ask only ONE question at a time
- No bullet points or long lists

Your job - COLLECT INFO IN ORDER:
1. Project goal (what to build)
2. Timeline (how long)
3. Team size (how many people)
4. Tech stack (optional)
5. CONFIRM and close questioning

WORKFLOW:
- Ask for missing info one at a time
- Once you have goal + timeline + team size, SUMMARIZE and ask: "Is this correct?"
- If user confirms (yes/correct/right/ok), say: "Perfect! Click 'Generate Gantt Chart' to create your timeline."
- Then STOP asking questions

Examples:
User: "MERN app"
You: "Got it. How long do you have?"

User: "50 days"
You: "Perfect. How many team members?"

User: "6 people"
You: "Great! So: MERN app, 50 days, 6 people. Is this correct?"

User: "Yes"
You: "Perfect! Click 'Generate Gantt Chart' to create your timeline."

After confirmation, ONLY answer direct questions. Don't ask more questions.

Be brief and helpful."""},
                *[{"role": msg.role, "content": msg.content} for msg in request.messages]
            ],
            temperature=0.5,
            max_tokens=200,
            timeout=20  # 20 second timeout for chat
        )
        
        response = completion.choices[0].message.content
        return {"response": response}
        
    except Exception as e:
        print(f"Chat Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")


@app.post("/api/generate-plan")
async def generate_plan(request: ChatRequest):
    """Generate comprehensive project plan with Gantt chart data"""
    
    print("=" * 80)
    print("GENERATE PLAN ENDPOINT CALLED")
    print("=" * 80)
    
    try:
        groq_client = get_groq_client()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Groq client initialization failed: {str(e)}")
    
    # Extract conversation text
    conversation = "\n".join([f"{msg.role}: {msg.content}" for msg in request.messages])
    all_text = " ".join([msg.content for msg in request.messages])
    
    # Extract project information
    goal_match = re.search(
        r'(build|create|develop|make|design).*?(website|app|project|platform|system|tool|software|product|e-commerce|ecommerce|research|MERN|mern|full.*stack)',
        all_text,
        re.IGNORECASE
    )
    goal = goal_match.group(0) if goal_match else "project"
    
    duration_match = re.search(r'(\d+)\s*(week|weeks|month|months|day|days)', all_text, re.IGNORECASE)
    duration_text = duration_match.group(0) if duration_match else None
    
    team_match = re.search(r'(\d+)\s*(member|members|developer|developers|people|person|team)', all_text, re.IGNORECASE)
    if not team_match:
        team_match = re.search(r'team\s+of\s+(\d+)', all_text, re.IGNORECASE)
    team_size = team_match.group(1) if team_match else None
    
    # Extract team member names
    team_names = []
    names_pattern = re.search(
        r'(?:names?\s+(?:are|is)\s+)?([a-zA-Z]+(?:\s*,\s*[a-zA-Z]+)*(?:\s+and\s+[a-zA-Z]+)?)',
        all_text,
        re.IGNORECASE
    )
    if names_pattern:
        names_text = names_pattern.group(1)
        names_text = names_text.replace(' and ', ', ')
        team_names = [name.strip().title() for name in names_text.split(',') if name.strip() and len(name.strip()) > 2]
        common_words = ['team', 'size', 'members', 'people', 'days', 'weeks', 'months', 'build', 'create', 'have', 'got', 'want', 'their', 'where']
        team_names = [name for name in team_names if name.lower() not in common_words]
    
    team_info = f"{team_size} members"
    if team_names and len(team_names) > 0:
        team_info = f"{team_size} members: {', '.join(team_names)}"
    
    extraction_summary = f"\nEXTRACTED INFO:\n- Goal: {goal}\n- Duration: {duration_text}\n- Team: {team_info}\n"
    
    system_prompt = """You are an expert project planning AI. Create a comprehensive project plan.

CRITICAL RULES:
1. Use EXACTLY the duration provided (already converted to days)
2. Use EXACTLY the team size specified
3. Create 6-10 realistic tasks
4. If names provided, use those exact names as assignees
5. Otherwise use role-based names (Frontend Dev, Backend Dev, etc.)

Return ONLY valid JSON:
{
  "project_name": "string",
  "description": "string",
  "total_duration_days": number,
  "tasks": [
    {
      "id": "task-1",
      "name": "string",
      "description": "string",
      "assignee": "string",
      "start_day": 0,
      "duration_days": number,
      "dependencies": [],
      "priority": "high|medium|low",
      "status": "pending"
    }
  ],
  "milestones": [
    {
      "name": "string",
      "day": number,
      "description": "string"
    }
  ]
}"""

    try:
        completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"{extraction_summary}\n\nGenerate project plan JSON:"}
            ],
            temperature=0.7,
            max_tokens=3000,
            timeout=25  # 25 second timeout for plan generation
        )
        
        response_text = completion.choices[0].message.content.strip()
        
        # Extract JSON from markdown
        json_match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', response_text, re.DOTALL)
        if json_match:
            response_text = json_match.group(1)
        
        if not response_text.strip().startswith('{'):
            raise HTTPException(status_code=400, detail="Invalid AI response format")
        
        plan_data = json.loads(response_text)
        
        # Calculate dates
        start_date = datetime.now()
        project_id = f"proj-{int(datetime.now().timestamp())}"
        
        tasks = []
        team_members = set()
        
        tasks_from_ai = plan_data.get("tasks", [])
        
        if not tasks_from_ai:
            # Fallback tasks
            total_duration = plan_data.get("total_duration_days", 30)
            num_tasks = min(6, max(3, total_duration // 5))
            task_duration = total_duration // num_tasks
            
            for i in range(num_tasks):
                task_start = start_date + timedelta(days=i * task_duration)
                task_end = task_start + timedelta(days=task_duration - 1)
                assignee = f"Team Member {(i % 3) + 1}"
                team_members.add(assignee)
                
                task = Task(
                    id=f"task-{i+1}",
                    name=f"Task {i+1}",
                    description=f"Project task {i+1}",
                    assignee=assignee,
                    start_date=task_start.strftime("%Y-%m-%d"),
                    end_date=task_end.strftime("%Y-%m-%d"),
                    duration_days=task_duration,
                    dependencies=[],
                    priority="medium",
                    status="pending"
                )
                tasks.append(task)
        else:
            for task_data in tasks_from_ai:
                start_day = task_data.get("start_day", 0)
                duration = task_data.get("duration_days", 1)
                
                task_start = start_date + timedelta(days=start_day)
                task_end = task_start + timedelta(days=duration - 1)
                
                team_members.add(task_data.get("assignee", "Team Member"))
                
                task = Task(
                    id=task_data.get("id", f"task-{len(tasks)+1}"),
                    name=task_data.get("name", "Unnamed Task"),
                    description=task_data.get("description", ""),
                    assignee=task_data.get("assignee", "Team Member"),
                    start_date=task_start.strftime("%Y-%m-%d"),
                    end_date=task_end.strftime("%Y-%m-%d"),
                    duration_days=duration,
                    dependencies=task_data.get("dependencies", []),
                    priority=task_data.get("priority", "medium"),
                    status=task_data.get("status", "pending")
                )
                tasks.append(task)
        
        total_duration = plan_data.get("total_duration_days", 30)
        end_date = start_date + timedelta(days=total_duration - 1)
        
        project_plan = ProjectPlan(
            project_id=project_id,
            project_name=plan_data.get("project_name", "New Project"),
            description=plan_data.get("description", ""),
            start_date=start_date.strftime("%Y-%m-%d"),
            end_date=end_date.strftime("%Y-%m-%d"),
            total_duration_days=total_duration,
            tasks=tasks,
            team_members=list(team_members),
            milestones=plan_data.get("milestones", [])
        )
        
        print(f"RETURNING PROJECT PLAN: {project_plan.project_name}")
        print(f"Tasks: {len(project_plan.tasks)}")
        
        return project_plan
        
    except json.JSONDecodeError as e:
        print(f"JSON Parse Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to parse AI response: {str(e)}")
    except Exception as e:
        print(f"Error generating plan: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@app.put("/api/projects/{project_id}/tasks/{task_id}")
async def update_task(project_id: str, task_id: str, task: Task):
    """Update task details"""
    return {"message": "Task updated", "task": task}


# ============================================================================
# NETLIFY FUNCTION HANDLER
# ============================================================================

from mangum import Mangum

# Wrap FastAPI app with Mangum for Netlify Functions
handler = Mangum(app, lifespan="off")
