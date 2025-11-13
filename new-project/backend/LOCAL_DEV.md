# 💻 Local Development Guide

## Quick Start

### Option 1: Using the Setup Script (Easiest)

```bash
cd new-project/backend
./run-local.sh
```

This script will:
1. Create a virtual environment
2. Install dependencies
3. Check for .env file
4. Start the development server

### Option 2: Manual Setup

```bash
cd new-project/backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On macOS/Linux
# OR
venv\Scripts\activate     # On Windows

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Add your GROQ_API_KEY to .env

# Run the server
python -m uvicorn netlify.functions.api:app --reload --host 0.0.0.0 --port 8000
```

## Environment Setup

### 1. Get Groq API Key

1. Go to https://console.groq.com
2. Sign up or log in
3. Create an API key
4. Copy the key

### 2. Configure Environment

Edit `new-project/backend/.env`:
```bash
GROQ_API_KEY=your_actual_api_key_here
```

## Running the Backend

### Using uvicorn directly:
```bash
cd new-project/backend
source venv/bin/activate
uvicorn netlify.functions.api:app --reload --port 8000
```

### Access Points:
- **API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs
- **Health Check:** http://localhost:8000/api
- **Debug Endpoint:** http://localhost:8000/api/debug

## Testing the API

### Health Check
```bash
curl http://localhost:8000/api
```

### Chat Endpoint
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "I want to build a website"}
    ]
  }'
```

### Generate Plan
```bash
curl -X POST http://localhost:8000/api/generate-plan \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Build a website in 30 days with 5 people"}
    ]
  }'
```

## Common Issues

### Issue: `venv` not found
**Solution:** Create it with `python3 -m venv venv`

### Issue: `GROQ_API_KEY not found`
**Solution:** Make sure `.env` file exists with your API key

### Issue: `Module not found`
**Solution:** Activate venv and reinstall: `pip install -r requirements.txt`

### Issue: Port 8000 already in use
**Solution:** Use a different port: `uvicorn netlify.functions.api:app --port 8001`

## Development Workflow

1. **Start Backend:**
   ```bash
   cd new-project/backend
   source venv/bin/activate
   uvicorn netlify.functions.api:app --reload --port 8000
   ```

2. **Start Frontend (in another terminal):**
   ```bash
   cd new-project/frontend
   npm run dev
   ```

3. **Test the app:**
   - Open http://localhost:3000
   - Chat with the AI
   - Generate Gantt charts

## Deactivating Virtual Environment

When you're done:
```bash
deactivate
```

## Notes

- The backend uses the Netlify function at `netlify/functions/api.py`
- For production, this runs as a serverless function on Netlify
- For local dev, we run it with uvicorn
- The frontend expects the backend at `http://localhost:8000`
