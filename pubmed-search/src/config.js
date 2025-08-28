// API Configuration
const config = {
  // Development API URL (localhost)
  development: "https://bioseekai-backend-api-dpc9cwfxhxa5dtd7.eastasia-01.azurewebsites.net",
  
  // Production API URL (Azure) - Hardcoded for your deployed frontend
  production: "https://bioseekai-backend-api-dpc9cwfxhxa5dtd7.eastasia-01.azurewebsites.net",
  
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

