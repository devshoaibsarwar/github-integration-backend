const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');

const userRepositoriesSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    userId: {
      type: String,
    },
    username: {
      type: String,
    },
    repoId: {
      type: String,
    },
    totalCommits: {
      type: Number
    },
    totalIssues: {
      type: Number
    },
    totalPRs: {
      type: Number
    },
    status: {
      type: String,
      enum : ['SYNCING', 'FAILED', 'SYNCED'],
      default: 'SYNCING'
    },
  },
  { timestamps: true }
);

userRepositoriesSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("user-repositories", userRepositoriesSchema);
