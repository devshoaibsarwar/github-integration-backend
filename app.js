import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import logger from "morgan";
import routes from "./routes/index.js";
import MongoDbClient from "./database/index.js";
import dotenv from "dotenv"

dotenv.config();

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
