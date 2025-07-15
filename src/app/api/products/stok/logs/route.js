import { NextResponse } from "next/server";
import pool from "@/app/lib/db";

export async function GET() {
  try {
    const query = `
      SELECT
        sm.id,
        p.name AS product_name,
        sm.movement_type,
        sm.ref_table,
        sm.ref_id,
        sm.qty,
        sm.cost,
        sm.created_at
      FROM stock_movements sm
      JOIN products p ON sm.product_id = p.id
      ORDER BY sm.created_at DESC;
    `;
    const [rows] = await pool.query(query);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch stock movement logs." },
      { status: 500 }
    );
  }
}
