import { query } from "../config/db.mjs";
import { CREATE_USER_QUERY, GET_USER_BY_EMAIL_QUERY, GET_USER_BY_USERID } from "./auth.query.mjs";
import ApiError from "../common/utils/api-error.mjs";
import { generateAccessToken, generateRefreshToken, generateResetToken, verifyAccessToken } from "../common/utils/jwt.utils.mjs";
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

  const user = await query(GET_USER_BY_EMAIL_QUERY, [email]);
  if (!user.rows || user.rows.length === 0) throw ApiError.unauthorized("Invalid Email or password");

  const isMatch = await bcrypt.compare(password, user.rows[0].password);
  if (!isMatch) throw ApiError.unauthorized("Invalid email or password");
  console.log(user.rows);
  const accessToken = generateAccessToken({ id: user.rows[0].id });
  const refreshToken = generateRefreshToken({ id: user.rows[0].id });

  user.refreshToken = hashToken(refreshToken);

  return { user: user.rows[0], accessToken, refreshToken };
};

const logout = async (userId) => {
    const user = await query(GET_USER_BY_USERID,[userId]);
    if (!user.length) throw ApiError.unauthorized("User not found");

};

const getMe = async (userId) => {
  console.log(userId);
  const user = await query(GET_USER_BY_USERID, [userId]);
  if (!user.rows.length) throw ApiError.notfound("User not found");
  return user.rows[0];
};


export { register,login, getMe, logout };
