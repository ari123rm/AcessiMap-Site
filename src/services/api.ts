const API_URL = process.env.REACT_APP_API_URL || 'http://localhost';
const API_PORT = process.env.REACT_APP_API_PORT || '3001';

export const API_BASE_URL = `${API_URL}:${API_PORT}/api`;
