import { NextResponse } from "next/server";
import pool from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// ✅ GET all suppliers
export async function GET() {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM suppliers ORDER BY name ASC"
    );
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ POST create new supplier
export async function POST(req) {
  try {
    const { name, phone = null, address = null } = await req.json();

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Nama supplier wajib diisi" },
        { status: 400 }
      );
    }

    await pool.query(
      `INSERT INTO suppliers (name, phone, address, created_at)
       VALUES (?, ?, ?, NOW())`,
      [name, phone, address]
    );

    return NextResponse.json({
      success: true,
      message: "Supplier berhasil ditambahkan",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ✅ PATCH edit supplier by ID
export async function PATCH(req) {
  try {
    const { id, name, phone = null, address = null } = await req.json();

    if (!id || !name) {
      return NextResponse.json(
        { success: false, error: "ID dan nama supplier wajib diisi" },
        { status: 400 }
      );
    }

    await pool.query(
      `UPDATE suppliers SET name = ?, phone = ?, address = ? WHERE id = ?`,
      [name, phone, address, id]
    );

    return NextResponse.json({
      success: true,
      message: "Supplier berhasil diupdate",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ✅ DELETE supplier by ID (khusus admin & owner)
export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions); // 🔑 cek session login
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const role = session.user.role; // pastikan role disimpan di user
    if (role !== "admin" && role !== "owner") {
      return NextResponse.json(
        {
          success: false,
          error: "Hanya admin & owner yang bisa menghapus supplier",
        },
        { status: 403 }
      );
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID supplier wajib dikirim" },
        { status: 400 }
      );
    }

    await pool.query("DELETE FROM suppliers WHERE id = ?", [id]);

    return NextResponse.json({
      success: true,
      message: "Supplier berhasil dihapus",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
