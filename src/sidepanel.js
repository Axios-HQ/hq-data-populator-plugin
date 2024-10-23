import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './styles/styles.css';
import MaterialNavigation from './components/MaterialNavigation';
import CreateTestUserForm from './components/CreateTestUserForm';

const App = () => {
  const [activeTab, setActiveTab] = useState('generate-data');
  return (
    <div className="app-container">
      <MaterialNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="app-content">
        <CreateTestUserForm />
      </main>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
