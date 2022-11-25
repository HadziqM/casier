interface Props {
  name: string;
  price: number;
  stock: number;
  selected: () => void;
}

import { FaCartPlus } from "react-icons/fa";
export default function Card(prop: Props) {
  return (
    <div className="flex text-gray-200 text-[0.8rem] w-[600px] text-center border-b border-purple-900">
      <p className="w-[300px] truncate py-[2px] border-r border-purple-900 text-left pl-4">
        {prop.name}
      </p>
      <p className="w-[180px] truncate py-[2px] border-r border-purple-900">{`Rp.${prop.price.toLocaleString(
        "id-ID"
      )}`}</p>
      <p className="w-[70px] truncate py-[2px] border-r border-purple-900">
        {prop.stock}
      </p>
      <button
        onClick={prop.selected}
        className="cursor-pointer h-fit w-[50px] flex justify-center"
      >
        <FaCartPlus className="flex text-purple-400 w-6 h-6" />
      </button>
    </div>
  );
}
