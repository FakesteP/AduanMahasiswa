import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelizePg = new Sequelize(
  process.env.PG_DATABASE,
  process.env.PG_USER,
  process.env.PG_PASSWORD,
  {
    host: process.env.PG_HOST,
    port: 5432,
    dialect: "postgres",
    logging: false,
  }
);

export default sequelizePg;
