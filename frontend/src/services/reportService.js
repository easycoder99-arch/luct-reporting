import api from './api';

export const reportService = {
  createReport: async (reportData) => {
    const response = await api.post('/reports', reportData);
    return response.data;
  },

  getReports: async () => {
    const response = await api.get('/reports');
    return response.data;
  },

  getReportById: async (id) => {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  },

  searchReports: async (query) => {
    const response = await api.get(`/search?q=${query}&type=reports`);
    return response.data;
  },

  exportReports: async (startDate, endDate) => {
    const response = await api.get(
      `/export/reports?startDate=${startDate}&endDate=${endDate}`,
      { responseType: 'blob' }
    );
    return response.data;
  }
};