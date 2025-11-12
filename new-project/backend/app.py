from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
import os
from dotenv import load_dotenv
from groq import Groq
import json
import re
from datetime import datetime, timedelta

load_dotenv()

app = FastAPI(title="AI Project Planner API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

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

@app.get("/")
def root():
    return {"status": "AI Project Planner API", "version": "2.0"}

@app.post("/api/chat")
async def chat(request: ChatRequest):
    """Simple chat to ask for missing information"""
    
    if not os.getenv("GROQ_API_KEY"):
        raise HTTPException(status_code=500, detail="GROQ_API_KEY not configured")
    
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
            max_tokens=200
        )
        
        response = completion.choices[0].message.content
        return {"response": response}
        
    except Exception as e:
        print(f"Chat Error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")

@app.post("/api/generate-plan")
async def generate_plan(request: ChatRequest):
    """Generate comprehensive project plan with Gantt chart data"""
    
    print("=" * 80)
    print("GENERATE PLAN ENDPOINT CALLED")
    print("=" * 80)
    
    if not os.getenv("GROQ_API_KEY"):
        raise HTTPException(status_code=500, detail="GROQ_API_KEY not configured")
    
    conversation = "\n".join([f"{msg.role}: {msg.content}" for msg in request.messages])
    print(f"Conversation:\n{conversation}\n")
    
    # Extract information from conversation
    all_text = " ".join([msg.content for msg in request.messages])
    
    # Extract goal
    goal_match = re.search(r'(build|create|develop|make|design).*?(website|app|project|platform|system|tool|software|product|e-commerce|ecommerce|research|MERN|mern|full.*stack)', all_text, re.IGNORECASE)
    goal = goal_match.group(0) if goal_match else "project"
    
    # Extract duration
    duration_match = re.search(r'(\d+)\s*(week|weeks|month|months|day|days)', all_text, re.IGNORECASE)
    duration_text = duration_match.group(0) if duration_match else None
    
    # Extract team size
    team_match = re.search(r'(\d+)\s*(member|members|developer|developers|people|person|team)', all_text, re.IGNORECASE)
    if not team_match:
        team_match = re.search(r'team\s+of\s+(\d+)', all_text, re.IGNORECASE)
    team_size = team_match.group(1) if team_match else None
    
    # Extract team member names if provided
    team_names = []
    # Look for patterns like "rohit, rupin and brej" or "names are rohit, rupin, brej"
    names_pattern = re.search(r'(?:names?\s+(?:are|is)\s+)?([a-zA-Z]+(?:\s*,\s*[a-zA-Z]+)*(?:\s+and\s+[a-zA-Z]+)?)', all_text, re.IGNORECASE)
    if names_pattern:
        names_text = names_pattern.group(1)
        # Split by comma and 'and'
        names_text = names_text.replace(' and ', ', ')
        team_names = [name.strip().title() for name in names_text.split(',') if name.strip() and len(name.strip()) > 2]
        # Filter out common words
        common_words = ['team', 'size', 'members', 'people', 'days', 'weeks', 'months', 'build', 'create', 'have', 'got', 'want', 'their', 'where']
        team_names = [name for name in team_names if name.lower() not in common_words]
    
    # Create explicit instruction
    team_info = f"{team_size} members"
    if team_names and len(team_names) > 0:
        team_info = f"{team_size} members: {', '.join(team_names)}"
    
    extraction_summary = f"\nEXTRACTED INFO:\n- Goal: {goal}\n- Duration: {duration_text}\n- Team: {team_info}\n"
    
    system_prompt = """You are an expert project planning AI. Create a comprehensive, realistic project plan based on the extracted information.

REASONING PROCESS (think step-by-step):
1. First, identify the project type and domain (software, marketing, research, etc.)
2. Then, create logical tasks based on project description
3. Next, determine task dependencies based on natural workflow
4. After that, assign realistic durations considering task complexity
5. Finally, assign appropriate team members based on project type

CRITICAL RULES - MUST FOLLOW EXACTLY:
1. Use EXACTLY the duration provided (already converted to days) and it should not generate it own duration for the project
2. Use EXACTLY the team size specified - DO NOT EXCEED THIS NUMBER
3. Create ONLY as many unique assignees as the team size allows
4. Assign multiple tasks to the same person if needed - people can do multiple tasks
5. Create 6-10 realistic tasks that fit within the specified duration
6. DO NOT add extra time or change the requirements
7. Adapt role names to project type (not limited to Developer/Designer/QA)

TEAM SIZE ENFORCEMENT (CRITICAL):
- If team size is 5, create EXACTLY 5 unique assignee names
- If team size is 10, create EXACTLY 10 unique assignee names
- Count unique assignees before responding - MUST match team size
- Reuse the same role names across multiple tasks
- Example: 5 members, 8 tasks → some people get 2 tasks

TEAM MEMBER NAMING (IMPORTANT):
- If specific names are provided (e.g., "Rohit, Rupin, Brej"), USE THOSE EXACT NAMES as assignees
- If no names provided, use role-based names based on project type
- When names are given, assign tasks directly to those people

ROLE NAMING BY PROJECT TYPE (when no names provided):
- Software: "Frontend Dev", "Backend Dev", "Designer", "QA Engineer", "DevOps"
- Marketing: "Marketing Manager", "Content Writer", "Designer", "SEO Specialist", "Analyst"
- Research: "Researcher 1", "Researcher 2", "Data Analyst", "Writer", "Reviewer"
- General: "Team Member 1", "Team Member 2", etc.

COMMON WORKFLOWS (adapt as needed):
- Software: Planning → Design → Development → Testing → Deployment
- Marketing: Research → Strategy → Content Creation → Campaign Launch → Analysis
- Research: Literature Review → Data Collection → Analysis → Writing → Review
- Product: Ideation → Prototyping → User Testing → Refinement → Launch

Create a JSON response with this structure:
{
  "project_name": "string (based on user's goal)",
  "description": "string (brief summary of user's goal)",
  "total_duration_days": number (EXACTLY as user specified),
  "tasks": [
    {
      "id": "string (task-1, task-2, etc.)",
      "name": "string (clear task name)",
      "description": "string (what this task involves)",
      "assignee": "string (role like Frontend Dev, Designer, PM, etc.)",
      "start_day": number (0-indexed from project start),
      "duration_days": number (realistic for this task),
      "dependencies": ["task-id-1"],
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
}

DURATION CONVERSION:
- "6 weeks" = 42 days
- "2 months" = 60 days  
- "30 days" = 30 days
- "1 month" = 30 days

TEAM SIZE EXAMPLES:
- User: "4 members" → Create EXACTLY 4 unique assignees (e.g., "Frontend Dev", "Backend Dev", "Designer", "QA Engineer")
- User: "3 developers" → Create EXACTLY 3 unique assignees (e.g., "Developer 1", "Developer 2", "Developer 3")
- User: "team of 5" → Create EXACTLY 5 unique assignees

VALIDATION BEFORE RESPONDING:
1. Count unique assignee names - MUST equal user's team size
2. All tasks must fit within total_duration_days
3. Dependencies must reference valid task IDs
4. start_day must respect dependencies

Return ONLY valid JSON, no markdown, no explanations."""

    try:
        completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"{extraction_summary}\n\nGenerate project plan JSON based on this information:"}
            ],
            temperature=0.7,
            max_tokens=3000
        )
        
        response_text = completion.choices[0].message.content.strip()
        
        # Extract JSON from markdown code blocks if present
        json_match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', response_text, re.DOTALL)
        if json_match:
            response_text = json_match.group(1)
        
        # Check if response is an error message instead of JSON
        if not response_text.strip().startswith('{'):
            raise HTTPException(status_code=400, detail=response_text)
        
        plan_data = json.loads(response_text)
        
        # Log the response for debugging
        print("=" * 80)
        print("AI RESPONSE PARSED:")
        print(json.dumps(plan_data, indent=2))
        print("=" * 80)
        
        # Calculate dates
        start_date = datetime.now()
        project_id = f"proj-{int(datetime.now().timestamp())}"
        
        tasks = []
        team_members = set()
        
        # Check if tasks array exists and has items
        tasks_from_ai = plan_data.get("tasks", [])
        print(f"Tasks from AI: {len(tasks_from_ai)} tasks")
        
        if not plan_data.get("tasks") or len(plan_data.get("tasks", [])) == 0:
            print("=" * 80)
            print("WARNING: No tasks in AI response, creating default tasks")
            print("=" * 80)
            # Create default tasks if AI didn't generate any
            total_duration = plan_data.get("total_duration_days", 30)
            num_tasks = min(6, max(3, total_duration // 5))  # 3-6 tasks based on duration
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
            for task_data in plan_data.get("tasks", []):
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
        
        print(f"Total tasks created: {len(tasks)}")
        print(f"Team members: {team_members}")
        
        total_duration = plan_data.get("total_duration_days", 30)
        end_date = start_date + timedelta(days=total_duration - 1)
        
        print(f"Creating ProjectPlan with {len(tasks)} tasks")
        
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
        
        print("=" * 80)
        print(f"RETURNING PROJECT PLAN: {project_plan.project_name}")
        print(f"Tasks in response: {len(project_plan.tasks)}")
        print("=" * 80)
        
        return project_plan
        
    except json.JSONDecodeError as e:
        print(f"JSON Parse Error: {str(e)}")
        print(f"Response text: {response_text}")
        raise HTTPException(status_code=500, detail=f"Failed to parse AI response: {str(e)}")
    except Exception as e:
        print(f"Error generating plan: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@app.put("/api/projects/{project_id}/tasks/{task_id}")
async def update_task(project_id: str, task_id: str, task: Task):
    """Update task details"""
    return {"message": "Task updated", "task": task}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
