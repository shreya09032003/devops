CREATE DATABASE IF NOT EXISTS myapp;

-- Update the root user's password and privileges
ALTER USER 'root'@'%' IDENTIFIED BY 'rootpassword';
GRANT ALL PRIVILEGES ON myapp.* TO 'root'@'%';
FLUSH PRIVILEGES;
