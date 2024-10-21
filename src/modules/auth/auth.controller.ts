import { Router } from "express";
import { AuthService } from "./auth.service";
import { AuthenticationMiddleware } from "../../middlewares/authentication.middleware";

const router = Router();

router.get("/user", AuthenticationMiddleware, AuthService.getUser);
router.post("/register", AuthService.registerUser);
router.post("/login", AuthService.loginUser);
router.put("/update-password", AuthService.updatePassword);
router.get("/users", AuthService.getAllUsers);

export const AuthController = router;
