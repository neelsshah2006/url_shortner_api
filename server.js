const app = require("./app");
const connectDB = require("./db/mongodb.config");

if (
  !process.env.MONGO_URL ||
  !process.env.ACCESS_TOKEN_SECRET ||
  !process.env.REFRESH_TOKEN_SECRET ||
  !process.env.ACCESS_TOKEN_EXPIRY ||
  !process.env.REFRESH_TOKEN_EXPIRY
) {
  console.error("Missing required environment variables.");
  process.exit(1);
}

const port = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server due to DB error:", err);
    process.exit(1);
  });
