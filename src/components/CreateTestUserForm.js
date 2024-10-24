import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import MultiSelectDropdown from './MultiSelectDropdown';
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

const CreateTestUserForm = ({ onError }) => {
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);  // Loading spinner state
  const [fieldsDisabled, setFieldsDisabled] = useState(false);  
  const [isOpen, setIsOpen] = useState(false);  // Accordion state
  const [formData, setFormData] = useState({
    org_id: '',
    series_id: '',
    role: 'member',
    support_user: false,
    export_html: true,
    user_auth_state: 'new_account',
    onboarding_complete: true,
    username_prefix: '',
    org_tags: [],
    env: '',
    org_type: 'customer',
    plan: 'package_v1:good',
  });
  
  const ORG_TAG_OPTIONS = [
    "package:premium",
    "enabled:lang_check", 
    "enabled:basic_sends",
    "package:calendar-add-on",
    "disabled:ai-features",
    "package:basic",
    "package:calendar",
    "anonymized_analytics"
  ];

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
              series_id: data.last_series_id ? data.last_series_id.replace(/['"]+/g, '') : ''
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

  useEffect(() => {
    setFieldsDisabled(!!(formData.org_id || formData.series_id));
  }, [formData.org_id, formData.series_id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);  // Show the loading spinner
    try {
      console.log('Submitting data:', formData);
      const result = await postData('/create-test-user', formData);
      console.log('Test user successfully created:', result);
      handleResponseDisplay(result); // Highlight the JSON response
    } catch (error) {
      console.error("Error creating test user:", error.message);
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
        {isOpen ? 'Hide Test User Form' : '/ create-test-user'}
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
              <label>Series ID</label>
              <div className="input-container">
                <input
                  type="text"
                  name="series_id"
                  value={formData.series_id}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <label>Role</label>
              <div className="input-container">
                <select name="role" value={formData.role} onChange={handleInputChange}>
                  <option value="owner">Owner</option>
                  <option value="admin">Admin</option>
                  <option value="member">Member</option>
                </select>
              </div>
            </div>

            <div className="checkbox-row">
              <label>Support User</label>
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  name="support_user"
                  checked={formData.support_user}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="checkbox-row">
              <label>Export HTML</label>
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  name="export_html"
                  checked={formData.export_html}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="checkbox-row">
              <label>Onboarding Complete</label>
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  name="onboarding_complete"
                  checked={formData.onboarding_complete}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <label>User Authentication State</label>
              <div className="input-container">
                <select name="user_auth_state" value={formData.user_auth_state} onChange={handleInputChange}>
                  <option value="new_account">New Account</option>
                  <option value="verified">Email Verified, Temp Password</option>
                  <option value="active">Active</option>
                  <option value="temp_locked">Temporarily Locked Out</option>
                  <option value="locked">Permanently Locked Out/De-activated</option>
                  <option value="forgot_password">Active with pending forgot password code</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <label>Username Prefix</label>
              <div className="input-container">
                <input
                  type="text"
                  name="username_prefix"
                  value={formData.username_prefix}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <label>Organization Tags</label>
              <div className="input-container">
                <MultiSelectDropdown
                  options={ORG_TAG_OPTIONS}
                  selected={formData.org_tags}
                  onChange={(tags) => setFormData(prev => ({ ...prev, org_tags: tags }))}
                  disabled={fieldsDisabled}
                />
              </div>
            </div>
            <div className="form-row">
              <label>Organization Type</label>
              <div className="input-container">
                <select 
                  name="org_type" 
                  value={formData.org_type} 
                  onChange={handleInputChange}
                  disabled={fieldsDisabled}
                >
                  <option value="customer">Customer</option>
                  <option value="partner">Partner</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <label>Organization Plan</label>
              <div className="input-container">
                <select 
                  name="plan" 
                  value={formData.plan} 
                  onChange={handleInputChange}
                  disabled={fieldsDisabled}
                >
                  <option value="package_v1:good">Good</option>
                  <option value="package_v1:better">Better</option>
                  <option value="package_v1:best">Best</option>
                </select>
              </div>
            </div>
            <div className="button-container">
              <button type="submit" className="submit-button">
                Create Test User
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

export default CreateTestUserForm; 