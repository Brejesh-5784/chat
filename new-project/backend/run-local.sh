#!/bin/bash

# Local Development Setup Script for Backend

echo "🚀 Setting up AI Project Planner Backend..."
echo ""

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.9 or higher."
    exit 1
fi

echo "✅ Python 3 found: $(python3 --version)"
echo ""

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
    echo "✅ Virtual environment created"
else
    echo "✅ Virtual environment already exists"
fi

echo ""
echo "📥 Installing dependencies..."
source venv/bin/activate
pip install -r requirements.txt

echo ""
echo "🔐 Checking environment variables..."
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "⚠️  Please add your GROQ_API_KEY to .env file"
    echo ""
    read -p "Press Enter to continue after adding your API key..."
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Starting development server..."
echo "   Backend will run at: http://localhost:8000"
echo "   API docs at: http://localhost:8000/docs"
echo ""

# Run the app (using the file that exists)
if [ -f "app.py" ]; then
    python app.py
elif [ -f "netlify/functions/api.py" ]; then
    echo "⚠️  Note: Running Netlify function locally requires additional setup"
    echo "   For local development, create a simple app.py file"
    echo ""
    echo "Creating temporary local server..."
    cat > temp_server.py << 'EOF'
from netlify.functions.api import app
import uvicorn

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
EOF
    python temp_server.py
else
    echo "❌ No backend entry point found"
    exit 1
fi
