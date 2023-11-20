import dotenv, { config } from "dotenv";
import http from "http";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import userRoute from "./src/router/index.js";
import Logger from "./src/utils/loggers.js";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
// import cors from 'cors';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const logger = new Logger().createMyLogger("ServerFile");


dotenv.config();

const app = express();
app.use(cors());
let dbUrl = process.env.ATLAS;
try{
  mongoose.connect(dbUrl);
}
catch(e){ 
  console.log(e);
}

/**
 * General Middleware
*/
// app.use(express.static(path.join(__dirname, 'www')));
// app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));
// app.use(express.json());
app.use(cors({ origin: '*' }));

/** Security middleware to prevent access by IP */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  logger.info(
    `Request received : ${req.protocol}://${req.get("host")}${req.originalUrl}`
  );
  let requestURL = req.get("host");
  // if (requestURL) {
  //   if (requestURL.includes("143.244.137.66")) {
  //     logger.warn(
  //       "Someone tried accessing your server with IP, IP of user " + req.ip
  //     );
  //     logger.warn(JSON.stringify(req.headers));
  //     // return res.end("");
  //     return res.status(404).json({ message: "NO IP ACCESS ALLOWED" });
  //   } else {
  //     next();
  //   }
  // } else {
  next();
  // }
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization,Origin, X-Requested-With, Content-Type, Accept, multipart/form-data"
  );
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    return res.status(200).json({});
  }
  next();
});

/**27017
 * Routes
 */
app.use(express.static(path.join(__dirname, "/build")));
app.get("/web/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.use("/api/", userRoute);
/**
 * Error Handling
 */
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(
    `Cannot find requested resource :${req.protocol}://${req.get("host")}${req.originalUrl
    }`
  );
});

app.use((error, req, res) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

const port = process.env.PORT;
global.httpServer = http.createServer(app);

httpServer.listen(port, function () {
  logger.info(`Server started listening on ${port}`);
});
