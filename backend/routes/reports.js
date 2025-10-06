const express = require('express');
const ReportController = require('../controllers/reportController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateToken, authorizeRoles('lecturer'), ReportController.createReport);
router.get('/', authenticateToken, ReportController.getReports);
router.get('/:id', authenticateToken, ReportController.getReportById);

module.exports = router;