interface Props {
  name: string;
  price: number;
  stock: number;
  selected: () => void;
}

import { FaCartPlus } from "react-icons/fa";
export default function Card(prop: Props) {
  return (
    <div className="flex text-gray-200 text-[0.8rem] w-[600px] text-center border border-gray-600">
      <p className="w-[300px] truncate py-[2px] border-r border-gray-600 text-left">
        {prop.name}
      </p>
      <p className="w-[180px] truncate py-[2px] border-r border-gray-600">{`Rp.${prop.price.toLocaleString(
        "id-ID"
      )}`}</p>
      <p className="w-[70px] truncate py-[2px] border-r border-gray-600">
        {prop.stock}
      </p>
      <button
        onClick={prop.selected}
        className="cursor-pointer h-fit w-[50px] flex justify-center"
      >
        <FaCartPlus className="flex text-green-500 w-6 h-6" />
      </button>
    </div>
  );
}
