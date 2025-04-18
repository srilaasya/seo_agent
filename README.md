# SEO Content Generator with Arize Phoenix Tracing

A multi-agent system for generating SEO-optimized blog content with comprehensive tracing and observability powered by Arize Phoenix.

## Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Technology Choices](#technology-choices)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Set Up Virtual Environment](#2-set-up-virtual-environment)
  - [3. Set Up Environment Variables](#3-set-up-environment-variables)
  - [4. Install Backend Dependencies](#4-install-backend-dependencies)
  - [5. Install Frontend Dependencies](#5-install-frontend-dependencies)
- [Running the Application](#running-the-application)
  - [Option 1: Using the Automated Script](#option-1-using-the-automated-script)
  - [Option 2: Manual Startup (Preferred)](#option-2-manual-startup-preferred)
- [Agent Workflow](#agent-workflow)
- [Observability with Arize Phoenix](#observability-with-arize-phoenix)
- [Troubleshooting](#troubleshooting)
- [Future Improvements](#future-improvements)

## Overview

This application demonstrates a multi-agent approach to SEO content generation, with each specialized agent handling a different part of the content creation process. The entire system is instrumented with Arize Phoenix for comprehensive tracing and observability.

## Architecture

### Agent Workflow

![Agent Workflow Diagram](https://example.com/images/seo-agent-workflow.png)

*Figure 1: Multi-agent workflow showing data flow from user input through Research, Outline, and Writing agents with Phoenix observability*

### Arize Phoenix Observability

![Arize Phoenix Observability](https://example.com/images/arize-phoenix-tracing.png)

*Figure 2: Arize Phoenix tracing architecture showing session tracking, data collection, and visualization capabilities*

## Features

- **Three Specialized AI Agents**:
  - **Research Agent**: Analyzes topics and generates keywords and research notes
  - **Outline Agent**: Creates a structured outline with citation markers
  - **Writing Agent**: Produces the final blog post with proper citations

- **Modern React Frontend**:
  - Step-by-step workflow UI
  - Live editing of agent outputs
  - Markdown rendering for better readability

- **Comprehensive Observability**:
  - Full tracing of all agent operations with Arize Phoenix
  - Session-based trace correlation
  - Performance monitoring and debugging
  - Prompt and response analysis

## Technology Choices

### OpenAI Agents SDK

This project uses OpenAI's Agents SDK as the core framework for several important reasons:

- **Integrated Web Search Capabilities**: For an SEO content generator, accurate and up-to-date web search is crucial. OpenAI's Agents SDK provides a seamless WebSearchTool that allows agents to retrieve current information with minimal configuration, which is essential for:
  - Finding relevant and authoritative sources for citations
  - Verifying factual information in real-time
  - Researching current trends and statistics

- **Simplified Agent Design**: The SDK provides a streamlined way to define specialized agents with:
  - Clear instruction formatting
  - Powerful tool integration
  - Built-in state management

- **Performance and Reliability**: The SDK handles retry logic, error handling, and response validation, ensuring more stable agent behavior in production environments.

- **Compatibility with Arize Phoenix**: The SDK works seamlessly with OpenInference instrumentation, enabling detailed tracing and monitoring of agent activities.

For our multi-agent SEO workflow, the web search capability is particularly important in both the Research and Writing phases, where finding accurate sources and citations directly impacts content quality and SEO effectiveness.

## Prerequisites

Before installing, make sure you have the following:

- **Python**: 3.8 or higher
- **Node.js**: 14.0 or higher
- **npm**: 6.0 or higher
- **Terminal**: Bash or Zsh (for running the shell script)
- **OpenAI API Key**: For accessing OpenAI models
- **virtualenv or venv**: For creating Python virtual environments

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/seo-agent.git
cd seo-agent
```

### 2. Set Up Virtual Environment

Creating a virtual environment is strongly recommended to avoid dependency conflicts:

```bash
# Using virtualenv
virtualenv venv
source venv/bin/activate  # On Unix/MacOS
venv\Scripts\activate     # On Windows

# Or using Python's built-in venv module
python -m venv venv
source venv/bin/activate  # On Unix/MacOS
venv\Scripts\activate     # On Windows
```

Make sure the virtual environment is activated for all following backend setup steps and when running the application.

### 3. Set Up Environment Variables

Create a `.env` file in the `backend` directory with the following content:

```
OPENAI_API_KEY=your_openai_api_key
```

Replace `your_openai_api_key` with your actual OpenAI API key.

Optional: If you want to use Arize Phoenix cloud services, add:

```
PHOENIX_API_KEY=your_phoenix_api_key
```

### 4. Install Backend Dependencies

With your virtual environment activated:

```bash
cd backend
pip install -r requirements.txt
pip install phoenix-ai  # For Phoenix tracing and observability
cd ..
```

This installs all required Python packages, including:
- Flask and Flask-CORS for the API server
- OpenAI SDK
- Agents SDK
- Phoenix for tracing

### 5. Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

This installs all required Node.js packages, including:
- React and related libraries
- Axios for API calls
- React Markdown for rendering
- UUID for session management

## Running the Application

You can run the application using either the automated script or manual approach. Both methods work, but the manual approach is preferred if you're using virtual environments.

### Option 1: Using the Automated Script

We've provided a shell script that starts all components in separate terminal windows:

```bash
# Make the script executable
chmod +x run_app.sh

# Run the script
./run_app.sh
```

The script will:
1. Check if the necessary .env file exists
2. Create temporary helper scripts in the appropriate directories
3. Start the Phoenix server in a new terminal window
4. Start the backend API server in another terminal window
5. Start the frontend development server in a third terminal window
6. Clean up temporary files when you exit the script with Ctrl+C

**Note for macOS users**: The script uses the `open -a Terminal.app` command to launch separate terminal windows.

**Important**: When using the script, each component will run in its own terminal window, but they will **not** automatically use your activated virtual environment. For this reason, we recommend the manual startup method below if you're using virtual environments.

### Option 2: Manual Startup (Preferred)

This approach gives you more control and ensures proper virtual environment activation:

**Terminal 1: Start Phoenix Server**
```bash
# Activate virtual environment
source venv/bin/activate  # On Unix/MacOS
venv\Scripts\activate     # On Windows

cd backend
phoenix serve
```

**Terminal 2: Start Backend API Server**
```bash
# Activate virtual environment
source venv/bin/activate  # On Unix/MacOS
venv\Scripts\activate     # On Windows

cd backend
python api_server.py
```

**Terminal 3: Start Frontend**
```bash
cd frontend
npm start
```

### Accessing the Application

- **Frontend UI**: http://localhost:3000
- **Phoenix Dashboard**: http://localhost:6006
- **Backend API**: http://localhost:5000

## Agent Workflow

1. **Input Step**:
   - User enters topic, target audience, tone, and desired length
   - A session ID is generated to correlate all agent activities

2. **Research Step**:
   - Research Agent analyzes the topic and generates keywords
   - Produces research notes about the topic
   - Finds potential URLs for citations using OpenAI Agents SDK's WebSearchTool

3. **Outline Step**:
   - Outline Agent creates a detailed blog post structure
   - Incorporates keywords naturally
   - Marks places for citations and backlinks

4. **Writing Step**:
   - Writing Agent creates the full blog post using OpenAI Agents SDK and WebSearchTool
   - Uses web search to verify facts and add proper citations
   - Follows the outline structure while expanding content

5. **Result Step**:
   - Displays the final blog post with proper formatting
   - Shows all citations and backlinks

## Observability with Arize Phoenix

Phoenix provides comprehensive tracing for all agent operations:

1. **Session Tracking**:
   - Each user interaction has a unique session ID
   - All agent calls are correlated with this session
   - Complete end-to-end tracing from input to final content

2. **Agent Performance Monitoring**:
   - Track token usage and response times
   - Identify bottlenecks in the agent workflow
   - Optimize prompts and tools

3. **Debug Mode**:
   - Inspect raw inputs and outputs
   - Visualize the exact prompt sent to the model
   - See all tool calls made by agents

4. **OpenInference Integration**:
   - Automatically instruments all LLM calls
   - Tracks tool usage and performance
   - Integrates with the OpenTelemetry ecosystem

### How OpenInference Integration Works

The SEO agent application uses OpenInference instrumentation to provide detailed observability into the LLM interactions and agent operations:

1. **Request Tracing Flow**:
   - When a user makes a request, a unique session ID is generated and attached
   - API calls wrap agent executions with the `using_session` context manager
   - This creates a trace context that follows all downstream operations

2. **Automatic LLM Instrumentation**:
   - OpenInference automatically captures all LLM interactions
   - Every prompt sent to the model is recorded
   - Responses, token usage, and latency metrics are logged
   - No manual instrumentation code needed for basic tracking

3. **Tool Call Capture**:
   - When agents use tools (like web search), all calls are captured
   - Input parameters and output results are recorded
   - Execution time is measured for performance analysis

4. **Data Collection and Correlation**:
   - All telemetry data is sent to the Phoenix collector
   - Data is correlated by session ID to create complete traces
   - Phoenix connects all steps of the agent workflow into a cohesive timeline

5. **Cloud Integration (Optional)**:
   - Local traces can be synchronized to Arize Cloud
   - This enables advanced analytics and team collaboration
   - Historical data is preserved for long-term analysis

This integration provides software engineers with visibility into the internal operations of AI systems without requiring deep knowledge of AI observability concepts. The instrumentation is lightweight and adds minimal overhead to the application.

## Troubleshooting

### Common Issues

1. **Phoenix UI Not Starting**:
   - Ensure Phoenix is installed: `pip install phoenix-ai`
   - Try manually starting it: `phoenix serve`
   - Check for port conflicts if the server won't start

2. **API Server Errors**:
   - Verify your OpenAI API key is correct in the `.env` file
   - Check API key quota and rate limits
   - Look for Python dependency issues: `pip install -r requirements.txt`

3. **Frontend Not Loading**:
   - Ensure all npm dependencies are installed: `npm install`
   - Verify the backend API is running on port 5000
   - Check browser console for CORS errors

4. **Agent Failures**:
   - Check the Phoenix UI for detailed error traces
   - Verify web search tool is working properly
   - Ensure inputs are properly formatted

### Getting Help

If you encounter issues not covered here, please:
1. Check the Phoenix logs for detailed error messages
2. Review the terminal output for all three components
3. Contact support with your session ID for faster diagnosis

## Future Improvements

Potential enhancements for this project:

1. **Agent Capabilities**:
   - Add image generation for blog post visuals
   - Implement meta tag and schema markup generation
   - Create social media snippets from the blog content
   - Direct integration with Substack, Gmail, Medium, Notion, Etc.

2. **Observability**:
   - Add custom metrics for content quality evaluation
   - Implement A/B testing framework for different prompts
   - Develop a performance dashboard for agent optimization

3. **Evals**:
    - Add evals that measure the following:
      - correctness
      - length
      - fluency
      - sentiment (to validate with the input sentiment given by user)
      - relevance
      - citations (test if links work, relevance of links, context match with content of webpage attached)
      - overall score
    etc.

4. **User Experience**:
   - Add user authentication
   - Implement project saving and history
   - Create templates for common blog types 