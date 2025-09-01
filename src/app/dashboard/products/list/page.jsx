import LogsLayout from "@/app/layout/LogsLayout";
import PurchaseInLayout from "@/app/layout/PurchaseInLayout";
import StokLayout from "@/app/layout/StokLayout";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import Link from "next/link";

const productsListPage = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user || null;

  return (
    <div className="flex h-screen flex-col w-full p-8 overflow-scroll">
      <Link
        href="/dashboard/products/add"
        className="btn btn-neutral btn-outline rounded-md mb-4"
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
