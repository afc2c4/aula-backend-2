const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const { configurePassport } = require("./config/passport");
const { requestLogger } = require("./middlewares/requestLogger");
const { errorHandler } = require("./middlewares/errorHandler");
const { authRoutes } = require("./routes/authRoutes");
const { userRoutes } = require("./routes/userRoutes");
const { productRoutes } = require("./routes/productRoutes");
const { orderRoutes } = require("./routes/orderRoutes");

const app = express();

configurePassport();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);
app.use(morgan("dev"));
app.use(requestLogger);
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "super-secret-session",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 2
    }
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.use(errorHandler);

module.exports = {
  app
};
