"use client";
import TableStok from "../components/table/TableStok";

const StokLayout = ({ products }) => {
  return (
    <div className="stok-layout">
      <h1 className="text-2xl font-bold my-4">Daftar Stok</h1>
      <TableStok products={products} />
    </div>
  );
};

export default StokLayout;
