const express = require('express');
const Report = require('../models/Report');
const ExcelGenerator = require('../utils/excelGenerator');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Export reports to Excel
router.get('/reports', authenticateToken, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const { role, id } = req.user;

        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'Start date and end date are required' });
        }

        const reports = await Report.findByDateRange(startDate, endDate, role === 'lecturer' ? id : null);

        if (reports.length === 0) {
            return res.status(404).json({ error: 'No reports found for the specified date range' });
        }

        const workbook = ExcelGenerator.generateReportsExcel(reports);
        
        const buffer = require('xlsx').write(workbook, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=reports-${startDate}-to-${endDate}.xlsx`);
        res.send(buffer);
    } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;