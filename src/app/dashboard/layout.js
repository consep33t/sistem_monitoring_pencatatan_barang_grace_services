import SideBar from "../components/sideBar/SideBar";
import { CartProvider } from "../context/CartContext";
import { getSessionUser } from "../lib/session";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/");
  }

  return (
    <div className="w-full h-[100dvh] flex flex-col md:flex-row antialiased">
      <div className="left w-1/5 bg-white shadow-2xl">
        <SideBar user={user} />
      </div>
      <div className="flex-1">
        <CartProvider>{children}</CartProvider>
      </div>
    </div>
  );
}
