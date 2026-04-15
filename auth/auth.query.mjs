export const CREATE_USER_QUERY = "INSERT INTO users(name, email, password, verification_token) VALUES($1, $2, $3, $4) RETURNING id, name, email, created_at";

export const GET_USER_BY_EMAIL_QUERY = "SELECT * FROM users WHERE email = $1"

export const GET_USER_BY_USERID = "SELECT id, name, email FROM users WHERE id = $1";

export const UPDATE_REFRESH_TOKEN_QUERY = "UPDATE users SET refresh_token = $1 WHERE id = $2";

