import { NextResponse } from "next/server";
import pool from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

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
    const [rows] = await pool.query(sql);
    return NextResponse.json({ data: rows }, { status: 200 });
  } catch (err) {
    console.error("Error fetching sales with items:", err);
    return NextResponse.json(
      { error: "Gagal mengambil data penjualan" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  const body = await req.json();
  const {
    invoice_no,
    customer,
    sub_total,
    discount_total,
    grand_total,
    paid,
    payment_method,
    notes,
    items = [],
    additional_costs = [],
  } = body;

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // ✅ Ambil session NextAuth
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("User tidak login");

    const employee_id = session.user.id; // 👉 langsung pakai session.user.id

    // ✅ Tangani customer
    let customer_id = null;
    if (customer && customer.name && customer.phone) {
      const [rows] = await conn.query(
        `SELECT id FROM customers WHERE name = ? AND phone = ? LIMIT 1`,
        [customer.name, customer.phone]
      );

      if (rows.length > 0) {
        customer_id = rows[0].id;
      } else {
        const [result] = await conn.query(
          `INSERT INTO customers (name, phone) VALUES (?, ?)`,
          [customer.name, customer.phone]
        );
        customer_id = result.insertId;
      }
    }

    // ✅ Insert sales
    const [salesResult] = await conn.query(
      `INSERT INTO sales
        (invoice_no, customer_id, employee_id, sub_total, discount_total, grand_total, paid, payment_method, notes, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        invoice_no,
        customer_id,
        employee_id,
        sub_total,
        discount_total,
        grand_total,
        paid,
        payment_method,
        notes,
      ]
    );
    const sales_id = salesResult.insertId;

    // ✅ Insert sales_items
    for (const item of items) {
      const { item_type, item_id, qty, unit_price, total } = item;
      await conn.query(
        `INSERT INTO sales_items
          (sales_id, item_type, product_id, service_id, qty, unit_price, total)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          sales_id,
          item_type,
          item_type === "product" ? item_id : null,
          item_type === "service" ? item_id : null,
          qty,
          unit_price,
          total,
        ]
      );
    }

    // ✅ Insert biaya tambahan
    for (const cost of additional_costs) {
      const { name, cost: costValue } = cost;
      if (name && parseFloat(costValue) > 0) {
        await conn.query(
          `INSERT INTO additional_costs (sales_id, name, cost) VALUES (?, ?, ?)`,

          [sales_id, name, costValue]
        );
      }
    }

    await conn.commit();
    return NextResponse.json({
      success: true,
      message: "Transaksi penjualan berhasil disimpan",
      sales_id,
    });
  } catch (err) {
    await conn.rollback();
    console.error("POST /api/sales/with-items error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  } finally {
    conn.release();
  }
}
