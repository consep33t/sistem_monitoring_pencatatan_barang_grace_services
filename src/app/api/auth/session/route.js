import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import pool from "@/app/lib/db";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session");
    if (!session) {
      return NextResponse.json(
        { error: "Tidak ada sesi login" },
        { status: 401 }
      );
    }

    let userSession;
    try {
      userSession = JSON.parse(session.value);
    } catch (err) {
      return NextResponse.json({ error: "Sesi tidak valid" }, { status: 400 });
    }

    const userId = userSession.id;

    const [rows] = await pool.query(
      "SELECT id, name, email FROM employees WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error("API /auth/session error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
