const { default: ProductForm } = require("@/app/components/form/ProductForm ");

const addProductPage = () => {
  return <ProductForm />;
};
export default addProductPage;
export const metadata = {
  title: "Add Product",
  description: "Add a new product to the inventory",
};
export const dynamic = "force-dynamic";
export const revalidate = 0;
