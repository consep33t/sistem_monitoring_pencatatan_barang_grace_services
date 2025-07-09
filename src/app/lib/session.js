import { cookies } from "next/headers";
import pool from "./db";

export async function getSessionUser() {
  const session = cookies().get("session");
  if (!session) return null;

  try {
    const sessionData = JSON.parse(session.value);
    const userId = sessionData.id;

    const [rows] = await pool.query(
      `
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
      WHERE e.id = ?
      `,
      [userId]
    );

    if (rows.length === 0) return null;

    return rows[0];
  } catch (error) {
    console.error("Gagal ambil sesi:", error);
    return null;
  }
}
