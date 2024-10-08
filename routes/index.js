const express = require("express");
const authRoutes = require("./auth");
const githubIntegrationRoutes = require("./githubIntegration");

const router = express.Router();

router.get("/health-check", function (req, res, next) {
  res.send({ title: "Integrations API is Live!!!" });
});

router.use("/v1/api/auth", authRoutes);
router.use("/v1/api/github-integration", githubIntegrationRoutes);

module.exports = router;
