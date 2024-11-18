import mongoose from "mongoose";
import mongoosePaginate from "mongoose-aggregate-paginate-v2";

const repositoriesSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    userId: {
      type: String,
    },
    repoId: {
      type: String,
    },
    description: {
      type: String,
    },
    name: {
      type: String,
      unique: false,
    },
    slug: {
      type: String,
      unique: false,
    },
    url: {
      type: String,
      unique: false,
    },
    username: {
      type: String,
    },
    isIncluded: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

repositoriesSchema.plugin(mongoosePaginate);

export default mongoose.model("repositories", repositoriesSchema);
