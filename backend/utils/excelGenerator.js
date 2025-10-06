const XLSX = require('xlsx');

class ExcelGenerator {
    static generateReportsExcel(reports) {
        // Format data for Excel
        const data = reports.map(report => ({
            'Date': new Date(report.date_of_lecture).toLocaleDateString(),
            'Faculty': report.faculty_name,
            'Class': report.class_name,
            'Course Code': report.course_code,
            'Course Name': report.course_name,
            'Lecturer': report.lecturer_name,
            'Students Present': report.actual_students_present,
            'Venue': report.venue,
            'Scheduled Time': report.scheduled_lecture_time,
            'Topic': report.topic_taught,
            'Learning Outcomes': report.learning_outcomes,
            'Recommendations': report.recommendations,
            'Week': report.week_of_reporting
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Reports');

        return workbook;
    }
}

module.exports = ExcelGenerator;