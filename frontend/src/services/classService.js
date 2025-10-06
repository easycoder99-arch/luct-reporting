import api from './api';

export const classService = {
  getClasses: async () => {
    const response = await api.get('/classes');
    return response.data;
  },

  getClassById: async (id) => {
    const response = await api.get(`/classes/${id}`);
    return response.data;
  },

  searchClasses: async (query) => {
    const response = await api.get(`/search?q=${query}&type=classes`);
    return response.data;
  }
};