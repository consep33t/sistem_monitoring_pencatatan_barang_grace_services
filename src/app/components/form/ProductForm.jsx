"use client";
import { useState } from "react";

export default function ProductForm() {
  const [form, setForm] = useState({
    sku: "",
    name: "",
    category: "",
    brand: "",
    unit_cost: "",
    unit_price: "",
    gambar: null,
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "gambar") {
      setForm((prev) => ({ ...prev, gambar: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("sku", form.sku);
      formData.append("name", form.name);
      formData.append("category", form.category);
      formData.append("brand", form.brand);
      formData.append("unit_cost", form.unit_cost);
      formData.append("unit_price", form.unit_price);
      if (form.gambar) formData.append("gambar", form.gambar);

      const res = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`Produk berhasil ditambahkan dengan ID: ${data.data.id}`);
        setForm({
          sku: "",
          name: "",
          category: "",
          brand: "",
          unit_cost: "",
          unit_price: "",
          gambar: null,
        });
      } else {
        setMessage(`Error: ${data.error || "Gagal menambahkan produk"}`);
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center flex-col w-full p-8 space-y-4">
      <h2 className="font-bold">Tambah Produk Baru</h2>
      {message && <p>{message}</p>}
      <form
        className="w-full max-w-md space-y-4"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <label>
          SKU:
          <br />
          <input
            className="w-full border p-2 rounded"
            type="text"
            name="sku"
            value={form.sku}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Nama Produk:
          <br />
          <input
            className="w-full border p-2 rounded"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Kategori:
          <br />
          <input
            className="w-full border p-2 rounded"
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Brand:
          <br />
          <input
            className="w-full border p-2 rounded"
            type="text"
            name="brand"
            value={form.brand}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Harga Modal:
          <br />
          <input
            className="w-full border p-2 rounded"
            type="number"
            name="unit_cost"
            value={form.unit_cost}
            onChange={handleChange}
            required
            step="0.01"
          />
        </label>
        <br />
        <label>
          Harga Jual:
          <br />
          <input
            className="w-full border p-2 rounded"
            type="number"
            name="unit_price"
            value={form.unit_price}
            onChange={handleChange}
            required
            step="0.01"
          />
        </label>
        <br />
        <label>
          Gambar Produk:
          <br />
          <input
            className="w-full border p-2 rounded"
            type="file"
            name="gambar"
            accept="image/*"
            onChange={handleChange}
          />
        </label>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Mengupload..." : "Tambah Produk"}
        </button>
      </form>
    </div>
  );
}
