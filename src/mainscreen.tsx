import { useState } from "react";
import { Product } from "./type";
import Login from "./loginscreen";

export default function Main() {
  const [product, setProduct] = useState({} as Product);
  const [login, setLogin] = useState(false);
  return (
    <>
      {login ? (
        <div className="h-full w-full flex flex-col">
          <h1>Its main Screen</h1>
        </div>
      ) : (
        <Login
          logged={() => setLogin(true)}
          productData={(data: Product) => setProduct(data)}
        />
      )}
    </>
  );
}
