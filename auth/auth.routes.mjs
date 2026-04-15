import { Router } from "express";
import * as controller from "./auth.controller.mjs";

import RegisterDto from "./dto/register.dto.mjs";
import { authenticate } from "./auth.middleware.mjs";
import LoginDto from "./dto/login.dto.mjs";
import validate from "../common/middleware/validate.middleware.mjs";

const router = Router();

router.post("/register", validate(RegisterDto), controller.register);
router.post("/login", validate(LoginDto), controller.login);
router.post("/logout", controller.logout);
router.post("/refresh-token", controller.refreshToken);
router.get("/me", authenticate, controller.getMe);

export default router;
