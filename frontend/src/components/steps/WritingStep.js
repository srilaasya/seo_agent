import React, { useEffect, useCallback } from 'react';

const WritingStep = ({
    inputData,
    researchData,
    outlineData,
    setFinalBlogPost,
    runAgent,
    error,
    isRunning,
    onPrevious,
    onNext,
    finalBlogPost
}) => {
    const handleRunAgent = useCallback(async () => {
        try {
            const blogPost = await runAgent();
            setFinalBlogPost(blogPost);
        } catch (err) {
            // console.error("Error running writing agent:", err);
        }
    }, [runAgent, setFinalBlogPost]);

    useEffect(() => {
        if (!finalBlogPost && !isRunning && !error) {
            handleRunAgent();
        }
    }, [finalBlogPost, isRunning, error, handleRunAgent]);

    return (
        <div className="step-content">
            <div className="step-header">
                <h2 className="step-title">Generate Blog Post</h2>
                <p className="step-description">
                    Our AI is writing your blog post based on the outline and research. This final step creates high-quality, SEO-optimized content with proper citations.
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
                    <button className="button button-primary ml-2" onClick={handleRunAgent} disabled={isRunning}>
                        Retry
                    </button>
                </div>
            )}

            {isRunning ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <div className="loading-text">📝 Writing the full blog post...</div>
                    <p>This may take a minute or two while our AI crafts your content with proper citations</p>
                </div>
            ) : (
                <>
                    <div className="node-card">
                        <div className="node-header">
                            <div className="node-title">
                                <div className="node-icon">W</div>
                                Writing in Progress
                            </div>
                        </div>
                        <div className="node-content">
                            <p>The AI is generating your blog post based on:</p>
                            <ul className="data-list">
                                <li className="data-item"><strong>Topic:</strong> {inputData.topic}</li>
                                <li className="data-item"><strong>Audience:</strong> {inputData.audience}</li>
                                <li className="data-item"><strong>Tone:</strong> {inputData.tone}</li>
                                <li className="data-item"><strong>Length:</strong> {inputData.length}</li>
                                <li className="data-item"><strong>Keywords:</strong> {researchData.keywords.length} keywords</li>
                                <li className="data-item"><strong>Outline:</strong> {outlineData.outlineContent ? `${outlineData.outlineContent.split('\n').filter(line => line.trim().startsWith('##')).length} sections` : 'None'}</li>
                            </ul>
                            <p className="mt-4">The writing agent is creating your content with:</p>
                            <div className="data-grid">
                                <div className="data-card">📊 SEO Optimization</div>
                                <div className="data-card">🔍 Keyword Integration</div>
                                <div className="data-card">🔗 Proper Citations</div>
                                <div className="data-card">📋 Structure from Outline</div>
                            </div>
                        </div>
                    </div>

                    <div className="button-group">
                        <button className="button button-secondary" onClick={onPrevious} disabled={isRunning}>
                            Back to Outline
                        </button>
                        <button className="button button-primary" onClick={onNext} disabled={isRunning}>
                            View Final Result
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default WritingStep; 