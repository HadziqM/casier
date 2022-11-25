import { useState } from "react";
import { Product } from "./type";
import { open, save } from "@tauri-apps/api/dialog";
import Login from "./loginscreen";
import ProductSc from "./productscreen";
import Card from "./components/productdata";

export default function Main() {
  const [product, setProduct] = useState({} as Product);
  const [login, setLogin] = useState(false);
  return (
    <>
      {login ? (
        <>
          <ProductSc product={product} />
          <div className="flex flex-col items-center absolute bottom-0">
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
