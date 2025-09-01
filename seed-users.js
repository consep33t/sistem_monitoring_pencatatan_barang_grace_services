// seed-users.js
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";

async function main() {
  const db = await mysql.createPool({
    host: "localhost",
    user: "root",
    password: "consep33t",
    database: "toko_servis",
  });

  const users = [
    {
      name: "Asep Owner",
      email: "owner@example.com",
      password: "owner123",
      role_id: 1,
    }, // owner
    {
      name: "Dina Admin",
      email: "admin@example.com",
      password: "admin123",
      role_id: 2,
    }, // admin
    {
      name: "Rudi Kasir",
      email: "kasir@example.com",
      password: "kasir123",
      role_id: 3,
    }, // cashier
    {
      name: "Toni Teknisi",
      email: "teknisi@example.com",
      password: "teknisi123",
      role_id: 4,
    }, // technician
  ];

  for (const u of users) {
    const hashed = await bcrypt.hash(u.password, 10);

    // Insert ke employees
    const [result] = await db.query(
      "INSERT INTO employees (name, email, password_hash, is_active, created_at) VALUES (?, ?, ?, 1, NOW())",
      [u.name, u.email, hashed]
    );

    const employeeId = result.insertId;

    // Mapping role ke employee_roles
    await db.query(
      "INSERT INTO employee_roles (employee_id, role_id) VALUES (?, ?)",
      [employeeId, u.role_id]
    );

    console.log(`✅ User ${u.email} ditambahkan dengan role_id ${u.role_id}`);
  }

  await db.end();
}

main().catch((err) => console.error(err));
