import { useState } from "react";
import { Product } from "./type";
import { open, save } from "@tauri-apps/api/dialog";
import Login from "./loginscreen";
import Card from "./components/productdata";

export default function Main() {
  const [product, setProduct] = useState({} as Product);
  const [login, setLogin] = useState(false);
  return (
    <>
      {login ? (
        <div className="h-full w-full flex flex-col items-center">
          <h1>Its main Screen</h1>
          <button onClick={() => setLogin(false)}>Back</button>
          <p>{product.totalItems || 0}</p>
          <div className="relative flex-flex-col w-[612px] h-[400px] overflow-auto border border-gray-100">
            <div className="flex w-[600px] top-0 text-gray-200 text-[1rem] text-center border border-gray-600 bg-gray-800 sticky">
              <p className="w-[300px] truncate py-[2px] border-r border-gray-600">
                Nama
              </p>
              <p className="w-[180px] truncate py-[2px] border-r border-gray-600">
                Harga
              </p>
              <p className="w-[70px] truncate py-[2px] border-r border-gray-600">
                Stok
              </p>
              <p className="w-[50px] truncate py-[2px] border-r border-gray-600">
                Buy
              </p>
            </div>
            <div className="absolute bottom-0 h-[570px] overflow-auto"></div>
            {product.items.map((e) => (
              <Card
                name={e.name}
                price={e.price}
                stock={e.stock}
                selected={() => open()}
              />
            ))}
          </div>
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
