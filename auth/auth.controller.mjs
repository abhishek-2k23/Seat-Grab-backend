import * as authService from "./auth.service.mjs";
import ApiResponse from "../common/utils/api-response.mjs";
import ApiError from "../common/utils/api-error.mjs";
const register = async (req, res) => {
  const user = await authService.register(req.body);
  ApiResponse.created(res, "Registration success", user);
};

const login = async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  ApiResponse.ok(res, "Login successful", { user, accessToken });
};

const logout = async (req, res) => {
  res.clearCookie("refreshToken");
  ApiResponse.ok(res, "Logout Success");
};

const getMe = async (req, res) => {
  const user = await authService.getMe(req.user.id);
  ApiResponse.ok(res, "User Profile", user);
};

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    console.log(token)
    const data = await authService.refresh(token);

    return ApiResponse.ok(res, "Token refreshed", data);
  } catch (err) {
    throw ApiError.forbidden("Invalid refresh token");
  }
};

export { register, login, logout, getMe, refreshToken };
