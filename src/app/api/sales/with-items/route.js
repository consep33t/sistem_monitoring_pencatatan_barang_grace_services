import { NextResponse } from "next/server";
import connection from "@/app/lib/db";

/*  GET /api/sales/with-items
    Mengembalikan list seluruh sales + barang dan jasa di dalamnya
*/
export async function GET() {
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
  ) AS items

FROM sales s
JOIN customers        c  ON c.id = s.customer_id
JOIN employees        e  ON e.id = s.employee_id
JOIN sales_items      si ON si.sales_id = s.id
LEFT JOIN products         p  ON p.id  = si.product_id
LEFT JOIN service_catalog  sc ON sc.id = si.service_id

GROUP BY s.id
ORDER BY s.id;
  `;

  try {
    const [rows] = await connection.promise().query(sql);
    return NextResponse.json({ data: rows });
  } catch (err) {
    console.error("Error fetching sales with items:", err);
    return NextResponse.json(
      { error: "Gagal mengambil data penjualan" },
      { status: 500 }
    );
  }
}
