import express from "express";
import AuthController from "../controllers/auth/AuthController.js";

const router = express.Router();

router.post("/sign-up", AuthController.signUp);

export default router;
