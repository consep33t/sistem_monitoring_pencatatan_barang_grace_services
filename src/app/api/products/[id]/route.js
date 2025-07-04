import { NextResponse } from "next/server";
import connection from "@/app/lib/db";
import fs from "fs/promises";
import { existsSync, unlinkSync } from "fs";
import path from "path";

/* ───────────── GET /api/product/[id] ───────────── */
export const GET = async (_req, ctx) => {
  const { id } = await ctx.params;

  try {
    const [rows] = await connection.promise().query(
      `SELECT p.*, pi.image_url
         FROM products p
         LEFT JOIN product_images pi
           ON pi.product_id = p.id AND pi.is_main = 1
       WHERE p.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }
    return NextResponse.json(rows[0]); // 200 OK
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Gagal mengambil produk" },
      { status: 500 }
    );
  }
};

/* ───────────── PUT /api/product/[id] ───────────── */
export const PUT = async (req, ctx) => {
  const { id } = ctx.params; // tidak perlu await di sini

  try {
    /* 1. Form-data */
    const fd = await req.formData();
    const sku = fd.get("sku");
    const name = fd.get("name");
    const category = fd.get("category");
    const brand = fd.get("brand");
    const unit_cost = parseFloat(fd.get("unit_cost"));
    const unit_price = parseFloat(fd.get("unit_price"));
    const file = fd.get("gambar"); // File | null

    if (!sku || !name || isNaN(unit_cost) || isNaN(unit_price)) {
      return NextResponse.json(
        { error: "sku, name, unit_cost, unit_price wajib diisi" },
        { status: 400 }
      );
    }

    /* 2. Ambil data lama */
    const [oldRows] = await connection.promise().query(
      `SELECT p.*, pi.image_url
           FROM products p
           LEFT JOIN product_images pi
             ON pi.product_id = p.id AND pi.is_main = 1
         WHERE p.id = ?`,
      [id]
    );

    if (oldRows.length === 0)
      return NextResponse.json(
        { error: "Produk tidak ditemukan" },
        { status: 404 }
      );

    const old = oldRows[0];

    /* 3. Deteksi perubahan */
    const textChanged =
      sku !== old.sku ||
      name !== old.name ||
      category !== old.category ||
      brand !== old.brand ||
      unit_cost !== parseFloat(old.unit_cost) ||
      unit_price !== parseFloat(old.unit_price);

    const hasNewFile =
      file && typeof File !== "undefined" && file instanceof File;

    if (!textChanged && !hasNewFile) {
      return NextResponse.json(
        { message: "Tidak ada perubahan, data tetap disimpan." },
        { status: 200 }
      );
    }

    /* 4. Mulai transaksi (tanpa getConnection) */
    await connection.promise().query("START TRANSACTION");

    if (textChanged) {
      await connection.promise().query(
        `UPDATE products
               SET sku = ?, name = ?, category = ?, brand = ?, unit_cost = ?, unit_price = ?
             WHERE id = ?`,
        [sku, name, category || null, brand || null, unit_cost, unit_price, id]
      );
    }

    /* 5. Proses gambar baru */
    if (hasNewFile) {
      const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!allowed.includes(file.type)) {
        await connection.promise().query("ROLLBACK");
        return NextResponse.json(
          { error: "Format gambar tidak didukung" },
          { status: 400 }
        );
      }

      /* 5a. Hapus file & record lama */
      if (old.image_url) {
        const oldPath = path.join(
          process.cwd(),
          "gambar_container",
          path.basename(old.image_url)
        );
        if (existsSync(oldPath)) unlinkSync(oldPath);
        await connection
          .promise()
          .query(
            `DELETE FROM product_images WHERE product_id = ? AND is_main = 1`,
            [id]
          );
      }

      /* 5b. Simpan file baru */
      const uploadDir = path.join(process.cwd(), "gambar_container");
      await fs.mkdir(uploadDir, { recursive: true });

      const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
      const destPath = path.join(uploadDir, filename);
      await fs.writeFile(destPath, Buffer.from(await file.arrayBuffer()));

      const imageUrl = `/api/images/${filename}`;

      await connection
        .promise()
        .query(
          `INSERT INTO product_images (product_id, image_url, is_main) VALUES (?, ?, 1)`,
          [id, imageUrl]
        );
    }

    /* 6. Commit */
    await connection.promise().query("COMMIT");

    return NextResponse.json(
      { message: "Produk berhasil diperbarui" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Update error:", err);
    // pastikan rollback jika transaksi sudah dibuka
    try {
      await connection.promise().query("ROLLBACK");
    } catch {}
    return NextResponse.json(
      { error: "Gagal mengupdate produk" },
      { status: 500 }
    );
  }
};
