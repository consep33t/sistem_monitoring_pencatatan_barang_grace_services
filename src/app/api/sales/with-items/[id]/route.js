import { NextResponse } from "next/server";
import pool from "@/app/lib/db";

export async function GET(request, context) {
  const { id } = await context.params;

  const sql = `
  SELECT
    s.id              AS sales_id,
    s.invoice_no,
    s.customer_id,
    c.name            AS customer_name,
    c.phone           AS customer_phone,
    s.employee_id,
    e.name            AS employee_name,
    s.sub_total,
    s.discount_total,
    s.grand_total,
    s.paid,
    s.notes,
    s.created_at,
    s.payment_method,
    pm.name           AS payment_methods_name,

    /* JSON array berisi barang & jasa */
    JSON_ARRAYAGG(
      JSON_OBJECT(
        'item_type',  si.item_type,
        'item_id',    COALESCE(si.product_id, si.service_id),
        'item_name',  COALESCE(p.name, sc.name),
        'qty',        si.qty,
        'unit_price', si.unit_price,
        'total',      si.total
      )
    ) AS items,

    /* Tambahkan tambahan biaya (jika ada) */
    (
      SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
          'id', ac.id,
          'name', ac.name,
          'cost', ac.cost
        )
      )
      FROM additional_costs ac
      WHERE ac.sales_id = s.id
    ) AS additional_costs

  FROM sales s
  JOIN customers c ON c.id = s.customer_id
  JOIN employees e ON e.id = s.employee_id
  JOIN sales_items si ON si.sales_id = s.id
  LEFT JOIN products p ON p.id = si.product_id
  LEFT JOIN service_catalog sc ON sc.id = si.service_id
  LEFT JOIN payment_methods pm ON pm.id = s.payment_method
  WHERE s.id = ?
  GROUP BY s.id
  LIMIT 1;
`;

  try {
    const [rows] = await pool.query(sql, [id]);
    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Data penjualan tidak ditemukan" },
        { status: 404 }
      );
    }
    return NextResponse.json({ data: rows[0] });
  } catch (err) {
    console.error("Error fetching sales with items by id:", err);
    return NextResponse.json(
      { error: "Gagal mengambil data penjualan" },
      { status: 500 }
    );
  }
}
