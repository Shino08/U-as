import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Service = sequelize.define("Service", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: "Duration in minutes",
  },
  category: {
    type: DataTypes.STRING,
  },
  image: {
    type: DataTypes.STRING,
  },
  tag: {
    type: DataTypes.STRING,
  },
  features: {
    type: DataTypes.JSON,
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});
