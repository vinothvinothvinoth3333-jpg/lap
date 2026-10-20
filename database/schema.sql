CREATE DATABASE IF NOT EXISTS lab_management
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE lab_management;

CREATE TABLE IF NOT EXISTS laboratories (
  id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  number VARCHAR(50) NOT NULL UNIQUE,
  location VARCHAR(150) NOT NULL,
  capacity INT NOT NULL,
  status ENUM('available', 'unavailable', 'maintenance') NOT NULL DEFAULT 'available',
  description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  eid VARCHAR(20) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  type ENUM('student', 'lecturer') NOT NULL,
  faculty VARCHAR(150) NOT NULL,
  department VARCHAR(150) NOT NULL,
  contact VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS equipment (
  id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  lab_id VARCHAR(20) NOT NULL,
  total INT NOT NULL,
  available INT NOT NULL,
  condition_name ENUM('Good', 'Fair', 'Poor') NOT NULL,
  status ENUM('available', 'unavailable', 'maintenance') NOT NULL DEFAULT 'available',
  notes TEXT NOT NULL,
  CONSTRAINT fk_equipment_lab FOREIGN KEY (lab_id) REFERENCES laboratories(id)
);

CREATE TABLE IF NOT EXISTS bookings (
  id VARCHAR(20) PRIMARY KEY,
  user_eid VARCHAR(20) NOT NULL,
  lab_id VARCHAR(20) NOT NULL,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  purpose VARCHAR(255) NOT NULL,
  status ENUM('pending', 'approved', 'rejected', 'cancelled', 'completed') NOT NULL DEFAULT 'pending',
  created_at DATETIME NOT NULL,
  CONSTRAINT fk_bookings_user FOREIGN KEY (user_eid) REFERENCES users(eid),
  CONSTRAINT fk_bookings_lab FOREIGN KEY (lab_id) REFERENCES laboratories(id),
  CONSTRAINT chk_booking_time CHECK (start_time < end_time),
  INDEX idx_bookings_schedule (lab_id, booking_date, start_time, end_time, status)
);

CREATE TABLE IF NOT EXISTS booking_equipment (
  booking_id VARCHAR(20) NOT NULL,
  equipment_id VARCHAR(20) NOT NULL,
  quantity INT NOT NULL,
  PRIMARY KEY (booking_id, equipment_id),
  CONSTRAINT fk_booking_equipment_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  CONSTRAINT fk_booking_equipment_equipment FOREIGN KEY (equipment_id) REFERENCES equipment(id),
  CONSTRAINT chk_booking_equipment_quantity CHECK (quantity > 0)
);

CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(20) PRIMARY KEY,
  kind ENUM('request', 'approved', 'rejected', 'maintenance') NOT NULL,
  title VARCHAR(200) NOT NULL,
  body TEXT NOT NULL,
  notification_time VARCHAR(50) NOT NULL,
  unread BOOLEAN NOT NULL DEFAULT TRUE
);
