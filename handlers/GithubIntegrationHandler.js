import mongoose from "mongoose";
import GithubIntegration from "../models/GithubIntegration.js";

class GithubIntegrationHandler {
  static addNewUser(user) {
    const newUser = new GithubIntegration({
      ...user,
      _id: new mongoose.Types.ObjectId(),
    });

    return newUser.save();
  }

  static getUserDetails(filter = {}) {
    return GithubIntegration.findOne(filter);
  }

  static deleteUser(userId) {
    return GithubIntegration.deleteOne({
      _id: new mongoose.Types.ObjectId(userId),
    });
  }
}

export default GithubIntegrationHandler;
