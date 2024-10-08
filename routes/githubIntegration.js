const express = require("express");
const Authentication = require("../middlewares/authentication");
const GithubIntegrationController = require("../controllers/githubIntegration/GithubIntegrationController");
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

module.exports = router;
