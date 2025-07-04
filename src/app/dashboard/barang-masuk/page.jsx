"use client";
import { useState } from "react";

const BarangMasuk = () => {
  const [nama, setNama] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [gambar, setGambar] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nama", nama);
    formData.append("jumlah", jumlah);
    if (gambar) formData.append("gambar", gambar);

    try {
      const response = await fetch("/api/barang", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("Barang berhasil ditambahkan!");
        setNama("");
        setJumlah("");
        setGambar(null);
      } else {
        setMessage(result.error || "Terjadi kesalahan.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Gagal mengirim data.");
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Input Barang Masuk</h1>
      {message && <p className="mb-2 text-green-600">{message}</p>}
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="space-y-4"
      >
        <div>
          <label className="block mb-1">Nama Barang</label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Jumlah</label>
          <input
            type="number"
            className="input input-bordered w-full"
            value={jumlah}
            onChange={(e) => setJumlah(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Upload Gambar</label>
          <input
            type="file"
            className="file-input file-input-bordered w-full"
            accept="image/*"
            onChange={(e) => setGambar(e.target.files[0])}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Kirim
        </button>
      </form>
    </div>
  );
};

export default BarangMasuk;
