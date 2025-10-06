import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Table, Alert, ProgressBar, Form, Button } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { reportService } from '../services/reportService';
import { classService } from '../services/classService';

function Monitoring() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [classes, setClasses] = useState([]);
  const [stats, setStats] = useState({
    totalReports: 0,
    totalClasses: 0,
    averageAttendance: 0,
    completionRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('week'); // week, month, semester

  useEffect(() => {
    fetchMonitoringData();
  }, [timeRange]);

  const fetchMonitoringData = async () => {
    try {
      setLoading(true);
      const [reportsData, classesData] = await Promise.all([
        reportService.getReports(),
        classService.getClasses()
      ]);

      setReports(reportsData);
      setClasses(classesData);
      calculateStats(reportsData, classesData);
      setError('');
    } catch (error) {
      console.error('Error fetching monitoring data:', error);
      setError('Failed to load monitoring data');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (reportsData, classesData) => {
    const totalReports = reportsData.length;
    const totalClasses = classesData.length;
    
    const totalAttendance = reportsData.reduce((sum, report) => sum + report.actual_students_present, 0);
    const averageAttendance = totalReports > 0 ? Math.round(totalAttendance / totalReports) : 0;
    
    // Calculate completion rate based on expected reports vs actual reports
    const expectedReports = totalClasses * 4; // Assuming 4 reports per class per period
    const completionRate = expectedReports > 0 ? Math.round((totalReports / expectedReports) * 100) : 0;

    setStats({
      totalReports,
      totalClasses,
      averageAttendance,
      completionRate
    });
  };

  const getRecentReports = () => {
    const now = new Date();
    const timeRangeMs = {
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
      semester: 180 * 24 * 60 * 60 * 1000
    }[timeRange];

    return reports
      .filter(report => {
        const reportDate = new Date(report.date_of_lecture);
        return (now - reportDate) < timeRangeMs;
      })
      .slice(0, 10); // Show only recent 10 reports
  };

  const getAttendanceTrend = () => {
    const recentReports = getRecentReports();
    return recentReports.map(report => ({
      date: new Date(report.date_of_lecture).toLocaleDateString(),
      attendance: report.actual_students_present,
      class: report.class_name,
      course: report.course_name
    }));
  };

  const getClassPerformance = () => {
    const classPerformance = {};
    
    reports.forEach(report => {
      if (!classPerformance[report.class_name]) {
        classPerformance[report.class_name] = {
          totalReports: 0,
          totalAttendance: 0,
          averageAttendance: 0
        };
      }
      
      classPerformance[report.class_name].totalReports++;
      classPerformance[report.class_name].totalAttendance += report.actual_students_present;
    });

    // Calculate averages
    Object.keys(classPerformance).forEach(className => {
      const classData = classPerformance[className];
      classData.averageAttendance = Math.round(classData.totalAttendance / classData.totalReports);
    });

    return classPerformance;
  };

  if (loading) {
    return (
      <Container>
        <div className="text-center py-4">Loading monitoring data...</div>
      </Container>
    );
  }

  return (
    <Container>
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h3 className="mb-0">Monitoring Dashboard</h3>
          <Form.Select 
            style={{ width: 'auto' }}
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="semester">This Semester</option>
          </Form.Select>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          {/* Key Metrics */}
          <Row className="mb-4">
            <Col md={3}>
              <Card className="text-center border-primary">
                <Card.Body>
                  <h2 className="text-primary">{stats.totalReports}</h2>
                  <Card.Title>Total Reports</Card.Title>
                  <small className="text-muted">In selected period</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center border-success">
                <Card.Body>
                  <h2 className="text-success">{stats.totalClasses}</h2>
                  <Card.Title>Active Classes</Card.Title>
                  <small className="text-muted">Being monitored</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center border-info">
                <Card.Body>
                  <h2 className="text-info">{stats.averageAttendance}</h2>
                  <Card.Title>Avg Attendance</Card.Title>
                  <small className="text-muted">Students per class</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center border-warning">
                <Card.Body>
                  <h2 className="text-warning">{stats.completionRate}%</h2>
                  <Card.Title>Completion Rate</Card.Title>
                  <small className="text-muted">Reports submitted</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Recent Activity */}
          <Row>
            <Col md={6}>
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Recent Activity</h5>
                </Card.Header>
                <Card.Body>
                  {getRecentReports().length > 0 ? (
                    <div className="list-group list-group-flush">
                      {getRecentReports().map((report, index) => (
                        <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="mb-1">{report.course_name}</h6>
                            <small className="text-muted">
                              {report.class_name} • {new Date(report.date_of_lecture).toLocaleDateString()}
                            </small>
                          </div>
                          <Badge attendance={report.actual_students_present} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted text-center">No recent activity</p>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Class Performance</h5>
                </Card.Header>
                <Card.Body>
                  {Object.keys(getClassPerformance()).length > 0 ? (
                    <div>
                      {Object.entries(getClassPerformance()).map(([className, data]) => (
                        <div key={className} className="mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <span>{className}</span>
                            <span>{data.averageAttendance} students avg</span>
                          </div>
                          <ProgressBar 
                            now={data.averageAttendance} 
                            max={30}
                            variant={getProgressVariant(data.averageAttendance)}
                          />
                          <small className="text-muted">{data.totalReports} reports</small>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted text-center">No performance data available</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Attendance Trends */}
          <Row className="mt-4">
            <Col>
              <Card className={`border-0 bg-dark text-light`}>
                <Card.Header>
                  <h5 className="mb-0">Attendance Trends</h5>
                </Card.Header>
                <Card.Body className={`border-0 bg-dark text-light`}>
                  {getAttendanceTrend().length > 0 ? (
                    <Table responsive striped  className={`border-0 bg-dark text-light`}>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Class</th>
                          <th>Course</th>
                          <th>Attendance</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getAttendanceTrend().map((trend, index) => (
                          <tr key={index}>
                            <td>{trend.date}</td>
                            <td>{trend.class}</td>
                            <td>{trend.course}</td>
                            <td>{trend.attendance} students</td>
                            <td>
                              <span className={`badge bg-${getAttendanceStatus(trend.attendance)}`}>
                                {getAttendanceStatus(trend.attendance).toUpperCase()}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <p className="text-muted text-center">No attendance data for selected period</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}

// Helper components
const Badge = ({ attendance }) => {
  const status = getAttendanceStatus(attendance);
  return (
    <span className={`badge bg-${status}`}>
      {attendance} students
    </span>
  );
};

// Helper functions
const getAttendanceStatus = (attendance) => {
  if (attendance >= 25) return 'success';
  if (attendance >= 15) return 'warning';
  return 'danger';
};

const getProgressVariant = (attendance) => {
  if (attendance >= 25) return 'success';
  if (attendance >= 15) return 'warning';
  return 'danger';
};

export default Monitoring;