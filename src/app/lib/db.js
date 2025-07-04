const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: process.env.DB_HOST || "",
  user: process.env.DB_USER || "",
  port: process.env.DB_PORT || "",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.stack);
    return;
  }
  console.log("Connected to the database as ID", connection.threadId);
});

module.exports = connection;
