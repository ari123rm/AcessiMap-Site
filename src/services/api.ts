const API_API = process.env.REACT_APP_API_IP || 'http://localhost';
const API_PORT = process.env.REACT_APP_API_PORT || '3001';
const API_URL =  process.env.REACT_APP_API_URL || `${API_API}:${API_PORT}`;



export const API_BASE_URL = `${API_URL}/api`;
