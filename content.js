// Log when the content script loads and include timestamp
console.log(`Content script loaded on: ${window.location.href} at ${new Date().toISOString()}`);

// Helper function to safely parse JSON
const safeJsonParse = (str) => {
  try {
    return str ? JSON.parse(str) : null;
  } catch (error) {
    console.error('JSON parsing error:', error);
    return null;
  }
};

// Helper function to safely get localStorage items
const safeGetStorage = (key) => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Error accessing localStorage for key "${key}":`, error);
    return null;
  }
};

// Main message listener
// In content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Content script received message:', request);

  if (request.message === 'getLocalStorage') {
    try {
      const analyticsQa = safeGetStorage('analytics-qa');
      const lastSeriesId = safeGetStorage('last_series_id');
      
      console.group('Local Storage Values');
      console.log('analytics-qa:', analyticsQa);
      console.log('last_series_id:', lastSeriesId);
      console.groupEnd();

      let localStorageValues = {
        last_series_id: lastSeriesId || '',
        user_email: '',
        organization_id: '',
        timestamp: new Date().toISOString(),
        source_url: window.location.href
      };

      const parsedAnalytics = safeJsonParse(analyticsQa);
      if (parsedAnalytics) {
        localStorageValues = {
          ...localStorageValues,
          user_email: parsedAnalytics.user_email || '',
          organization_id: parsedAnalytics.organization_id || ''
        };
        console.log('Successfully parsed analytics data:', parsedAnalytics);
      } else {
        console.warn('No analytics data found or parsing failed');
      }

      console.log('Sending response to extension:', localStorageValues);
      
      // Make sure to call sendResponse with the data
      sendResponse({
        success: true,
        data: localStorageValues
      });
    } catch (error) {
      console.error('Unexpected error in content script:', error);
      sendResponse({
        success: false,
        error: error.message
      });
    }
  }
  
  // This is important - it tells Chrome we will send a response asynchronously
  return true;
});

// Add a global error handler for the content script
window.addEventListener('error', (event) => {
  console.error('Content script error:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  });
});

// Add unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection in content script:', {
    reason: event.reason
  });
});