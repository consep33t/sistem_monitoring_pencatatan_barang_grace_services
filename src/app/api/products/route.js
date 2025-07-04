import { NextResponse } from "next/server";
import connection from "@/app/lib/db";
import path from "path";
import fs from "fs/promises";

export const POST = async (req) => {
  try {
    const formData = await req.formData();

    // Ambil data produk
    const sku = formData.get("sku");
    const name = formData.get("name");
    const category = formData.get("category");
    const brand = formData.get("brand");
    const unit_cost = formData.get("unit_cost");
    const unit_price = formData.get("unit_price");
    const gambar = formData.get("gambar");

    // Validasi data minimal
    if (!sku || !name || !unit_cost || !unit_price) {
      return NextResponse.json(
        { error: "sku, name, unit_cost, dan unit_price harus diisi" },
        { status: 400 }
      );
    }

    // Insert produk dulu
    const insertProductQuery =
      "INSERT INTO products (sku, name, category, brand, unit_cost, unit_price) VALUES (?, ?, ?, ?, ?, ?)";
    const [result] = await connection
      .promise()
      .query(insertProductQuery, [
        sku,
        name,
        category || null,
        brand || null,
        parseFloat(unit_cost),
        parseFloat(unit_price),
      ]);

    const productId = result.insertId;

    // Jika ada gambar, simpan gambar ke folder dan simpan ke product_images
    let imageUrl = null;
    if (gambar && gambar instanceof File) {
      // Validasi tipe gambar (opsional)
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(gambar.type)) {
        return NextResponse.json(
          { error: "Format gambar tidak didukung" },
          { status: 400 }
        );
      }

      const uploadDir = path.join(process.cwd(), "gambar_container");
      await fs.mkdir(uploadDir, { recursive: true });

      const timestamp = Date.now();
      const filename = `${timestamp}-${gambar.name.replace(/\s+/g, "_")}`;
      const filePath = path.join(uploadDir, filename);

      const buffer = await gambar.arrayBuffer();
      await fs.writeFile(filePath, Buffer.from(buffer));

      imageUrl = `/api/images/${filename}`;

      // Simpan ke tabel product_images, is_main bisa true karena ini gambar utama produk
      const insertImageQuery =
        "INSERT INTO product_images (product_id, image_url, is_main) VALUES (?, ?, ?)";
      await connection
        .promise()
        .query(insertImageQuery, [productId, imageUrl, true]);
    }

    return NextResponse.json(
      {
        message: "Produk berhasil ditambahkan",
        data: {
          id: productId,
          sku,
          name,
          category,
          brand,
          unit_cost: parseFloat(unit_cost),
          unit_price: parseFloat(unit_price),
          image_url: imageUrl,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error adding product:", err);
    return NextResponse.json(
      { error: "Gagal menambahkan produk" },
      { status: 500 }
    );
  }
};

export const GET = async () => {
  try {
    const query = `
      SELECT p.id, p.sku, p.name, p.category, p.brand, p.unit_cost, p.unit_price, pi.image_url
      FROM products p
      LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.is_main = 1
      ORDER BY p.id DESC
    `;

    const [rows] = await connection.promise().query(query);

    return NextResponse.json({ data: rows }, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data produk" },
      { status: 500 }
    );
  }
};
