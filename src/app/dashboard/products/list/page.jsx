import ProductsList from "@/app/layout/ProductList";
import Link from "next/link";

const productsListPage = () => {
  return (
    <div className="flex h-screen flex-col w-full p-8">
      <Link href="/dashboard/products/add" className="btn btn-primary mb-4">
        Tambah Produk
      </Link>
      <ProductsList />
    </div>
  );
};
export default productsListPage;
