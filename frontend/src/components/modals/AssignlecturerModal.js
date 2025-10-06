import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';
import { courseManagementService } from '../../services/courseManagementService';

function AssignLecturerModal({ show, onHide, course, onAssignLecturer }) {
    const [formData, setFormData] = useState({
        lecturer_id: '',
        class_name: '',
        venue: '',
        scheduled_time: '08:00',
        total_students: 0
    });
    const [lecturers, setLecturers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (show) {
            fetchLecturers();
            // Generate default class name
            if (course) {
                setFormData(prev => ({
                    ...prev,
                    class_name: `${course.course_code}-01`
                }));
            }
        }
    }, [show, course]);

    const fetchLecturers = async () => {
        try {
            const lecturersData = await courseManagementService.getLecturers();
            setLecturers(lecturersData);
        } catch (error) {
            console.error('Error fetching lecturers:', error);
            setError('Failed to load lecturers');
        }
    };

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
            await onAssignLecturer(course.id, formData);
            setFormData({
                lecturer_id: '',
                class_name: '',
                venue: '',
                scheduled_time: '08:00',
                total_students: 0
            });
            onHide();
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to assign lecturer');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Assign Lecturer to {course?.course_code}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    <Form.Group className="mb-3">
                        <Form.Label>Lecturer *</Form.Label>
                        <Form.Select
                            name="lecturer_id"
                            value={formData.lecturer_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Lecturer</option>
                            {lecturers.map(lecturer => (
                                <option key={lecturer.id} value={lecturer.id}>
                                    {lecturer.name} ({lecturer.email})
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Class Name *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="class_name"
                                    value={formData.class_name}
                                    onChange={handleChange}
                                    placeholder="e.g., DIT101-01"
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Total Students</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="total_students"
                                    value={formData.total_students}
                                    onChange={handleChange}
                                    min="0"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Venue</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="venue"
                                    value={formData.venue}
                                    onChange={handleChange}
                                    placeholder="e.g., ICT Lab 1"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Scheduled Time</Form.Label>
                                <Form.Control
                                    type="time"
                                    name="scheduled_time"
                                    value={formData.scheduled_time}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Cancel
                    </Button>
                    <Button variant="success" type="submit" disabled={loading}>
                        {loading ? 'Assigning...' : 'Assign Lecturer'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default AssignLecturerModal;