import LogsLayout from "@/app/layout/LogsLayout";
import PurchaseInLayout from "@/app/layout/PurchaseInLayout";
import StokLayout from "@/app/layout/StokLayout";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import Link from "next/link";

// Helper function to fetch stock data
async function getStokData() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/products/stok`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch stock data");
  }
  return res.json();
}

// Helper function to fetch purchase-in data
async function getPurchaseInData() {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/products/stok/purchase-in`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch purchase-in data");
  }
  return res.json();
}

// Helper function to fetch logs data
async function getLogsData() {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/products/stok/logs`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch logs data");
  }
  return res.json();
}

const productsListPage = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user || null;

  const [stokData, purchaseInData, logsData] = await Promise.all([
    getStokData(),
    getPurchaseInData(),
    getLogsData(),
  ]);

  return (
    <div className="flex h-screen flex-col w-full p-8 overflow-scroll">
      <Link
        href="/dashboard/products/add"
        className="btn btn-neutral btn-outline rounded-md mb-4"
      >
        Tambah Produk
      </Link>
      <StokLayout products={stokData} />
      <PurchaseInLayout user={user} purchases={purchaseInData} />
      <LogsLayout logs={logsData} />
    </div>
  );
};
export default productsListPage;
