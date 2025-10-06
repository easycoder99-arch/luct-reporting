import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

function AddCourseModal({ show, onHide, onAddCourse }) {
    const [formData, setFormData] = useState({
        course_code: '',
        course_name: '',
        faculty: 'ICT'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await onAddCourse(formData);
            setFormData({
                course_code: '',
                course_name: '',
                faculty: 'ICT'
            });
            onHide();
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to add course');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Add New Course</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    <Form.Group className="mb-3">
                        <Form.Label>Course Code *</Form.Label>
                        <Form.Control
                            type="text"
                            name="course_code"
                            value={formData.course_code}
                            onChange={handleChange}
                            placeholder="e.g., DIT101"
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Course Name *</Form.Label>
                        <Form.Control
                            type="text"
                            name="course_name"
                            value={formData.course_name}
                            onChange={handleChange}
                            placeholder="e.g., Introduction to Programming"
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Faculty *</Form.Label>
                        <Form.Select
                            name="faculty"
                            value={formData.faculty}
                            onChange={handleChange}
                            required
                        >
                            <option value="ICT">Faculty of ICT</option>
                            <option value="Business">Faculty of Business</option>
                            <option value="Engineering">Faculty of Engineering</option>
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Adding...' : 'Add Course'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default AddCourseModal;