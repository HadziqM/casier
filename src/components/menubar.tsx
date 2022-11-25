import { FaHome, FaShoppingCart, FaMoneyBill, FaPrint } from "react-icons/fa";

export default function Menu() {
  return (
    <div className="flex absolute left-0 h-screen flex-col justify-center items-center w-[100px] bg-[rgba(20,0,20,0.8)]">
      <div>
        <FaHome className="w-10 h-10 my-4 text-purple-700" />
      </div>
      <div>
        <FaShoppingCart className="w-10 h-10 my-4 text-purple-700" />
      </div>
      <div>
        <FaPrint className="w-10 h-10 my-4 text-purple-700" />
      </div>
      <div>
        <FaMoneyBill className="w-10 h-10 my-4 text-purple-700" />
      </div>
    </div>
  );
}
