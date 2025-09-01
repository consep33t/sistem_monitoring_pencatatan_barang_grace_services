import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function getSessionUser() {
  const cookieStore = await cookies(); // ✅ sekarang pakai await
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return user;
  } catch (err) {
    return null;
  }
}
