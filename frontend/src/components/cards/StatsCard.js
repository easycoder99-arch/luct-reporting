import React from 'react';
import { Card } from 'react-bootstrap';

function StatsCard({ title, value, icon, variant = 'primary' }) {
  return (
    <Card className={`border-0 bg-dark text-light`}>
      <Card.Body className="text-center">
        <div className={`text-${variant} mb-2`} style={{ fontSize: '2rem' }}>
          {icon}
        </div>
        <h3 className={`text-${variant}`}>{value}</h3>
        <Card.Title as="h6" className="text-muted">
          {title}
        </Card.Title>
      </Card.Body>
    </Card>
  );
}

export default StatsCard;