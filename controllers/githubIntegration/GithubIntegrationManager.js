const {
  GithubIntegrationHandler,
  UserRepoHandler,
  RepositoriesHandler,
} = require("../../handlers");
const GithubService = require("../../services/github");

class GithubIntegrationManager {
  static getUser(user) {
    return GithubIntegrationHandler.getUserDetails({
      _id: user._id,
    });
  }

  static async delete(user) {
    await GithubService.revokeUserAccess(user.token);
    await RepositoriesHandler.deleteRepositoryByUserId(user.userId);
    return GithubIntegrationHandler.deleteUser(user._id);
  }
}

module.exports = GithubIntegrationManager;
