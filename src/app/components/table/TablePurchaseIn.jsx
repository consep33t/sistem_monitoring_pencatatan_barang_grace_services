"use client";
import { useState } from "react";

const TablePurchaseIn = ({ purchases, refreshData }) => {
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState("");
  const [cost, setCost] = useState("");
  const [status, setStatus] = useState("");

  const handleEditClick = (item) => {
    setSelected(item);
    setQty(item.qty);
    setCost(item.cost / item.qty);
    setStatus(item.purchase_status || "received");
    document.getElementById("modal_edit_purchase_in").showModal();
  };

  const handleUpdate = async () => {
    if (!selected || qty === "" || cost === "" || status === "") {
      alert("Semua field harus diisi");
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
          status, // include status here
        }),
      });

      const result = await res.json();
      if (result.success) {
        alert("Data berhasil diupdate");
        document.getElementById("modal_edit_purchase_in").close();
        refreshData?.();
      } else {
        alert("Gagal: " + result.error);
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Terjadi kesalahan");
    }
  };

  return (
    <>
      <div className="overflow-x-auto border rounded-box">
        <table className="table">
          <thead>
            <tr>
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
                    className="btn btn-xs btn-warning"
                    onClick={() => handleEditClick(item)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Edit */}
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
            {/* <select
              className="select select-bordered"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="ordered">Ordered</option>
              <option value="received">Received</option>
              <option value="canceled">Canceled</option>
            </select> */}
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
