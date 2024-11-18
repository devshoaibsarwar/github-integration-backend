import {
  GithubIntegrationHandler,
  RepositoriesHandler,
  UserRepoHandler,
} from "../../handlers/index.js";

class GithubIntegrationManager {
  static getUser(user) {
    return GithubIntegrationHandler.getUserDetails({
      _id: user._id,
    });
  }

  static async delete(user) {
    const repositories = await RepositoriesHandler.getRepositoriesById(
      user.userId
    );
    await RepositoriesHandler.deleteRepositoryByUserId(user.userId);
    for (const repository of repositories) {
      await UserRepoHandler.deleteRepository(repository._id);
    }
    return GithubIntegrationHandler.deleteUser(user._id);
  }
}

export default GithubIntegrationManager;
