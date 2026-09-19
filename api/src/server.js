import app from "./app.js";
import config from "./config/index.js";
import { sequelize } from "./config/database.js";

const PORT = config.port || 3000;

async function main() {
  try {
    await sequelize.authenticate();
    console.log("Database connected");
    await sequelize.sync({ alter: true });
    console.log("Models synced");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to database:", error);
    process.exit(1);
  }
}

main();
