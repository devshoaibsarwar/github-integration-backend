const express = require("express");
const authRoutes = require("./auth");

const router = express.Router();

router.get("/health-check", function (req, res, next) {
  res.send({ title: "Integrations API is Live!!!" });
});

router.use("/v1/api/auth", authRoutes);

module.exports = router;
