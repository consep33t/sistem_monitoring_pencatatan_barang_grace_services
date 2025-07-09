import { NextResponse } from "next/server";
import pool from "@/app/lib/db";
import bcrypt from "bcrypt";

// GET employee by id (dengan rolenya)
export async function GET(_, { params }) {
  const { id } = await params;

  try {
    const [employees] = await pool.query(
      `SELECT e.id, e.name, e.email, e.is_active, e.created_at, r.id AS role_id, r.name AS role_name
       FROM employees e
       JOIN employee_roles er ON e.id = er.employee_id
       JOIN roles r ON er.role_id = r.id
       WHERE e.id = ?`,
      [id]
    );

    if (employees.length === 0) {
      return NextResponse.json(
        { success: false, error: "Employee tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: employees[0] });
  } catch (error) {
    console.error("GET /api/employees/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE employee by id
export async function DELETE(_, { params }) {
  const { id } = await params;

  try {
    await pool.query(`DELETE FROM employee_roles WHERE employee_id = ?`, [id]);
    await pool.query(`DELETE FROM employees WHERE id = ?`, [id]);

    return NextResponse.json({
      success: true,
      message: "Employee berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE /api/employees/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT (edit)
export async function PUT(req, { params }) {
  const { id } = await params;

  try {
    const body = await req.json();
    const { name, email, password_hash, is_active, role_id } = body;

    if (!name || !email || !role_id) {
      return NextResponse.json(
        { success: false, error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    // Hash password hanya jika ada perubahan password (tidak kosong)
    let hashedPassword = null;
    if (password_hash && password_hash.trim() !== "") {
      hashedPassword = await bcrypt.hash(password_hash, 10);
    }

    // Update employee (gunakan COALESCE agar jika password tidak diubah, tetap pakai yg lama)
    await pool.query(
      `UPDATE employees 
         SET name = ?, email = ?, 
             password_hash = COALESCE(?, password_hash), 
             is_active = ? 
         WHERE id = ?`,
      [name, email, hashedPassword, is_active, id]
    );

    // Update role
    await pool.query(`DELETE FROM employee_roles WHERE employee_id = ?`, [id]);
    await pool.query(
      `INSERT INTO employee_roles (employee_id, role_id) VALUES (?, ?)`,
      [id, role_id]
    );

    return NextResponse.json({
      success: true,
      message: "Employee berhasil diupdate",
    });
  } catch (error) {
    console.error("PUT /api/employees/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
