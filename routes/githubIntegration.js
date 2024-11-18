import express from "express";
import Authentication from "../middlewares/Authentication.js";
import GithubIntegrationController from "../controllers/githubIntegration/GithubIntegrationController.js";

const router = express.Router();

router.get(
  "/",
  Authentication.authenticate,
  GithubIntegrationController.getUserDetails
);

router.delete(
  "/",
  Authentication.authenticate,
  GithubIntegrationController.deleteUserDetails
);

export default router;
