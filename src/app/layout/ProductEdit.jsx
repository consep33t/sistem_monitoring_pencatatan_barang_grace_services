"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  /* ambil data awal */
  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then(setProduct)
      .catch(() => setMsg("Gagal mengambil data"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("Menyimpan...");
    const fd = new FormData(e.target);
    if (imageFile) fd.set("gambar", imageFile);

    const res = await fetch(`/api/products/${id}`, { method: "PUT", body: fd });
    const data = await res.json();
    if (res.ok) {
      setMsg(data.message);
      router.push("/products/list");
    } else {
      setMsg(data.error || "Gagal menyimpan");
    }
  };

  if (loading) return <p className="p-4">Loading ...</p>;
  if (!product) return <p className="p-4">Produk tidak ditemukan</p>;

  return (
    <div className="flex flex-col w-full p-8 space-y-4">
      <h2 className="text-xl font-bold text-black">Edit Produk</h2>
      {msg && <p>{msg}</p>}

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="space-y-4"
      >
        <input
          name="sku"
          defaultValue={product.sku}
          className="input bg-white border rounded-md border-black input-bordered w-full"
          required
        />
        <input
          name="name"
          defaultValue={product.name}
          className="input bg-white border rounded-md border-black input-bordered w-full"
          required
        />
        <input
          name="category"
          defaultValue={product.category || ""}
          className="input bg-white border rounded-md border-black input-bordered w-full"
        />
        <input
          name="brand"
          defaultValue={product.brand || ""}
          className="input bg-white border rounded-md border-black input-bordered w-full"
        />
        <input
          name="unit_cost"
          type="number"
          step="0.01"
          defaultValue={product.unit_cost}
          className="input bg-white border rounded-md border-black input-bordered w-full"
          required
        />
        <input
          name="unit_price"
          type="number"
          step="0.01"
          defaultValue={product.unit_price}
          className="input bg-white border rounded-md border-black input-bordered w-full"
          required
        />

        {product.image_url && (
          <div>
            <p className="text-sm mb-1">Gambar saat ini:</p>
            <img
              src={product.image_url}
              alt="current"
              className="w-32 h-32 object-contain border mb-2"
            />
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="file-input file-input-bordered w-full"
        />

        <button className="btn btn-primary">Simpan</button>
      </form>
    </div>
  );
}
