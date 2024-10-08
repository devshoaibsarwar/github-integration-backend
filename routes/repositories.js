const express = require("express");
const RepositoryController = require("../controllers/repositories/RepositoryController.js");
const Authentication = require("../middlewares/authentication");
const router = express.Router();

router.get(
  "/",
  Authentication.authenticate,
  RepositoryController.fetchRepositories
);

module.exports = router;
