USE lab_management;

INSERT INTO laboratories (id, name, number, location, capacity, status, description) VALUES
('LAB-001', 'Nanotechnology Laboratory', 'B2-104', 'Science Block B, Level 2', 24, 'available', 'Equipped for nanoscale materials characterisation, with a clean bench and fume hood.'),
('LAB-002', 'Biology Laboratory', 'A1-012', 'Science Block A, Ground Floor', 40, 'available', 'General biology teaching laboratory used for undergraduate practical sessions.'),
('LAB-003', 'Organic Chemistry Laboratory', 'C3-301', 'Chemistry Wing C, Level 3', 32, 'maintenance', 'Wet chemistry laboratory. Currently closed for ventilation system servicing.'),
('LAB-004', 'Physics Laboratory', 'D1-110', 'Engineering Block D, Level 1', 30, 'available', 'Mechanics, optics and electromagnetism experiments.'),
('LAB-005', 'Computer Laboratory 1', 'E2-205', 'IT Building E, Level 2', 60, 'available', '60 workstations with development and simulation software.'),
('LAB-006', 'Microbiology Laboratory', 'A2-118', 'Science Block A, Level 2', 20, 'unavailable', 'Biosafety Level 2 laboratory. Reserved for research use only this week.'),
('LAB-007', 'Electronics Laboratory', 'D2-214', 'Engineering Block D, Level 2', 36, 'available', 'Circuit design, PCB prototyping and embedded systems benches.'),
('LAB-008', 'Analytical Chemistry Laboratory', 'C2-210', 'Chemistry Wing C, Level 2', 28, 'available', 'Spectroscopy and chromatography instruments for analytical work.'),
('LAB-009', 'Robotics Laboratory', 'E3-310', 'IT Building E, Level 3', 18, 'available', 'Robot arms, mobile platforms and a motion-capture test area.'),
('LAB-010', 'Environmental Science Laboratory', 'B1-020', 'Science Block B, Ground Floor', 26, 'available', 'Soil, water and air quality testing.')
ON DUPLICATE KEY UPDATE name = VALUES(name), status = VALUES(status), description = VALUES(description);

INSERT INTO users (eid, name, type, faculty, department, contact) VALUES
('E20210451', 'Amara Perera', 'student', 'Faculty of Science', 'Chemistry', '+94 77 123 4567'),
('E20200132', 'Kasun Jayasinghe', 'student', 'Faculty of Engineering', 'Electrical Engineering', '+94 71 987 6543'),
('L10000231', 'Dr. Nirmala Fernando', 'lecturer', 'Faculty of Science', 'Biology', '+94 11 234 5678'),
('L10000087', 'Prof. Ranjith Silva', 'lecturer', 'Faculty of Science', 'Physics', '+94 11 876 5432'),
('E20220874', 'Dilini Wickramasinghe', 'student', 'Faculty of Science', 'Microbiology', '+94 76 555 0192'),
('E20190319', 'Tharindu Bandara', 'student', 'Faculty of Computing', 'Computer Science', '+94 70 220 3311'),
('L10000412', 'Dr. Sanduni Rathnayake', 'lecturer', 'Faculty of Computing', 'Robotics & AI', '+94 11 445 6677'),
('E20230015', 'Ishara Gunawardena', 'student', 'Faculty of Engineering', 'Electronics', '+94 75 334 8890'),
('L10000158', 'Dr. Mahesh Kumara', 'lecturer', 'Faculty of Science', 'Environmental Science', '+94 11 998 7766'),
('E20210902', 'Nethmi Abeysekara', 'student', 'Faculty of Science', 'Nanotechnology', '+94 72 110 4455')
ON DUPLICATE KEY UPDATE name = VALUES(name), contact = VALUES(contact);

INSERT INTO equipment (id, name, lab_id, total, available, condition_name, status, notes) VALUES
('EQ-001', 'Microscope', 'LAB-002', 5, 4, 'Good', 'available', 'One unit reserved for demonstration.'),
('EQ-002', 'Centrifuge', 'LAB-002', 2, 2, 'Good', 'available', ''),
('EQ-003', 'Spectrophotometer', 'LAB-008', 1, 0, 'Fair', 'maintenance', 'Lamp replacement scheduled 12 Sep.'),
('EQ-004', 'Analytical Balance', 'LAB-008', 3, 3, 'Good', 'available', ''),
('EQ-005', 'Atomic Force Microscope', 'LAB-001', 1, 1, 'Good', 'available', 'Requires trained supervisor.'),
('EQ-006', 'Fume Hood', 'LAB-001', 2, 2, 'Good', 'available', ''),
('EQ-007', 'Oscilloscope', 'LAB-007', 12, 10, 'Good', 'available', ''),
('EQ-008', 'Soldering Station', 'LAB-007', 15, 15, 'Fair', 'available', ''),
('EQ-009', 'Autoclave', 'LAB-006', 1, 0, 'Poor', 'unavailable', 'Pressure valve fault reported.'),
('EQ-010', 'Laser Interferometer', 'LAB-004', 2, 2, 'Good', 'available', ''),
('EQ-011', 'Robotic Arm (6-DOF)', 'LAB-009', 4, 3, 'Good', 'available', ''),
('EQ-012', 'Water Quality Kit', 'LAB-010', 6, 6, 'Good', 'available', ''),
('EQ-013', 'Rotary Evaporator', 'LAB-003', 2, 0, 'Fair', 'maintenance', 'Lab under maintenance.')
ON DUPLICATE KEY UPDATE available = VALUES(available), status = VALUES(status), notes = VALUES(notes);

INSERT INTO notifications (id, kind, title, body, notification_time, unread) VALUES
('N1', 'request', 'New booking request', 'Ishara Gunawardena requested Electronics Laboratory on 10 Sep, 14:00-16:00.', '5 min ago', TRUE),
('N2', 'request', 'New booking request', 'Dr. Sanduni Rathnayake requested Robotics Laboratory on 10 Sep, 09:00-12:00.', '38 min ago', TRUE),
('N3', 'maintenance', 'Laboratory maintenance update', 'Organic Chemistry Laboratory ventilation servicing extended to 12 Sep.', '2 h ago', TRUE),
('N4', 'approved', 'Booking approved', 'B015 for Analytical Chemistry Laboratory was approved by S. Weerasinghe.', 'Yesterday', FALSE),
('N5', 'rejected', 'Booking rejected', 'B009 was rejected: laboratory under maintenance.', 'Yesterday', FALSE)
ON DUPLICATE KEY UPDATE unread = VALUES(unread), body = VALUES(body);
