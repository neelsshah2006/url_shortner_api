const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const userRoutes = require("./routes/user.routes");
const urlRoutes = require("./routes/url.routes");
const redirectRoutes = require("./routes/redirect.routes");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(morgan("dev"));

app.use(cors());

app.set("view engine", "ejs");

app.use("/user", userRoutes);
app.use("/url", urlRoutes);
app.use(redirectRoutes);

module.exports = app;
