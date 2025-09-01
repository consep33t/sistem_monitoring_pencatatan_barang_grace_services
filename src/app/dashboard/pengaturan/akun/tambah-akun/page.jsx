"use client";

import { useState } from "react";

export default function PengaturanTambahAkunPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role_id: "",
    is_active: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const roles = [
    { id: 1, name: "owner" },
    { id: 2, name: "admin" },
    { id: 3, name: "cashier" },
    { id: 4, name: "technician" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password_hash: form.password,
          is_active: parseInt(form.is_active),
          role_id: parseInt(form.role_id),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menambahkan akun");

      setMessage("✅ Akun berhasil ditambahkan!");
      setForm({ name: "", email: "", password: "", role_id: "", is_active: 1 });
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex p-8 justify-center items-center w-full h-full">
      <div className="w-full p-4 bg-white shadow rounded">
        <h1 className="text-lg font-bold mb-4">Tambah Akun Baru</h1>

        {message && (
          <div className="mb-3 text-sm text-center text-red-600">{message}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          <div>
            <label className="block mb-1">Nama</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Peran (Role)</label>
            <select
              name="role_id"
              value={form.role_id}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            >
              <option value="">-- Pilih Role --</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Status</label>
            <select
              name="is_active"
              value={form.is_active}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            >
              <option value={1}>Aktif</option>
              <option value={0}>Nonaktif</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-neutral btn-outline btn px-4 py-2 rounded w-full mt-4"
            >
              {isSubmitting ? "Menyimpan..." : "Tambah Akun"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
