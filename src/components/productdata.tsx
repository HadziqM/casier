interface Props {
  name: string;
  price: number;
  stock: number;
  telp?: string;
  useCase: "product" | "cart" | "debt";
  selected: () => void;
}

import { FaCartPlus, FaEdit, FaClipboardList } from "react-icons/fa";
import { currency, telepon } from "../lib/math";
export default function Card(prop: Props) {
  const icon = () => {
    if (prop.useCase == "product") {
      return <FaCartPlus className="flex text-purple-400 w-6 h-6" />;
    } else if (prop.useCase == "cart") {
      return <FaEdit className="flex text-purple-400 w-6 h-6" />;
    } else {
      return <FaClipboardList className="flex text-purple-400 w-6 h-6" />;
    }
  };
  return (
    <div className="flex text-gray-200 text-[0.8rem] w-[600px] text-center border-b border-purple-900">
      <p className="w-[270px] truncate py-[2px] border-r border-purple-900 text-left pl-4">
        {prop.useCase == "debt" ? (
          <a href={`https://wa.me/62${prop.telp?.slice(1)}`} target={"_blank"}>
            {`${prop.name} | (${telepon(prop.telp || "")})`}
          </a>
        ) : (
          prop.name
        )}
      </p>
      <p className="w-[100px] truncate py-[2px] border-r border-purple-900">
        {prop.useCase == "debt"
          ? prop.stock == 0
            ? "No date"
            : new Date(prop.stock * 1000).toLocaleDateString()
          : prop.stock}
      </p>
      <p className="w-[180px] truncate py-[2px] border-r border-purple-900">
        {currency(prop.price)}
      </p>
      <button
        onClick={prop.selected}
        className="cursor-pointer h-fit w-[50px] flex justify-center"
      >
        {icon()}
      </button>
    </div>
  );
}
