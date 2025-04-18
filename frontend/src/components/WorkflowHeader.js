import React from 'react';

const WorkflowHeader = ({ title, currentStep, totalSteps }) => {
    const progressPercentage = (currentStep / (totalSteps - 1)) * 100;

    return (
        <header className="workflow-header">
            <h1 className="workflow-title">{title}</h1>

            <div className="workflow-progress">
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
                </div>
                <div className="progress-text">
                    {currentStep + 1} of {totalSteps}
                </div>
            </div>
        </header>
    );
};

export default WorkflowHeader; 