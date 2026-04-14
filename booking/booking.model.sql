CREATE TABLE IF NOT EXISTS seats(
    id SERIAL PRIMARY KEY,
    seat_number TEXT,
    isbooked INT DEFAULT 0,
    name TEXT,
    user_id INT REFERENCES users(id)
)