import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Appointment = sequelize.define("Appointment", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  clientName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  clientEmail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  clientPhone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  serviceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  notes: {
    type: DataTypes.TEXT,
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  addons: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("pending", "confirmed", "cancelled", "completed"),
    defaultValue: "pending",
  },
  paid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});
