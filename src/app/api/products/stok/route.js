import { NextResponse } from "next/server";
import pool from "@/app/lib/db";

export async function GET() {
  try {
    const query = `
      SELECT
        p.id,
        p.name,
        p.sku,
        COALESCE(SUM(sm.qty), 0) AS stock_available
      FROM products p
      LEFT JOIN stock_movements sm ON p.id = sm.product_id
      GROUP BY p.id, p.name, p.sku
      ORDER BY p.name ASC;
    `;
    const [rows] = await pool.query(query);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { product_id, qty, cost = null } = await req.json();

    if (!product_id || qty === undefined) {
      return NextResponse.json(
        { success: false, error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    await pool.query(
      `INSERT INTO stock_movements 
       (product_id, movement_type, ref_table, ref_id, qty, cost, created_at) 
       VALUES (?, 'adjust', 'manual', NULL, ?, ?, NOW())`,
      [product_id, qty, cost]
    );

    return NextResponse.json({
      success: true,
      message: "Stok berhasil ditambahkan",
    });
  } catch (error) {
    console.error("POST /api/stock/adjust error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    const { product_id, qty, cost = null } = await req.json();

    if (!product_id || qty === undefined || typeof qty !== "number") {
      return NextResponse.json(
        { success: false, error: "Data tidak lengkap atau salah" },
        { status: 400 }
      );
    }

    // Buat penyesuaian stok (positif atau negatif)
    await pool.query(
      `INSERT INTO stock_movements 
       (product_id, movement_type, ref_table, ref_id, qty, cost, created_at) 
       VALUES (?, 'adjust', 'manual', NULL, ?, ?, NOW())`,
      [product_id, qty, cost]
    );

    return NextResponse.json({
      success: true,
      message: "Stok berhasil disesuaikan",
    });
  } catch (error) {
    console.error("PATCH /api/stock/adjust error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
