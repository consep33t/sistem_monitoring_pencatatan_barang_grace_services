"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Kasir" },
  { href: "/dashboard/penjualan", label: "Penjualan" },
  { href: "/dashboard/products/list", label: "Produk" },
  { href: "/dashboard/services", label: "Services" },
  { href: "/dashboard/pengaturan", label: "Pengaturan" },
];

const SideBar = ({ user }) => {
  const pathname = usePathname();

  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

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
      <h1 className="text-xl font-bold">
        Selamat Datang, {user.employee_name}
      </h1>
      <p className="text-sm text-gray-600">Role: {user.role_name}</p>
      <p className="text-center">@bla bla bla</p>
      <button onClick={handleLogout}>logout</button>
    </div>
  );
};

export default SideBar;
