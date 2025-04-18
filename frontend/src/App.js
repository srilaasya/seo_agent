import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

// Main components
import Sidebar from './components/Sidebar';
import WorkflowHeader from './components/WorkflowHeader';
import InputStep from './components/steps/InputStep';
import ResearchStep from './components/steps/ResearchStep';
import OutlineStep from './components/steps/OutlineStep';
import WritingStep from './components/steps/WritingStep';
import ResultStep from './components/steps/ResultStep';

// API configuration
const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  // State Management - Simplified
  const [currentStep, setCurrentStep] = useState(0); // 0: Input, 1: Research, 2: Outline, 3: Write, 4: Done
  const [isRunning, setIsRunning] = useState(false);
  const [sessionId, setSessionId] = useState(null); // Add state for Session ID

  // Input form data
  const [inputData, setInputData] = useState({
    topic: '',
    audience: '',
    tone: 'Informative',
    length: 'Medium (~750 words)',
    proprietaryData: '',
  });

  // Agent results data
  const [researchData, setResearchData] = useState({
    keywords: [],
    researchNotes: '',
    potentialUrls: [],
    rawOutput: null
  });

  const [outlineData, setOutlineData] = useState({
    outlineContent: '',
    rawOutput: null
  });

  // Final result state (remains the same)
  const [finalBlogPost, setFinalBlogPost] = useState('');

  // Error states (back to separate errors)
  const [errors, setErrors] = useState({
    research: null,
    outline: null,
    writing: null,
    general: null // Optional general error
  });

  // Generate Session ID on initial load/reset
  useEffect(() => {
    // Generate a session ID when the component mounts or is reset
    if (currentStep === 0 && !sessionId) {
      const newSessionId = uuidv4();
      // console.log("Generated new session ID:", newSessionId);
      setSessionId(newSessionId);
    }
  }, [currentStep, sessionId]); // Re-run if step becomes 0 or sessionId changes

  // Navigation functions - Simplified
  const goToStep = (step) => {
    if (step >= 0 && step <= 4) { // 5 steps now
      setCurrentStep(step);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Reset the entire workflow
  const resetWorkflow = () => {
    setCurrentStep(0);
    setInputData({
      topic: '',
      audience: '',
      tone: 'Informative',
      length: 'Medium (~750 words)',
      proprietaryData: '',
    });
    setResearchData({
      keywords: [],
      researchNotes: '',
      potentialUrls: [],
      rawOutput: null
    });
    setOutlineData({
      outlineContent: '',
      rawOutput: null
    });
    setFinalBlogPost('');
    setErrors({
      research: null,
      outline: null,
      writing: null,
      general: null
    });
    // Reset session ID to trigger generation of a new one
    setSessionId(null);
    setIsRunning(false);
  };

  // === MOVE API FUNCTIONS HERE ===
  // --- Restore separate API functions with Session ID --- 
  const runResearchAgent = async () => {
    if (!sessionId) {
      // console.error("Session ID not available for research call.");
      setErrors(prev => ({ ...prev, research: "Session ID missing. Please try again." }));
      return; // Don't proceed without session ID
    }
    setIsRunning(true);
    setErrors(prev => ({ ...prev, research: null }));

    try {
      // console.log("Running research API call with data:", { ...inputData, sessionId });
      const response = await axios.post(`${API_BASE_URL}/research`, {
        topic: inputData.topic,
        audience: inputData.audience,
        proprietaryData: inputData.proprietaryData,
        sessionId: sessionId // Send the session ID
      });

      // console.log("Research API response:", response.data);

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || "Unknown error in research agent");
      }
    } catch (error) {
      // console.error("Error in research API call:", error);
      const errorMessage = error.response?.data?.error || error.message || "Failed to connect to research API";
      setErrors(prev => ({ ...prev, research: errorMessage }));
      throw error;
    } finally {
      setIsRunning(false);
    }
  };

  const runOutlineAgent = async () => {
    if (!sessionId) {
      // console.error("Session ID not available for outline call.");
      setErrors(prev => ({ ...prev, outline: "Session ID missing. Please try again." }));
      return;
    }
    setIsRunning(true);
    setErrors(prev => ({ ...prev, outline: null }));

    try {
      // console.log("Running outline API call with data:", { ...inputData, ...researchData, sessionId });
      const response = await axios.post(`${API_BASE_URL}/outline`, {
        topic: inputData.topic,
        audience: inputData.audience,
        tone: inputData.tone,
        length: inputData.length,
        keywords: researchData.keywords,
        researchNotes: researchData.researchNotes,
        potentialUrls: researchData.potentialUrls,
        proprietaryData: inputData.proprietaryData,
        sessionId: sessionId // Send the session ID
      });

      // console.log("Outline API response:", response.data);

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.error || "Unknown error in outline agent");
      }
    } catch (error) {
      // console.error("Error in outline API call:", error);
      const errorMessage = error.response?.data?.error || error.message || "Failed to connect to outline API";
      setErrors(prev => ({ ...prev, outline: errorMessage }));
      throw error;
    } finally {
      setIsRunning(false);
    }
  };

  const runWritingAgent = async () => {
    if (!sessionId) {
      // console.error("Session ID not available for writing call.");
      setErrors(prev => ({ ...prev, writing: "Session ID missing. Please try again." }));
      return;
    }
    setIsRunning(true);
    setErrors(prev => ({ ...prev, writing: null }));

    try {
      // console.log("Running writing API call with data:", { ...inputData, ...researchData, ...outlineData, sessionId });
      const response = await axios.post(`${API_BASE_URL}/write`, {
        topic: inputData.topic,
        audience: inputData.audience,
        tone: inputData.tone,
        length: inputData.length,
        keywords: researchData.keywords,
        researchNotes: researchData.researchNotes,
        potentialUrls: researchData.potentialUrls,
        outlineContent: outlineData.outlineContent,
        proprietaryData: inputData.proprietaryData,
        sessionId: sessionId // Send the session ID
      });

      // console.log("Writing API response:", response.data);

      if (response.data.success) {
        return response.data.data.blogPost;
      } else {
        throw new Error(response.data.error || "Unknown error in writing agent");
      }
    } catch (error) {
      // console.error("Error in writing API call:", error);
      const errorMessage = error.response?.data?.error || error.message || "Failed to connect to writing API";
      setErrors(prev => ({ ...prev, writing: errorMessage }));
      throw error;
    } finally {
      setIsRunning(false);
    }
  };
  // --- End Restore API Functions ---
  // === END MOVE API FUNCTIONS ===

  // --- Restore original Steps Array --- 
  const steps = [
    {
      name: "Inputs", component: <InputStep
        inputData={inputData}
        setInputData={setInputData}
        onSubmit={() => {
          if (!inputData.topic || !inputData.audience) {
            alert("Please fill in the Topic and Target Audience fields.");
            return;
          }
          nextStep();
        }}
        isRunning={isRunning}
      />
    },
    {
      name: "Research", component: <ResearchStep
        inputData={inputData}
        researchData={researchData}
        setResearchData={setResearchData}
        runAgent={runResearchAgent} // Now defined before usage
        error={errors.research}
        isRunning={isRunning}
        onPrevious={prevStep}
        onNext={nextStep}
      />
    },
    {
      name: "Outline", component: <OutlineStep
        researchData={researchData} // Pass research data
        outlineData={outlineData}
        setOutlineData={setOutlineData}
        runAgent={runOutlineAgent} // Now defined before usage
        error={errors.outline}
        isRunning={isRunning}
        onPrevious={prevStep}
        onNext={nextStep}
      />
    },
    {
      name: "Write Post", component: <WritingStep
        inputData={inputData}
        researchData={researchData}
        outlineData={outlineData}
        setFinalBlogPost={setFinalBlogPost}
        finalBlogPost={finalBlogPost}
        runAgent={runWritingAgent}
        error={errors.writing}
        isRunning={isRunning}
        onPrevious={prevStep}
        onNext={nextStep}
      />
    },
    {
      name: "Done", component: <ResultStep
        finalBlogPost={finalBlogPost}
        onStartNew={resetWorkflow}
      // No specific error needed here unless a general one
      />
    }
  ];
  // --- End Restore Steps Array ---

  return (
    <div className="app-container">
      <Sidebar currentStep={currentStep} steps={steps} onStepClick={goToStep} />

      <div className="main-content">
        <WorkflowHeader
          title="Multi-Agent SEO Content Generator"
          currentStep={currentStep}
          totalSteps={steps.length} // Now reflects 5 steps
        />

        <div className="step-container">
          {steps[currentStep].component}
          {/* Optionally display general error here if not handled in step component */}
          {/* {error && currentStep === 0 && <p className="error-message">Error: {error}</p>} */}
        </div>
      </div>
    </div>
  );
}

export default App;
