import CartPanel from "../components/CartPanel";
import ProductsLayout from "../layout/ProductLayout";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

const Home = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <div className="flex h-screen w-full flex-col md:flex-row">
      <div className="mid w-full flex flex-col justify-center">
        <ProductsLayout />
      </div>
      <div className="right w-1/3 bg-white shadow-2xl">
        <CartPanel user={user} />
      </div>
    </div>
  );
};
export default Home;
