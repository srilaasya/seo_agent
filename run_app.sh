#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to clean up temporary files
cleanup() {
    echo -e "${YELLOW}Cleaning up temporary files...${NC}"
    [ -f "backend/phoenix_start.sh" ] && rm backend/phoenix_start.sh
    [ -f "backend/api_start.sh" ] && rm backend/api_start.sh
    [ -f "frontend/frontend_start.sh" ] && rm frontend/frontend_start.sh
}

# Set up trap to clean up on exit
trap cleanup EXIT

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}   Starting SEO Agent Application    ${NC}"
echo -e "${GREEN}======================================${NC}"

# Check if .env file exists in the backend directory
if [ ! -f "backend/.env" ]; then
    echo -e "${RED}Error: backend/.env file not found!${NC}"
    echo -e "${YELLOW}Please create the .env file with required API keys:${NC}"
    echo "OPENAI_API_KEY=your_openai_api_key"
    echo "PHOENIX_API_KEY=your_phoenix_api_key (optional)"
    exit 1
fi

# Check for OPENAI_API_KEY in backend/.env
if ! grep -q "OPENAI_API_KEY" "backend/.env"; then
    echo -e "${RED}Error: OPENAI_API_KEY not found in backend/.env file!${NC}"
    echo -e "${YELLOW}Please add your OpenAI API key to the .env file.${NC}"
    exit 1
fi

# For macOS: Using open command for launching terminal windows
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo -e "${GREEN}Creating helper scripts...${NC}"
    
    # Create Phoenix script
    echo "#!/bin/bash" > backend/phoenix_start.sh
    echo "cd '$(pwd)/backend' && phoenix serve" >> backend/phoenix_start.sh
    chmod +x backend/phoenix_start.sh
    
    # Create API server script
    echo "#!/bin/bash" > backend/api_start.sh
    echo "cd '$(pwd)/backend' && python api_server.py" >> backend/api_start.sh
    chmod +x backend/api_start.sh
    
    # Create Frontend script
    echo "#!/bin/bash" > frontend/frontend_start.sh
    echo "cd '$(pwd)/frontend' && npm start" >> frontend/frontend_start.sh
    chmod +x frontend/frontend_start.sh
    
    echo -e "${GREEN}Step 1/3: Starting Phoenix server...${NC}"
    open -a Terminal.app "$(pwd)/backend/phoenix_start.sh"
    sleep 3
    
    echo -e "${GREEN}Step 2/3: Starting Backend API server...${NC}"
    open -a Terminal.app "$(pwd)/backend/api_start.sh"
    sleep 3
    
    echo -e "${GREEN}Step 3/3: Starting Frontend...${NC}"
    open -a Terminal.app "$(pwd)/frontend/frontend_start.sh"

else
    # Linux approach
    echo -e "${GREEN}Step 1/3: Starting Phoenix server...${NC}"
    gnome-terminal -- bash -c "cd $(pwd)/backend && phoenix serve; exec bash" || \
    xterm -e "cd $(pwd)/backend && phoenix serve; exec bash" || \
    echo -e "${RED}Failed to start Phoenix server. Try running it manually.${NC}"
    sleep 2

    echo -e "${GREEN}Step 2/3: Starting Backend API server...${NC}"
    gnome-terminal -- bash -c "cd $(pwd)/backend && python api_server.py; exec bash" || \
    xterm -e "cd $(pwd)/backend && python api_server.py; exec bash" || \
    echo -e "${RED}Failed to start Backend API server. Try running it manually.${NC}"
    sleep 2

    echo -e "${GREEN}Step 3/3: Starting Frontend...${NC}"
    gnome-terminal -- bash -c "cd $(pwd)/frontend && npm start; exec bash" || \
    xterm -e "cd $(pwd)/frontend && npm start; exec bash" || \
    echo -e "${RED}Failed to start Frontend. Try running it manually.${NC}"
fi

echo -e "${GREEN}======================================${NC}"
echo -e "${GREEN}   All components started!           ${NC}"
echo -e "${GREEN}   - Phoenix UI: http://localhost:6006${NC}"
echo -e "${GREEN}   - Backend API: http://localhost:5000${NC}"
echo -e "${GREEN}   - Frontend: http://localhost:3000 ${NC}"
echo -e "${GREEN}======================================${NC}"

echo -e "${YELLOW}Note: Each component is running in its own terminal window.${NC}"
echo -e "${YELLOW}To stop all components, close the terminal windows or press Ctrl+C in each window.${NC}"

# Keep the script running to allow proper cleanup when the user presses Ctrl+C
echo -e "${YELLOW}Press Ctrl+C to exit this script (components will continue running in their terminal windows)${NC}"
wait 