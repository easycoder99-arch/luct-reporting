import api from './api';

export const courseService = {
  getCourses: async () => {
    const response = await api.get('/courses');
    return response.data;
  },

  getCourseById: async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  searchCourses: async (query) => {
    const response = await api.get(`/search?q=${query}&type=courses`);
    return response.data;
  }
};