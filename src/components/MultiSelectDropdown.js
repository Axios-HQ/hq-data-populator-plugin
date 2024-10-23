import React, { useState } from 'react';

const MultiSelectDropdown = ({ options, selected, onChange, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionClick = (option) => {
    const newSelected = selected.includes(option)
      ? selected.filter((item) => item !== option)
      : [...selected, option];
    onChange(newSelected);
  };

  return (
    <div className="multi-select-container">
      <div
        className={`multi-select-header ${disabled ? 'disabled' : ''}`}
        onClick={handleToggle}
        style={{
          backgroundColor: 'var(--vscode-input-bg)',
          border: '1px solid var(--vscode-secondary-text)',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        <span className="selected-count">
          {selected.length ? `${selected.length} selected` : 'None selected'}
        </span>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </div>
      {isOpen && !disabled && (
        <div
          className="multi-select-options"
          style={{
            backgroundColor: 'var(--vscode-darker)',
            border: '1px solid var(--vscode-secondary-text)',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
            padding: '8px',
            maxHeight: '200px',
            overflowY: 'auto',
            zIndex: 1000,
          }}
        >
          {options.map((option) => (
            <label key={option} className="option-label" style={{ display: 'flex', alignItems: 'center', padding: '4px 0' }}>
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => handleOptionClick(option)}
                className="option-checkbox"
                style={{
                  width: '16px',
                  height: '16px',
                  marginRight: '8px',
                  accentColor: '#89d185',
                }}
              />
              <span className="option-text" style={{ color: 'var(--vscode-text)' }}>{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
