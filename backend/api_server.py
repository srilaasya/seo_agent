from flask import Flask, request, jsonify
from flask_cors import CORS
import asyncio
import os
import sys
from dotenv import load_dotenv
import traceback

# --- Phoenix / OTel Imports ---
from phoenix.otel import register
from openinference.instrumentation import using_session

# Adjust path for imports
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if current_dir not in sys.path:
    sys.path.append(current_dir)
if parent_dir not in sys.path:
    sys.path.append(parent_dir)

try:
    from seo_agents import (
        research_agent, 
        outline_agent, 
        writing_agent, 
        Runner, 
        parse_research_output
    )
except ImportError as e:
    print(f"Fatal Error: Could not import from seo_agents.py. Check path and file existence.")
    print(f"Error details: {e}")
    print(f"Current sys.path: {sys.path}")
    raise 

# Load environment variables
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    print("Error: OPENAI_API_KEY must be set in your .env file.")
    exit(1)

# --- Initialize Phoenix --- 
print("Initializing Phoenix tracing...")
try:
    os.environ["PHOENIX_COLLECTOR_ENDPOINT"] = "http://localhost:6006"
    tracer_provider = register(project_name="seo_agent", auto_instrument=True)
    print("✅ Phoenix tracing and OpenAI instrumentation configured.")
except Exception as e:
    print(f"⚠️ Phoenix initialization failed: {e}")

app = Flask(__name__)
CORS(app)  

# --- API Endpoints with Session Handling --- 
@app.route('/api/research', methods=['POST'])
def run_research():
    session_id = None
    try:
        data = request.json
        topic = data.get('topic', '')
        audience = data.get('audience', '')
        proprietary_data = data.get('proprietaryData', '')
        session_id = data.get('sessionId') 
        
        if not topic or not audience:
            return jsonify({"error": "Topic and audience are required"}), 400
        if not session_id:
             print("Warning: sessionId not provided for research request.")

        research_prompt = f"Topic: {topic}\nAudience: {audience}\nProprietary Data: {proprietary_data if proprietary_data else 'None'}"
        
        research_output = None
        with using_session(session_id):
            result = asyncio.run(Runner.run(research_agent, research_prompt))
            research_output = result.final_output
        
        if not research_output:
            return jsonify({"error": "Research agent returned no output"}), 500
            
        parsed_data = parse_research_output(research_output)
        
        return jsonify({
            "success": True,
            "data": {
                "keywords": parsed_data.get("keywords", []),
                "researchNotes": parsed_data.get("research_notes", ""),
                "potentialUrls": parsed_data.get("potential_urls", []),
                "rawOutput": research_output
            }
        })
        
    except Exception as e:
        print(f"Error in research endpoint: {str(e)}\n{traceback.format_exc()}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/outline', methods=['POST'])
def run_outline():
    session_id = None
    try:
        data = request.json
        topic = data.get('topic', '')
        audience = data.get('audience', '')
        tone = data.get('tone', 'Informative')
        length = data.get('length', 'Medium (~750 words)')
        keywords = data.get('keywords', [])
        research_notes = data.get('researchNotes', '')
        potential_urls = data.get('potentialUrls', [])
        proprietary_data = data.get('proprietaryData', '')
        session_id = data.get('sessionId') 
        
        if not keywords:
            return jsonify({"error": "Keywords are required"}), 400
        if not session_id:
             print("Warning: sessionId not provided for outline request.")
            
        keywords_str = "\n".join([f"- {kw}" for kw in keywords])
        urls_str = "\n".join([f"- {url}" for url in potential_urls])
        outline_prompt = f"""
Topic: {topic}
Audience: {audience}
Tone: {tone}
Length: {length}

Keywords:
{keywords_str}

Research Notes:
{research_notes}

Potential URLs:
{urls_str}

Proprietary Data: {proprietary_data if proprietary_data else 'None'}

Generate the blog post outline based on the provided research and requirements.
"""
        
        outline_output = None
        with using_session(session_id):
            result = asyncio.run(Runner.run(outline_agent, outline_prompt))
            outline_output = result.final_output
        
        if not outline_output:
            return jsonify({"error": "Outline agent returned no output"}), 500
            
        return jsonify({
            "success": True,
            "data": {
                "outlineContent": outline_output,
                "rawOutput": outline_output
            }
        })
        
    except Exception as e:
        print(f"Error in outline endpoint: {str(e)}\n{traceback.format_exc()}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/write', methods=['POST'])
def run_writing():
    session_id = None
    try:
        data = request.json
        topic = data.get('topic', '')
        audience = data.get('audience', '')
        tone = data.get('tone', 'Informative')
        length = data.get('length', 'Medium (~750 words)')
        keywords = data.get('keywords', [])
        research_notes = data.get('researchNotes', '')
        potential_urls = data.get('potentialUrls', [])
        outline_content = data.get('outlineContent', '')
        proprietary_data = data.get('proprietaryData', '')
        session_id = data.get('sessionId') 
        
        if not outline_content:
            return jsonify({"error": "Outline content is required"}), 400
        if not session_id:
             print("Warning: sessionId not provided for writing request.")

        keywords_str = "\n".join([f"- {kw}" for kw in keywords])
        urls_str = "\n".join([f"- {url}" for url in potential_urls])
        writing_prompt = f"""
Topic: {topic}
Audience: {audience}
Tone: {tone}
Length: {length}

Keywords:
{keywords_str}

Research Notes:
{research_notes}

Potential URLs:
{urls_str}

Proprietary Data: {proprietary_data if proprietary_data else 'None'}

Outline:
{outline_content}

IMPORTANT INSTRUCTION: This blog post MUST include proper citations and backlinks. For any facts, statistics, or major claims, find and cite appropriate sources using the web search tool. Include at least 5-7 hyperlinks to credible sources properly.

Write the complete blog post, following the outline and incorporating the research/keywords/URLs.
"""
        
        blog_post = None
        with using_session(session_id):
            result = asyncio.run(Runner.run(writing_agent, writing_prompt))
            blog_post = result.final_output
        
        if not blog_post:
            return jsonify({"error": "Writing agent returned no output"}), 500
            
        return jsonify({
            "success": True,
            "data": {
                "blogPost": blog_post
            }
        })
        
    except Exception as e:
        print(f"Error in writing endpoint: {str(e)}\n{traceback.format_exc()}")
        return jsonify({"error": str(e)}), 500
# --- End API Endpoints --- 

# Simple health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "message": "API server is running"})

if __name__ == '__main__':
    print("Starting API server on port 5000...")
    app.run(host='0.0.0.0', port=5000, debug=True) 