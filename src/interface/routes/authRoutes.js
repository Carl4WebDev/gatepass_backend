import { Router } from "express";
import { loginValidation } from "../../interface/middleware/AuthValidation.js";
import { validateRequest } from "../../interface/middleware/ValidateRequest.js";

export default function authRoutes(authController) {
  const router = Router();

  router.post("/login", loginValidation, validateRequest, (req, res) =>
    authController.loginWithRole(req, res, "admin")
  );

  return router;
}
