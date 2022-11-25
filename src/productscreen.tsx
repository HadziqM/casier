import { useState } from "react";
import Card from "./components/productdata";
import { Product } from "./type";
interface Props {
  product: Product;
}
export default function ProductSc({ product }: Props) {
  const category = ["All", ...new Set(product.items?.map((e) => e.category))];
  const [selected, setSelected] = useState("All");
  const [count, setCount] = useState(product.totalItems || 0);

  return (
    <div className="flex flex-col absolute top-0 right-0 w-[calc(100vw-100px)] h-screen justify-center items-center">
      <p>{product.totalItems || 0}</p>
      <div className="p-[10px] border-[3px] border-purple-600 rounded-2xl bg-[rgba(30,0,30,0.8)]">
        <div className="relative flex-flex-col w-[632px] h-[380px] overflow-auto">
          <div className="flex w-[600px] top-0 text-gray-200 text-[1rem] text-center bg-purple-600 rounded-t-lg sticky">
            <p className="w-[300px] truncate py-[2px] border-r border-purple-900">
              Nama
            </p>
            <p className="w-[180px] truncate py-[2px] border-r border-purple-900">
              Harga
            </p>
            <p className="w-[70px] truncate py-[2px] border-r border-purple-900">
              Stok
            </p>
            <p className="w-[50px] truncate py-[2px]">Buy</p>
          </div>
          <div className="absolute bottom-0 h-[570px] overflow-auto"></div>
          {product.items?.map((e) => (
            <Card
              name={e.name}
              price={e.price}
              stock={e.stock}
              selected={() => open()}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
