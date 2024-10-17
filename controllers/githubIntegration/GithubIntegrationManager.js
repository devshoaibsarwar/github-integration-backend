const {
  GithubIntegrationHandler,
  RepositoriesHandler,
} = require("../../handlers");

class GithubIntegrationManager {
  static getUser(user) {
    return GithubIntegrationHandler.getUserDetails({
      _id: user._id,
    });
  }

  static async delete(user) {
    await RepositoriesHandler.deleteRepositoryByUserId(user.userId);
    return GithubIntegrationHandler.deleteUser(user._id);
  }
}

module.exports = GithubIntegrationManager;
