import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Alert, Button } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { courseService } from '../services/courseService';
import { courseManagementService } from '../services/courseManagementService';

function Courses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const coursesData = await courseService.getCourses();
      setCourses(coursesData);
      setError('');
    } catch (error) {
      setError('Error fetching courses: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async (courseData) => {
    try {
      await courseManagementService.addCourse(courseData);
      setSuccess('Course added successfully!');
      setShowAddModal(false);
      fetchCourses(); // Refresh the list
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateCourse = async (courseId, courseData) => {
    try {
      await courseManagementService.updateCourse(courseId, courseData);
      setSuccess('Course updated successfully!');
      setShowEditModal(false);
      fetchCourses(); // Refresh the list
    } catch (error) {
      throw error;
    }
  };

  const handleAssignLecturer = async (courseId, assignmentData) => {
    try {
      await courseManagementService.assignLecturer(courseId, assignmentData);
      setSuccess('Lecturer assigned successfully!');
      setShowAssignModal(false);
      fetchCourses(); // Refresh the list
    } catch (error) {
      throw error;
    }
  };

  const handleEdit = (course) => {
    setSelectedCourse(course);
    setShowEditModal(true);
  };

  const handleAssign = (course) => {
    setSelectedCourse(course);
    setShowAssignModal(true);
  };

  // Simple modal components (inline to avoid import issues)
  const AddCourseModal = ({ show, onHide, onAddCourse }) => {
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
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to add course');
      } finally {
        setLoading(false);
      }
    };

    if (!show) return null;

    return (
      <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Course</h5>
              <button type="button" className="btn-close" onClick={onHide}></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {error && <Alert variant="danger">{error}</Alert>}
                
                <div className="mb-3">
                  <label className="form-label">Course Code *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="course_code"
                    value={formData.course_code}
                    onChange={handleChange}
                    placeholder="e.g., DIT101"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Course Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="course_name"
                    value={formData.course_name}
                    onChange={handleChange}
                    placeholder="e.g., Introduction to Programming"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Faculty *</label>
                  <select
                    className="form-select"
                    name="faculty"
                    value={formData.faculty}
                    onChange={handleChange}
                    required
                  >
                    <option value="ICT">Faculty of ICT</option>
                    <option value="Business">Faculty of Business</option>
                    <option value="Engineering">Faculty of Engineering</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onHide}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const EditCourseModal = ({ show, onHide, course, onUpdateCourse }) => {
    const [formData, setFormData] = useState({
      course_code: '',
      course_name: '',
      faculty: 'ICT'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    React.useEffect(() => {
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
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to update course');
      } finally {
        setLoading(false);
      }
    };

    if (!show) return null;

    return (
      <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Course</h5>
              <button type="button" className="btn-close" onClick={onHide}></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {error && <Alert variant="danger">{error}</Alert>}
                
                <div className="mb-3">
                  <label className="form-label">Course Code *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="course_code"
                    value={formData.course_code}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Course Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="course_name"
                    value={formData.course_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Faculty *</label>
                  <select
                    className="form-select"
                    name="faculty"
                    value={formData.faculty}
                    onChange={handleChange}
                    required
                  >
                    <option value="ICT">Faculty of ICT</option>
                    <option value="Business">Faculty of Business</option>
                    <option value="Engineering">Faculty of Engineering</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onHide}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const AssignLecturerModal = ({ show, onHide, course, onAssignLecturer }) => {
    const [formData, setFormData] = useState({
      lecturer_id: '',
      class_name: '',
      venue: '',
      scheduled_time: '08:00',
      total_students: 25
    });
    const [lecturers, setLecturers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    React.useEffect(() => {
      if (show && course) {
        fetchLecturers();
        setFormData(prev => ({
          ...prev,
          class_name: `${course.course_code}-01`
        }));
      }
    }, [show, course]);

    const fetchLecturers = async () => {
      try {
        console.log('Fetching lecturers...');
        const lecturersData = await courseManagementService.getLecturers();
        console.log('Lecturers data:', lecturersData);
        setLecturers(lecturersData);
        setError('');
      } catch (error) {
        console.error('Error fetching lecturers:', error);
        setError('Failed to load lecturers');
        setLecturers([]);
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
          total_students: 25
        });
        onHide();
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to assign lecturer');
      } finally {
        setLoading(false);
      }
    };

    if (!show) return null;

    return (
      <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Assign Lecturer to {course?.course_code}</h5>
              <button type="button" className="btn-close" onClick={onHide}></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {error && <div className="alert alert-danger">{error}</div>}
                
                <div className="mb-3">
                  <label className="form-label">Lecturer *</label>
                  <select
                    className="form-select"
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
                  </select>
                  {lecturers.length === 0 && (
                    <div className="text-warning mt-1">
                      No lecturers found. Make sure lecturers are registered with the "lecturer" role.
                    </div>
                  )}
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Class Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="class_name"
                        value={formData.class_name}
                        onChange={handleChange}
                        placeholder="e.g., DIT101-01"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Total Students</label>
                      <input
                        type="number"
                        className="form-control"
                        name="total_students"
                        value={formData.total_students}
                        onChange={handleChange}
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Venue</label>
                      <input
                        type="text"
                        className="form-control"
                        name="venue"
                        value={formData.venue}
                        onChange={handleChange}
                        placeholder="e.g., ICT Lab 1"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Scheduled Time</label>
                      <input
                        type="time"
                        className="form-control"
                        name="scheduled_time"
                        value={formData.scheduled_time}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onHide}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-success" 
                  disabled={loading || !formData.lecturer_id || !formData.class_name}
                >
                  {loading ? 'Assigning...' : 'Assign Lecturer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Container>
        <div className="text-center">Loading courses...</div>
      </Container>
    );
  }

  return (
    <Container>
      <Card className={`border-0 bg-dark text-light`}>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h3 className="mb-0">Courses</h3>
          {user.role === 'program_leader' && (
            <Button variant="primary" onClick={() => setShowAddModal(true)}>
              Add Course
            </Button>
          )}
        </Card.Header>
        <Card.Body className={`border-0 bg-dark text-light`}>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}
          
          <Table responsive striped bordered hover>
            <thead className="table-dark">
              <tr>
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Faculty</th>
                {user.role === 'program_leader' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {courses.map(course => (
                <tr key={course.id}>
                  <td><strong>{course.course_code}</strong></td>
                  <td>{course.course_name}</td>
                  <td>{course.faculty}</td>
                  {user.role === 'program_leader' && (
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-1"
                        onClick={() => handleEdit(course)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="outline-success" 
                        size="sm"
                        onClick={() => handleAssign(course)}
                      >
                        Assign
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
          
          {courses.length === 0 && (
            <div className="text-center text-muted py-4">
              <h5>No courses found</h5>
              <p>There are no courses available at the moment.</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modals */}
      <AddCourseModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onAddCourse={handleAddCourse}
      />

      <EditCourseModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        course={selectedCourse}
        onUpdateCourse={handleUpdateCourse}
      />

      <AssignLecturerModal
        show={showAssignModal}
        onHide={() => setShowAssignModal(false)}
        course={selectedCourse}
        onAssignLecturer={handleAssignLecturer}
      />
    </Container>
  );
}

export default Courses; // Make sure this export statement is present