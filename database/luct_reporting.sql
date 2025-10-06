-- Create database
CREATE DATABASE IF NOT EXISTS luct_reporting;
USE luct_reporting;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'lecturer', 'principal_lecturer', 'program_leader') NOT NULL,
    name VARCHAR(255) NOT NULL,
    faculty VARCHAR(255),
    department VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_code VARCHAR(50) UNIQUE NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    program_leader_id INT,
    faculty VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (program_leader_id) REFERENCES users(id)
);

-- Classes table
CREATE TABLE IF NOT EXISTS classes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    class_name VARCHAR(255) NOT NULL,
    course_id INT,
    lecturer_id INT,
    total_registered_students INT DEFAULT 0,
    venue VARCHAR(255),
    scheduled_time TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (lecturer_id) REFERENCES users(id)
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    faculty_name VARCHAR(255) NOT NULL,
    class_id INT,
    week_of_reporting VARCHAR(50) NOT NULL,
    date_of_lecture DATE NOT NULL,
    course_id INT,
    lecturer_id INT,
    actual_students_present INT NOT NULL,
    venue VARCHAR(255) NOT NULL,
    scheduled_lecture_time TIME NOT NULL,
    topic_taught TEXT NOT NULL,
    learning_outcomes TEXT NOT NULL,
    recommendations TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (lecturer_id) REFERENCES users(id)
);

-- Insert sample data

-- Users (password: password123)
INSERT INTO users (email, password, role, name, faculty, department) VALUES
('student@luct.ac.mu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'John Student', 'ICT', 'Information Technology'),
('lecturer@luct.ac.mu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'lecturer', 'Dr. Jane Lecturer', 'ICT', 'Information Technology'),
('prl@luct.ac.mu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'principal_lecturer', 'Prof. Mark PRL', 'ICT', 'Business Information Technology'),
('pl@luct.ac.mu', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'program_leader', 'Dr. Sarah PL', 'ICT', 'Information Technology');

-- Courses
INSERT INTO courses (course_code, course_name, program_leader_id, faculty) VALUES
('DIT101', 'Introduction to Programming', 4, 'ICT'),
('DIT102', 'Web Development Fundamentals', 4, 'ICT'),
('DBIT201', 'Business Systems Analysis', 4, 'ICT'),
('DBIT202', 'Database Management', 4, 'ICT'),
('BBIT301', 'Advanced Database Systems', 4, 'ICT'),
('BBIT302', 'Software Engineering', 4, 'ICT');

-- Classes
INSERT INTO classes (class_name, course_id, lecturer_id, total_registered_students, venue, scheduled_time) VALUES
('DIT101-01', 1, 2, 25, 'ICT Lab 1', '08:00:00'),
('DIT101-02', 1, 2, 30, 'ICT Lab 2', '10:00:00'),
('DIT102-01', 2, 2, 28, 'Room 201', '09:00:00'),
('DBIT201-01', 3, 2, 22, 'Room 305', '11:00:00'),
('BBIT301-01', 5, 2, 20, 'ICT Lab 3', '14:00:00');

-- Sample reports
INSERT INTO reports (faculty_name, class_id, week_of_reporting, date_of_lecture, course_id, lecturer_id, actual_students_present, venue, scheduled_lecture_time, topic_taught, learning_outcomes, recommendations) VALUES
('ICT', 1, 'Week 1, Semester 1', '2024-01-15', 1, 2, 23, 'ICT Lab 1', '08:00:00', 'Introduction to Python Programming', 'Students should be able to write basic Python scripts and understand programming fundamentals', 'More practice exercises needed for beginners'),
('ICT', 1, 'Week 2, Semester 1', '2024-01-22', 1, 2, 24, 'ICT Lab 1', '08:00:00', 'Python Functions and Modules', 'Students should understand function definition, parameters, and module imports', 'Group projects will help students collaborate'),
('ICT', 3, 'Week 1, Semester 1', '2024-01-16', 2, 2, 26, 'Room 201', '09:00:00', 'HTML and CSS Basics', 'Students should be able to create basic web pages with proper structure and styling', 'Need to cover responsive design in next class');

SELECT 'Database setup completed successfully!' as status;