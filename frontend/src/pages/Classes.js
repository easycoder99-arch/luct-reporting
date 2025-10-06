import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Alert, Button, Modal } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { classService } from '../services/classService';

function Classes() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const classesData = await classService.getClasses();
      setClasses(classesData);
    } catch (error) {
      setError('Error fetching classes: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewClass = (classItem) => {
    setSelectedClass(classItem);
    setShowViewModal(true);
  };

  // View Class Modal Component
  const ViewClassModal = ({ show, onHide, classItem }) => {
    if (!classItem) return null;

    return (
      <Modal show={show} onHide={onHide} size="lg">
        <Modal.Header closeButton className="bg-info text-white">
          <Modal.Title>Class Details - {classItem.class_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <h6>Class Information</h6>
              <p><strong>Class Name:</strong> {classItem.class_name}</p>
              <p><strong>Course:</strong> {classItem.course_code} - {classItem.course_name}</p>
              <p><strong>Lecturer:</strong> {classItem.lecturer_name}</p>
              <p><strong>Total Students:</strong> {classItem.total_registered_students}</p>
            </div>
            <div className="col-md-6">
              <h6>Schedule & Venue</h6>
              <p><strong>Venue:</strong> {classItem.venue}</p>
              <p><strong>Scheduled Time:</strong> {classItem.scheduled_time}</p>
              <p><strong>Faculty:</strong> ICT</p>
            </div>
          </div>
          
          <hr />
          
          <div className="row">
            <div className="col-12">
              <h6>Recent Activity</h6>
              <div className="border p-3 bg-light rounded">
                <p className="mb-2">
                  <strong>Last Report:</strong> {classItem.last_report_date || 'No reports yet'}
                </p>
                <p className="mb-0">
                  <strong>Average Attendance:</strong> {classItem.avg_attendance || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button variant="primary" onClick={() => {
            // Navigate to reports for this class
            window.location.href = `/reports?class=${classItem.id}`;
          }}>
            View Reports
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  if (loading) {
    return (
      <Container>
        <div className="text-center">Loading classes...</div>
      </Container>
    );
  }

  return (
    <Container>
      <Card  className={`border-0 bg-dark text-light`}>
        <Card.Header>
          <h3>Classes</h3>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Table responsive striped bordered hover>
            <thead className="table-dark">
              <tr>
                <th>Class Name</th>
                <th>Course</th>
                <th>Lecturer</th>
                <th>Total Students</th>
                <th>Venue</th>
                <th>Scheduled Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map(classItem => (
                <tr key={classItem.id}>
                  <td>
                    <strong>{classItem.class_name}</strong>
                  </td>
                  <td>
                    <div><strong>{classItem.course_code}</strong></div>
                    <small className="text-muted">{classItem.course_name}</small>
                  </td>
                  <td>{classItem.lecturer_name}</td>
                  <td>{classItem.total_registered_students}</td>
                  <td>{classItem.venue}</td>
                  <td>{classItem.scheduled_time}</td>
                  <td>
                    <Button 
                      variant="info" 
                      size="sm" 
                      onClick={() => handleViewClass(classItem)}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          
          {classes.length === 0 && (
            <div className="text-center text-muted py-4">
              <h5>No classes found</h5>
              <p>There are no classes assigned to you at the moment.</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* View Class Modal */}
      <ViewClassModal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        classItem={selectedClass}
      />
    </Container>
  );
}

export default Classes;