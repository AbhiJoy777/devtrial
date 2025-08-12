import React from 'react';
import './ToggleSwitch.css';

// This component takes two props:
// isOn: a boolean to determine if the switch is in the "on" state
// onToggle: a function to call when the switch is clicked
const ToggleSwitch = ({ isOn, onToggle }) => {
    return (
        <label className="switch">
            <input type="checkbox" checked={isOn} onChange={onToggle} />
            <span className="slider round"></span>
        </label>
    );
};

export default ToggleSwitch;