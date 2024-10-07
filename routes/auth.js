const express = require("express");
const AuthController = require("../controllers/auth/AuthController");
const router = express.Router();

router.post("/sign-up", AuthController.signUp);

module.exports = router;
