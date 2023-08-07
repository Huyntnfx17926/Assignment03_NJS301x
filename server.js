const path = require("path");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
require("dotenv").config();

const server = express();

const authRouter = require("./routers/auth");
const userRouter = require("./routers/user");
const adminRouter = require("./routers/admin");
const socket = require("./socket");

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flag: "a" }
);

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mineType === "image/png" ||
    file.mineType === "image/jpg" ||
    file.mineType === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

server.use(cors());
server.use(
  express.json({
    type: ["application/json"],
  })
);

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(helmet());
server.use(compression());
server.use(morgan("combined", { stream: accessLogStream }));
server.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).array("images")
);
server.use("/images", express.static(path.join(__dirname, "images")));

const MONGO_URI =
  "mongodb+srv://admin:Huynguyen@atlascluster.syfs4fj.mongodb.net/asm3";

server.use(authRouter);
server.use(userRouter);
server.use("/admin", adminRouter);

// Handling errors
server.use((err, req, res, next) => {
  console.log(err);
  const status = err.statusCode || 500;
  const message = err.message;
  const data = err.data;
  res.status(status).json({ msg: message, data: data });
});

// Connect Mongooes
mongoose
  .connect(MONGO_URI)
  .then((result) => {
    const app = server.listen(process.env.PORT || 5000);
    const io = require("./socket").init(app);
    io.on("connection", (socket) => {
      console.log("Connected!!");
    });
  })
  .catch((err) => {
    console.log(err);
  });
