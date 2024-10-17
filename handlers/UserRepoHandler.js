const { default: mongoose } = require("mongoose");
const UserRepoDetails = require("../models/UserRepoDetails");

class UserRepoHandler {
  static addNewRecord(repository) {
    const newRecord = new UserRepoDetails({
      ...repository,
      _id: new mongoose.Types.ObjectId(),
    });

    return newRecord.save();
  }

  static updateRecord(detailId, options) {
    return UserRepoDetails.updateOne({ _id: detailId }, options)
  }

  static getRepositories({ userId, page = 1, pageSize = 5 }) {
    const repoDetailAggregate = UserRepoDetails.aggregate([
      {
        $match: {
          userId,
        },
      },
      {
        $lookup: {
          from: "github-integration",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user"
      }
    ]);

    return UserRepoDetails.aggregatePaginate(repoDetailAggregate, { page, limit: pageSize });
  }

  static deleteRepositoryByUserId(userId) {
    return UserRepoDetails.deleteMany({
      userId,
    });
  }

  static deleteRepository(repoId) {
    return UserRepoDetails.deleteMany({
      repoId: repoId.toString(),
    });
  }
}

module.exports = UserRepoHandler;
