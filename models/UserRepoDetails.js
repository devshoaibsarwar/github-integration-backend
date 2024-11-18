import mongoose from "mongoose";

import mongoosePaginate from 'mongoose-aggregate-paginate-v2';

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
    syncedUserId: {
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

export default mongoose.model("user-repositories", userRepositoriesSchema);
