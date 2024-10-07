const mongoose = require("mongoose");

class MongoDbClient {
  static async connect() {
    return new Promise((resolve, reject) => {
      const connectionString = process.env.MONGO_URI;
      console.log("Connection string::", connectionString);

      mongoose.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      const db = mongoose.connection;

      db.on("error", (error) => reject(error));

      db.once("open", () => {
        console.log("Connected to MongoDB");
        resolve("connected");
      });
    });
  }
}

module.exports = MongoDbClient;
