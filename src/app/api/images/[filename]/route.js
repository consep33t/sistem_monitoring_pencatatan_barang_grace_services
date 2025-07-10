import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const GET = async (req, { params }) => {
  try {
    let { filename } = await params;

    // Decode untuk mengatasi %20 atau karakter URL encoded
    filename = decodeURIComponent(filename);

    // Validasi nama file untuk mencegah path traversal
    if (
      !filename ||
      !/^[\w\-.,\s]+\.(jpg|jpeg|png|gif|webp|svg)$/i.test(filename)
    ) {
      return NextResponse.json(
        { error: "Nama file tidak valid atau format tidak didukung" },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), "gambar_container", filename);
    const fileBuffer = await fs.readFile(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": getMimeType(filename),
        "Cache-Control": "public, max-age=604800", // 7 hari caching
      },
    });
  } catch (error) {
    console.error("Error serving image:", error);
    return NextResponse.json(
      { error: "Gambar tidak ditemukan" },
      { status: 404 }
    );
  }
};

function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase().replace(".", "");
  const mimeTypes = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
  };
  return mimeTypes[ext] || "application/octet-stream";
}
