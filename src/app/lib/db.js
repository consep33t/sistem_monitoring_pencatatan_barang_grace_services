const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: process.env.PUBLIC_DB_HOST || "",
  user: process.env.PUBLIC_DB_USER || "",
  password: process.env.PUBLIC_DB_PASSWORD || "",
  database: process.env.PUBLIC_DB_DATABASE || "",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.stack);
    return;
  }
  console.log("Connected to the database as ID", connection.threadId);
});

module.exports = connection;
