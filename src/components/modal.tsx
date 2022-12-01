import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { ModalData, CustomerData, DebtData } from "../type";
import { currency } from "../lib/math";
import { ask } from "@tauri-apps/api/dialog";
import Backdrop from "./backdrop";

interface Props {
  debt?: true;
  debtData?: DebtData;
  cart?: true;
  buy?: true;
  data?: ModalData;
  handleClose: () => void;
  handleEvent?: (data: ModalData, unit: number) => Promise<void>;
  handleDelete?: (data: ModalData, unit: number) => Promise<void>;
  handleSubmit?: (data: CustomerData) => Promise<void>;
  handlePay?: (id: string, paid: number) => Promise<void>;
}

export default function Modal({
  debt,
  debtData,
  handleClose,
  handleSubmit,
  data,
  handleEvent,
  cart,
  buy,
  handleDelete,
  handlePay,
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
  const telpForm = useRef<HTMLInputElement | null>(null);
  const [copy, setCopy] = useState(false);
  const [paid, setPaid] = useState(0);
  const [unit, setUnit] = useState(cart ? Number(data?.unit) : 1);
  const add_unit = () => {
    unit < (data?.stock || 0) && setUnit(unit + 1);
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
  const warnString = () => {
    if (debt) {
      return (debtData?.debt || 0) - paid < 0
        ? `Pastikan pelanggan sudah membayar dan diberi kembalian ${currency(
            paid - (debtData?.debt || 0)
          )} ok?`
        : "Pastikan pelanggan sudah membayar ok?";
    } else {
      return (data?.total || 0) - paid < 0
        ? `Pastikan pelanggan sudah membayar dan diberi kembalian ${currency(
            paid - (data?.total || 0)
          )} ok?`
        : "Pastikan pelanggan sudah membayar ok?";
    }
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
              {debt ? "Data Pengembalian" : "Masukkan Data Pelanggan"}
            </h1>
            <div className="flex gap-4">
              <div>
                <form
                  className="flex flex-col gap-1"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (
                      await ask(warnString(), {
                        title: "Persetujuan",
                        type: "info",
                      })
                    ) {
                      if (debt) {
                        if (handlePay == undefined) return;
                        await handlePay(
                          debtData?.id || "",
                          (debtData?.debt || 0) - paid < 0
                            ? debtData?.debt || 0
                            : paid
                        );
                      } else {
                        if (handleSubmit == undefined) return;
                        await handleSubmit({
                          name: nameForm.current?.value || "",
                          total: data?.total || 0,
                          paid:
                            (data?.total || 0) - paid < 0
                              ? data?.total || 0
                              : paid,
                          telp: telpForm.current?.value,
                          due: dateForm.current?.value
                            ? Math.floor(
                                new Date(dateForm.current.value).getTime() /
                                  1000
                              )
                            : undefined,
                          adrress: addressFrom.current?.value,
                        });
                      }
                      handleClose();
                    } else {
                      handleClose();
                    }
                  }}
                >
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
                      className="px-1 placeholder:text-gray-400 placeholder:text-[0.7rem]"
                    />
                  </div>
                  {debt ? (
                    <>
                      <div className="flex">
                        <h1 className="w-[100px] mr-4">Nama</h1>
                        <p className="w-[200px] bg-[rgba(50,0,50,1)] text-center text-[0.8rem]">
                          {debtData?.expand.customer.name}
                        </p>
                      </div>
                      <div className="flex">
                        <h1 className="w-[100px] mr-4">Tgl.Hutang</h1>
                        <p className="w-[200px] bg-[rgba(50,0,50,1)] text-center text-[0.8rem]">
                          {new Date(debtData?.created || "").toLocaleString()}
                        </p>
                      </div>
                      <div className="flex">
                        <h1 className="w-[100px] mr-4">Nota</h1>
                        <p className="w-[200px] bg-[rgba(50,0,50,1)] text-center text-[0.8rem] relative">
                          {debtData?.id}{" "}
                          <span
                            className="cursor-pointer hover:border hover:border-white"
                            onClick={() => {
                              navigator.clipboard.writeText(debtData?.id || "");
                              setCopy(true);
                              setTimeout(() => setCopy(false), 1000);
                            }}
                          >
                            🔗
                          </span>
                          <span
                            style={
                              copy ? { display: "flex" } : { display: "none" }
                            }
                            className="absolute bg-[rgba(200,0,200,0.3)] p-1 rounded-lg right-4 top-8"
                          >
                            Copied
                          </span>
                        </p>
                      </div>
                      <div className="flex">
                        <h1 className="w-[100px] mr-4">Jatuh Tempo</h1>
                        <p className="w-[200px] bg-[rgba(50,0,50,1)] text-center text-[0.8rem]">
                          {debtData?.due
                            ? new Date(debtData.due * 1000).toLocaleDateString()
                            : "Tidak ada data"}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex">
                        <label className="w-[100px] mr-4">Nama</label>
                        <input
                          id="name"
                          ref={nameForm}
                          type={"text"}
                          required
                          placeholder="Isi Nama Pelanggan/Perusahaan"
                          className="px-1 placeholder:text-gray-400 placeholder:text-[0.7rem]"
                        />
                      </div>
                      <div className="flex">
                        <label className="w-[100px] mr-4">Alamat</label>
                        <input
                          id="alamat"
                          ref={addressFrom}
                          type={"text"}
                          placeholder="Tidak harus diisi"
                          className="px-1 placeholder:text-gray-400 placeholder:text-[0.7rem]"
                        />
                      </div>
                      <div className="flex">
                        <label className="w-[100px] mr-4">No.Telepon</label>
                        <input
                          id="telp"
                          ref={telpForm}
                          type={"tel"}
                          placeholder="Tidak harus diisi"
                          className="px-1 placeholder:text-gray-400 placeholder:text-[0.7rem]"
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
                    </>
                  )}
                  <div className="flex gap-8 justify-center w-full mt-2">
                    <button
                      className="px-2 py-[0.1rem] rounded-full bg-purple-900 hover:bg-purple-600 my-1"
                      type="submit"
                    >
                      {debt ? "💸 Bayar" : "🛒 Beli"}
                    </button>
                  </div>
                </form>
              </div>
              <div className="gap-2 flex flex-col border-l-2 border-purple-600 pl-2">
                <h1 className="text-[0.8rem]">{debt ? "Hutang" : "Total"}</h1>
                <p className="bg-[rgba(30,0,30,1)] w-[200px] text-center">
                  {debt
                    ? currency(debtData?.debt || 0)
                    : currency(data?.total || 0)}
                </p>
                <h1 className="text-[0.8rem]">Dibayar</h1>
                <p className="bg-[rgba(30,0,30,1)] w-[200px] text-center">
                  {currency(paid)}
                </p>
                <h1 className="text-[0.8rem]">Kurang</h1>
                <p className="bg-[rgba(30,0,30,1)] w-[200px] text-center">
                  {debt
                    ? change((debtData?.debt || 0) - paid)
                    : change((data?.total || 0) - paid)}
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <h1 className="uppercase text-[1.5rem] font-bold">
              {cart ? "Edit Cart" : "Add to Cart"}
            </h1>
            <p className="p-2 bg-[rgba(30,0,30,1)] rounded-md">{data?.name}</p>
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
                      className="ml-8 bg-purple-900 px-1"
                      onClick={async () => {
                        if (handleDelete == undefined || data == undefined)
                          return;
                        await handleDelete(data, unit);
                        handleClose();
                      }}
                    >
                      🔥 Return
                    </button>
                  </div>
                )}
              </div>
              <p>Total = {currency(data?.price || 0 * unit)}</p>
            </div>
            <div className="flex gap-12">
              <button
                onClick={async () => {
                  if (handleEvent == undefined || data == undefined) return;
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
