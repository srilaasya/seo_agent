import React from 'react';
import ReactMarkdown from 'react-markdown';

const ResultStep = ({ finalBlogPost, onStartNew }) => {
    // Process the markdown to convert footnote syntax to proper links
    const processMarkdown = (markdown) => {
        if (!markdown) return '';

        // Step 1: Find all footnote references
        const footnoteRegex = /\[\^(\d+)\^\]/g;
        let processedMarkdown = markdown;

        // Replace footnote references with proper markdown links
        processedMarkdown = processedMarkdown.replace(footnoteRegex, (match, num) => {
            return `[${num}](#footnote-${num})`;
        });

        // Step 2: Find all footnote definitions
        const footnoteDefRegex = /\[\^(\d+)\^\]:\s*(.*?)(?=\n\n|\n\[\^|$)/gs;
        const footnotes = [];

        // Extract footnotes
        let footnotesMatch;
        while ((footnotesMatch = footnoteDefRegex.exec(processedMarkdown)) !== null) {
            footnotes.push({
                num: footnotesMatch[1],
                text: footnotesMatch[2].trim()
            });
        }

        // Remove footnote definitions from the main text
        processedMarkdown = processedMarkdown.replace(footnoteDefRegex, '');

        // Add footnote section at the end if there are any
        if (footnotes.length > 0) {
            processedMarkdown += '\n\n## References\n\n';
            footnotes.forEach(footnote => {
                processedMarkdown += `<div id="footnote-${footnote.num}" class="footnote"><sup>${footnote.num}</sup> ${footnote.text}</div>\n`;
            });
        }

        return processedMarkdown;
    };

    const downloadMarkdown = () => {
        const element = document.createElement('a');
        const file = new Blob([finalBlogPost], { type: 'text/markdown' });
        element.href = URL.createObjectURL(file);
        element.download = 'blog_post.md';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(finalBlogPost)
            .then(() => {
                alert('Blog post copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                alert('Failed to copy to clipboard');
            });
    };

    return (
        <div className="step-content">
            <div className="step-header">
                <h2 className="step-title">Your Completed Blog Post</h2>
                <p className="step-description">
                    Your SEO-optimized blog post is ready! You can preview it below, download it as a Markdown file, or copy it to your clipboard.
                </p>
            </div>

            <div className="button-group mb-4">
                <button className="button button-primary" onClick={downloadMarkdown}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    <span className="ml-2">Download as Markdown</span>
                </button>
                <button className="button button-secondary" onClick={copyToClipboard}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    <span className="ml-2">Copy to Clipboard</span>
                </button>
                <button className="button button-secondary" onClick={onStartNew}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 2v6h6"></path>
                        <path d="M3 13a9 9 0 1 0 3-7.7L3 8"></path>
                    </svg>
                    <span className="ml-2">Start New Post</span>
                </button>
            </div>

            <div className="node-card">
                <div className="node-header">
                    <div className="node-title">
                        <div className="node-icon">📄</div>
                        Blog Post Preview
                    </div>
                </div>
                <div className="node-content">
                    <div className="blog-post-container">
                        <ReactMarkdown>
                            {processMarkdown(finalBlogPost)}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>

            <div className="message message-success mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span className="ml-2">
                    <strong>Success!</strong> Your blog post has been generated with proper citations and SEO optimization.
                </span>
            </div>
        </div>
    );
};

export default ResultStep; 