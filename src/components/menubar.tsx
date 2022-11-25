import { FaHome, FaShoppingCart, FaMonero, FaPrint } from "react-icons/fa";

export default function Menu() {
  return (
    <div className="flex absolute left-0 h-screen flex-col justify-center items-center">
      <div>
        <FaHome />
      </div>
      <div>
        <FaShoppingCart />
      </div>
      <div>
        <FaPrint />
      </div>
      <div>
        <FaMonero />
      </div>
    </div>
  );
}
