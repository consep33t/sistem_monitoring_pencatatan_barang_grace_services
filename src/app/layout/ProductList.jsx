"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProductsList({ products }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoad] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchAll = async () => {
    setLoad(true);
    setError(null);
    try {
      const res = await fetch("/api/products");
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setRows(json.data);
    } catch (e) {
      setError(e.message || "Gagal memuat produk");
      setRows([]);
    } finally {
      setLoad(false);
    }
  };

  const fetchByName = async (name) => {
    setLoad(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/products/search/${encodeURIComponent(name)}`
      );
      if (res.status === 404) {
        setRows([]);
        return setError("Produk tidak ditemukan");
      }
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setRows([json]);
    } catch (e) {
      setError(e.message || "Gagal memuat produk");
      setRows([]);
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return fetchAll();
    fetchByName(query.trim());
  };

  const onReset = () => {
    setQuery("");
    fetchAll();
  };

  return (
    <div className="flex flex-col w-full p-8 h-screen overflow-hidden">
      <h1 className="text-2xl font-bold mb-6">Daftar Produk</h1>

      <form onSubmit={onSubmit} className="flex gap-2 mb-6">
        <input
          className="border rounded px-3 py-2 flex-1"
          placeholder="Cari nama produk ..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="btn btn-neutral btn-outline px-4 py-2 rounded">
          Cari
        </button>
        {query && (
          <button
            type="button"
            onClick={onReset}
            className="text-gray-600 underline"
          >
            Reset
          </button>
        )}
      </form>

      {loading && <p className="text-center">Loading…</p>}
      {error && (
        <p className="text-center text-red-600">
          Produk tidak di temukan error code: 401
        </p>
      )}
      {!loading && !error && rows.length === 0 && (
        <p className="text-center">Belum ada produk.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 overflow-scroll overflow-x-hidden">
        {rows.map((p) => (
          <div key={p.id} className="border rounded p-4 shadow">
            {p.image_url ? (
              <img
                src={p.image_url}
                alt={p.name}
                className="w-full h-48 object-contain mb-3"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center mb-3">
                No Image
              </div>
            )}
            <h2 className="text-lg font-semibold mb-2">{p.name}</h2>
            <p className="text-sm text-gray-500">Kategori: {p.category}</p>
            <p className="text-sm text-gray-500">Merek: {p.brand}</p>
            <p className="font-semibold mt-1">
              Rp {Number(p.unit_price).toLocaleString("id-ID")}
            </p>

            <div className="mt-4 flex justify-between">
              <Link
                href={`/products/${p.id}/edit`}
                className="text-blue-600 text-sm hover:underline mt-2 inline-block"
              >
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
