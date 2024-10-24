import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { postData } from '../apiService';

// Syntax highlighting function
const syntaxHighlight = (json) => {
  if (typeof json !== 'string') {
    json = JSON.stringify(json, undefined, 2);
  }
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"(:)?|\b(true|false|null)\b|\b-?\d+(\.\d+)?([eE][+-]?\d+)?\b)/g, function (match) {
    let cls = 'number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'key';
      } else {
        cls = 'string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'boolean';
    } else if (/null/.test(match)) {
      cls = 'null';
    }
    return `<span class="${cls}">${match}</span>`;
  });
};

const CreateSeriesForm = ({ onError }) => {
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);  // Loading spinner state
  const [isOpen, setIsOpen] = useState(false);  // Accordion state
  const [formData, setFormData] = useState({
    org_id: '',
    series_name: '',
    accessToken: ''
  });
  
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Get current tab info
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (!tabs || tabs.length === 0) {
          console.error("No active tab found");
          return;
        }
  
        const currentTabId = tabs[0].id;
        const currentTabUrl = tabs[0].url;  
  
        // Skip if we're on a login page
        if (currentTabUrl?.includes('/login')) {
          console.log("Login page detected, skipping local storage fetch.");
          return;
        }
  
        // Get local storage data
        chrome.tabs.sendMessage(currentTabId, { message: 'getLocalStorage' }, (response) => {
          if (chrome.runtime.lastError) {
            console.error("Error accessing tab:", chrome.runtime.lastError);
            return;
          }
        
          if (response?.success) {
            const { data } = response;
            console.log("Received data:", data);
            setFormData(prevData => ({
              ...prevData,
              org_id: data.organization_id || '',
              accessToken: data.accessToken || ''  // Set access token
            }));
          } else {
            console.error("Error getting local storage:", response?.error);
          }
        });
  
      } catch (error) {
        console.error("Error initializing data:", error);
      }
    };
  
    initializeData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);  // Show the loading spinner
    try {
      // Log the access token before submitting
      console.log('Access Token on Submit:', formData.accessToken);
      
      if (!formData.accessToken) {
        throw new Error("Access token is missing.");
      }

      console.log('Submitting data:', formData);
      const result = await postData('/create-series', formData);
      console.log('Series successfully created:', result);
      handleResponseDisplay(result); // Highlight the JSON response
    } catch (error) {
      console.error("Error creating series:", error.message);
      handleResponseDisplay({ error: error.message });
    } finally {
      setIsLoading(false);  // Hide the loading spinner
    }
  };

  const handleResponseDisplay = (response) => {
    const formattedResponse = syntaxHighlight(response);
    setResponse(formattedResponse);
  };

  return (
    <div className="accordion">
      <div className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Hide Series Form' : '/ create-series'}
        <span className={`accordion-chevron ${isOpen ? 'open' : ''}`}>
            ▼
        </span>
      </div>
      {isOpen && (
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <label>Org ID</label>
              <div className="input-container">
                <input
                  type="text"
                  name="org_id"
                  value={formData.org_id}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <label>Series Name</label>
              <div className="input-container">
                <input
                  type="text"
                  name="series_name"
                  value={formData.series_name}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="button-container">
              <button type="submit" className="submit-button">
                Create Series
              </button>
            </div>
          </form>
          {isLoading && (
            <div className="loading-spinner">
              <CircularProgress color="primary" />
            </div>
          )}
          {response && (
            <div className="response-section">
              <div className="response-header">Response</div>
              <pre
                className="response-content"
                dangerouslySetInnerHTML={{ __html: response }}
              ></pre>
            </div>
          )}    
        </div>
      )}
    </div>
  );
};

export default CreateSeriesForm; 