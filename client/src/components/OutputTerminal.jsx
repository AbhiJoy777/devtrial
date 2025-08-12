import React from 'react';
import './OutputTerminal.css';

// Props:
// output: The text to display
// isOpen: Boolean to control visibility
// onClose: Function to call when the close button is clicked
const OutputTerminal = ({ output, isOpen, onClose }) => {
    if (!isOpen) {
        return null; // Don't render anything if it's not open
    }

    return (
        <div className="output-terminal-container">
            <div className="terminal-header">
                <span>Output</span>
                <button onClick={onClose} className="terminal-close-btn">
                    _
                </button>
            </div>
            <div className="output-box">
                {/* Use 'pre' tag to preserve whitespace and newlines from console.log */}
                <pre>{output}</pre>
            </div>
        </div>
    );
};

export default OutputTerminal;