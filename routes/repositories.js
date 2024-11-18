import express from "express";
import RepositoryController from "../controllers/repositories/RepositoryController.js";
import Authentication from "../middlewares/Authentication.js";
const router = express.Router();

router.get(
  "/",
  Authentication.authenticate,
  RepositoryController.fetchRepositories
);
router.put('/:id', Authentication.authenticate, RepositoryController.addRepositoriesDetail);
router.get('/details', Authentication.authenticate, RepositoryController.fetchRepositoriesDetail);

export default router;
