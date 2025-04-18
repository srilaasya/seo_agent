import React, { useEffect, useState, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';

const OutlineStep = ({
    researchData,
    outlineData,
    setOutlineData,
    runAgent,
    error,
    isRunning,
    onPrevious,
    onNext
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const textareaRef = useRef(null);

    const handleRunAgent = useCallback(async () => {
        try {
            const result = await runAgent();
            setOutlineData({
                outlineContent: result.outlineContent || '',
                rawOutput: result.rawOutput || ''
            });
        } catch (err) {
            // console.error("Error running outline agent:", err);
        }
    }, [runAgent, setOutlineData]);

    useEffect(() => {
        if (!outlineData.outlineContent && !isRunning && !error) {
            handleRunAgent();
        }
    }, [outlineData.outlineContent, isRunning, error, handleRunAgent]);

    const handleOutlineChange = (e) => {
        setOutlineData({
            ...outlineData,
            outlineContent: e.target.value
        });
    };

    const toggleEditMode = () => {
        setIsEditing(!isEditing);
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
                <h2 className="step-title">Review & Edit Outline</h2>
                <p className="step-description">
                    Our AI has generated a structured outline for your blog post based on the research. Review and edit this outline to ensure it covers all the key points you want to address.
                </p>
            </div>

            {error && (
                <div className="message message-error">
                    {/* SVG Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    <span className="ml-2">{error}</span>
                </div>
            )}

            {isRunning ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <div className="loading-text">✍️ Crafting the blog post structure...</div>
                    <p>This may take a minute while our AI creates your outline</p>
                </div>
            ) : outlineData.outlineContent ? (
                <>
                    <div className="node-card">
                        <div className="node-header">
                            <div className="node-title">
                                <div className="node-icon">O</div>
                                Blog Post Outline
                            </div>
                            <button
                                className="button button-small"
                                onClick={toggleEditMode}
                                style={{ marginLeft: 'auto' }}
                            >
                                {isEditing ? 'Done Editing' : 'Edit Outline'}
                            </button>
                        </div>
                        <div className="node-content">
                            <div className="editor-container">
                                {isEditing ? (
                                    <textarea
                                        ref={textareaRef}
                                        className="form-textarea"
                                        value={outlineData.outlineContent}
                                        onChange={handleOutlineChange}
                                        placeholder="Enter blog post outline in Markdown format"
                                        style={{ minHeight: "400px", width: "100%", fontFamily: "'SF Mono', 'Courier New', Courier, monospace" }}
                                    />
                                ) : (
                                    <div className="blog-post-container">
                                        <ReactMarkdown>
                                            {outlineData.outlineContent}
                                        </ReactMarkdown>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="button-group">
                        <button className="button button-secondary" onClick={onPrevious} disabled={isRunning}>
                            Back to Research
                        </button>
                        <button className="button button-primary" onClick={onNext} disabled={isRunning}>
                            Write Blog Post
                        </button>
                    </div>
                </>
            ) : (
                <div className="button-group">
                    <button className="button button-secondary" onClick={onPrevious} disabled={isRunning}>
                        Back to Research
                    </button>
                    <button className="button button-primary" onClick={handleRunAgent} disabled={isRunning}>
                        Generate Outline
                    </button>
                </div>
            )}
        </div>
    );
};

export default OutlineStep; 