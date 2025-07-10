// app/api/products/search/[name]/route.js
import { NextResponse } from "next/server";
import pool from "@/app/lib/db";

export const GET = async (_req, ctx) => {
  const { name } = await ctx.params;

  try {
    const keyword = `%${name}%`;

    const [rows] = await pool.query(
      `SELECT p.*, pi.image_url
       FROM products p
       LEFT JOIN product_images pi
         ON pi.product_id = p.id AND pi.is_main = 1
       WHERE p.name LIKE ? COLLATE utf8mb4_general_ci`,
      [keyword]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error("Database error:", err);
    return NextResponse.json(
      { error: "Gagal mengambil produk" },
      { status: 500 }
    );
  }
};
