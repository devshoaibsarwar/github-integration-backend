import mongoose from "mongoose";

const githubIntegrationSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    username: {
      type: String,
      unique: false,
    },
    avatar_url: {
      type: String,
      unique: false,
    },
    userId: {
      type: String,
      unique: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("github-integration", githubIntegrationSchema);
