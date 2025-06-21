const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const requestIp = require("request-ip");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const urlRoutes = require("./routes/url.routes");
const redirectRoutes = require("./routes/redirect.routes");

const errorHandler = require("./middleware/errorHandler.middleware");
const { AppError } = require("./utils/appError.util");
const authMiddleware = require("./middleware/auth.middleware");

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(helmet());
app.use(requestIp.mw());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const corsOptions = process.env.FRONTEND_URL
  ? {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    }
  : {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    };

app.use(cors(corsOptions));

app.set("view engine", "ejs");
app.set("trust proxy", true);

app.use("/auth", authRoutes);
app.use("/user", authMiddleware, userRoutes);
app.use("/url", authMiddleware, urlRoutes);
app.use(redirectRoutes);

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(errorHandler);

module.exports = app;
