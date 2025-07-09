"use client";
import React, { useEffect, useState } from "react";

const SalesLayout = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedSale, setSelectedSale] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  // Refactor fetchSales supaya bisa dipanggil ulang
  const fetchSales = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/sales/with-items");
      if (!response.ok) {
        throw new Error("Failed to fetch sales data");
      }
      const data = await response.json();
      setSales(data.data || []);
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleShowDetail = async (salesId) => {
    setDetailLoading(true);
    setDetailError("");
    setSelectedSale(null);
    try {
      const response = await fetch(`/api/sales/with-items/${salesId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch sale detail");
      }
      const data = await response.json();
      setSelectedSale(data.data);
      document.getElementById("my_modal_1").showModal();
    } catch (err) {
      setDetailError(err.message || "Unknown error");
    } finally {
      setDetailLoading(false);
    }
  };

  console.log(selectedSale);
  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchLoading(true);
    setSearchError("");
    if (!search.trim()) {
      // Jika search kosong, tampilkan semua sales
      await fetchSales();
      setSearchLoading(false);
      return;
    }
    try {
      const response = await fetch(
        `/api/sales/with-items/search/${encodeURIComponent(search)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch sales by customer name");
      }
      const data = await response.json();
      setSales(data.data || []);
    } catch (err) {
      setSearchError(err.message || "Unknown error");
      setSales([]);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="overflow-y-scroll">
      <h1>Sales Dashboard</h1>
      <p>Total Sales: {sales.length}</p>
      <form onSubmit={handleSearch} style={{ marginBottom: 16 }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari Berdasarkan Nama Pelanggan"
          className="border border-black rounded px-3 py-2 mb-2"
          style={{ width: "100%", maxWidth: "400px" }}
        />
        <button type="submit" className="btn ml-2" disabled={searchLoading}>
          {searchLoading ? "Searching..." : "Cari"}
        </button>
      </form>
      {searchError && <div style={{ color: "red" }}>{searchError}</div>}
      {sales.length === 0 ? (
        <p>No sales found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>ID</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Nama Pelanggan
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Date</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Items
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Total Harga
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Nama Pegawai
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.sales_id}>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {sale.sales_id}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {sale.customer_name}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {sale.created_at
                    ? new Date(sale.created_at).toLocaleDateString()
                    : "N/A"}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {sale.items && sale.items.length > 0 ? (
                      sale.items.map((item) => (
                        <li key={`${item.item_type}-${item.item_id}`}>
                          {item.item_name} (Qty: {item.qty})
                        </li>
                      ))
                    ) : (
                      <li>No items</li>
                    )}
                  </ul>
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  Rp {Number(sale.grand_total).toLocaleString("id-ID")}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  <p>{sale.employee_name}</p>
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  <button
                    className="btn"
                    onClick={() => handleShowDetail(sale.sales_id)}
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <dialog id="my_modal_1" className="modal">
        <div className="modal-box bg-white text-black">
          {detailLoading ? (
            <div>Loading detail...</div>
          ) : detailError ? (
            <div style={{ color: "red" }}>{detailError}</div>
          ) : selectedSale ? (
            <div>
              <h2>Detail Penjualan</h2>
              <p>
                <strong>ID:</strong> {selectedSale.sales_id}
              </p>
              <p>
                <strong>Nama Pelanggan:</strong> {selectedSale.customer_name}
              </p>
              <p>
                <strong>Tanggal:</strong>{" "}
                {selectedSale.created_at
                  ? new Date(selectedSale.created_at).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                <strong>Nama Pegawai:</strong> {selectedSale.employee_name}
              </p>
              <p>
                <strong>Sub Harga:</strong>Rp{" "}
                {Number(selectedSale.sub_total).toLocaleString("id-ID")}
              </p>
              <p>
                <strong>Total Diskon:</strong>Rp{" "}
                {Number(selectedSale.discount_total).toLocaleString("id-ID")}
              </p>
              <p>
                <strong>Catatan:</strong> {selectedSale.notes}
              </p>
              <p>
                <strong>Total Harga:</strong> Rp{" "}
                {Number(selectedSale.grand_total).toLocaleString("id-ID")}
              </p>
              <p>
                <strong>Metode Pembayaran :</strong>{" "}
                {selectedSale.payment_methods_name}
              </p>
              <p>
                <strong>Bayar:</strong>Rp{" "}
                {Number(selectedSale.paid).toLocaleString("id-ID")}
              </p>
              <div>
                <strong>Items:</strong>
                <ul>
                  {selectedSale.items && selectedSale.items.length > 0 ? (
                    selectedSale.items.map((item) => (
                      <li key={`${item.item_type}-${item.item_id}`}>
                        {item.item_name} (Qty: {item.qty}) (harga:Rp.
                        {item.unit_price})
                      </li>
                    ))
                  ) : (
                    <li>No items</li>
                  )}
                </ul>
              </div>
            </div>
          ) : (
            <div>Pilih penjualan untuk melihat detail.</div>
          )}
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default SalesLayout;
