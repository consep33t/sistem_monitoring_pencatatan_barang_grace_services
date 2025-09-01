import { NextResponse } from "next/server";

export async function GET() {
  // Clear cookies NextAuth
  const response = NextResponse.json({ message: "Logged out" });
  response.cookies.set("next-auth.session-token", "", { maxAge: -1 });
  response.cookies.set("__Secure-next-auth.session-token", "", { maxAge: -1 });
  return response;
}
