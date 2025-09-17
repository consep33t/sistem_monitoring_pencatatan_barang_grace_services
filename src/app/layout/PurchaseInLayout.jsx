"use client";
import { useEffect, useState } from "react";
import TablePurchaseIn from "../components/table/TablePurchaseIn";
import AlertModal from "../components/AlertModal";

const PurchaseInPage = ({ user, purchases }) => {
  const [alert, setAlert] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  const [data, setData] = useState(purchases);
  const [form, setForm] = useState({
    product_id: "",
    qty: "",
    cost: "",
    supplier_id: "",
  });

  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const fetchData = () => {
    fetch("/api/products/stok/purchase-in")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchData();

    fetch("/api/products")
      .then((res) => res.json())
      .then((res) => setProducts(res?.data || []))
      .catch(() => setProducts([]));

    fetch("/api/suppliers")
      .then((res) => res.json())
      .then((res) => setSuppliers(Array.isArray(res) ? res : []))
      .catch(() => setSuppliers([]));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { product_id, qty, cost, supplier_id } = form;
    if (!product_id || !qty || !cost || !supplier_id) {
      showAlert("error", "Semua field wajib diisi");
      return;
    }

    const res = await fetch("/api/products/stok/purchase-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_id: parseInt(product_id),
        qty: parseInt(qty),
        cost: parseFloat(cost),
        supplier_id: parseInt(supplier_id),
        employee_id: user?.id || null,
      }),
    });

    const result = await res.json();
    if (result.success) {
      showAlert("success", "Berhasil menambahkan pembelian");
      document.getElementById("modal_add_purchase_in").close();
      setForm({ product_id: "", qty: "", cost: "", supplier_id: "" });
      fetchData();
      window.location.reload();
    } else {
      showAlert("error", "Gagal: " + result.error);
    }
  };

  return (
    <div className="mt-8">
      <AlertModal
        show={alert.show}
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ ...alert, show: false })}
      />
      <h1 className="text-xl font-bold mb-4">Pembelian Masuk</h1>

      <button
        className="btn rounded btn-outline mb-4"
        onClick={() =>
          document.getElementById("modal_add_purchase_in").showModal()
        }
      >
        Tambah Pembelian
      </button>

      <TablePurchaseIn purchases={data} refreshData={fetchData} />

      {/* Modal Form */}
      <dialog id="modal_add_purchase_in" className="modal">
        <div className="modal-box bg-[#f5f5f5]">
          <h3 className="font-bold text-lg mb-2">Tambah Pembelian</h3>
          <form method="dialog" className="space-y-3">
            <select
              name="product_id"
              value={form.product_id}
              onChange={handleChange}
              className="select select-bordered w-full border-black bg-transparent"
            >
              <option value="">-- Pilih Produk --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <select
              name="supplier_id"
              value={form.supplier_id}
              onChange={handleChange}
              className="select select-bordered w-full border-black bg-transparent"
            >
              <option value="">-- Pilih Supplier --</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="qty"
              value={form.qty}
              onChange={handleChange}
              className="input input-bordered w-full border-black bg-transparent"
              placeholder="Jumlah"
            />

            <input
              type="number"
              name="cost"
              value={form.cost}
              onChange={handleChange}
              className="input input-bordered w-full border-black bg-transparent"
              placeholder="Harga per unit"
            />

            <div className="modal-action">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                Simpan
              </button>
              <button
                type="button"
                className="btn"
                onClick={() =>
                  document.getElementById("modal_add_purchase_in").close()
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

export default PurchaseInPage;
