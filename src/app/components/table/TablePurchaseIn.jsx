"use client";
import { useState } from "react";
import AlertModal from "../AlertModal";

const TablePurchaseIn = ({ purchases, refreshData }) => {
  // State untuk konfirmasi hapus
  const [confirm, setConfirm] = useState({
    show: false,
    id: null,
    message: "",
  });

  // State untuk alert
  const [alert, setAlert] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState("");
  const [cost, setCost] = useState("");
  const [status, setStatus] = useState("");

  // Fungsi untuk menampilkan alert
  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  // Konfirmasi hapus
  const askDelete = (id) => {
    setConfirm({
      show: true,
      id,
      message: "Apakah kamu yakin ingin menghapus data ini?",
    });
  };

  // Handle hapus
  const handleDelete = async () => {
    if (!confirm.id) return;

    try {
      const res = await fetch(`/api/products/stok/purchase-in/${confirm.id}`, {
        method: "DELETE",
      });
      const result = await res.json();

      if (result.success) {
        showAlert("success", "Data berhasil dihapus");
        refreshData?.();
      } else {
        showAlert("error", "Gagal menghapus: " + result.error);
      }
    } catch (error) {
      console.error("Delete error:", error);
      showAlert("error", "Terjadi kesalahan");
    } finally {
      setConfirm({ show: false, id: null, message: "" });
    }
  };

  // Handle edit
  const handleEditClick = (item) => {
    setSelected(item);
    setQty(item.qty);
    setCost(item.cost / item.qty);
    setStatus(item.purchase_status || "received");
    document.getElementById("modal_edit_purchase_in").showModal();
  };

  const handleUpdate = async () => {
    if (!selected || qty === "" || cost === "" || status === "") {
      showAlert("error", "Semua field harus diisi");
      return;
    }

    try {
      const res = await fetch("/api/products/stok/purchase-in", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stock_movement_id: selected.id,
          qty: parseInt(qty),
          cost: parseFloat(cost),
          status,
        }),
      });

      const result = await res.json();
      if (result.success) {
        showAlert("success", "Data berhasil diupdate");
        document.getElementById("modal_edit_purchase_in").close();
        refreshData?.();
      } else {
        showAlert("error", "Gagal: " + result.error);
      }
    } catch (error) {
      console.error("Update error:", error);
      showAlert("error", "Terjadi kesalahan");
    }
  };

  return (
    <>
      {/* Custom Confirm Modal */}
      <dialog id="confirm_modal" className="modal" open={confirm.show}>
        <div className="modal-box bg-white">
          <h3 className="font-bold text-lg">Konfirmasi</h3>
          <p className="py-4">{confirm.message}</p>
          <div className="modal-action">
            <button className="btn btn-error rounded" onClick={handleDelete}>
              Ya
            </button>
            <button
              className="btn rounded"
              onClick={() => setConfirm({ show: false, id: null, message: "" })}
            >
              Tidak
            </button>
          </div>
        </div>
      </dialog>

      {/* Custom Alert Modal */}
      <AlertModal
        show={alert.show}
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ ...alert, show: false })}
      />

      {/* Tabel Pembelian */}
      <div className="overflow-x-auto border rounded-box">
        <table className="table">
          <thead>
            <tr className="text-black">
              <th>No</th>
              <th>Produk</th>
              <th>Qty</th>
              <th>Harga/unit</th>
              <th>Total</th>
              <th>Supplier</th>
              <th>Karyawan</th>
              <th>Status</th>
              <th>Tanggal</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((item, idx) => (
              <tr key={item.id}>
                <td>{idx + 1}</td>
                <td>{item.product_name}</td>
                <td>{item.qty}</td>
                <td>{(item.cost / item.qty).toLocaleString("id-ID")}</td>
                <td>{item.cost.toLocaleString("id-ID")}</td>
                <td>{item.supplier_name || "-"}</td>
                <td>{item.employee_name || "-"}</td>
                <td>{item.purchase_status}</td>
                <td>{new Date(item.created_at).toLocaleDateString()}</td>
                <td className="space-x-1">
                  <button
                    className="btn rounded btn-xs btn-warning"
                    onClick={() => handleEditClick(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn rounded btn-error btn-xs"
                    onClick={() => askDelete(item.id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Edit Pembelian */}
      <dialog id="modal_edit_purchase_in" className="modal">
        <div className="modal-box bg-[#f5f5f5]">
          <h3 className="font-bold text-lg mb-2">Edit Pembelian</h3>
          <p className="mb-2 text-sm">Produk: {selected?.product_name}</p>
          <form method="dialog" className="flex flex-col space-y-3">
            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              placeholder="Jumlah"
              className="input input-bordered border-black bg-transparent"
              required
            />
            <input
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="Harga/unit"
              className="input input-bordered border-black bg-transparent"
              required
            />
            <div className="modal-action">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUpdate}
              >
                Simpan
              </button>
              <button
                type="button"
                className="btn"
                onClick={() =>
                  document.getElementById("modal_edit_purchase_in").close()
                }
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default TablePurchaseIn;
