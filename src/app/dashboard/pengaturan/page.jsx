import Link from "next/link";

const pengaturanPage = () => {
  return (
    <div className="flex flex-col items-center w-full p-8 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Pengaturan</h1>
      <ul>
        <li>
          <Link
            className="btn btn-neutral btn-outline"
            href="/dashboard/pengaturan/akun"
          >
            Pengaturan Akun
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default pengaturanPage;
