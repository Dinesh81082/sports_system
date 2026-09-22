-- =============================================
--   Sports Athlete Management System
--   Database Schema + Sample Data
-- =============================================

CREATE DATABASE IF NOT EXISTS sports_mgmt;
USE sports_mgmt;

-- -----------------------
-- Team Table
-- -----------------------
CREATE TABLE IF NOT EXISTS Team (
  Team_id    INT AUTO_INCREMENT PRIMARY KEY,
  Team_name  VARCHAR(100) NOT NULL,
  Coach_name VARCHAR(100),
  Home_ground VARCHAR(100)
);

-- -----------------------
-- Coach Table
-- -----------------------
CREATE TABLE IF NOT EXISTS Coach (
  Coach_id   INT AUTO_INCREMENT PRIMARY KEY,
  Coach_name VARCHAR(100) NOT NULL,
  Team_id    INT,
  Age        INT,
  Experience INT,
  FOREIGN KEY (Team_id) REFERENCES Team(Team_id) ON DELETE SET NULL
);

-- -----------------------
-- Players Table
-- -----------------------
CREATE TABLE IF NOT EXISTS Players (
  PLY_id   INT AUTO_INCREMENT PRIMARY KEY,
  PLY_name VARCHAR(100) NOT NULL,
  Team_id  INT,
  Position VARCHAR(50),
  FOREIGN KEY (Team_id) REFERENCES Team(Team_id) ON DELETE SET NULL
);

-- -----------------------
-- Matches Table
-- -----------------------
CREATE TABLE IF NOT EXISTS Matches (
  Match_id     INT AUTO_INCREMENT PRIMARY KEY,
  Ground       VARCHAR(100),
  date         DATETIME,
  Home_team_id INT,
  Away_team_id INT,
  FOREIGN KEY (Home_team_id) REFERENCES Team(Team_id) ON DELETE SET NULL,
  FOREIGN KEY (Away_team_id) REFERENCES Team(Team_id) ON DELETE SET NULL
);

-- -----------------------
-- Score Table
-- -----------------------
CREATE TABLE IF NOT EXISTS Score (
  Score_id   INT AUTO_INCREMENT PRIMARY KEY,
  Match_id   INT,
  Win_team   INT,
  Home_Score INT,
  Away_Score INT,
  FOREIGN KEY (Match_id) REFERENCES Matches(Match_id) ON DELETE CASCADE,
  FOREIGN KEY (Win_team) REFERENCES Team(Team_id) ON DELETE SET NULL
);

-- =============================================
--   Sample Data
-- =============================================

INSERT INTO Team (Team_name, Coach_name, Home_ground) VALUES
('Mumbai Warriors',  'Rahul Sharma',  'Wankhede Stadium'),
('Delhi Dynamos',    'Suresh Patel',  'Feroz Shah Kotla'),
('Chennai Kings',    'Anil Kumar',    'Chepauk Stadium'),
('Kolkata Knights',  'Vijay Singh',   'Eden Gardens');

INSERT INTO Coach (Coach_name, Team_id, Age, Experience) VALUES
('Rahul Sharma', 1, 48, 15),
('Suresh Patel', 2, 52, 20),
('Anil Kumar',   3, 45, 12),
('Vijay Singh',  4, 55, 22);

INSERT INTO Players (PLY_name, Team_id, Position) VALUES
('Rohit Verma',   1, 'Forward'),
('Amit Tiwari',   1, 'Midfielder'),
('Sanjay Gupta',  2, 'Defender'),
('Ravi Kapoor',   2, 'Goalkeeper'),
('Arjun Nair',    3, 'Forward'),
('Karan Mehta',   3, 'Midfielder'),
('Dev Sharma',    4, 'Defender'),
('Nikhil Joshi',  4, 'Forward');

INSERT INTO Matches (Ground, date, Home_team_id, Away_team_id) VALUES
('Wankhede Stadium',  '2025-03-10 15:00:00', 1, 2),
('Chepauk Stadium',   '2025-03-15 17:00:00', 3, 4),
('Eden Gardens',      '2025-03-20 16:00:00', 4, 1),
('Feroz Shah Kotla',  '2025-03-25 18:00:00', 2, 3);

INSERT INTO Score (Match_id, Win_team, Home_Score, Away_Score) VALUES
(1, 1, 3, 1),
(2, 3, 2, 0),
(3, 1, 1, 2),
(4, 2, 4, 2);
