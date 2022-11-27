import { motion } from "framer-motion";
import { useState } from "react";
import { ModalData } from "../type";
import { currency } from "../lib/math";
import Backdrop from "./backdrop";

interface Props {
  data: ModalData;
  handleClose: () => void;
  handleEvent: (data: ModalData, unit: number) => void;
}

export default function Modal({ handleClose, data, handleEvent }: Props) {
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
  const add_unit = () => {
    unit < data.stock && setUnit(unit + 1);
  };
  const sub_unit = () => {
    unit > 1 && setUnit(unit - 1);
  };
  return (
    <Backdrop>
      <motion.div
        onClick={(e) => e.stopPropagation}
        className="w-[clamp(50%,700px,90%)] h-[min(50%,300px)] m-auto p-8 rounded-xl flex flex-col items-center bg-[#404] text-gray-300 z-50 justify-between"
        variants={dropIn}
        initial="hiden"
        exit="exit"
        animate="visible"
      >
        <h1 className="uppercase text-[1.5rem] font-bold">Add to Cart</h1>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 justify-center">
            <span className="bg-[#202] rounded-[30%] p-2 w-[60px] text-center">
              {unit}
            </span>
            <div className="flex flex-col gap-4">
              <button onClick={() => add_unit()}>➕</button>
              <button onClick={() => sub_unit()}>➖</button>
            </div>
          </div>
          <p>Total = {currency(data.price * unit)}</p>
        </div>
        <div className="flex gap-12">
          <button
            onClick={() => {
              handleEvent(data, unit);
              handleClose();
            }}
            className="px-2 py-[0.1rem] rounded-full bg-purple-800 hover:bg-purple-600 my-1"
          >
            🛒 Beli
          </button>
          <button
            onClick={() => handleClose()}
            className="px-2 py-[0.1rem] rounded-full bg-purple-900 hover:bg-purple-600 my-1"
          >
            ❌ Tutup
          </button>
        </div>
      </motion.div>
    </Backdrop>
  );
}
