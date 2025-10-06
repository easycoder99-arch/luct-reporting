import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

function EditCourseModal({ show, onHide, course, onUpdateCourse }) {
    const [formData, setFormData] = useState({
        course_code: '',
        course_name: '',
        faculty: 'ICT'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (course) {
            setFormData({
                course_code: course.course_code,
                course_name: course.course_name,
                faculty: course.faculty
            });
        }
    }, [course]);

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
            await onUpdateCourse(course.id, formData);
            onHide();
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to update course');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Edit Course</Modal.Title>
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
                        {loading ? 'Updating...' : 'Update Course'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default EditCourseModal;