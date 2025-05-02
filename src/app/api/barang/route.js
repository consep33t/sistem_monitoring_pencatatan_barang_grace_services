import { NextResponse } from "next/server";
import connection from "@/app/lib/db";
import path from "path";
import fs from "fs/promises";

export const GET = async () => {
  try {
    const query = "SELECT * FROM barang ORDER BY diperbaharui_pada DESC";
    const [results] = await connection.promise().query(query);

    return NextResponse.json(results, { status: 200 });
  } catch (err) {
    console.error("Error fetching data:", err);
    return NextResponse.json(
      { error: "Gagal mengambil data" },
      { status: 500 }
    );
  }
};

export const POST = async (req) => {
  try {
    // Parse form data
    const formData = await req.formData();

    // Validasi input
    const nama_barang = formData.get("nama_barang");
    const jumlah = formData.get("jumlah");
    const gambar = formData.get("gambar");

    if (!nama_barang || !jumlah) {
      return NextResponse.json(
        { error: "Nama barang dan jumlah harus diisi" },
        { status: 400 }
      );
    }

    // Handle file upload
    let gambarUrl = null;
    if (gambar && gambar instanceof File) {
      const uploadDir = path.join(process.cwd(), "gambar_container");
      await fs.mkdir(uploadDir, { recursive: true });

      const filename = `${Date.now()}-${gambar.name}`;
      const filePath = path.join(uploadDir, filename);
      const buffer = await gambar.arrayBuffer();

      await fs.writeFile(filePath, Buffer.from(buffer));
      gambarUrl = `/api/gambar/${filename}`;
    }

    // Insert ke database
    const query =
      "INSERT INTO barang (nama_barang, jumlah, gambar) VALUES (?, ?, ?)";
    const [result] = await connection
      .promise()
      .query(query, [nama_barang, parseInt(jumlah), gambarUrl]);

    return NextResponse.json(
      {
        message: "Data berhasil ditambahkan",
        data: {
          id: result.insertId,
          nama_barang,
          jumlah: parseInt(jumlah),
          gambar: gambarUrl,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error processing request:", err);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
};
