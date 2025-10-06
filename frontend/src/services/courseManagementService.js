import api from './api';

export const courseManagementService = {
    // Add new course
    addCourse: async (courseData) => {
        const response = await api.post('/course-management', courseData);
        return response.data;
    },

    // Update course
    updateCourse: async (id, courseData) => {
        const response = await api.put(`/course-management/${id}`, courseData);
        return response.data;
    },

    // Assign lecturer to course
    assignLecturer: async (courseId, assignmentData) => {
        const response = await api.post(`/course-management/${courseId}/assign`, assignmentData);
        return response.data;
    },

    // Get all lecturers
    getLecturers: async () => {
        try {
            const response = await api.get('/users/lecturers');
            console.log('Lecturers fetched:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching lecturers:', error);
            // Return empty array if API fails
            return [];
        }
    }
};