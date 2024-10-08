const mongoose = require("mongoose");
// const { default: mongoose } = require("mongoose");
const GithubIntegration = require("../models/githubIntegration");

class GithubIntegrationHandler {
  static addNewUser(user) {
    const newUser = new GithubIntegration({
      ...user,
      _id: new mongoose.Types.ObjectId(),
    });

    return newUser.save();
  }

  static getUserDetails(options = {}) {
    return GithubIntegration.findOne(options);
  }

  static deleteUser(userId) {
    return GithubIntegration.deleteOne({
      _id: new mongoose.Types.ObjectId(userId),
    });
  }
}

module.exports = GithubIntegrationHandler;