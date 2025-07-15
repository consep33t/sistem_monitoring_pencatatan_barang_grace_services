"use client";
import { useState } from "react";

const TableStok = ({ products }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [qty, setQty] = useState("");
  const [cost, setCost] = useState("");
  const [mode, setMode] = useState("add"); // 'add' atau 'edit'

  const openModal = (product, modeType) => {
    setSelectedProduct(product);
    setMode(modeType);
    setQty("");
    setCost("");
    document.getElementById("modal_stock").showModal();
  };

  const handleSubmit = async () => {
    if (!qty) return alert("Qty harus diisi");

    try {
      const res = await fetch("/api/products/stok", {
        method: mode === "add" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: selectedProduct.id,
          qty: parseInt(qty),
          cost: cost ? parseFloat(cost) : null,
        }),
      });

      const result = await res.json();
      if (result.success) {
        alert(
          mode === "add"
            ? "Stok berhasil ditambahkan"
            : "Stok berhasil disesuaikan"
        );
        location.reload();
      } else {
        alert("Gagal: " + result.error);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan");
    }
  };

  return (
    <div className="overflow-x-auto rounded-box border border-black-content/5">
      <table className="table">
        <thead>
          <tr className="text-black">
            <th>No</th>
            <th>Product Name</th>
            <th>SKU</th>
            <th>Stock Available</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item, idx) => (
            <tr className="hover:bg-gray-100" key={item.id}>
              <td>{idx + 1}</td>
              <td>{item.name}</td>
              <td>{item.sku}</td>
              <td>{item.stock_available}</td>
              <td className="space-x-2">
                <button
                  className="btn btn-xs btn-success"
                  onClick={() => openModal(item, "add")}
                >
                  Add
                </button>
                <button
                  className="btn btn-xs btn-warning"
                  onClick={() => openModal(item, "edit")}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Tambah/Edit Stok */}
      <dialog id="modal_stock" className="modal">
        <div className="modal-box bg-[#f5f5f5]">
          <h3 className="font-bold text-lg mb-2">
            {mode === "add" ? "Tambah" : "Edit"} Stok: {selectedProduct?.name}
          </h3>
          <form method="dialog" className="flex flex-col space-y-4">
            <input
              type="number"
              placeholder={
                mode === "edit"
                  ? "Qty (+ untuk tambah, - untuk kurangi)contoh = -5"
                  : "Qty"
              }
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="input input-bordered bg-transparent border-black w-full"
              required
            />
            <input
              type="number"
              placeholder="Cost (opsional)"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="input input-bordered bg-transparent border-black w-full"
            />
            <div className="modal-action">
              <button
                type="button"
                onClick={handleSubmit}
                className="btn btn-primary"
              >
                Simpan
              </button>
              <button
                onClick={() => document.getElementById("modal_stock").close()}
                className="btn"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default TableStok;
