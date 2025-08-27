// API Configuration
const config = {
  // Development API URL (localhost)
  development: "http://127.0.0.1:8000",
  
  // Production API URL (Azure) - Hardcoded for your deployed frontend
  production: "https://bioseekai-backend.azurewebsites.net",
  
  // Get the appropriate URL based on environment
  getApiUrl: () => {
    // Check if we're in production (Azure)
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return config.production;
    }
    // Development (localhost)
    return config.development;
  }
};

export default config;
