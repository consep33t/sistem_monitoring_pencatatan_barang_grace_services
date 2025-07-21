"use client";
import { useEffect, useState } from "react";
import TableStok from "../components/table/TableStok";

const StokLayout = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products/stok")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="stok-layout">
      <h1 className="text-2xl font-bold my-4">Daftar Stok</h1>
      <TableStok products={products} />
    </div>
  );
};

export default StokLayout;
