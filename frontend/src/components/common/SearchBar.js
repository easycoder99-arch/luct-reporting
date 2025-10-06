import React, { useState } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';

function SearchBar({ onSearch, placeholder = "Search...", size = "md" }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup size={size}>
        <Form.Control
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="outline-secondary" type="submit">
          🔍
        </Button>
        {searchTerm && (
          <Button variant="outline-danger" onClick={handleClear}>
            ✕
          </Button>
        )}
      </InputGroup>
    </Form>
  );
}

export default SearchBar;