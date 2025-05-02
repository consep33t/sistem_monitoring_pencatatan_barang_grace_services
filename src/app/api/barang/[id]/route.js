import { NextResponse } from "next/server";
import connection from "@/app/lib/db";
import path from "path";
import fs from "fs/promises";

// GET Single Barang
export const GET = async (req, { params }) => {
  try {
    const { id } = params;

    // Validasi ID
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const query = "SELECT * FROM barang WHERE id = ?";
    const [results] = await connection.promise().query(query, [id]);

    if (results.length === 0) {
      return NextResponse.json(
        { error: "Barang tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(results[0], { status: 200 });
  } catch (err) {
    console.error("Error fetching data:", err);
    return NextResponse.json(
      { error: "Gagal mengambil data" },
      { status: 500 }
    );
  }
};

// DELETE Barang
export const DELETE = async (req, { params }) => {
  try {
    const { id } = params;

    // Validasi ID
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    // Ambil data gambar sebelum dihapus
    const getQuery = "SELECT gambar FROM barang WHERE id = ?";
    const [results] = await connection.promise().query(getQuery, [id]);

    if (results.length === 0) {
      return NextResponse.json(
        { error: "Barang tidak ditemukan" },
        { status: 404 }
      );
    }

    // Hapus file gambar jika ada
    const gambarPath = results[0].gambar;
    if (gambarPath) {
      try {
        const filename = gambarPath.split("/").pop();
        const filePath = path.join(process.cwd(), "gambar_container", filename);
        await fs.unlink(filePath);
      } catch (err) {
        console.error("Gagal menghapus gambar:", err);
      }
    }

    // Hapus dari database
    const deleteQuery = "DELETE FROM barang WHERE id = ?";
    await connection.promise().query(deleteQuery, [id]);

    return NextResponse.json(
      { message: "Data berhasil dihapus" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error deleting data:", err);
    return NextResponse.json(
      { error: "Gagal menghapus data" },
      { status: 500 }
    );
  }
};
