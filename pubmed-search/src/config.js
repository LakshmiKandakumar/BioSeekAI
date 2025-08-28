// API Configuration
const config = {
  // Development API URL (localhost)
  development: "https://bioseek-ai-backend-api-dud2f6cbbvbuemg2.southindia-01.azurewebsites.net",
  
  // Production API URL (Azure) - Hardcoded for your deployed frontend
  production: "https://bioseek-ai-backend-api-dud2f6cbbvbuemg2.southindia-01.azurewebsites.net",
  
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


