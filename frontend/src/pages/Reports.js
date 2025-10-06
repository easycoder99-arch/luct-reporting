import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, InputGroup, Form, Button, Alert, Modal } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { reportService } from '../services/reportService';
import ReportsTable from '../components/tables/ReportsTable';
import SearchBar from '../components/common/SearchBar';
import ExportButton from '../components/common/ExportButton';
import FeedbackModal from '../components/modals/FeedbackModal';

function Reports() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const reportsData = await reportService.getReports();
      setReports(reportsData);
      setError('');
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      fetchReports();
      return;
    }
    
    try {
      const results = await reportService.searchReports(term);
      setReports(results);
      setError('');
    } catch (error) {
      console.error('Error searching reports:', error);
      setError('Search failed');
    }
  };

  const handleExport = async () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }
    
    try {
      const blob = await reportService.exportReports(startDate, endDate);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reports-${startDate}-to-${endDate}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting reports:', error);
      alert('Error exporting reports: ' + (error.response?.data?.error || 'Unknown error'));
    }
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setShowViewModal(true);
  };

  const handleFeedback = (report) => {
    setSelectedReport(report);
    setShowFeedbackModal(true);
  };

  const handleRateReport = (report) => {
    setSelectedReport(report);
    setShowRatingModal(true);
  };

  const handleFeedbackSubmitted = () => {
    setError('');
    alert('Feedback submitted successfully!');
  };

  const handleRatingSubmitted = () => {
    setError('');
    alert('Rating submitted successfully!');
  };

  // View Report Modal Component
  const ViewReportModal = ({ show, onHide, report }) => {
    if (!report) return null;

    return (
      <Modal show={show} onHide={onHide} size="lg">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Report Details - {report.course_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <h6>Basic Information</h6>
              <p><strong>Date:</strong> {new Date(report.date_of_lecture).toLocaleDateString()}</p>
              <p><strong>Class:</strong> {report.class_name}</p>
              <p><strong>Course:</strong> {report.course_code} - {report.course_name}</p>
              <p><strong>Week:</strong> {report.week_of_reporting}</p>
            </div>
            <div className="col-md-6">
              <h6>Attendance & Venue</h6>
              <p><strong>Students Present:</strong> {report.actual_students_present}</p>
              <p><strong>Venue:</strong> {report.venue}</p>
              <p><strong>Scheduled Time:</strong> {report.scheduled_lecture_time}</p>
              {report.lecturer_name && <p><strong>Lecturer:</strong> {report.lecturer_name}</p>}
            </div>
          </div>
          
          <hr />
          
          <div className="row">
            <div className="col-12">
              <h6>Topic Taught</h6>
              <div className="border p-3 bg-light rounded">
                {report.topic_taught}
              </div>
            </div>
          </div>
          
          <div className="row mt-3">
            <div className="col-12">
              <h6>Learning Outcomes</h6>
              <div className="border p-3 bg-light rounded">
                {report.learning_outcomes}
              </div>
            </div>
          </div>
          
          {report.recommendations && (
            <div className="row mt-3">
              <div className="col-12">
                <h6>Recommendations</h6>
                <div className="border p-3 bg-light rounded">
                  {report.recommendations}
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          {user.role === 'principal_lecturer' && (
            <Button variant="warning" onClick={() => handleFeedback(report)}>
              Provide Feedback
            </Button>
          )}
          {user.role !== 'lecturer' && (
            <Button variant="success" onClick={() => handleRateReport(report)}>
              Rate Report
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    );
  };

  // Simple Rating Modal Component
  const RatingModal = ({ show, onHide, report, onRatingSubmitted }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        // Simulate API call
        console.log('Submitting rating:', { report_id: report.id, rating, comment });
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        onRatingSubmitted();
        onHide();
        setRating(0);
        setComment('');
      } catch (error) {
        alert('Failed to submit rating');
      } finally {
        setLoading(false);
      }
    };

    if (!show) return null;

    return (
      <Modal show={show} onHide={onHide} size="lg">
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>Rate Report - {report?.course_name}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="mb-3">
              <h6>Report Information</h6>
              <p><strong>Course:</strong> {report?.course_code} - {report?.course_name}</p>
              <p><strong>Lecturer:</strong> {report?.lecturer_name}</p>
              <p><strong>Date:</strong> {report?.date_of_lecture && new Date(report.date_of_lecture).toLocaleDateString()}</p>
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
                    variant={rating >= star ? "warning" : "outline-warning"}
                    size="lg"
                    className="me-2"
                    onClick={() => setRating(star)}
                  >
                    ⭐ {star}
                  </Button>
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Comments</strong>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about this report..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>
              Cancel
            </Button>
            <Button 
              variant="success" 
              type="submit" 
              disabled={loading || rating === 0}
            >
              {loading ? 'Submitting...' : 'Submit Rating'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  };

  if (loading) {
    return (
      <Container>
        <div className="text-center py-4">Loading reports...</div>
      </Container>
    );
  }

  return (
    <Container>
      <Card>
        <Card.Header>
          <h3 className="mb-0">Reports</h3>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          {/* Search and Export Section */}
          <Row className="mb-4">
            <Col md={6}>
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search reports by course, topic, or lecturer..."
                size="lg"
              />
            </Col>
            <Col md={6}>
              <InputGroup size="lg">
                <Form.Control
                  type="date"
                  placeholder="Start Date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <Form.Control
                  type="date"
                  placeholder="End Date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <ExportButton onExport={handleExport} size="lg" />
              </InputGroup>
            </Col>
          </Row>

          {/* Reports Table */}
          <ReportsTable
            reports={reports}
            onView={handleViewReport}
            onFeedback={handleFeedback}
            onRate={handleRateReport}
            userRole={user.role}
          />

          {reports.length === 0 && !loading && (
            <div className="text-center text-muted py-4">
              <h5>No reports found</h5>
              <p>There are no reports to display at the moment.</p>
              {user.role === 'lecturer' && (
                <Button variant="primary" href="/report-form">
                  Create Your First Report
                </Button>
              )}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* View Report Modal */}
      <ViewReportModal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        report={selectedReport}
      />

      {/* Feedback Modal */}
      <FeedbackModal
        show={showFeedbackModal}
        onHide={() => setShowFeedbackModal(false)}
        report={selectedReport}
        onFeedbackSubmitted={handleFeedbackSubmitted}
      />

      {/* Rating Modal */}
      <RatingModal
        show={showRatingModal}
        onHide={() => setShowRatingModal(false)}
        report={selectedReport}
        onRatingSubmitted={handleRatingSubmitted}
      />
    </Container>
  );
}

export default Reports;