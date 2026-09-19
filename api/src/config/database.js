import { Sequelize } from "sequelize";
import config from "./index.js";

export const sequelize = new Sequelize(
  config.db.database,
  config.db.username,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: "postgres",
    logging: false,
  }
);
