"use client";
import { useState } from "react";
import AlertModal from "../AlertModal";
import ConfirmModal from "../ConfirmModal";

const TableStok = ({ products, refreshData }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [qty, setQty] = useState("");
  const [cost, setCost] = useState("");
  const [mode, setMode] = useState("add");

  // State Alert
  const [alert, setAlert] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  // State Confirm
  const [confirm, setConfirm] = useState({
    show: false,
    message: "",
  });

  const openModal = (product, modeType) => {
    setSelectedProduct(product);
    setMode(modeType);
    setQty("");
    setCost("");
    document.getElementById("modal_stock").showModal();
  };

  const handleSubmit = async () => {
    if (!qty) {
      showAlert("error", "Qty harus diisi");
      return;
    }

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
        showAlert(
          "success",
          mode === "add"
            ? "Stok berhasil ditambahkan"
            : "Stok berhasil disesuaikan"
        );
        document.getElementById("modal_stock").close();
        refreshData?.();
      } else {
        showAlert("error", "Gagal: " + result.error);
      }
    } catch (err) {
      console.error(err);
      showAlert("error", "Terjadi kesalahan");
    }
  };

  // 🔥 buka modal konfirmasi delete
  const openDeleteConfirm = (product) => {
    setSelectedProduct(product);
    setConfirm({
      show: true,
      message: `Apakah kamu yakin ingin menghapus produk ${product.name}?`,
    });
  };

  // 🔥 eksekusi delete
  const handleDelete = async () => {
    if (!selectedProduct?.id) {
      showAlert("error", "Produk tidak valid untuk dihapus");
      return;
    }
    try {
      const res = await fetch(`/api/products/${selectedProduct.id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.success) {
        showAlert("success", "Produk berhasil dihapus");
        refreshData?.();
        window.location.reload();
      } else {
        showAlert("error", "Gagal menghapus: " + result.error);
      }
    } catch (err) {
      console.error(err);
      showAlert("error", "Terjadi kesalahan");
    } finally {
      setConfirm({ show: false, message: "" });
    }
  };

  return (
    <div className="overflow-x-auto rounded-box border border-black-content/5">
      {/* Alert Modal */}
      <AlertModal
        show={alert.show}
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ ...alert, show: false })}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        show={confirm.show}
        message={confirm.message}
        onConfirm={handleDelete}
        onCancel={() => setConfirm({ show: false, message: "" })}
      />

      {/* Tabel Produk */}
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
                  className="btn rounded btn-xs btn-success"
                  onClick={() => openModal(item, "add")}
                >
                  Add
                </button>
                <button
                  className="btn rounded btn-xs btn-warning"
                  onClick={() => openModal(item, "edit")}
                >
                  Edit
                </button>
                <button
                  className="btn rounded btn-xs btn-error"
                  onClick={() => openDeleteConfirm(item)}
                >
                  Delete
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
              placeholder={mode === "edit" ? "Qty (+/-)" : "Qty"}
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
                className="btn rounded btn-error"
              >
                Simpan
              </button>
              <button
                type="button"
                onClick={() => document.getElementById("modal_stock").close()}
                className="btn rounded"
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
