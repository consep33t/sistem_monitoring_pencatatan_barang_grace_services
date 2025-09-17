import { NextResponse } from "next/server";
import pool from "@/app/lib/db";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT 
        e.id AS employee_id,
        e.name AS employee_name,
        e.email,
        e.is_active,
        e.created_at,
        r.id AS role_id,
        r.name AS role_name
      FROM employees e
      JOIN employee_roles er ON e.id = er.employee_id
      JOIN roles r ON er.role_id = r.id
      ORDER BY e.id ASC
    `);

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("GET /api/employees error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password_hash, is_active = 1, role_id } = body;

    if (!name || !email || !password_hash || !role_id) {
      return NextResponse.json(
        { success: false, error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    // Cek apakah email sudah digunakan
    const [check] = await pool.query(
      "SELECT id FROM employees WHERE email = ?",
      [email]
    );
    if (check.length > 0) {
      return NextResponse.json(
        { success: false, error: "Email sudah digunakan" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password_hash, 10);

    // Tambahkan ke employees
    const [employeeResult] = await pool.query(
      `INSERT INTO employees (name, email, password_hash, is_active, created_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [name, email, hashedPassword, is_active]
    );

    const employeeId = employeeResult.insertId;

    // Simpan ke employee_roles
    await pool.query(
      `INSERT INTO employee_roles (employee_id, role_id) VALUES (?, ?)`,
      [employeeId, role_id]
    );

    return NextResponse.json({
      success: true,
      message: "Akun berhasil ditambahkan",
      employee_id: employeeId,
    });
  } catch (error) {
    console.error("POST /api/employees error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
