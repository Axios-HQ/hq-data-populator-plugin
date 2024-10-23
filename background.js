// When the extension is installed, set the behavior to open the side panel when the icon is clicked
chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});

// Listen for messages from the side panel or other parts of the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_TAB_INFO') {
    // Use async/await with Promise
    (async () => {
      try {
        const tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
        if (tabs.length === 0) {
          sendResponse({ error: 'No active tab found' });
          return;
        }
        
        const activeTab = tabs[0];
        if (!activeTab.id) {
          sendResponse({ error: 'Invalid tab ID' });
          return;
        }

        sendResponse({ 
          success: true,
          tabId: activeTab.id, 
          url: activeTab.url 
        });
      } catch (error) {
        sendResponse({ 
          success: false,
          error: error.message 
        });
      }
    })();
    return true;  // Will respond asynchronously
  }
});