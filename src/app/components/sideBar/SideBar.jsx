"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

const links = [
  { href: "/dashboard", label: "Kasir" },
  { href: "/dashboard/penjualan", label: "Penjualan" },
  { href: "/dashboard/products/list", label: "Produk" },
  { href: "/dashboard/suppliers", label: "Suppliers" },
  { href: "/dashboard/pengaturan", label: "Pengaturan" },
];

const SideBar = ({ user }) => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col justify-between h-screen py-5 px-5 ">
      <div className="flex gap-2 flex-col w-full">
        <h1 className="w-full mb-5 font-bold py-1 px-3 text-center text-xl">
          GRACE SERVICES
        </h1>
        {links.map((link, idx) => (
          <Link
            key={idx}
            className={`hover:bg-slate-200 w-full py-3 border hover:cursor-pointer border-b-gray-600 rounded-md text-center ${
              pathname === link.href ? "border-gray-600 border-2" : ""
            }`}
            href={link.href}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <div className="flex flex-col items-center gap-2">
        <h1 className="font-bold">Selamat Datang, {user.name}</h1>
        <button
          className="btn rounded"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          logout
        </button>
      </div>
    </div>
  );
};

export default SideBar;
