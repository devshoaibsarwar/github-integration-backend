import mongoose from "mongoose";
import UserRepoDetails from "../models/UserRepoDetails.js";

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

  static getUserRepos({ page = 1, pageSize = 5, syncedUserId = '' }) {
    const repoDetailAggregate = UserRepoDetails.aggregate([
      {
        $match: {
          syncedUserId
        },
      },
      {

        $lookup: {
          from: "repositories",
          let: { repoIdStr: "$repoId" }, 
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", { $toObjectId: "$$repoIdStr" }]  
                }
              }
            }
          ],
          as: "repository"
        },
      },
      { $unwind: { path: "$repository", preserveNullAndEmptyArrays: true } },
    ]);

    return UserRepoDetails.aggregatePaginate(repoDetailAggregate, { page, limit: pageSize });
  }

  static deleteRepository(repoId) {
    return UserRepoDetails.deleteMany({
      repoId: repoId.toString(),
    });
  }
}

export default UserRepoHandler;
