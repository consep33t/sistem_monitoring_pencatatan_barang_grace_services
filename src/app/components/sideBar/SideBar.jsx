"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Kasir" },
  { href: "/penjualan", label: "Penjualan" },
  { href: "/products/list", label: "Produk" },
  { href: "/services", label: "Services" },
  { href: "/pengaturan", label: "Pengaturan" },
];

const SideBar = () => {
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
      <p className="text-center">@bla bla bla</p>
    </div>
  );
};

export default SideBar;
