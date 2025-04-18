import os
import re # For parsing agent output
from agents import Agent, Runner, WebSearchTool
from dotenv import load_dotenv

# --- Initialization ---
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY not found. Please create a .env file...")

# Make sure the OPENAI_API_KEY is available in the environment
os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY

# Web search tool for the writing agent
web_search_tool = WebSearchTool()

# --- Agent Definitions ---

research_agent = Agent(
    name="ResearchAgent",
    instructions="""
    You are a research assistant specializing in SEO and topic analysis.
    Your goal is to provide the foundational elements for creating an SEO-optimized blog post.
    You have access to a `web_search` tool.

    **Inputs:**
    - Topic: '{topic}'
    - Target Audience: '{audience}'
    - Proprietary Data/Context: '{proprietary_data}'

    **Process:**
    1.  Analyze the inputs based on your general knowledge.
    2.  Generate relevant keywords for the topic and audience based on your internal understanding.
    3.  Based on your knowledge, write brief notes about the topic, covering common concepts.
    4.  **MANDATORY ACTION:** Use the `web_search` tool to find exactly 2-3 specific, authoritative, and highly relevant website URLs related to the Topic ('{topic}') that would be suitable backlink sources. These MUST be full, specific URLs (like https://example.com/specific-page or https://organization.org), not just domain names. Do NOT suggest types of websites.
    
    **Output Format:**
    - Output the results clearly structured using the following EXACT headers:
        ## Keywords
        (List 10-15 keywords here, one per line, based on internal knowledge)

        ## Research Notes
        (Summarize key concepts based on internal knowledge)

        ## Potential URLs
        (List the 2-3 *specific full URLs* you found using the `web_search` tool here, one per line. **DO NOT state that you cannot provide URLs. You MUST provide the URLs found by the tool.**)

    - Do NOT include any other text, commentary, or introduction before or after these sections.
    """,
    tools=[web_search_tool],
)

outline_agent = Agent(
    name="OutlineAgent",
    instructions="""
    You are an expert content strategist creating outlines for SEO blog posts.

    **Inputs:**
    - Topic: '{topic}'
    - Target Audience: '{audience}'
    - Tone: '{tone}'
    - Desired Length: '{length}'
    - Keywords: {keywords}
    - Research Notes: {research_notes}
    - Potential URLs: {potential_urls}
    - Proprietary Data/Context: '{proprietary_data}'

    **Process:**
    1.  Review all inputs.
    2.  Create a detailed, logical blog post outline in.
    3.  Structure the outline to effectively incorporate the keywords and research notes.
    4.  IMPORTANT - BACKLINKS: For each major section, explicitly indicate where to add backlinks as the hyperlink.
        If the potential URLs provided are not specific enough, specify the TYPE of source that should be linked (e.g., "Link to recent study on climate change").
    5.  Include at least 3-5 specific places for citations/backlinks throughout the outline ONLY if they are CORRECT, EXACT, EXTREMELY RELEVANT TO THE POST AND SENTENCE AND TOPIC.
    6.  Ensure the structure aligns with the desired tone and length.
    7.  Consider the proprietary data context.

    """,
    # No tools needed for this agent
)

writing_agent = Agent(
    name="WritingAgent",
    instructions="""
    You are a skilled SEO copywriter creating the final blog post with properly cited sources.
    Your primary goal is accuracy and credibility.

    **Inputs:**
    - Topic: '{topic}'
    - Target Audience: '{audience}'
    - Tone: '{tone}'
    - Desired Length: '{length}'
    - Keywords: {keywords}
    - Research Notes: {research_notes}
    - Potential URLs: {potential_urls} # URLs suggested by ResearchAgent
    - Outline: {outline}
    - Proprietary Data/Context: '{proprietary_data}'

    **Process:**
    1.  Strictly follow the provided outline: {outline}
    2.  Naturally integrate the keywords: {keywords} throughout the text.
    3.  Use the research notes: {research_notes} for factual accuracy.
    4.  **CITATIONS & HYPERLINKS (MANDATORY & CRITICAL):**
        - Create at least 5-7 relevant backlinks/citations throughout the post.
        - For **every statistic, specific fact, or significant claim**, you MUST provide a citation using a hyperlink.
        - Follow all explicit citation instructions from the Outline.
        - Use the `web_search` tool **aggressively** to find the *most specific and authoritative source* for each claim needing citation. Prioritize primary sources (original studies, reports) if possible.
        - If specific URLs were provided in {potential_urls}, verify their relevance before using them. If relevant, use them for appropriate claims.
        - **Anchor Text:** The hyperlinked text (anchor text) MUST be descriptive and accurately reflect the content of the linked page. Examples: Instead of `[read more](URL)`, use `[according to the 2023 NASA report](URL)`. Instead of `[this article](URL)`, use `[research on solar panel efficiency](URL)`.
        - **Relevance:** Ensure the linked URL *directly supports* the statement being cited. The linked page should contain the specific fact, statistic, or data point mentioned.
        - **Forbidden Anchor Text:** Do NOT use vague phrases like "click here", "read more", "this study", "this article", "here", "link", etc.
    5. Adhere to the tone '{tone}' and length '{length}' requirements.
    6. Incorporate proprietary data '{proprietary_data}' where relevant and appropriate.

    **Output:**
    - Output *only* the final, complete blog post in with accurate, descriptive, and relevant hyperlinks serving as citations.
    """,
    tools=[web_search_tool],
)

# --- Helper Function to Parse Research Agent Output ---
def parse_research_output(text: str):
    keywords = []
    research_notes = ""
    potential_urls = []

    if not text: # Handle empty input
        return {
            "keywords": [], "research_notes": "N/A - No input text", "potential_urls": []
        }

    try:
        # Extract Keywords
        kw_match = re.search(r"## Keywords\s*\n(.*?)\n## Research Notes", text, re.DOTALL | re.IGNORECASE)
        if kw_match:
            keywords = [line.strip() for line in kw_match.group(1).strip().split('\n') if line.strip()]

        # Extract Research Notes
        notes_match = re.search(r"## Research Notes\s*\n(.*?)\n## Potential URLs", text, re.DOTALL | re.IGNORECASE)
        if notes_match:
            research_notes = notes_match.group(1).strip()

        # Extract Potential URLs
        urls_match = re.search(r"## Potential URLs\s*\n(.*)", text, re.DOTALL | re.IGNORECASE)
        if urls_match:
            # Accept any non-empty line now, as they might be descriptions
            potential_urls = [line.strip() for line in urls_match.group(1).strip().split('\n') if line.strip()]

        # Basic validation and fallback
        if not keywords or not research_notes or not potential_urls:
            if not research_notes and text:
                research_notes = text # Fallback if parsing failed but text exists

    except Exception as e:
        print(f"Warning: Error parsing research output: {e}. Falling back to full text for notes.")
        research_notes = text # Fallback

    return {
        "keywords": keywords,
        "research_notes": research_notes,
        "potential_urls": potential_urls
    }