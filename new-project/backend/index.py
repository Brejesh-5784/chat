"""
Vercel Serverless Entry Point
==============================
This file serves as the entry point for Vercel serverless deployment.
It imports and exposes the FastAPI app from main.py.
"""

from main import app

# Vercel expects a variable named 'app' or 'handler'
handler = app
