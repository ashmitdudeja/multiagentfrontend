import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const complianceAPI = {
  // Health check
  async healthCheck() {
    const response = await api.get('/health');
    return response.data;
  },

  // Analyze text
  async analyzeText(text, customRules = [], useDefaultRules = true) {
    const response = await api.post('/analyze/text', {
      text,
      custom_rules: customRules,
      use_default_rules: useDefaultRules,
    });
    return response.data;
  },

  // Analyze document
  async analyzeDocument(file, customRules = [], useDefaultRules = true) {
    const formData = new FormData();
    formData.append('document', file);
    
    if (customRules.length > 0) {
      formData.append('custom_rules', JSON.stringify(customRules));
    }
    
    formData.append('use_default_rules', useDefaultRules.toString());

    const response = await api.post('/analyze/document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default api;