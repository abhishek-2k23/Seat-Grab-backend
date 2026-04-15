import { query } from "../config/db.mjs";
import { CREATE_USER_QUERY, GET_USER_BY_EMAIL_QUERY, GET_USER_BY_USERID, UPDATE_REFRESH_TOKEN_QUERY } from "./auth.query.mjs";
import ApiError from "../common/utils/api-error.mjs";
import { generateAccessToken, generateRefreshToken, generateResetToken, verifyAccessToken, verifyRefreshToken } from "../common/utils/jwt.utils.mjs";
import bcrypt from 'bcrypt';
import crypto from "node:crypto";

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const register = async ({ name, email, password }) => {
  const existing = await query(GET_USER_BY_EMAIL_QUERY, [email]);

  console.log("Existing: ", existing)
  if (existing.rows.length > 0) throw ApiError.conflict("Email already exisits");

  const { rawToken, hashedToken } = generateResetToken();
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await query(CREATE_USER_QUERY, [name, email, hashedPassword, hashedToken])

  console.log("user: ", user);
  return user.rows[0];
};

 const login = async ({ email, password }) => {
  const result = await query(GET_USER_BY_EMAIL_QUERY, [email]);

  if (!result.rows || result.rows.length === 0) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const user = result.rows[0];

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const accessToken = generateAccessToken({ id: user.id });
  const refreshToken = generateRefreshToken({ id: user.id });

  const hashedToken = hashToken(refreshToken);

  await query(
    UPDATE_REFRESH_TOKEN_QUERY,
    [hashedToken, user.id]
  );

  delete user.password;
  delete user.refresh_token;

  return { user, accessToken, refreshToken };
};


const logout = async (userId) => {
  const result = await query(
    "UPDATE users SET refresh_token = NULL WHERE id = $1 RETURNING id",
    [userId]
  );

  if (result.rows.length === 0) {
    throw ApiError.unauthorized("User not found");
  }

  return { message: "Logged out successfully" };
};

const refresh = async (refreshToken) => {
  if (!refreshToken) {
    throw ApiError.unauthorized("Refresh token missing");
  }
  console.log(refreshToken)

  const decoded = verifyRefreshToken(refreshToken);

  const result = await query(
    "SELECT id, refresh_token FROM users WHERE id = $1",
    [decoded.id]
  );

  const user = result.rows[0];
  if (!user) {
    throw ApiError.unauthorized("User not found");
  }

  const hashedToken = hashToken(refreshToken);

  if (user.refresh_token !== hashedToken) {
    throw ApiError.unauthorized("Invalid refresh token");
  }

  const newAccessToken = generateAccessToken({
    id: user.id,
  });

  return { accessToken: newAccessToken };
};

const getMe = async (userId) => {
  console.log(userId);
  const user = await query(GET_USER_BY_USERID, [userId]);
  if (!user.rows.length) throw ApiError.notfound("User not found");
  return user.rows[0];
};


export { register,login, getMe, logout, refresh};
  