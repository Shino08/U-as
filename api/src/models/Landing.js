import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Landing = sequelize.define("Landing", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  section: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  content: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
  },
});
