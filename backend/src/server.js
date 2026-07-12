require("dotenv").config();
const app = require("./app");
const { sequelize } = require("./models");

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established.");

    await sequelize.sync();
    console.log("Database tables synchronized.");

    app.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT} [${process.env.NODE_ENV || "development"}]`,
      );
    });
  } catch (err) {
    console.error("Unable to start server:", err);
    process.exit(1);
  }
};

start();
