import Link from "next/link";

const pengaturanAkunPage = () => {
  return (
    <div className="flex flex-col w-full p-8 space-y-4">
      <h1>Pengaturan Akun</h1>
      <li className="list-none">
        <Link
          className="btn rounded btn-neutral btn-outline"
          href="/dashboard/pengaturan/akun/tambah-akun"
        >
          Tambahkan Akun baru
        </Link>
      </li>
    </div>
  );
};

export default pengaturanAkunPage;
