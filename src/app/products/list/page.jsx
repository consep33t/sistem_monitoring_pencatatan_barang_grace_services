import ProductsList from "@/app/layout/ProductList";
import Link from "next/link";

const productsListPage = () => {
  return (
    <div className="flex flex-col w-full p-8">
      <Link href="/products/add" className="btn btn-primary mb-4">
        Tambah Produk
      </Link>
      <ProductsList />
    </div>
  );
};
export default productsListPage;
