import React from 'react';

const MaterialNavigation = ({ activeTab, setActiveTab }) => {
  return (
    <div className="nav-container">
      <nav className="nav-links">
        <button
          onClick={() => setActiveTab('generate-data')}
          className={`nav-button ${activeTab === 'generate-data' ? 'active' : ''}`}
        >
          Generate Data
        </button>
      </nav>
    </div>
  );
};

export default MaterialNavigation;