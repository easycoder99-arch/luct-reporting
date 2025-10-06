import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

function ReportFormComponent({ formData, onFormChange, classes = [], courses = [] }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFormChange(name, value);
  };

  const handleClassChange = (e) => {
    const classId = e.target.value;
    const selectedClass = classes.find(cls => cls.id == classId);
    
    onFormChange('class_id', classId);
    
    if (selectedClass) {
      onFormChange('course_id', selectedClass.course_id);
      onFormChange('venue', selectedClass.venue);
      onFormChange('scheduled_lecture_time', selectedClass.scheduled_time);
    }
  };

  return (
    <Form>
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
              onChange={handleClassChange}
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
            <Form.Label>Actual Students Present</Form.Label>
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
            <Form.Label>Scheduled Time</Form.Label>
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
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Recommendations</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="recommendations"
          value={formData.recommendations}
          onChange={handleChange}
        />
      </Form.Group>
    </Form>
  );
}

export default ReportFormComponent;