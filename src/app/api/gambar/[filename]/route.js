// app/api/images/[filename]/route.js

import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const GET = async (req, { params }) => {
  try {
    const { filename } = params;

    // Validasi filename
    if (!filename || !/^[\w-.]+$/.test(filename)) {
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
        "Cache-Control": "public, max-age=604800", // Cache 1 minggu
      },
    });
  } catch (err) {
    console.error("Error serving image:", err);
    return NextResponse.json(
      { error: "Gambar tidak ditemukan" },
      { status: 404 }
    );
  }
};

// Helper untuk menentukan MIME type
function getMimeType(filename) {
  const ext = filename.split(".").pop().toLowerCase();
  const mimeTypes = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
  };
  return mimeTypes[ext] || "application/octet-stream";
}
