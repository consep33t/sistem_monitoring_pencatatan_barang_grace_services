import Link from "next/link";

const pengaturanAkunPage = () => {
  return (
    <div>
      <h1>Pengaturan Akun</h1>
      <li className=" list-none">
        <Link className="btn" href="/dashboard/pengaturan/akun/tambah-akun">
          Tambahkan Akun baru
        </Link>
      </li>
    </div>
  );
};

export default pengaturanAkunPage;
