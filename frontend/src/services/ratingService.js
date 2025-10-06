import api from './api';

export const ratingService = {
    // Submit a rating
    submitRating: async (ratingData) => {
        const response = await api.post('/ratings', ratingData);
        return response.data;
    },

    // Get ratings for a report
    getRatingsForReport: async (reportId) => {
        const response = await api.get(`/ratings/report/${reportId}`);
        return response.data;
    },

    // Get ratings by lecturer
    getRatingsByLecturer: async (lecturerId) => {
        const response = await api.get(`/ratings/lecturer/${lecturerId}`);
        return response.data;
    },

    // Get overall rating statistics
    getRatingStats: async () => {
        const response = await api.get('/ratings/stats');
        return response.data;
    }
};