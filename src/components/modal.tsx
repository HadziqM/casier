import { motion } from "framer-motion";
import { useState } from "react";
import { ModalData } from "../type";
import { currency } from "../lib/math";
import Backdrop from "./backdrop";

interface Props {
  cart?: true;
  buy?: true;
  data: ModalData;
  handleClose: () => void;
  handleEvent: (data: ModalData, unit: number) => Promise<void>;
  handleDelete?: (data: ModalData, unit: number) => Promise<void>;
}

export default function Modal({
  handleClose,
  data,
  handleEvent,
  cart,
  buy,
  handleDelete,
}: Props) {
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
  const [unit, setUnit] = useState(cart ? Number(data.unit) : 1);
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
        className="w-[clamp(50%,700px,90%)] h-[min(50%,300px)] m-auto p-8 rounded-xl flex flex-col items-center bg-[#404] text-gray-300 z-50 justify-between relative"
        variants={dropIn}
        initial="hiden"
        exit="exit"
        animate="visible"
      >
        {buy ? (
          <>
            <button className="absolute top-1 right-1" onClick={handleClose}>
              ❌
            </button>
            <h1 className="font-bold text-[1.2rem] mb-2">
              Masukkan Data Pelanggan
            </h1>
            <div className="flex gap-4">
              <div>
                <form className="flex flex-col gap-1" onSubmit={handleClose}>
                  <div className="flex">
                    <label className="w-[100px] mr-4">Nama</label>
                    <input
                      id="name"
                      type={"text"}
                      required
                      placeholder="Isi Nama Pelanggan"
                      className="p-1 placeholder:text-gray-400 placeholder:text-[0.8rem]"
                    />
                  </div>
                  <div className="flex">
                    <label className="w-[100px] mr-4">Alamat</label>
                    <input
                      id="alamat"
                      type={"text"}
                      placeholder="Tidak harus diisi"
                      className="p-1 placeholder:text-gray-400 placeholder:text-[0.8rem]"
                    />
                  </div>
                  <div className="flex">
                    <label className="w-[100px] mr-4">Dibayar</label>
                    <input
                      id="total"
                      type={"number"}
                      placeholder="Dalam Rupiah"
                      className="p-1 placeholder:text-gray-400 placeholder:text-[0.8rem]"
                    />
                  </div>
                  <div className="flex">
                    <label className="w-[100px] mr-4">Tenggak*</label>
                    <input id="tenggang" type={"date"} />
                    <div className="ml-2">
                      <p className="text-[0.7rem]">Apabila hutang</p>
                      <p className="text-[0.7rem]">(Tidak harus diisi)</p>
                    </div>
                  </div>
                  <div className="flex gap-8 justify-center w-full mt-2">
                    <button
                      className="px-2 py-[0.1rem] rounded-full bg-purple-900 hover:bg-purple-600 my-1"
                      type="submit"
                    >
                      ❕Beli
                    </button>
                  </div>
                </form>
              </div>
              <div>
                <h1>Total</h1>
                <h1>Dibayar</h1>
                <h1>Kembalian</h1>
              </div>
            </div>
          </>
        ) : (
          <>
            <h1 className="uppercase text-[1.5rem] font-bold">
              {cart ? "Edit Cart" : "Add to Cart"}
            </h1>
            <p>{data.name}</p>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 justify-center">
                <span className="bg-[#202] rounded-[30%] p-2 w-[60px] text-center">
                  {unit}
                </span>
                <div className="flex flex-col gap-4">
                  <button onClick={() => add_unit()}>➕</button>
                  <button onClick={() => sub_unit()}>➖</button>
                </div>
                {cart && (
                  <div>
                    <button
                      className="ml-8 bg-purple-900"
                      onClick={async () => {
                        if (handleDelete == undefined) return;
                        await handleDelete(data, unit);
                        handleClose();
                      }}
                    >
                      🔥 Delete
                    </button>
                  </div>
                )}
              </div>
              <p>Total = {currency(data.price * unit)}</p>
            </div>
            <div className="flex gap-12">
              <button
                onClick={async () => {
                  await handleEvent(data, unit);
                  handleClose();
                }}
                className="px-2 py-[0.1rem] rounded-full bg-purple-800 hover:bg-purple-600 my-1"
              >
                {cart ? "✏️ Ubah" : "🛒 Beli"}
              </button>
              <button
                onClick={() => handleClose()}
                className="px-2 py-[0.1rem] rounded-full bg-purple-900 hover:bg-purple-600 my-1"
              >
                ❌ Tutup
              </button>
            </div>
          </>
        )}
      </motion.div>
    </Backdrop>
  );
}
