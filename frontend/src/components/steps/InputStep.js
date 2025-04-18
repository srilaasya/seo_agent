import React from 'react';

const InputStep = ({ inputData, setInputData, onSubmit, isRunning }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="step-content">
            <div className="step-header">
                <h2 className="step-title">Define Your Content Needs</h2>
                <p className="step-description">
                    Provide information about your content requirements to help our AI generate the most relevant and engaging content for your audience.
                </p>
            </div>

            {/* Remove conditional rendering - Show form directly */}
            <>
                <div className="node-card">
                    <div className="node-header">
                        <div className="node-title">
                            <div className="node-icon">1</div>
                            Project Details
                        </div>
                    </div>
                    <div className="node-content">
                        <form className="node-form">
                            <div className="form-group">
                                <label className="form-label" htmlFor="topic">
                                    Topic <span className="form-required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="topic"
                                    name="topic"
                                    className="form-input"
                                    value={inputData.topic}
                                    onChange={handleChange}
                                    placeholder="e.g., Sustainable Urban Living"
                                    required
                                />
                                <div className="form-hint">Specify the topic area for your content</div>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="audience">
                                    Target Audience <span className="form-required">*</span>
                                </label>
                                <textarea
                                    id="audience"
                                    name="audience"
                                    className="form-textarea"
                                    value={inputData.audience}
                                    onChange={handleChange}
                                    placeholder="e.g., Environmentally conscious city residents"
                                    required
                                />
                                <div className="form-hint">Describe who will be reading your content</div>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="node-card">
                    <div className="node-header">
                        <div className="node-title">
                            <div className="node-icon">2</div>
                            Style Preferences
                        </div>
                    </div>
                    <div className="node-content">
                        <form className="node-form">
                            <div className="form-group">
                                <label className="form-label" htmlFor="tone">Tone</label>
                                <select
                                    id="tone"
                                    name="tone"
                                    className="form-select"
                                    value={inputData.tone}
                                    onChange={handleChange}
                                >
                                    <option value="Informative">Informative</option>
                                    <option value="Casual">Casual</option>
                                    <option value="Formal">Formal</option>
                                    <option value="Witty">Witty</option>
                                    <option value="Inspiring">Inspiring</option>
                                    <option value="Persuasive">Persuasive</option>
                                    <option value="Practical">Practical</option>
                                    <option value="Enthusiastic">Enthusiastic</option>
                                    <option value="Simple">Simple</option>
                                </select>
                                <div className="form-hint">Select the writing style for your content</div>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="length">Desired Length</label>
                                <select
                                    id="length"
                                    name="length"
                                    className="form-select"
                                    value={inputData.length}
                                    onChange={handleChange}
                                >
                                    <option value="Short (~400 words)">Short (~400 words)</option>
                                    <option value="Medium (~750 words)">Medium (~750 words)</option>
                                    <option value="Long (~1200 words)">Long (~1200 words)</option>
                                </select>
                                <div className="form-hint">Choose how detailed you want your content to be</div>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="proprietaryData">
                                    Proprietary Data/Context (Optional)
                                </label>
                                <textarea
                                    id="proprietaryData"
                                    name="proprietaryData"
                                    className="form-textarea"
                                    value={inputData.proprietaryData}
                                    onChange={handleChange}
                                    placeholder="e.g., Mention our new product model X."
                                />
                                <div className="form-hint">Add any specific information or product details you want included</div>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="button-group">
                    <button
                        className="button button-primary"
                        onClick={onSubmit}
                        disabled={isRunning || !inputData.topic || !inputData.audience}
                    >
                        {/* Restore original button text */}
                        Start Research
                    </button>
                </div>
            </>
            {/* End removal of conditional rendering */}
        </div>
    );
};

export default InputStep; 