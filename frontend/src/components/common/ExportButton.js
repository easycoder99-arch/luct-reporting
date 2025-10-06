import React from 'react';
import { Button } from 'react-bootstrap';

function ExportButton({ onExport, disabled = false, variant = "success", size = "md" }) {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onExport}
      disabled={disabled}
    >
      📊 Download to Excel
    </Button>
  );
}

export default ExportButton;