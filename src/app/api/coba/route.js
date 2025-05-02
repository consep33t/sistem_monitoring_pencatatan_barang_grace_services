import barang from "@/app/data/barang";

export async function GET(request) {
  return new Response(
    JSON.stringify({ message: "GET request successful", data: barang }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

export async function POST(request) {
  const body = await request.json();
  return new Response(
    JSON.stringify({ message: "POST request successful", data: body }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
