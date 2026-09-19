import { User } from "./User.js";
import { Service } from "./Service.js";
import { Appointment } from "./Appointment.js";
import { Landing } from "./Landing.js";

User.hasMany(Appointment, { foreignKey: "userId" });
Appointment.belongsTo(User, { foreignKey: "userId" });

Service.hasMany(Appointment, { foreignKey: "serviceId" });
Appointment.belongsTo(Service, { foreignKey: "serviceId" });

export { User, Service, Appointment, Landing };
