import React, { useEffect, useState, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';

const ResearchStep = ({
    inputData,
    researchData,
    setResearchData,
    runAgent,
    error,
    isRunning,
    onPrevious,
    onNext
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const textareaRef = useRef(null);

    // Wrap handleRunAgent in useCallback
    const handleRunAgent = useCallback(async () => {
        try {
            // Call the API and get real data
            const result = await runAgent();

            // Update state with the API response data
            setResearchData({
                keywords: result.keywords || [],
                researchNotes: result.researchNotes || '',
                potentialUrls: result.potentialUrls || [],
                rawOutput: result.rawOutput || ''
            });
        } catch (err) {
            console.error("Error running research agent:", err);
        }
    }, [runAgent, setResearchData]);

    // Effect to run the agent when the component mounts if we don't have results yet
    useEffect(() => {
        if (!researchData.rawOutput && !isRunning && !error) {
            handleRunAgent();
        }
        // Ensure all dependencies are listed
    }, [researchData.rawOutput, isRunning, error, handleRunAgent]);

    const handleKeywordChange = (e) => {
        const keywordText = e.target.value;
        const keywordArray = keywordText.split('\n').map(k => k.trim()).filter(k => k);
        setResearchData({
            ...researchData,
            keywords: keywordArray
        });
    };

    const handleUrlsChange = (e) => {
        const urlsText = e.target.value;
        const urlsArray = urlsText.split('\n').map(u => u.trim()).filter(u => u);
        setResearchData({
            ...researchData,
            potentialUrls: urlsArray
        });
    };

    const handleNotesChange = (e) => {
        setResearchData({
            ...researchData,
            researchNotes: e.target.value
        });
    };

    const toggleEditMode = () => {
        setIsEditing(!isEditing);
        // Focus the textarea when switching to edit mode
        if (!isEditing) {
            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.focus();
                }
            }, 0);
        }
    };

    return (
        <div className="step-content">
            <div className="step-header">
                <h2 className="step-title">Review & Edit Research Results</h2>
                <p className="step-description">
                    Our AI has analyzed your topic and gathered relevant keywords, research notes, and potential link sources. Review and edit this information before proceeding to outline generation.
                </p>
            </div>

            {error && (
                <div className="message message-error">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span className="ml-2">{error}</span>
                </div>
            )}

            {isRunning ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <div className="loading-text">🕵️ Conducting research and keyword analysis...</div>
                    <p>This may take a minute while our AI analyzes your topic</p>
                </div>
            ) : researchData.rawOutput ? (
                <>
                    <div className="node-card">
                        <div className="node-header">
                            <div className="node-title">
                                <div className="node-icon">K</div>
                                Keywords
                            </div>
                        </div>
                        <div className="node-content">
                            <p className="mb-4">These keywords should be naturally incorporated throughout your content for SEO optimization.</p>
                            <textarea
                                className="form-textarea"
                                value={researchData.keywords.join('\n')}
                                onChange={handleKeywordChange}
                                placeholder="Enter keywords (one per line)"
                            />
                        </div>
                    </div>

                    <div className="node-card">
                        <div className="node-header">
                            <div className="node-title">
                                <div className="node-icon">U</div>
                                Potential URLs
                            </div>
                        </div>
                        <div className="node-content">
                            <p className="mb-4">Types of authoritative sources that would make good backlinks for your content.</p>
                            <textarea
                                className="form-textarea"
                                value={researchData.potentialUrls.join('\n')}
                                onChange={handleUrlsChange}
                                placeholder="Enter URL types (one per line)"
                            />
                        </div>
                    </div>

                    <div className="node-card">
                        <div className="node-header">
                            <div className="node-title">
                                <div className="node-icon">R</div>
                                Research Notes
                            </div>
                            <button
                                className="button button-small"
                                onClick={toggleEditMode}
                                style={{ marginLeft: 'auto' }}
                            >
                                {isEditing ? 'Done Editing' : 'Edit Notes'}
                            </button>
                        </div>
                        <div className="node-content">
                            <p className="mb-4">Key concepts and information related to your topic.</p>

                            {isEditing ? (
                                <textarea
                                    ref={textareaRef}
                                    className="form-textarea"
                                    value={researchData.researchNotes}
                                    onChange={handleNotesChange}
                                    placeholder="Enter research notes"
                                    style={{ minHeight: "200px" }}
                                />
                            ) : (
                                <div className="blog-post-container">
                                    <ReactMarkdown>
                                        {researchData.researchNotes}
                                    </ReactMarkdown>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="button-group">
                        <button className="button button-secondary" onClick={onPrevious} disabled={isRunning}>
                            Back to Inputs
                        </button>
                        <button className="button button-primary" onClick={onNext} disabled={isRunning}>
                            Generate Outline
                        </button>
                    </div>
                </>
            ) : (
                <div className="button-group">
                    <button className="button button-secondary" onClick={onPrevious} disabled={isRunning}>
                        Back to Inputs
                    </button>
                    <button className="button button-primary" onClick={handleRunAgent} disabled={isRunning}>
                        Run Research
                    </button>
                </div>
            )}
        </div>
    );
};

export default ResearchStep; 