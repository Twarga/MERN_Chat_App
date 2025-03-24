// API utility for making fetch requests with reliable error handling
const API_URL = 'http://localhost:5000';

/**
 * Make API request with enhanced error handling
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  try {
    console.log(`API Request: ${options.method || 'GET'} ${url}`);
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    // Try to parse as JSON first
    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    // Check for error status
    if (!response.ok) {
      const errorMessage = typeof data === 'object' && data.message
        ? data.message
        : `Request failed with status: ${response.status}`;
      
      throw new Error(errorMessage);
    }
    
    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

/**
 * GET request
 */
export const get = (endpoint, token) => {
  return apiRequest(endpoint, {
    method: 'GET',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
};

/**
 * POST request
 */
export const post = (endpoint, data, token) => {
  return apiRequest(endpoint, {
    method: 'POST',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    body: JSON.stringify(data)
  });
};

/**
 * PUT request
 */
export const put = (endpoint, data, token) => {
  return apiRequest(endpoint, {
    method: 'PUT',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    body: JSON.stringify(data)
  });
};

/**
 * DELETE request
 */
export const del = (endpoint, token) => {
  return apiRequest(endpoint, {
    method: 'DELETE',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
};