import React from 'react';

const Sidebar = ({ currentStep, steps, onStepClick }) => {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                    </svg>
                    SEO Writer
                </div>
                <div className="sidebar-description">
                    Generate high-quality SEO content with AI
                </div>
            </div>

            <ul className="step-list">
                {steps.map((step, index) => (
                    <li
                        key={index}
                        className={`step-item ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                        onClick={() => index <= currentStep && onStepClick(index)}
                    >
                        <div className="step-number">
                            {index < currentStep ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            ) : (
                                index + 1
                            )}
                        </div>
                        <div className="step-label">{step.name}</div>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default Sidebar; 