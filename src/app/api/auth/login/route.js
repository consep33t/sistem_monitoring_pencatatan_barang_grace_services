import { NextResponse } from "next/server";
import pool from "@/app/lib/db";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

export async function POST(req) {
  const { email, password } = await req.json();

  try {
    const [rows] = await pool.query(
      `SELECT e.id, e.name, e.email, e.password_hash, r.name AS role_name 
       FROM employees e 
       JOIN employee_roles er ON e.id = er.employee_id 
       JOIN roles r ON er.role_id = r.id 
       WHERE e.email = ? LIMIT 1`,
      [email]
    );

    const user = rows[0];
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Password salah" },
        { status: 401 }
      );
    }

    // ✅ Simpan ke cookies
    const cookieStore = await cookies();
    cookieStore.set(
      "session",
      JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role_name: user.role_name,
      }),
      {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 2,
      }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
