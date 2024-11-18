import mongoose from "mongoose";
import Repository from "../models/Repository.js";

class RepositoriesHandler {
  static getRepositories({ userId, page = 1, pageSize = 5 }) {
    const repoDetailAggregate = Repository.aggregate([
      {
        $match: {
          userId: userId,
        },
      },
      {
        $addFields: {
          repoIdString: { $toString: "$_id" },
        },
      },
      {
        $lookup: {
          from: "user-repositories",
          localField: "repoIdString",
          foreignField: "repoId",
          as: "userRepoDetails",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          url: 1,
          userId: 1,
          username: 1,
          isIncluded: 1,
          userRepoDetails: 1,
        },
      },
    ]);

    return Repository.aggregatePaginate(repoDetailAggregate, {
      page,
      limit: pageSize,
    });
  }

  static update(id, option) {
    return Repository.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id) },
      option
    );
  }

  static getRepositoriesById(userId) {
    return Repository.find({
      userId: userId,
    })
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

export default RepositoriesHandler;
