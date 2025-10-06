import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Table, Alert, Form, Button, Modal } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { reportService } from '../services/reportService';

function Ratings() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [ratingForm, setRatingForm] = useState({
    rating: 0,
    comment: '',
    category: 'teaching_quality'
  });

  useEffect(() => {
    fetchRatingsData();
  }, []);

  const fetchRatingsData = async () => {
    try {
      setLoading(true);
      const reportsData = await reportService.getReports();
      setReports(reportsData);
      
      // For now, we'll use mock ratings data
      // In a real app, you'd fetch this from your ratings API
      const mockRatings = generateMockRatings(reportsData);
      setRatings(mockRatings);
      
      setError('');
    } catch (error) {
      console.error('Error fetching ratings data:', error);
      setError('Failed to load ratings data');
    } finally {
      setLoading(false);
    }
  };

  const generateMockRatings = (reportsData) => {
    return reportsData.map(report => ({
      id: report.id,
      report_id: report.id,
      course_code: report.course_code,
      course_name: report.course_name,
      lecturer_name: report.lecturer_name,
      rating: Math.floor(Math.random() * 2) + 4, // Random 4-5 stars
      comment: getRandomComment(),
      category: ['teaching_quality', 'content_quality', 'engagement'][Math.floor(Math.random() * 3)],
      created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      rated_by: ['Student A', 'Principal Lecturer', 'Peer Reviewer'][Math.floor(Math.random() * 3)]
    }));
  };

  const getRandomComment = () => {
    const comments = [
      'Excellent teaching methodology and engaging content.',
      'Well structured lecture with clear learning outcomes.',
      'Good interaction with students during the session.',
      'Could improve on time management.',
      'Very knowledgeable and helpful instructor.',
      'Practical examples made the concepts easy to understand.'
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  };

  const handleRateReport = (report) => {
    setSelectedReport(report);
    setRatingForm({
      rating: 0,
      comment: '',
      category: 'teaching_quality'
    });
    setShowRatingModal(true);
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    
    try {
      // Simulate API call to submit rating
      console.log('Submitting rating:', {
        report_id: selectedReport.id,
        ...ratingForm
      });

      // Add the new rating to the list
      const newRating = {
        id: Date.now(), // Temporary ID
        report_id: selectedReport.id,
        course_code: selectedReport.course_code,
        course_name: selectedReport.course_name,
        lecturer_name: selectedReport.lecturer_name,
        rating: ratingForm.rating,
        comment: ratingForm.comment,
        category: ratingForm.category,
        created_at: new Date().toISOString(),
        rated_by: user.name
      };

      setRatings(prev => [newRating, ...prev]);
      setShowRatingModal(false);
      alert('Rating submitted successfully!');
      
    } catch (error) {
      setError('Failed to submit rating: ' + error.message);
    }
  };

  const getAverageRating = (lecturerName) => {
    const lecturerRatings = ratings.filter(r => r.lecturer_name === lecturerName);
    if (lecturerRatings.length === 0) return 0;
    
    const sum = lecturerRatings.reduce((total, rating) => total + rating.rating, 0);
    return (sum / lecturerRatings.length).toFixed(1);
  };

  const getStarRating = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const getRatingSummary = () => {
    const summary = {};
    
    ratings.forEach(rating => {
      if (!summary[rating.lecturer_name]) {
        summary[rating.lecturer_name] = {
          totalRatings: 0,
          totalScore: 0,
          averageRating: 0,
          courses: new Set()
        };
      }
      
      summary[rating.lecturer_name].totalRatings++;
      summary[rating.lecturer_name].totalScore += rating.rating;
      summary[rating.lecturer_name].courses.add(rating.course_name);
    });

    // Calculate averages
    Object.keys(summary).forEach(lecturer => {
      const data = summary[lecturer];
      data.averageRating = (data.totalScore / data.totalRatings).toFixed(1);
      data.courses = Array.from(data.courses);
    });

    return summary;
  };

  if (loading) {
    return (
      <Container>
        <div className="text-center py-4">Loading ratings data...</div>
      </Container>
    );
  }

  return (
    <Container>
      <Card className="mb-4">
        <Card.Header>
          <h3 className="mb-0">Ratings & Feedback System</h3>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          {/* Rating Summary */}
          <Row className="mb-4">
            <Col>
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Lecturer Performance Summary</h5>
                </Card.Header>
                <Card.Body>
                  {Object.keys(getRatingSummary()).length > 0 ? (
                    <Table responsive striped>
                      <thead>
                        <tr>
                          <th>Lecturer</th>
                          <th>Courses</th>
                          <th>Average Rating</th>
                          <th>Total Ratings</th>
                          <th>Performance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(getRatingSummary()).map(([lecturer, data]) => (
                          <tr key={lecturer}>
                            <td>
                              <strong>{lecturer}</strong>
                            </td>
                            <td>
                              {data.courses.slice(0, 2).join(', ')}
                              {data.courses.length > 2 && ` +${data.courses.length - 2} more`}
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <span className="text-warning me-2">
                                  {getStarRating(Math.round(data.averageRating))}
                                </span>
                                <span>({data.averageRating})</span>
                              </div>
                            </td>
                            <td>{data.totalRatings}</td>
                            <td>
                              <span className={`badge bg-${getPerformanceLevel(data.averageRating)}`}>
                                {getPerformanceLevel(data.averageRating).toUpperCase()}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <p className="text-muted text-center">No ratings data available</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Recent Ratings */}
          <Row>
            <Col md={6}>
              <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Recent Ratings</h5>
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => window.location.href = '/reports'}
                  >
                    Rate a Report
                  </Button>
                </Card.Header>
                <Card.Body>
                  {ratings.slice(0, 5).length > 0 ? (
                    <div className="list-group list-group-flush">
                      {ratings.slice(0, 5).map((rating) => (
                        <div key={rating.id} className="list-group-item">
                          <div className="d-flex w-100 justify-content-between">
                            <h6 className="mb-1">{rating.course_name}</h6>
                            <small className="text-muted">
                              {getStarRating(rating.rating)}
                            </small>
                          </div>
                          <p className="mb-1 small">{rating.comment}</p>
                          <small className="text-muted">
                            By {rating.rated_by} • {new Date(rating.created_at).toLocaleDateString()}
                          </small>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted text-center">No ratings yet</p>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Rating Statistics</h5>
                </Card.Header>
                <Card.Body>
                  <div className="text-center">
                    <h2 className="text-warning">{ratings.length}</h2>
                    <p>Total Ratings Submitted</p>
                    
                    <hr />
                    
                    <h4>Rating Distribution</h4>
                    {[5, 4, 3, 2, 1].map(stars => {
                      const count = ratings.filter(r => r.rating === stars).length;
                      const percentage = ratings.length > 0 ? (count / ratings.length * 100).toFixed(1) : 0;
                      
                      return (
                        <div key={stars} className="d-flex align-items-center mb-2">
                          <span className="me-2" style={{ width: '60px' }}>
                            {getStarRating(stars)}
                          </span>
                          <div className="progress flex-grow-1 me-2">
                            <div 
                              className="progress-bar bg-warning" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-muted" style={{ width: '40px' }}>
                            {percentage}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Rating Modal */}
      <RatingModal 
        show={showRatingModal}
        onHide={() => setShowRatingModal(false)}
        report={selectedReport}
        ratingForm={ratingForm}
        setRatingForm={setRatingForm}
        onSubmit={handleSubmitRating}
      />
    </Container>
  );
}

// Rating Modal Component
const RatingModal = ({ show, onHide, report, ratingForm, setRatingForm, onSubmit }) => {
  const handleChange = (e) => {
    setRatingForm({
      ...ratingForm,
      [e.target.name]: e.target.value
    });
  };

  const handleRatingClick = (rating) => {
    setRatingForm({
      ...ratingForm,
      rating: rating
    });
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton className="bg-warning text-dark">
        <Modal.Title>Rate Report - {report?.course_name}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
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
              <strong>Rating *</strong>
            </Form.Label>
            <div>
              {[1, 2, 3, 4, 5].map(star => (
                <Button
                  key={star}
                  type="button"
                  variant={ratingForm.rating >= star ? "warning" : "outline-warning"}
                  size="lg"
                  className="me-2"
                  onClick={() => handleRatingClick(star)}
                >
                  ⭐ {star}
                </Button>
              ))}
            </div>
            <Form.Text className="text-muted">
              Select a rating from 1 (Poor) to 5 (Excellent)
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <strong>Category</strong>
            </Form.Label>
            <Form.Select
              name="category"
              value={ratingForm.category}
              onChange={handleChange}
            >
              <option value="teaching_quality">Teaching Quality</option>
              <option value="content_quality">Content Quality</option>
              <option value="engagement">Student Engagement</option>
              <option value="organization">Organization</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <strong>Comments *</strong>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="comment"
              value={ratingForm.comment}
              onChange={handleChange}
              placeholder="Provide detailed feedback about this report..."
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button 
            variant="warning" 
            type="submit" 
            disabled={!ratingForm.rating || !ratingForm.comment.trim()}
          >
            Submit Rating
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

// Helper functions
const getPerformanceLevel = (rating) => {
  if (rating >= 4.5) return 'success';
  if (rating >= 3.5) return 'warning';
  return 'danger';
};

export default Ratings;