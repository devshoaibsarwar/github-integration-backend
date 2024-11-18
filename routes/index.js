import express from "express";
import authRoutes from "./auth.js";
import githubIntegrationRoutes from "./githubIntegration.js";
import repositoriesRoutes from "./repositories.js";

const router = express.Router();

router.get("/health-check", function (req, res, next) {
  res.send({ title: "Integrations API is Live!!!" });
});

router.use("/v1/api/auth", authRoutes);
router.use("/v1/api/github-integration", githubIntegrationRoutes);
router.use("/v1/api/repositories", repositoriesRoutes);

export default router;
