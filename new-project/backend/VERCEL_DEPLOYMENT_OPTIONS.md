# Vercel Backend Deployment - Troubleshooting Guide

## Common Deployment Issues and Solutions

### Issue 1: Build Fails with Python Dependencies

**Problem:** Vercel can't install certain Python packages with C extensions.

**Solution:** Updated `requirements.txt` to remove `uvicorn[standard]` which has C dependencies.

### Issue 2: Module Import Errors

**Problem:** Vercel can't find the FastAPI app.

**Solutions Provided:**

#### Option A: Using api/index.py (Recommended)
```
backend/
├── api/
│   └── index.py          # Vercel entry point
├── main.py               # Your FastAPI app
├── requirements.txt
└── vercel.json
```

Current `vercel.json` uses this approach.

#### Option B: Direct index.py
```
backend/
├── index.py              # Imports from main.py
├── main.py               # Your FastAPI app
├── requirements.txt
└── vercel.json
```

To use this, update `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.py"
    }
  ]
}
```

#### Option C: Single File (Simplest)
Rename `main.py` to `index.py` and update `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.py"
    }
  ]
}
```

### Issue 3: Environment Variables Not Working

**Problem:** `GROQ_API_KEY` not found.

**Solution:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add `GROQ_API_KEY` with your actual key
3. Select all environments (Production, Preview, Development)
4. Redeploy the project

### Issue 4: CORS Errors

**Problem:** Frontend can't connect to backend.

**Solution:** Already configured in `main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Issue 5: Timeout Errors

**Problem:** AI generation takes too long.

**Solution:** Vercel free tier has 10s timeout, Pro has 60s.
- Upgrade to Vercel Pro for longer timeouts
- Or optimize AI prompts to respond faster

## Deployment Steps

### Step 1: Choose Your Approach
Pick one of the options above (A, B, or C).

### Step 2: Update Files
Make sure your `vercel.json` matches your chosen approach.

### Step 3: Deploy
```bash
cd backend
vercel --prod
```

Or use Vercel Dashboard:
1. Import Git repository
2. Select `backend` folder as root
3. Vercel auto-detects Python
4. Deploy

### Step 4: Set Environment Variables
In Vercel Dashboard:
- Add `GROQ_API_KEY`
- Redeploy if needed

### Step 5: Test
Visit: `https://your-backend.vercel.app/`

Should return:
```json
{
  "status": "AI Project Planner API",
  "version": "2.0",
  "endpoints": {...}
}
```

## Debugging

### View Logs
1. Vercel Dashboard → Your Project
2. Click on deployment
3. View "Functions" tab
4. Check for errors

### Common Error Messages

**"Module not found"**
- Check file paths in `vercel.json`
- Ensure `index.py` or `api/index.py` exists
- Verify imports in entry point file

**"Package installation failed"**
- Check `requirements.txt` for problematic packages
- Remove packages with C extensions
- Use pure Python alternatives

**"Function timeout"**
- Reduce AI prompt complexity
- Upgrade to Vercel Pro
- Optimize code performance

**"Environment variable not found"**
- Set in Vercel Dashboard
- Redeploy after adding variables
- Check variable names match code

## Alternative: Use Railway or Render

If Vercel continues to have issues, consider:

### Railway.app
```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy
cd backend
railway login
railway init
railway up
```

### Render.com
1. Connect Git repository
2. Select "Web Service"
3. Build Command: `pip install -r requirements.txt`
4. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

Both support longer timeouts and are Python-friendly.

## Current Configuration

Your backend is currently configured with:
- ✅ `api/index.py` entry point
- ✅ `main.py` with FastAPI app
- ✅ Updated `requirements.txt` (no uvicorn[standard])
- ✅ Proper `vercel.json` routing

Try deploying now. If issues persist, check the specific error message in Vercel logs.
