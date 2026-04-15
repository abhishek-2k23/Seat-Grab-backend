-- users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  refresh_token TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- seats table
CREATE TABLE IF NOT EXISTS seats (
  id SERIAL PRIMARY KEY,
  seat_number TEXT,
  isbooked INT DEFAULT 0,
  name TEXT,
  user_id INT REFERENCES users(id)
);

-- seed seats
INSERT INTO seats (seat_number)
SELECT chr(row) || col
FROM generate_series(65, 74) AS row,  -- A-J
     generate_series(1, 10) AS col
WHERE NOT EXISTS (SELECT 1 FROM seats);