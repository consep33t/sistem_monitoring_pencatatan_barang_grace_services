"use client";
import { useEffect, useState } from "react";

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [editForm, setEditForm] = useState(null);
  const [alert, setAlert] = useState({ type: "", message: "" });

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

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: "", message: "" }), 3000);
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

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus supplier ini?")) return;

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
  };

  return (
    <div className="p-6 mx-auto">
      <h1 className="text-2xl font-bold mb-4">Data Supplier</h1>

      {/* Alert Section */}
      {alert.message && (
        <div className={`alert alert-${alert.type} mb-4`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            {alert.type === "success" && (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            )}
            {alert.type === "error" && (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            )}
            {alert.type === "warning" && (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01M5.062 21h13.876c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.33 18c-.77 1.333.192 3 1.732 3z"
              />
            )}
          </svg>
          <span>{alert.message}</span>
        </div>
      )}

      {/* Tombol Tambah Supplier */}
      <button
        className="btn btn-outline mb-4"
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
                    className="btn btn-xs btn-warning mr-2"
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
                    className="btn btn-xs btn-error"
                    onClick={() => handleDelete(s.id)}
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
                className="btn btn-primary"
                onClick={handleAdd}
              >
                Simpan
              </button>
              <button
                type="button"
                className="btn"
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
                className="btn btn-primary"
                onClick={handleUpdate}
              >
                Simpan
              </button>
              <button
                type="button"
                className="btn"
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
