const { RepositoriesHandler } = require("../../handlers");

class RepositoryManager {
  static async fetchRepositories(filter) {
    return RepositoriesHandler.getRepositories(filter);
  }
}

module.exports = RepositoryManager;
