import express from "express";
import AuthController from "../controllers/authController.js";
import { validate } from "../middlewares/validate.js";
import { signupSchema, signinSchema } from "../validators/authSchema.js";

const router = express.Router();

router.post("/signin", validate(signinSchema), AuthController.signin);
router.post("/signup", validate(signupSchema), AuthController.signup);
router.post("/signout", AuthController.signout);

export default router;
