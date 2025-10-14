/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */
import mysql from "mysql2";

const AWS = require("aws-sdk");

async function getSecret() {
  // Create a Secrets Manager client
  const client = new AWS.SecretsManager({
    region: process.env.AWS_REGION_NAME,
  });

  try {
    const data = await client
      .getSecretValue({ SecretId: process.env.AWS_SECRET_NAME })
      .promise();
    const secret = JSON.parse(data.SecretString ?? "{}");

    return secret;
    // Your code goes here
  } catch (error) {
    // Handle errors here
  }
}

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || "3306"),
};


export const executeQuery = async (query: string, values?: (string | number)[]) => {
  if (process.env.AWS_SECRET_NAME != undefined && process.env.AWS_REGION_NAME != undefined && process.env.AWS_SECRET_NAME != '' && process.env.AWS_REGION_NAME != '') {
    const dbInfo = await getSecret();
    dbConfig.user = dbInfo.username;
    dbConfig.password = dbInfo.password;
  }

  return new Promise((resolve, reject) => {

    const connection = mysql.createConnection(dbConfig);

    connection.connect((err) => {
      if (err) {
        return reject("Database connection error: " + err.message);
      }

      console.log("Connected to the database.");

      connection.query(query, values, (err, results) => {
        if (err) {
          connection.end();
          return reject(err);
        }

        resolve(results);

        connection.end();
      });
    });
  });
};
