const Report = require('../models/Report');
const XLSX = require('xlsx');

class ExportController {
    static async exportReports(req, res) {
        try {
            const { startDate, endDate } = req.query;
            const { role, id } = req.user;

            console.log('Export request:', { startDate, endDate, role, id });

            if (!startDate || !endDate) {
                return res.status(400).json({ error: 'Start date and end date are required' });
            }

            const reports = await Report.findByDateRange(startDate, endDate, role === 'lecturer' ? id : null);

            console.log(`Found ${reports.length} reports for export`);

            if (reports.length === 0) {
                return res.status(404).json({ error: 'No reports found for the specified date range' });
            }

            // Format data for Excel
            const data = reports.map(report => ({
                'Date': new Date(report.date_of_lecture).toLocaleDateString(),
                'Faculty': report.faculty_name,
                'Class': report.class_name,
                'Course Code': report.course_code,
                'Course Name': report.course_name,
                'Lecturer': report.lecturer_name || 'N/A',
                'Students Present': report.actual_students_present,
                'Venue': report.venue,
                'Scheduled Time': report.scheduled_lecture_time,
                'Topic': report.topic_taught,
                'Learning Outcomes': report.learning_outcomes,
                'Recommendations': report.recommendations || 'None',
                'Week': report.week_of_reporting
            }));

            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Reports');

            // Auto-size columns
            const colWidths = [
                { wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 12 },
                { wch: 25 }, { wch: 20 }, { wch: 15 }, { wch: 15 },
                { wch: 15 }, { wch: 30 }, { wch: 40 }, { wch: 40 }, { wch: 15 }
            ];
            worksheet['!cols'] = colWidths;

            const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=reports-${startDate}-to-${endDate}.xlsx`);
            res.send(buffer);

        } catch (error) {
            console.error('Export error:', error);
            res.status(500).json({ error: 'Internal server error: ' + error.message });
        }
    }
}

module.exports = ExportController;