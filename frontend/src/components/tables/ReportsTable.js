import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';

function ReportsTable({ reports, onView, onFeedback, userRole, onRate }) {
  const getStatusBadge = (report) => {
    const totalStudents = report.total_registered_students || 25;
    const attendanceRate = (report.actual_students_present / totalStudents) * 100;
    
    if (attendanceRate >= 80) return <Badge bg="success">Good</Badge>;
    if (attendanceRate >= 60) return <Badge bg="warning">Fair</Badge>;
    return <Badge bg="danger">Low</Badge>;
  };

  if (!reports || reports.length === 0) {
    return (
      <div className="text-center text-muted py-4">
        <h5>No reports found</h5>
        <p>There are no reports to display at the moment.</p>
      </div>
    );
  }

  return (
    <Table responsive striped bordered hover>
      <thead className="table-dark">
        <tr>
          <th>Date</th>
          <th>Course</th>
          <th>Class</th>
          <th>Topic</th>
          <th>Students</th>
          <th>Attendance</th>
          <th>Venue</th>
          {userRole === 'principal_lecturer' && <th>Lecturer</th>}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody  className={`border-0 bg-dark text-light`}>
        {reports.map(report => (
          <tr key={report.id}>
            <td>{new Date(report.date_of_lecture).toLocaleDateString()}</td>
            <td>
              <div><strong>{report.course_code}</strong></div>
              <small className="text-muted">{report.course_name}</small>
            </td>
            <td>{report.class_name}</td>
            <td>
              <div className="text-truncate" style={{ maxWidth: '200px' }} title={report.topic_taught}>
                {report.topic_taught}
              </div>
            </td>
            <td>{report.actual_students_present}</td>
            <td>{getStatusBadge(report)}</td>
            <td>{report.venue}</td>
            {userRole === 'principal_lecturer' && (
              <td>{report.lecturer_name}</td>
            )}
            <td>
              <div className="d-flex gap-1">
                <Button 
                  variant="info" 
                  size="sm" 
                  onClick={() => onView(report)}
                  title="View full report details"
                >
                  View
                </Button>
                {userRole === 'principal_lecturer' && (
                  <Button 
                    variant="warning" 
                    size="sm" 
                    onClick={() => onFeedback(report)}
                    title="Provide feedback on this report"
                  >
                    Feedback
                  </Button>
                )}
                {userRole !== 'lecturer' && onRate && (
                  <Button 
                    variant="success" 
                    size="sm" 
                    onClick={() => onRate(report)}
                    title="Rate this report"
                  >
                    Rate
                  </Button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default ReportsTable;