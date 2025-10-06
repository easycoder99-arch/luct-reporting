import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Alert, Card } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { reportService } from '../services/reportService';
import { classService } from '../services/classService';
import { courseService } from '../services/courseService';

function ReportForm() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    faculty_name: user?.faculty || 'ICT',
    class_id: '',
    week_of_reporting: '',
    date_of_lecture: '',
    course_id: '',
    actual_students_present: '',
    venue: '',
    scheduled_lecture_time: '',
    topic_taught: '',
    learning_outcomes: '',
    recommendations: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClasses();
    fetchCourses();
  }, []);

  const fetchClasses = async () => {
    try {
      const classesData = await classService.getClasses();
      setClasses(classesData);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setError('Failed to load classes');
    }
  };

  const fetchCourses = async () => {
    try {
      const coursesData = await courseService.getCourses();
      setCourses(coursesData);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to load courses');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-fill course and venue when class is selected
    if (name === 'class_id') {
      const selectedClass = classes.find(cls => cls.id == value);
      if (selectedClass) {
        setFormData(prev => ({
          ...prev,
          course_id: selectedClass.course_id,
          venue: selectedClass.venue,
          scheduled_lecture_time: selectedClass.scheduled_time
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await reportService.createReport(formData);
      setMessage('Report submitted successfully!');
      
      // Reset form
      setFormData({
        faculty_name: user?.faculty || 'ICT',
        class_id: '',
        week_of_reporting: '',
        date_of_lecture: '',
        course_id: '',
        actual_students_present: '',
        venue: '',
        scheduled_lecture_time: '',
        topic_taught: '',
        learning_outcomes: '',
        recommendations: ''
      });
    } catch (error) {
      console.error('Error submitting report:', error);
      setError(error.response?.data?.error || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={10}>
          <Card>
            <Card.Header className="bg-primary text-white">
              <h3 className="text-center mb-0">Lecturer Reporting Form</h3>
            </Card.Header>
            <Card.Body>
              {message && <Alert variant="success">{message}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Faculty Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="faculty_name"
                        value={formData.faculty_name}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Class Name</Form.Label>
                      <Form.Select
                        name="class_id"
                        value={formData.class_id}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Class</option>
                        {classes.map(cls => (
                          <option key={cls.id} value={cls.id}>
                            {cls.class_name} - {cls.course_name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Week of Reporting</Form.Label>
                      <Form.Control
                        type="text"
                        name="week_of_reporting"
                        value={formData.week_of_reporting}
                        onChange={handleChange}
                        placeholder="e.g., Week 1, Semester 1"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Date of Lecture</Form.Label>
                      <Form.Control
                        type="date"
                        name="date_of_lecture"
                        value={formData.date_of_lecture}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Course</Form.Label>
                      <Form.Select
                        name="course_id"
                        value={formData.course_id}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Course</option>
                        {courses.map(course => (
                          <option key={course.id} value={course.id}>
                            {course.course_code} - {course.course_name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Actual Number of Students Present</Form.Label>
                      <Form.Control
                        type="number"
                        name="actual_students_present"
                        value={formData.actual_students_present}
                        onChange={handleChange}
                        min="0"
                        required
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
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Scheduled Lecture Time</Form.Label>
                      <Form.Control
                        type="time"
                        name="scheduled_lecture_time"
                        value={formData.scheduled_lecture_time}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Topic Taught</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="topic_taught"
                    value={formData.topic_taught}
                    onChange={handleChange}
                    placeholder="Describe the topic covered in this lecture..."
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Learning Outcomes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="learning_outcomes"
                    value={formData.learning_outcomes}
                    onChange={handleChange}
                    placeholder="What should students be able to do after this lecture?"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Lecturer's Recommendations</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="recommendations"
                    value={formData.recommendations}
                    onChange={handleChange}
                    placeholder="Any recommendations for improvement or follow-up actions..."
                  />
                </Form.Group>

                <div className="text-center">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    size="lg" 
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit Report'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ReportForm;