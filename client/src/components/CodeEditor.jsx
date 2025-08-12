import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { githubDark } from '@uiw/codemirror-theme-github';

// This component now ONLY takes the props it is actually given: `value`, `onChange`, and `readOnly`.
const CodeEditor = ({ value, onChange, readOnly = false }) => {
    return (
        <CodeMirror
            value={value}
            height="100%"
            theme={githubDark}
            extensions={[javascript({ jsx: true })]}
            onChange={onChange} // We directly use the function passed in the 'onChange' prop.
            readOnly={readOnly}
            style={{ fontSize: '16px', height: '100%', overflow: 'auto' }}
        />
    );
};

export default CodeEditor;