"use client";
import { useEffect, useState } from "react";
import AlertModal from "@/app/components/AlertModal";
import ConfirmModal from "@/app/components/ConfirmModal";

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [editForm, setEditForm] = useState(null);
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
    action: null,
    message: "",
  });

  const fetchSuppliers = async () => {
    try {
      const res = await fetch("/api/suppliers");
      const data = await res.json();
      setSuppliers(data || []);
    } catch (err) {
      console.error("Gagal fetch supplier", err);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleChange = (e, isEdit = false) => {
    const target = isEdit ? editForm : form;
    const setter = isEdit ? setEditForm : setForm;
    setter({ ...target, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    if (!form.name) return showAlert("warning", "Nama wajib diisi");

    const res = await fetch("/api/suppliers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const result = await res.json();
    if (result.success) {
      document.getElementById("modal_add_supplier").close();
      setForm({ name: "", phone: "", address: "" });
      fetchSuppliers();
      showAlert("success", "Supplier berhasil ditambahkan");
    } else {
      showAlert("error", result.error);
    }
  };

  const handleUpdate = async () => {
    if (!editForm?.name) return showAlert("warning", "Nama wajib diisi");

    const res = await fetch("/api/suppliers", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    const result = await res.json();
    if (result.success) {
      document.getElementById("modal_edit_supplier").close();
      setEditForm(null);
      fetchSuppliers();
      showAlert("success", "Supplier berhasil diupdate");
    } else {
      showAlert("error", result.error);
    }
  };

  const openDeleteConfirm = (supplier) => {
    setConfirm({
      show: true,
      action: () => handleDelete(supplier.id),
      message: `Yakin ingin menghapus supplier ${supplier.name}?`,
    });
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch("/api/suppliers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const result = await res.json();
      if (result.success) {
        fetchSuppliers();
        showAlert("success", "Supplier berhasil dihapus");
      } else {
        showAlert("error", result.error || "Gagal menghapus supplier");
      }
    } catch (error) {
      console.error("Error deleting supplier:", error);
      showAlert("error", "Gagal menghapus supplier");
    } finally {
      setConfirm({ show: false, action: null, message: "" });
    }
  };

  return (
    <div className="p-6 mx-auto">
      <h1 className="text-2xl font-bold mb-4">Data Supplier</h1>

      {/* Alert Section */}
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
        onConfirm={() => confirm.action && confirm.action()}
        onCancel={() => setConfirm({ show: false, action: null, message: "" })}
      />

      {/* Tombol Tambah Supplier */}
      <button
        className="btn rounded btn-outline mb-4"
        onClick={() =>
          document.getElementById("modal_add_supplier").showModal()
        }
      >
        Tambah Supplier
      </button>

      {/* Tabel Supplier */}
      <div className="overflow-x-auto border rounded-box">
        <table className="table">
          <thead>
            <tr className="text-black">
              <th>No</th>
              <th>Nama</th>
              <th>Telepon</th>
              <th>Alamat</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s, i) => (
              <tr key={s.id}>
                <td>{i + 1}</td>
                <td>{s.name}</td>
                <td>{s.phone || "-"}</td>
                <td>{s.address || "-"}</td>
                <td>
                  <button
                    className="btn rounded btn-xs btn-warning mr-2"
                    onClick={() => {
                      setEditForm(s);
                      document
                        .getElementById("modal_edit_supplier")
                        .showModal();
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn rounded btn-xs btn-error"
                    onClick={() => openDeleteConfirm(s)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah Supplier */}
      <dialog id="modal_add_supplier" className="modal">
        <div className="modal-box bg-[#f5f5f5]">
          <h3 className="font-bold text-lg mb-2">Tambah Supplier</h3>
          <form method="dialog" className="space-y-3">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={(e) => handleChange(e)}
              placeholder="Nama"
              className="input input-bordered w-full border-black bg-transparent"
            />
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={(e) => handleChange(e)}
              placeholder="Telepon"
              className="input input-bordered w-full border-black bg-transparent"
            />
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={(e) => handleChange(e)}
              placeholder="Alamat"
              className="input input-bordered w-full border-black bg-transparent"
            />
            <div className="modal-action">
              <button
                type="button"
                className="btn rounded btn-error"
                onClick={handleAdd}
              >
                Simpan
              </button>
              <button
                type="button"
                className="btn rounded"
                onClick={() =>
                  document.getElementById("modal_add_supplier").close()
                }
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </dialog>

      {/* Modal Edit Supplier */}
      <dialog id="modal_edit_supplier" className="modal">
        <div className="modal-box bg-[#f5f5f5]">
          <h3 className="font-bold text-lg mb-2">Edit Supplier</h3>
          <form method="dialog" className="space-y-3">
            <input
              type="text"
              name="name"
              value={editForm?.name || ""}
              onChange={(e) => handleChange(e, true)}
              placeholder="Nama"
              className="input input-bordered w-full border-black bg-transparent"
            />
            <input
              type="text"
              name="phone"
              value={editForm?.phone || ""}
              onChange={(e) => handleChange(e, true)}
              placeholder="Telepon"
              className="input input-bordered w-full border-black bg-transparent"
            />
            <input
              type="text"
              name="address"
              value={editForm?.address || ""}
              onChange={(e) => handleChange(e, true)}
              placeholder="Alamat"
              className="input input-bordered w-full border-black bg-transparent"
            />
            <div className="modal-action">
              <button
                type="button"
                className="btn rounded btn-primary"
                onClick={handleUpdate}
              >
                Simpan
              </button>
              <button
                type="button"
                className="btn rounded"
                onClick={() =>
                  document.getElementById("modal_edit_supplier").close()
                }
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

export default SuppliersPage;
