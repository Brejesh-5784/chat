"""
AI Project Planner - Main Backend Application
==============================================

This is the main FastAPI backend server that powers the AI Project Planner.
It provides REST API endpoints for:
- Conversational AI chat to gather project requirements
- AI-powered project plan generation with Gantt chart data
- Task management and updates

Technologies:
- FastAPI: Modern Python web framework
- Groq AI: LLM API for intelligent project planning
- Pydantic: Data validation and serialization

Author: AI Project Planner Team
Version: 2.0
"""

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

# Load environment variables from .env file
load_dotenv()

# Initialize FastAPI application
app = FastAPI(
    title="AI Project Planner API",
    description="Backend API for AI-powered project planning and Gantt chart generation",
    version="2.0"
)

# Configure CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (configure for production)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Initialize Groq AI client for LLM interactions
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))


# ============================================================================
# DATA MODELS (Pydantic Schemas)
# ============================================================================

class ChatMessage(BaseModel):
    """
    Represents a single message in the chat conversation.
    
    Attributes:
        role: Either 'user' or 'assistant'
        content: The message text content
    """
    role: str
    content: str


class ChatRequest(BaseModel):
    """
    Request payload for chat and plan generation endpoints.
    
    Attributes:
        messages: List of chat messages in the conversation
        project_context: Optional additional context about the project
    """
    messages: List[ChatMessage]
    project_context: Optional[Dict] = None


class Task(BaseModel):
    """
    Represents a single task in the project plan.
    
    Attributes:
        id: Unique task identifier (e.g., 'task-1')
        name: Task name/title
        description: Detailed task description
        assignee: Team member assigned to this task
        start_date: Task start date (YYYY-MM-DD format)
        end_date: Task end date (YYYY-MM-DD format)
        duration_days: Number of days the task will take
        dependencies: List of task IDs that must complete before this task
        progress: Task completion percentage (0-100)
        priority: Task priority level ('high', 'medium', 'low')
        status: Current task status ('pending', 'in_progress', 'completed')
    """
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
    """
    Complete project plan with all tasks and metadata.
    
    Attributes:
        project_id: Unique project identifier
        project_name: Name of the project
        description: Project description
        start_date: Project start date
        end_date: Project end date
        total_duration_days: Total project duration in days
        tasks: List of all project tasks
        team_members: List of team member names
        milestones: List of project milestones
    """
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
def root():
    """
    Root endpoint - API health check.
    
    Returns:
        dict: API status and version information
    """
    return {
        "status": "AI Project Planner API",
        "version": "2.0",
        "endpoints": {
            "chat": "/api/chat",
            "generate_plan": "/api/generate-plan",
            "update_task": "/api/projects/{project_id}/tasks/{task_id}"
        }
    }


@app.post("/api/chat")
async def chat(request: ChatRequest):
    """
    Conversational AI endpoint for gathering project requirements.
    
    This endpoint uses Groq AI to have a natural conversation with the user,
    asking questions to gather project details like:
    - Project goal/description
    - Timeline/duration
    - Team size and member names
    - Technology stack (optional)
    
    Args:
        request: ChatRequest containing conversation history
        
    Returns:
        dict: AI response message
        
    Raises:
        HTTPException: If GROQ_API_KEY is not configured or API call fails
    """
    if not os.getenv("GROQ_API_KEY"):
        raise HTTPException(status_code=500, detail="GROQ_API_KEY not configured")
    
    try:
        # Call Groq AI with conversation history
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
    """
    Generate comprehensive project plan with Gantt chart data.
    
    This endpoint analyzes the conversation history to extract project requirements
    and uses Groq AI to generate a detailed project plan including:
    - Task breakdown with dependencies
    - Team member assignments
    - Realistic timelines
    - Project milestones
    
    The AI adapts task types and workflows based on the project domain
    (software, marketing, research, etc.)
    
    Args:
        request: ChatRequest containing full conversation history
        
    Returns:
        ProjectPlan: Complete project plan with tasks and metadata
        
    Raises:
        HTTPException: If GROQ_API_KEY is not configured or generation fails
    """
    print("=" * 80)
    print("GENERATE PLAN ENDPOINT CALLED")
    print("=" * 80)
    
    if not os.getenv("GROQ_API_KEY"):
        raise HTTPException(status_code=500, detail="GROQ_API_KEY not configured")
    
    # Extract conversation text for analysis
    conversation = "\n".join([f"{msg.role}: {msg.content}" for msg in request.messages])
    print(f"Conversation:\n{conversation}\n")
    
    # Extract information from conversation using regex
    all_text = " ".join([msg.content for msg in request.messages])
    
    # Extract project goal/type
    goal_match = re.search(
        r'(build|create|develop|make|design).*?(website|app|project|platform|system|tool|software|product|e-commerce|ecommerce|research|MERN|mern|full.*stack)',
        all_text,
        re.IGNORECASE
    )
    goal = goal_match.group(0) if goal_match else "project"
    
    # Extract duration (weeks, months, days)
    duration_match = re.search(r'(\d+)\s*(week|weeks|month|months|day|days)', all_text, re.IGNORECASE)
    duration_text = duration_match.group(0) if duration_match else None
    
    # Extract team size
    team_match = re.search(r'(\d+)\s*(member|members|developer|developers|people|person|team)', all_text, re.IGNORECASE)
    if not team_match:
        team_match = re.search(r'team\s+of\s+(\d+)', all_text, re.IGNORECASE)
    team_size = team_match.group(1) if team_match else None
    
    # Extract team member names if provided
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
        # Filter out common words
        common_words = ['team', 'size', 'members', 'people', 'days', 'weeks', 'months', 'build', 'create', 'have', 'got', 'want', 'their', 'where']
        team_names = [name for name in team_names if name.lower() not in common_words]
    
    # Create extraction summary for AI
    team_info = f"{team_size} members"
    if team_names and len(team_names) > 0:
        team_info = f"{team_size} members: {', '.join(team_names)}"
    
    extraction_summary = f"\nEXTRACTED INFO:\n- Goal: {goal}\n- Duration: {duration_text}\n- Team: {team_info}\n"
    
    # System prompt for AI project plan generation
    system_prompt = """You are an expert AI project planning assistant specializing in creating detailed, realistic project plans with task breakdowns, timelines, and team assignments.

═══════════════════════════════════════════════════════════════════════════════
STEP-BY-STEP REASONING PROCESS
═══════════════════════════════════════════════════════════════════════════════

Follow this systematic approach to create the project plan:

1. ANALYZE PROJECT TYPE
   - Identify the domain: software development, marketing, research, product design, etc.
   - Understand the project's core objectives and deliverables

2. BREAK DOWN INTO TASKS
   - Create 6-10 logical, sequential tasks based on the project type
   - Ensure tasks follow a natural workflow progression
   - Each task should be specific and actionable

3. ESTABLISH DEPENDENCIES
   - Determine which tasks must be completed before others can start
   - Create a realistic dependency chain (e.g., design before development)
   - Avoid circular dependencies

4. ASSIGN REALISTIC DURATIONS
   - Allocate time based on task complexity and scope
   - Ensure all tasks fit within the total project duration
   - Consider parallel tasks to optimize timeline

5. ASSIGN TEAM MEMBERS
   - Match tasks to appropriate team member roles or names
   - Distribute workload evenly across the team
   - Ensure each person has a manageable number of tasks

═══════════════════════════════════════════════════════════════════════════════
CRITICAL REQUIREMENTS (MUST FOLLOW EXACTLY)
═══════════════════════════════════════════════════════════════════════════════

⚠️ DURATION CONSTRAINTS:
   • Use EXACTLY the duration specified by the user (already converted to days)
   • DO NOT add extra days or modify the timeline
   • All tasks must fit within the total_duration_days
   • Example: If user says "14 days", total_duration_days = 14

⚠️ TEAM SIZE CONSTRAINTS:
   • Create EXACTLY the number of unique assignees as the team size
   • If team size is 3, create EXACTLY 3 unique assignee names
   • If team size is 7, create EXACTLY 7 unique assignee names
   • DO NOT exceed or reduce the specified team size
   • Assign multiple tasks to the same person if needed

⚠️ TASK REQUIREMENTS:
   • Generate 6-10 tasks (adjust based on project duration)
   • Each task must have a clear, descriptive name
   • Include meaningful task descriptions
   • Set appropriate priority levels (high/medium/low)
   • All tasks start with status "pending"

═══════════════════════════════════════════════════════════════════════════════
TEAM MEMBER NAMING GUIDELINES
═══════════════════════════════════════════════════════════════════════════════

OPTION 1: User Provides Specific Names
   • If names are given (e.g., "Rohit, Rupin, Brej"), USE THOSE EXACT NAMES
   • Assign tasks directly to the named individuals
   • Example: "Rohit", "Rupin", "Brej" (not "Team Member 1")

OPTION 2: No Names Provided - Use Role-Based Names
   • Adapt role names to match the project type
   • Use professional, descriptive role titles

   Software Projects:
   - "Frontend Developer", "Backend Developer", "UI/UX Designer"
   - "QA Engineer", "DevOps Engineer", "Tech Lead"

   Marketing Projects:
   - "Marketing Manager", "Content Writer", "Graphic Designer"
   - "SEO Specialist", "Social Media Manager", "Data Analyst"

   Research Projects:
   - "Lead Researcher", "Research Assistant", "Data Analyst"
   - "Technical Writer", "Peer Reviewer", "Lab Coordinator"

   Product Projects:
   - "Product Manager", "UX Designer", "Product Designer"
   - "User Researcher", "Prototyper", "Product Analyst"

   General Projects:
   - "Team Lead", "Team Member 1", "Team Member 2", etc.

═══════════════════════════════════════════════════════════════════════════════
WORKFLOW TEMPLATES BY PROJECT TYPE
═══════════════════════════════════════════════════════════════════════════════

Software Development:
   Planning → Requirements → Design → Development → Testing → Deployment → Review

Marketing Campaign:
   Research → Strategy → Content Creation → Design → Campaign Launch → Analysis → Optimization

Research Project:
   Literature Review → Hypothesis → Data Collection → Analysis → Writing → Peer Review → Publication

Product Development:
   Ideation → Market Research → Prototyping → User Testing → Refinement → Launch → Feedback

Event Planning:
   Concept → Venue Selection → Marketing → Logistics → Execution → Follow-up

═══════════════════════════════════════════════════════════════════════════════
JSON RESPONSE FORMAT
═══════════════════════════════════════════════════════════════════════════════

Return ONLY valid JSON in this exact structure (no markdown, no explanations):

{
  "project_name": "Descriptive project name based on user's goal",
  "description": "Brief 1-2 sentence summary of the project",
  "total_duration_days": <exact number from user input>,
  "tasks": [
    {
      "id": "task-1",
      "name": "Clear, actionable task name",
      "description": "Detailed description of what this task involves",
      "assignee": "Team member name or role",
      "start_day": 0,
      "duration_days": 3,
      "dependencies": [],
      "priority": "high",
      "status": "pending"
    },
    {
      "id": "task-2",
      "name": "Next task name",
      "description": "What needs to be done",
      "assignee": "Team member name or role",
      "start_day": 3,
      "duration_days": 4,
      "dependencies": ["task-1"],
      "priority": "medium",
      "status": "pending"
    }
  ],
  "milestones": [
    {
      "name": "Milestone name",
      "day": 7,
      "description": "What is achieved at this milestone"
    }
  ]
}

═══════════════════════════════════════════════════════════════════════════════
FIELD SPECIFICATIONS
═══════════════════════════════════════════════════════════════════════════════

• id: Sequential task identifiers (task-1, task-2, task-3, ...)
• name: Short, descriptive task title (e.g., "Design Database Schema")
• description: Detailed explanation of task scope and deliverables
• assignee: Team member name (if provided) or role-based name
• start_day: Day number when task begins (0-indexed, 0 = project start)
• duration_days: Number of days the task will take (must be realistic)
• dependencies: Array of task IDs that must complete first (e.g., ["task-1", "task-2"])
• priority: "high", "medium", or "low" based on task importance
• status: Always "pending" for new tasks

═══════════════════════════════════════════════════════════════════════════════
DURATION CONVERSION REFERENCE
═══════════════════════════════════════════════════════════════════════════════

• 1 week = 7 days
• 2 weeks = 14 days
• 3 weeks = 21 days
• 1 month = 30 days
• 2 months = 60 days
• 3 months = 90 days

═══════════════════════════════════════════════════════════════════════════════
VALIDATION CHECKLIST (Before Responding)
═══════════════════════════════════════════════════════════════════════════════

✓ Count unique assignee names - MUST equal user's team size
✓ All task start_day + duration_days ≤ total_duration_days
✓ All dependencies reference valid task IDs
✓ Tasks with dependencies start after their dependencies complete
✓ No circular dependencies exist
✓ All required fields are present in each task
✓ JSON is valid and properly formatted
✓ No markdown code blocks or extra text

═══════════════════════════════════════════════════════════════════════════════
EXAMPLES
═══════════════════════════════════════════════════════════════════════════════

Example 1: 3 team members, 14 days
   → Create EXACTLY 3 unique assignees
   → Generate 6-8 tasks
   → Ensure all tasks fit within 14 days

Example 2: 5 team members with names "Alice, Bob, Charlie, Diana, Eve"
   → Use EXACTLY these 5 names as assignees
   → Distribute tasks among these 5 people
   → Some people may have multiple tasks

Example 3: 10 team members, 60 days
   → Create EXACTLY 10 unique assignees
   → Generate 8-10 tasks
   → Distribute workload across all 10 members

═══════════════════════════════════════════════════════════════════════════════

Remember: Return ONLY the JSON object. No explanations, no markdown, no additional text."""

    try:
        # Generate project plan using AI
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
        
        # Validate response is JSON
        if not response_text.strip().startswith('{'):
            raise HTTPException(status_code=400, detail=response_text)
        
        # Parse AI response
        plan_data = json.loads(response_text)
        
        # Log the response for debugging
        print("=" * 80)
        print("AI RESPONSE PARSED:")
        print(json.dumps(plan_data, indent=2))
        print("=" * 80)
        
        # Calculate project dates
        start_date = datetime.now()
        project_id = f"proj-{int(datetime.now().timestamp())}"
        
        tasks = []
        team_members = set()
        
        # Check if tasks array exists and has items
        tasks_from_ai = plan_data.get("tasks", [])
        print(f"Tasks from AI: {len(tasks_from_ai)} tasks")
        
        if not plan_data.get("tasks") or len(plan_data.get("tasks", [])) == 0:
            # Fallback: Create default tasks if AI didn't generate any
            print("=" * 80)
            print("WARNING: No tasks in AI response, creating default tasks")
            print("=" * 80)
            
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
            # Process AI-generated tasks
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
        
        # Calculate project end date
        total_duration = plan_data.get("total_duration_days", 30)
        end_date = start_date + timedelta(days=total_duration - 1)
        
        print(f"Creating ProjectPlan with {len(tasks)} tasks")
        
        # Create and return project plan
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
    """
    Update task details (progress, status, etc.).
    
    This endpoint allows updating individual task properties like
    completion status, progress percentage, or other attributes.
    
    Args:
        project_id: Unique project identifier
        task_id: Unique task identifier
        task: Updated task data
        
    Returns:
        dict: Success message and updated task
    """
    return {"message": "Task updated", "task": task}


# ============================================================================
# APPLICATION ENTRY POINT
# ============================================================================

# For Vercel serverless deployment
handler = app

# For local development
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
