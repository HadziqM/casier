import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { ModalData, CustomerData } from "../type";
import { currency } from "../lib/math";
import { ask } from "@tauri-apps/api/dialog";
import Backdrop from "./backdrop";

interface Props {
  cart?: true;
  buy?: true;
  data: ModalData;
  handleClose: () => void;
  handleEvent: (data: ModalData, unit: number) => Promise<void>;
  handleDelete?: (data: ModalData, unit: number) => Promise<void>;
  handleSubmit?: (data: CustomerData) => Promise<void>;
}

export default function Modal({
  handleClose,
  handleSubmit,
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
  const paidForm = useRef<HTMLInputElement | null>(null);
  const nameForm = useRef<HTMLInputElement | null>(null);
  const addressFrom = useRef<HTMLInputElement | null>(null);
  const dateForm = useRef<HTMLInputElement | null>(null);
  const companyForm = useRef<HTMLInputElement | null>(null);
  const [paid, setPaid] = useState(0);
  const [unit, setUnit] = useState(cart ? Number(data.unit) : 1);
  const add_unit = () => {
    unit < data.stock && setUnit(unit + 1);
  };
  const sub_unit = () => {
    unit > 1 && setUnit(unit - 1);
  };
  const change = (num: number) => {
    if (num > 0) {
      return currency(num);
    } else if (num == 0) {
      return "PAS";
    } else return "Kelebihan " + currency(num * -1);
  };
  return (
    <Backdrop>
      <motion.div
        onClick={(e) => e.stopPropagation}
        className="w-[clamp(50%,700px,90%)] m-auto p-8 rounded-xl flex flex-col items-center bg-[#404] text-gray-300 z-50 justify-between relative"
        style={{ height: buy ? "350px" : "300px" }}
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
                <form
                  className="flex flex-col gap-1"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (handleSubmit == undefined) return;
                    if (
                      await ask(
                        (data.total || 0) - paid < 0
                          ? `pastikan pelanggan sudah membayar dan diberi kembalian ${currency(
                              paid - (data.total || 0)
                            )} ok?`
                          : "pastikan pelanggan sudah membayar ok?",
                        { title: "Persetujuan", type: "info" }
                      )
                    ) {
                      await handleSubmit({
                        name: nameForm.current?.value || "",
                        total: data.total || 0,
                        paid:
                          (data.total || 0) - paid < 0 ? data.total || 0 : paid,
                        company: companyForm.current?.value,
                        due: dateForm.current?.value
                          ? Math.floor(
                              new Date(dateForm.current.value).getTime() / 1000
                            )
                          : undefined,
                        adrress: addressFrom.current?.value,
                      });
                      handleClose();
                    } else {
                      handleClose();
                    }
                  }}
                >
                  <div className="flex">
                    <label className="w-[100px] mr-4">Nama</label>
                    <input
                      id="name"
                      ref={nameForm}
                      type={"text"}
                      required
                      placeholder="Isi Nama Pelanggan"
                      className="px-1 placeholder:text-gray-400 placeholder:text-[0.8rem]"
                    />
                  </div>
                  <div className="flex">
                    <label className="w-[100px] mr-4">Alamat</label>
                    <input
                      id="alamat"
                      ref={addressFrom}
                      type={"text"}
                      placeholder="Tidak harus diisi"
                      className="px-1 placeholder:text-gray-400 placeholder:text-[0.8rem]"
                    />
                  </div>
                  <div className="flex">
                    <label className="w-[100px] mr-4">Perusahaan</label>
                    <input
                      id="company"
                      ref={companyForm}
                      type={"text"}
                      placeholder="Tidak harus diisi"
                      className="px-1 placeholder:text-gray-400 placeholder:text-[0.8rem]"
                    />
                  </div>
                  <div className="flex">
                    <label className="w-[100px] mr-4">Dibayar</label>
                    <input
                      required
                      id="total"
                      type={"number"}
                      ref={paidForm}
                      onChange={(e) => {
                        setPaid(Number(e.currentTarget.value));
                      }}
                      placeholder="Dalam Rupiah"
                      className="px-1 placeholder:text-gray-400 placeholder:text-[0.8rem]"
                    />
                  </div>
                  <div className="flex">
                    <label className="w-[100px] mr-4">Tenggak*</label>
                    <input id="tenggang" type={"date"} ref={dateForm} />
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
                      🛒 Beli
                    </button>
                  </div>
                </form>
              </div>
              <div className="gap-2 flex flex-col border-l-2 border-purple-600 pl-2">
                <h1 className="text-[0.8rem]">Total</h1>
                <p className="bg-[rgba(30,0,30,1)] w-[200px] text-center">
                  {currency(data.total || 0)}
                </p>
                <h1 className="text-[0.8rem]">Dibayar</h1>
                <p className="bg-[rgba(30,0,30,1)] w-[200px] text-center">
                  {currency(paid)}
                </p>
                <h1 className="text-[0.8rem]">Kurang</h1>
                <p className="bg-[rgba(30,0,30,1)] w-[200px] text-center">
                  {change((data.total || 0) - paid)}
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <h1 className="uppercase text-[1.5rem] font-bold">
              {cart ? "Edit Cart" : "Add to Cart"}
            </h1>
            <p className="p-2 bg-[rgba(30,0,30,1)] rounded-md">{data.name}</p>
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
