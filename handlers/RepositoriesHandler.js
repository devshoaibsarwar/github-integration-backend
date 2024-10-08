const { default: mongoose } = require("mongoose");
const Repository = require("../models/Repository");

class RepositoriesHandler {
  static getRepositories({ userId, page = 1, pageSize = 5 }) {
    const repoDetailAggregate = Repository.aggregate([
      {
        $match: {
          userId,
        },
      },
    ]);

    return Repository.aggregatePaginate(repoDetailAggregate, {
      page,
      limit: pageSize,
    });
  }

  static addRepositories(repos) {
    return Repository.insertMany(repos);
  }

  static deleteRepositoryByUserId(userId) {
    return Repository.deleteMany({
      userId,
    });
  }
}

module.exports = RepositoriesHandler;
