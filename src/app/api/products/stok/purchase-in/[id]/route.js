import { NextResponse } from "next/server";
import pool from "@/app/lib/db";
import { getServerSession } from "next-auth/next"; // jika pakai NextAuth
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(_req, ctx) {
  try {
    // Ambil session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Cek role
    const userRole = session.user.role; // pastikan field role ada di session
    if (!["admin", "owner"].includes(userRole)) {
      return NextResponse.json(
        { success: false, error: "Akses ditolak! Hanya untuk Admin/Owner." },
        { status: 403 }
      );
    }

    const { id } = await ctx.params; // ambil dari URL
    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID stok tidak diberikan" },
        { status: 400 }
      );
    }

    // Ambil ref_id dari stock_movements
    const [rows] = await pool.query(
      `SELECT ref_id FROM stock_movements WHERE id = ? AND ref_table = 'purchase'`,
      [id]
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
    await pool.query(`DELETE FROM stock_movements WHERE id = ?`, [id]);

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
        `UPDATE purchase_orders
         SET total_cost = (
           SELECT SUM(total_cost) FROM purchase_items WHERE purchase_id = ?
         )
         WHERE id = ?`,
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
