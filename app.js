const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const logger = require("morgan");

const routes = require("./routes");

const MongoDbClient = require("./database");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const startServer = async () => {
  try {
    console.log("connecting with database...");
    await MongoDbClient.connect();
    console.log("Database successfully connected");
  } catch (error) {
    console.log("Database Connection Error", error);

    process.exit(1);
  }

  const server = http.createServer(app);

  server.listen(PORT, (err) => {
    if (err) {
      return console.log("ERR:: launching server ", err);
    }

    console.log(`API server is live at localhost:`, PORT);
  });
};

app.use("/", routes);

app.on('uncaughtException', (error) => {
  console.log("[UNCAUGHT EXCEPTION]:: Uncaught exception occurs", error)
});

startServer();
