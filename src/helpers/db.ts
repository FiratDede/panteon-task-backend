import { Sequelize } from "sequelize";
import { GenericObject, Db } from "../types/types";

let dbEnvVariables: GenericObject =
{
  "DB_NAME": undefined,
  "DB_USERNAME": undefined,
  "DB_PASSWORD": undefined,
  "DB_HOST": undefined,
  "DB_PORT": undefined
}

for (const key in dbEnvVariables) {
  if (dbEnvVariables.hasOwnProperty(key)) {
    const value: any = process.env[key]
    if (value) {
      dbEnvVariables[key] = value
    }
    else {
      throw new Error(
        `${key} env variable not found! This variable is for configuring database.
    Please create .env file according to the format in README file.
    `)
    }
  }
}

let database: Db = {
  dbName: dbEnvVariables["DB_NAME"],
  dbUsername: dbEnvVariables["DB_USERNAME"],
  dbPassword: dbEnvVariables["DB_PASSWORD"],
  dbHost: dbEnvVariables["DB_HOST"],
  dbPort: dbEnvVariables["DB_PORT"]
}

export let sequelize = new Sequelize(database.dbName, database.dbUsername, database.dbPassword, {
  host: database.dbHost,
  dialect: "postgres",
  port: database.dbPort,
  sync: {},
  logging: false,
});

export const sequelizeCheck = async () => {


  await sequelize.authenticate();
  console.log('DB connection has been established successfully.');



}

export async function syncDB() {
  try {
    // Check DB Connection
    await sequelize.authenticate();

    // Sync DB
    await sequelize.sync({}); // Create tables from scratch
    console.log('Db syncronized!');

  } catch (error) {
    console.error('Error:', error);
  }
}

