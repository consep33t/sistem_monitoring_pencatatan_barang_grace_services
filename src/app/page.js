import CartPanel from "./components/CartPanel";
import ProductsLayout from "./layout/ProductLayout";

const Home = () => {
  return (
    <div className="flex w-full flex-col md:flex-row">
      <div className="mid w-full flex flex-col justify-center p-8">
        <ProductsLayout />
      </div>
      <div className="right w-1/3 bg-white shadow-2xl">
        <CartPanel />
      </div>
    </div>
  );
};
export default Home;
