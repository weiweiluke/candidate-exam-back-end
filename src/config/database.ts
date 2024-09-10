import { Sequelize } from "sequelize";
import config from "./config";

/**
 * Creates a Sequelize instance and establishes a connection to the database.
 * @module config/database
 */

/**
 * The Sequelize instance representing the database connection.
 * @type {Sequelize}
 */
const sequelize = new Sequelize(
  config.db.database,
  config.db.username,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: "mysql",
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

export default sequelize;
