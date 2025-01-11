import mysql from "mysql2/promise";
import { config } from "../../Config.js";

export const MySqlPool = mysql.createPool(config.database);

const CREATE_DATABASE = `CREATE DATABASE IF NOT EXISTS webpushdemo;`;

const CREATE_USERS_TABLE = `
    CREATE TABLE IF NOT EXISTS users (
        id            VARCHAR(36)                               PRIMARY KEY,
        username      VARCHAR(255)                              NOT NULL,
        subscription  TEXT                                      NULL,
        user_agent    VARCHAR(255)                              NULL,
        created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP   NOT NULL
    );`;

export const initDatabase = async () => {
  // await MySqlPool.execute(CREATE_DATABASE); /* Prodution Server has already a database. */
  await MySqlPool.execute(CREATE_USERS_TABLE);

  console.log("MySQL database initialized successfully.");
};
