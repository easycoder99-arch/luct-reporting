import React, { useState } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import RegisterForm from '../components/forms/RegisterForm';

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (formData) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await authService.register(formData);
      setSuccess('Account created successfully! Redirecting to login...');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center align-items-center min-vh-80">
        <Col md={8} lg={6}>
          <Card className="shadow border-0">
            <Card.Header className="text-center bg-success text-white border-0">
              <h4 className="mb-0">Create Account</h4>
              <small>Join LUCT Reporting System</small>
            </Card.Header>
            <Card.Body className="p-4">
              {error && <Alert variant="danger" className="border-0">{error}</Alert>}
              {success && <Alert variant="success" className="border-0">{success}</Alert>}
              
              <RegisterForm onSubmit={handleRegister} loading={loading} />
              
              <div className="text-center mt-3">
                <small className="text-muted">
                  Already have an account? <a href="/login" className="text-info">Sign in here</a>
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;