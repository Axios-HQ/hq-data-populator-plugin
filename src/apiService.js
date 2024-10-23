// Helper function to determine base host
const getBaseHost = (url) => {
  const parsedUrl = new URL(url);
  const hostname = parsedUrl.hostname;
  console.log("Parsed hostname:", hostname);

  if (hostname.includes('editor-stage.axioshq.dev')) {
    return 'https://preprod-data-populator.axioshq.dev';
  } else if (/^test-shared-plus-(web|content-api)-[\w-]+-editor\.axioshq\.dev$/.test(hostname)) {
    const baseHost = hostname.replace('-editor', '-data-populator');
    return `https://${baseHost}`;
  } else if (/^test-private-plus-(web|content-api)-[\w-]+-editor\.axioshq\.dev$/.test(hostname)) {
    const baseHost = hostname.replace('-editor', '-data-populator');
    return `https://${baseHost}`;
  } else {
    console.warn('Unknown environment, returning default base_host');
    return 'https://default-base-host.com';
  }
};

// Function to fetch base host from active tab
export const fetchBaseHostFromTab = async () => {
  try {
    const tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    if (!tabs || tabs.length === 0) {
      console.error("No active tab found");
      return;
    }
    if (tabs[0]?.url) {
      return getBaseHost(tabs[0].url);
    }
    throw new Error('No active tab URL found');
  } catch (error) {
    console.error("Failed to determine base_host:", error);
    return 'https://default-base-host.com';
  }
};

// Function to make POST requests
export const postData = async (route, data) => {
  try {
    const baseHost = await fetchBaseHostFromTab();
    const url = `${baseHost}${route}`;
    
    console.log('Making request to:', url);
    console.log('With data:', data);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    console.log('Received data:', responseData);

    if (!response.ok) {
      console.warn('Request failed with status:', response.status);
      console.warn('Error details:', responseData);
      // Return the full error response
      return {
        error: true,
        status: response.status,
        data: responseData
      };
    }

    return {
      error: false,
      status: response.status,
      data: responseData
    };
  } catch (error) {
    console.error('Request failed:', error);
    return {
      error: true,
      status: 'NETWORK_ERROR',
      message: error.message
    };
  }
};