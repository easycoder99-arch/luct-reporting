import api from './api';

export const feedbackService = {
    // Add feedback to report
    addFeedback: async (feedbackData) => {
        const response = await api.post('/feedback', feedbackData);
        return response.data;
    },

    // Get feedback for a report
    getFeedbackForReport: async (reportId) => {
        const response = await api.get(`/feedback/report/${reportId}`);
        return response.data;
    },

    // Update feedback
    updateFeedback: async (feedbackId, feedbackData) => {
        const response = await api.put(`/feedback/${feedbackId}`, feedbackData);
        return response.data;
    }
};