CREATE DATABASE IF NOT EXISTS testdb;
USE testdb;

CREATE TABLE IF NOT EXISTS your_table (
    id INT PRIMARY KEY,
    name VARCHAR(50),
    value VARCHAR(50)
);

INSERT INTO your_table (id, name, value) VALUES (1, 'Sample Name', 'Sample Value');
INSERT INTO your_table (id, name, value) VALUES (2, 'Sangwoo Lah', 'Manager');
INSERT INTO your_table (id, name, value) VALUES (3, 'Sangchul Lee', 'Manager');
