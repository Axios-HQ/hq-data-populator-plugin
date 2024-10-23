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
      ? selected.filter(item => item !== option)
      : [...selected, option];
    onChange(newSelected);
  };

  return (
    <div className="multi-select-container">
      <div 
        className={`multi-select-header ${disabled ? 'disabled' : ''}`}
        onClick={handleToggle}
      >
        <span className="selected-count">
          {selected.length ? `${selected.length} selected` : 'None selected'}
        </span>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </div>
      {isOpen && !disabled && (
        <div className="multi-select-options">
          {options.map(option => (
            <label key={option} className="option-label">
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => handleOptionClick(option)}
                className="option-checkbox"
              />
              <span className="option-text">{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;