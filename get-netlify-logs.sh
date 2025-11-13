#!/bin/bash

# Script to get Netlify function logs
# Make sure you have Netlify CLI installed: npm install -g netlify-cli

echo "🔍 Checking Netlify CLI..."

if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI not found. Installing..."
    npm install -g netlify-cli
fi

echo "✅ Netlify CLI found"
echo ""
echo "📋 Getting function logs..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Login if needed
netlify status || netlify login

# Get logs for the api function
echo ""
echo "Fetching logs for 'api' function..."
echo ""
netlify functions:log api

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 Tips:"
echo "  - Check for GROQ_API_KEY errors"
echo "  - Look for import errors"
echo "  - Check for timeout errors"
echo ""
echo "To view logs in real-time:"
echo "  netlify functions:log api --follow"
