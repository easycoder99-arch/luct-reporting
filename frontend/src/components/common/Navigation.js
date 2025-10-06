import React from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function Navigation() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavItems = () => {
    if (!user) return [];

    const baseItems = [
      { path: '/dashboard', label: 'Dashboard' },
      { path: '/reports', label: 'Reports' },
      { path: '/classes', label: 'Classes' },
      { path: '/monitoring', label: 'Monitoring' },
      { path: '/ratings', label: 'Ratings' }
    ];

    if (user.role === 'lecturer') {
      baseItems.splice(1, 0, { path: '/report-form', label: 'New Report' });
    }

    if (['program_leader', 'principal_lecturer'].includes(user.role)) {
      baseItems.splice(3, 0, { path: '/courses', label: 'Courses' });
    }

    return baseItems;
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          🎓 LUCT Reporting
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          {user ? (
            <>
              <Nav className="me-auto">
                {getNavItems().map(item => (
                  <Nav.Link
                    key={item.path}
                    as={Link}
                    to={item.path}
                    active={location.pathname === item.path}
                    className="fw-medium"
                  >
                    {item.label}
                  </Nav.Link>
                ))}
              </Nav>
              
              <Nav>
                <Dropdown align="end">
                  <Dropdown.Toggle variant="outline-light" id="user-dropdown" className="border-0">
                    👤 {user.name}
                  </Dropdown.Toggle>
                  
                  <Dropdown.Menu className="dark-dropdown">
                    <Dropdown.Header className="text-muted">
                      {user.role.replace('_', ' ').toUpperCase()}
                    </Dropdown.Header>
                    <Dropdown.Item as={Link} to="/dashboard" className="text-light">
                      My Dashboard
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout} className="text-light">
                      🚪 Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav>
            </>
          ) : (
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/login" className="fw-medium">
                Login
              </Nav.Link>
              <Nav.Link as={Link} to="/register" className="fw-medium">
                Register
              </Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;