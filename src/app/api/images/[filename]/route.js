import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const GET = async (req, { params }) => {
  try {
    let { filename } = await params;

    // Decode URI component (mengubah %20 dll jadi spasi, dll)
    filename = decodeURIComponent(filename);

    // Validasi nama file setelah decode
    if (!filename || !/^[\w\-.,\s]+$/.test(filename)) {
      return NextResponse.json(
        { error: "Nama file tidak valid" },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), "gambar_container", filename);
    const fileBuffer = await fs.readFile(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": getMimeType(filename),
        "Cache-Control": "public, max-age=604800",
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
  const ext = filename.split(".").pop().toLowerCase();
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
