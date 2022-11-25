import { useState } from "react";
import { Product } from "./type";
import Menu from "./components/menubar";
import Login from "./loginscreen";
import ProductSc from "./productscreen";

export default function Main() {
  const [product, setProduct] = useState({} as Product);
  const [login, setLogin] = useState(false);
  return (
    <>
      {login ? (
        <>
          <Menu />
          <ProductSc product={product} />
          <div className="flex flex-col items-center absolute bottom-0 right-0">
            <h1>Its main Screen</h1>
            <button onClick={() => setLogin(false)}>Back</button>
          </div>
        </>
      ) : (
        <Login
          logged={() => setLogin(true)}
          productData={(data: Product) => setProduct(data)}
        />
      )}
    </>
  );
}
