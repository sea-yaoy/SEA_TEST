/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */
import mysql from "mysql2"
import { readFileSync } from "fs"

const mysqlSSH = require("mysql-ssh")
const AWS = require("aws-sdk")

const sshTunnelConfig = {
  host: process.env.SSH_HOST,
  port: process.env.SSH_PORT,
  username: process.env.SSH_USER,
  privateKey: readFileSync("services/config/id_rsa_sbi_dev"),
}

async function getSecret() {
  // Create a Secrets Manager client
  const client = new AWS.SecretsManager({
    region: process.env.AWS_REGION_NAME,
  })

  try {
    const data = await client
      .getSecretValue({ SecretId: process.env.AWS_SECRET_NAME })
      .promise()
    const secret = JSON.parse(data.SecretString ?? "{}")

    return secret
    // Your code goes here
  } catch (error) {
    // Handle errors here
  }
}

export const executeQuery = async (
  query: string,
  values?: (string | number)[],
) => {
  const dbInfo = await getSecret()
  const db = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: dbInfo.username,
    password: dbInfo.password,
  }

  return new Promise((resolve, reject) => {
    mysqlSSH.connect(sshTunnelConfig, db).then((client: mysql.Connection) => {
      client.query(query, values, (err, results) => {
        if (err) reject(err)
        resolve(results)
        mysqlSSH.close()
      })
    })
  })
}
