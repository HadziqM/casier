interface Props {
  name: string;
  price: number;
  stock: number;
  useCase: "product" | "cart" | "debt";
  selected: () => void;
}

import { FaCartPlus, FaEdit, FaPhone } from "react-icons/fa";
import { currency } from "../lib/math";
export default function Card(prop: Props) {
  const icon = () => {
    if (prop.useCase == "product") {
      return <FaCartPlus className="flex text-purple-400 w-6 h-6" />;
    } else if (prop.useCase == "cart") {
      return <FaEdit className="flex text-purple-400 w-6 h-6" />;
    } else {
      return <FaPhone className="flex text-purple-400 w-6 h-6" />;
    }
  };
  return (
    <div className="flex text-gray-200 text-[0.8rem] w-[600px] text-center border-b border-purple-900">
      <p className="w-[300px] truncate py-[2px] border-r border-purple-900 text-left pl-4">
        {prop.name}
      </p>
      <p className="w-[70px] truncate py-[2px] border-r border-purple-900">
        {prop.stock}
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
