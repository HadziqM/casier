import { motion } from "framer-motion";
import { useState } from "react";
import Backdrop from "./backdrop";

interface Props {
  data: {
    name: string;
    price: number;
    stock: number;
    id: string;
  };
  handleClose: React.MouseEventHandler<HTMLDivElement | HTMLButtonElement>;
}

export default function Modal({ handleClose, data }: Props) {
  const dropIn = {
    hiden: { y: "-100vh", opacity: 0 },
    visible: {
      y: "0",
      opacity: 1,
      transition: {
        duration: 0.2,
        damping: 25,
        type: "spring",
        stiffness: 500,
      },
    },
    exit: { y: "100vh", opacity: 0 },
  };
  const [unit, setUnit] = useState(1);
  const price = () => {
    const total = data.price * unit;
    return `Rp. ${total.toLocaleString("id-ID")}`;
  };
  return (
    <Backdrop>
      <motion.div
        onClick={(e) => e.stopPropagation}
        className="w-[clamp(50%,700px,90%)] h-[min(50%,300px)] m-auto p-8 rounded-md flex flex-col items-center bg-black text-white z-50"
        variants={dropIn}
        initial="hiden"
        exit="exit"
        animate="visible"
      >
        <h1>Add to Cart</h1>
        <form>
          <label>{data.name}</label>
          <input
            type={"number"}
            required
            maxLength={data.stock}
            value={unit}
            onChange={(e) => setUnit(Number(e.currentTarget.value))}
          />
          <label>{price()}</label>
        </form>
        <button
          onClick={handleClose}
          className="px-2 py-[0.1rem] rounded-full bg-red-700 hover:bg-red-600 my-1 text-white"
        >
          Close
        </button>
      </motion.div>
    </Backdrop>
  );
}
