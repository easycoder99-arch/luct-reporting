import React, { useState } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from '../components/forms/LoginForm';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (formData) => {
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center align-items-center min-vh-80">
        <Col md={6} lg={4}>
          <Card className="shadow border-0">
            <Card.Header className="text-center bg-primary text-white border-0">
              <h4 className="mb-0">LUCT Reporting System</h4>
              <small>Sign in to your account</small>
            </Card.Header>
            <Card.Body className="p-4">
              {error && <Alert variant="danger" className="border-0">{error}</Alert>}
              <LoginForm onSubmit={handleLogin} loading={loading} />
              
              <div className="text-center mt-3">
                <small className="text-muted">
                  Don't have an account? <a href="/register" className="text-info">Register here</a>
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;