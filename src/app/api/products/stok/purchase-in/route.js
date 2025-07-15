import { NextResponse } from "next/server";
import pool from "@/app/lib/db";

export async function GET() {
  const query = `
    SELECT
      sm.id,
      sm.created_at,
      p.name AS product_name,
      sm.product_id,
      sm.qty,
      sm.cost,
      s.name AS supplier_name,
      po.status AS purchase_status,
      e.name AS employee_name
    FROM stock_movements sm
    JOIN products p ON sm.product_id = p.id
    LEFT JOIN purchase_items pi ON sm.ref_table = 'purchase' AND sm.ref_id = pi.id
    LEFT JOIN purchase_orders po ON pi.purchase_id = po.id
    LEFT JOIN suppliers s ON po.supplier_id = s.id
    LEFT JOIN employees e ON po.employee_id = e.id
    WHERE sm.movement_type = 'in'
    ORDER BY sm.created_at DESC
  `;

  try {
    const [rows] = await pool.query(query);
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { product_id, qty, cost, supplier_id, employee_id } =
      await req.json();

    if (!product_id || !qty || !cost || !supplier_id || !employee_id) {
      return NextResponse.json(
        { success: false, error: "Semua field wajib diisi termasuk employee" },
        { status: 400 }
      );
    }

    const totalCost = qty * cost;
    const poNumber = `PO-${Date.now()}`;

    const [poRes] = await pool.query(
      `INSERT INTO purchase_orders 
       (po_number, supplier_id, employee_id, total_cost, status, ordered_at, received_at)
       VALUES (?, ?, ?, ?, 'received', NOW(), NOW())`,
      [poNumber, supplier_id, employee_id, totalCost]
    );
    const purchaseId = poRes.insertId;

    const [piRes] = await pool.query(
      `INSERT INTO purchase_items (purchase_id, product_id, qty, unit_cost, total_cost)
       VALUES (?, ?, ?, ?, ?)`,
      [purchaseId, product_id, qty, cost, totalCost]
    );
    const purchaseItemId = piRes.insertId;

    await pool.query(
      `INSERT INTO stock_movements
        (product_id, movement_type, ref_table, ref_id, qty, cost, created_at)
       VALUES (?, 'in', 'purchase', ?, ?, ?, NOW())`,
      [product_id, purchaseItemId, qty, totalCost]
    );

    return NextResponse.json({
      success: true,
      message: "Stok pembelian berhasil ditambahkan",
    });
  } catch (error) {
    console.error("POST Error", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    const { stock_movement_id, qty, cost, status } = await req.json();

    if (!stock_movement_id || !qty || !cost || !status) {
      return NextResponse.json(
        { success: false, error: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    // Ambil data ref_id dan ref_table dari stock_movements
    const [rows] = await pool.query(
      `SELECT ref_table, ref_id FROM stock_movements WHERE id = ?`,
      [stock_movement_id]
    );

    if (!rows.length) {
      return NextResponse.json(
        { success: false, error: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    const { ref_table, ref_id } = rows[0];

    if (ref_table !== "purchase") {
      return NextResponse.json(
        { success: false, error: "Hanya data pembelian yang bisa diedit" },
        { status: 400 }
      );
    }

    const totalCost = qty * cost;

    // Update purchase_items
    await pool.query(
      `UPDATE purchase_items SET qty = ?, unit_cost = ?, total_cost = ? WHERE id = ?`,
      [qty, cost, totalCost, ref_id]
    );

    // Ambil purchase_id dari purchase_items
    const [[{ purchase_id }]] = await pool.query(
      `SELECT purchase_id FROM purchase_items WHERE id = ?`,
      [ref_id]
    );

    // Update purchase_orders (status dan total_cost)
    await pool.query(
      `UPDATE purchase_orders SET total_cost = ?, status = ? WHERE id = ?`,
      [totalCost, status, purchase_id]
    );

    // Update stock_movements
    await pool.query(
      `UPDATE stock_movements SET qty = ?, cost = ? WHERE id = ?`,
      [qty, totalCost, stock_movement_id]
    );

    return NextResponse.json({ success: true, message: "Berhasil diupdate" });
  } catch (error) {
    console.error("PATCH Error", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { stock_movement_id } = await req.json();

    if (!stock_movement_id) {
      return NextResponse.json(
        { success: false, error: "ID stok tidak diberikan" },
        { status: 400 }
      );
    }

    // Ambil ref_id dari stock_movements
    const [rows] = await pool.query(
      `SELECT ref_id FROM stock_movements 
       WHERE id = ? AND ref_table = 'purchase'`,
      [stock_movement_id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    const purchaseItemId = rows[0].ref_id;

    // Ambil purchase_id dari purchase_items
    const [piRows] = await pool.query(
      `SELECT purchase_id FROM purchase_items WHERE id = ?`,
      [purchaseItemId]
    );

    const purchaseId = piRows[0]?.purchase_id;

    // Hapus stock_movements
    await pool.query(`DELETE FROM stock_movements WHERE id = ?`, [
      stock_movement_id,
    ]);

    // Hapus purchase_items
    await pool.query(`DELETE FROM purchase_items WHERE id = ?`, [
      purchaseItemId,
    ]);

    const [checkItems] = await pool.query(
      `SELECT COUNT(*) as itemCount FROM purchase_items WHERE purchase_id = ?`,
      [purchaseId]
    );

    if (checkItems[0].itemCount === 0) {
      await pool.query(`DELETE FROM purchase_orders WHERE id = ?`, [
        purchaseId,
      ]);
    } else {
      // Jika masih ada item lain, update total_cost
      await pool.query(
        `
        UPDATE purchase_orders
        SET total_cost = (
          SELECT SUM(total_cost) FROM purchase_items WHERE purchase_id = ?
        )
        WHERE id = ?
      `,
        [purchaseId, purchaseId]
      );
    }

    return NextResponse.json({
      success: true,
      message: "Pembelian berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE Error", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
