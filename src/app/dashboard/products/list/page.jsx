import LogsLayout from "@/app/layout/LogsLayout";
import ProductsList from "@/app/layout/ProductList";
import PurchaseInLayout from "@/app/layout/PurchaseInLayout";
import StokLayout from "@/app/layout/StokLayout";
import { getSessionUser } from "@/app/lib/session";
import Link from "next/link";

const productsListPage = async () => {
  const user = await getSessionUser();

  console.log(user);

  return (
    <div className="flex h-screen flex-col w-full p-8 overflow-scroll">
      <Link
        href="/dashboard/products/add"
        className="btn btn-neutral btn-outline mb-4"
      >
        Tambah Produk
      </Link>
      <StokLayout />
      <PurchaseInLayout user={user} />
      <LogsLayout />
    </div>
  );
};
export default productsListPage;
