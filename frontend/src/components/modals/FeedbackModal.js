import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

function FeedbackModal({ show, onHide, report, onFeedbackSubmitted }) {
    const [formData, setFormData] = useState({
        feedback_text: '',
        rating: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (show) {
            // Reset form when modal opens
            setFormData({
                feedback_text: '',
                rating: 0
            });
            setError('');
        }
    }, [show]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRatingChange = (rating) => {
        setFormData({
            ...formData,
            rating: rating
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // For now, simulate API call - you can connect to real API later
            console.log('Submitting feedback:', {
                report_id: report?.id,
                ...formData
            });
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            if (onFeedbackSubmitted) {
                onFeedbackSubmitted();
            }
            onHide();
        } catch (error) {
            setError('Failed to submit feedback: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton className="bg-warning text-dark">
                <Modal.Title>
                    Provide Feedback - {report?.course_name}
                </Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    <div className="mb-3">
                        <h6>Report Information</h6>
                        <p><strong>Course:</strong> {report?.course_code} - {report?.course_name}</p>
                        <p><strong>Lecturer:</strong> {report?.lecturer_name}</p>
                        <p><strong>Date:</strong> {report?.date_of_lecture && new Date(report.date_of_lecture).toLocaleDateString()}</p>
                        <p><strong>Topic:</strong> {report?.topic_taught}</p>
                    </div>

                    <hr />

                    <Form.Group className="mb-3">
                        <Form.Label>
                            <strong>Rating (Optional)</strong>
                        </Form.Label>
                        <div>
                            {[1, 2, 3, 4, 5].map(star => (
                                <Button
                                    key={star}
                                    type="button"
                                    variant={formData.rating >= star ? "warning" : "outline-warning"}
                                    size="sm"
                                    className="me-1"
                                    onClick={() => handleRatingChange(star)}
                                >
                                    ⭐ {star}
                                </Button>
                            ))}
                        </div>
                        <Form.Text className="text-muted">
                            Rate this report from 1 (Poor) to 5 (Excellent)
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>
                            <strong>Feedback Comments *</strong>
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={6}
                            name="feedback_text"
                            value={formData.feedback_text}
                            onChange={handleChange}
                            placeholder="Provide constructive feedback about this report. Mention strengths, areas for improvement, and any recommendations..."
                            required
                        />
                        <Form.Text className="text-muted">
                            Your feedback will help the lecturer improve their teaching and reporting.
                        </Form.Text>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Cancel
                    </Button>
                    <Button 
                        variant="warning" 
                        type="submit" 
                        disabled={loading || !formData.feedback_text.trim()}
                    >
                        {loading ? 'Submitting...' : 'Submit Feedback'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default FeedbackModal;