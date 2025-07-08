import { NextResponse } from "next/server";
import pool from "@/app/lib/db";
import fs from "fs/promises";
import { existsSync, unlinkSync } from "fs";
import path from "path";

/* ───────────── GET /api/products/[id] ───────────── */
export const GET = async (_req, ctx) => {
  const { id } = ctx.params;

  try {
    const [rows] = await pool.query(
      `SELECT p.*, pi.image_url
       FROM products p
       LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_main = 1
       WHERE p.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error("GET product error:", err);
    return NextResponse.json(
      { error: "Gagal mengambil produk" },
      { status: 500 }
    );
  }
};

/* ───────────── PUT /api/products/[id] ───────────── */
export const PUT = async (req, ctx) => {
  const { id } = ctx.params;

  let conn;
  try {
    const formData = await req.formData();
    const sku = formData.get("sku");
    const name = formData.get("name");
    const category = formData.get("category");
    const brand = formData.get("brand");
    const unit_cost = parseFloat(formData.get("unit_cost"));
    const unit_price = parseFloat(formData.get("unit_price"));
    const file = formData.get("gambar");

    if (!sku || !name || isNaN(unit_cost) || isNaN(unit_price)) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    conn = await pool.getConnection();
    await conn.beginTransaction();

    const [oldRows] = await conn.query(
      `SELECT p.*, pi.image_url
       FROM products p
       LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_main = 1
       WHERE p.id = ?`,
      [id]
    );

    if (oldRows.length === 0) {
      await conn.release();
      return NextResponse.json(
        { error: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    const old = oldRows[0];
    const hasChanges =
      sku !== old.sku ||
      name !== old.name ||
      category !== old.category ||
      brand !== old.brand ||
      unit_cost !== parseFloat(old.unit_cost) ||
      unit_price !== parseFloat(old.unit_price);

    const hasNewFile =
      file && typeof File !== "undefined" && file instanceof File;

    if (!hasChanges && !hasNewFile) {
      await conn.release();
      return NextResponse.json(
        { message: "Tidak ada perubahan" },
        { status: 200 }
      );
    }

    if (hasChanges) {
      await conn.query(
        `UPDATE products
         SET sku = ?, name = ?, category = ?, brand = ?, unit_cost = ?, unit_price = ?
         WHERE id = ?`,
        [sku, name, category || null, brand || null, unit_cost, unit_price, id]
      );
    }

    if (hasNewFile) {
      const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!allowed.includes(file.type)) {
        await conn.rollback();
        await conn.release();
        return NextResponse.json(
          { error: "Format gambar tidak didukung" },
          { status: 400 }
        );
      }

      // Hapus gambar lama
      if (old.image_url) {
        const oldPath = path.join(
          process.cwd(),
          "gambar_container",
          path.basename(old.image_url)
        );
        if (existsSync(oldPath)) unlinkSync(oldPath);
        await conn.query(
          `DELETE FROM product_images WHERE product_id = ? AND is_main = 1`,
          [id]
        );
      }

      // Simpan gambar baru
      const dir = path.join(process.cwd(), "gambar_container");
      await fs.mkdir(dir, { recursive: true });

      const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
      const fullPath = path.join(dir, filename);
      await fs.writeFile(fullPath, Buffer.from(await file.arrayBuffer()));

      const imageUrl = `/api/images/${filename}`;
      await conn.query(
        `INSERT INTO product_images (product_id, image_url, is_main) VALUES (?, ?, 1)`,
        [id, imageUrl]
      );
    }

    await conn.commit();
    await conn.release();

    return NextResponse.json(
      { message: "Produk berhasil diperbarui" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Update error:", err);
    if (conn) {
      try {
        await conn.rollback();
        await conn.release();
      } catch {}
    }
    return NextResponse.json(
      { error: "Gagal mengupdate produk" },
      { status: 500 }
    );
  }
};
