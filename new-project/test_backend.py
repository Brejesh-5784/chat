#!/usr/bin/env python3
import requests
import json

# Test the backend
url = "http://localhost:8000/api/generate-plan"

messages = [
    {"role": "user", "content": "I want to do a research project on Speech AI"},
    {"role": "assistant", "content": "How long do you have to complete the research project on Speech AI?"},
    {"role": "user", "content": "Around 3 weeks"},
    {"role": "assistant", "content": "How many team members will be working on the Speech AI research project?"},
    {"role": "user", "content": "Brej, Rohit, Rupin"},
    {"role": "assistant", "content": "So there are 3 team members. So: Speech AI research project, 3 weeks, 3 people. Is this correct?"},
    {"role": "user", "content": "Yes thats right"}
]

payload = {"messages": messages}

print("Sending request to backend...")
print(json.dumps(payload, indent=2))
print("\n" + "="*80 + "\n")

try:
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    print("\nResponse:")
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"Error: {e}")
