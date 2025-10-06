import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { reportService } from '../services/reportService';
import StatsCard from '../components/cards/StatsCard';

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalReports: 0,
    totalClasses: 0,
    averageAttendance: 0,
    recentReports: []
  });

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const reports = await reportService.getReports();
      
      setStats({
        totalReports: reports.length,
        totalClasses: new Set(reports.map(r => r.class_id)).size,
        averageAttendance: reports.length > 0 
          ? reports.reduce((acc, report) => acc + report.actual_students_present, 0) / reports.length 
          : 0,
        recentReports: reports.slice(0, 5)
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const getRoleBasedContent = () => {
    switch (user.role) {
      case 'lecturer':
        return {
          title: 'Lecturer Dashboard',
          description: 'Manage your classes and teaching reports'
        };
      case 'principal_lecturer':
        return {
          title: 'Principal Lecturer Dashboard',
          description: 'Monitor faculty reports and provide feedback'
        };
      case 'program_leader':
        return {
          title: 'Program Leader Dashboard',
          description: 'Oversee programs and course assignments'
        };
      case 'student':
        return {
          title: 'Student Dashboard',
          description: 'View your classes and course information'
        };
      default:
        return {
          title: 'Dashboard',
          description: 'Welcome to LUCT Reporting System'
        };
    }
  };

  const content = getRoleBasedContent();

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h1 className="text-light">{content.title}</h1>
          <p className="text-muted">{content.description}</p>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <StatsCard
            title="Total Reports"
            value={stats.totalReports}
            icon="📊"
            variant="primary"
          />
        </Col>
        <Col md={4}>
          <StatsCard
            title="Classes"
            value={stats.totalClasses}
            icon="🏫"
            variant="success"
          />
        </Col>
        <Col md={4}>
          <StatsCard
            title="Avg Attendance"
            value={Math.round(stats.averageAttendance)}
            icon="👥"
            variant="info"
          />
        </Col>
      </Row>

      {/* Recent Activity */}
      <Row>
        <Col>
          <Card className="border-0">
            <Card.Header className="bg-dark text-light border-0">
              <h5 className="mb-0">Recent Reports</h5>
            </Card.Header>
            <Card.Body>
              {stats.recentReports.length > 0 ? (
                <div className="list-group list-group-flush">
                  {stats.recentReports.map(report => (
                    <div key={report.id} className="list-group-item bg-transparent border-secondary">
                      <div className="d-flex w-100 justify-content-between">
                        <h6 className="mb-1 text-light">{report.course_name}</h6>
                        <small className="text-muted">{new Date(report.date_of_lecture).toLocaleDateString()}</small>
                      </div>
                      <p className="mb-1 text-muted">{report.topic_taught.substring(0, 100)}...</p>
                      <small className="text-muted">Students: {report.actual_students_present} • {report.venue}</small>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center">No reports found</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;