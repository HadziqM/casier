import { toJpeg } from "html-to-image";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import { currency } from "./lib/math";
import { Transaction } from "./type";

interface Prop {
  debt: Transaction;
}

export default function PrintSc({ debt }: Prop) {
  const [latest, setLatest] = useState(true);
  const [debtData, setdebtData] = useState(
    debt.items ? debt.items[0] : undefined
  );
  useEffect(() => {
    setLatest(true);
    setdebtData(debt.items ? debt.items[0] : undefined);
  }, [debt]);
  const ref = useRef<HTMLDivElement | null>(null);
  const idRef = useRef<HTMLInputElement | null>(null);
  const downloadPng = useCallback(() => {
    if (ref.current === null) {
      return;
    }
    toJpeg(ref.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `${debtData ? debtData.id : ""}.Jpeg`;
        link.href = dataUrl;
        link.target = "_blank";
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [ref]);
  return (
    <div className="flex flex-col absolute top-0 right-0 w-[calc(100vw-100px)] h-screen justify-center items-center">
      <div className="flex justify-between my-4 w-[450px] items-center">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setLatest(false);
            setdebtData(
              debt.items?.filter((i) => i.id == String(idRef.current?.value))[0]
            );
          }}
          className="flex gap-4 items-center"
        >
          <label>ID: </label>
          <input
            type={"text"}
            required
            ref={idRef}
            className="w-[150px] placeholder:text-[0.7rem] placeholder:pl-2"
            placeholder="input Transaction ID"
          />
          <button
            className="bg-gray-900 text-gray-100 w-[100px] text-center"
            type={"submit"}
          >
            Search
          </button>
        </form>
        <button
          className="bg-gray-900 text-gray-100 w-[100px] text-center"
          type="button"
          onClick={() => {
            setLatest(true);
            setdebtData(debt.items ? debt.items[0] : undefined);
          }}
        >
          Latest
        </button>
      </div>
      <h1 className="font-bold text-gray-50">
        {latest ? "Latest Transaction Receipt" : "Custom Input ID Receipt"}
      </h1>
      <div className="p-[10px] border-[3px] border-purple-600 rounded-2xl bg-[rgba(30,0,30,0.8)]">
        <div className="relative flex-flex-col w-[400px] h-[260px] overflow-auto">
          <div
            className="bg-white flex flex-col w-[380px] py-4 justify-center items-center text-black"
            ref={ref}
          >
            <div>
              <div className="flex">
                <h2 className="w-[80px]">Name:</h2>
                <p className="w-[270px]">
                  {debtData ? debtData.expand.customer.name : ""}
                </p>
              </div>
              <div className="flex">
                <h2 className="w-[80px]">Address:</h2>
                <p className="w-[270px]">
                  {debtData ? debtData.expand.customer.address : ""}
                </p>
              </div>
              <div className="flex">
                <h2 className="w-[80px]">Phone:</h2>
                <p className="w-[270px]">
                  {debtData ? debtData.expand.customer.phone : ""}
                </p>
              </div>
              <div className="flex">
                <h2 className="w-[80px]">Date:</h2>
                <p className="w-[270px]">
                  {debtData ? new Date(debtData.created).toLocaleString() : ""}
                </p>
              </div>
            </div>
            <div className="flex">
              <p className="w-[150px] border border-black text-center">Name</p>
              <p className="w-[50px] border border-black text-center">Qty</p>
              <p className="w-[150px] border border-black text-center">Price</p>
            </div>
            {debtData
              ? debtData.expand.product.map((e) => (
                  <div className="flex">
                    <p className=" text-[0.7rem] w-[150px] border border-black text-center">
                      {e.expand.product.name}
                    </p>
                    <p className=" text-[0.7rem] w-[50px] border border-black text-center">
                      {e.unit}
                    </p>
                    <p className=" text-[0.7rem] w-[150px] border border-black text-center">
                      {currency(e.total)}
                    </p>
                  </div>
                ))
              : "hello"}
            <div className="flex w-full px-4 mt-4">
              <h2 className="ml-auto ">Total: </h2>
              <p className="w-[200px] text-right">
                {debt.items ? currency(debt.items[0].total) : ""}
              </p>
            </div>
            <div className="flex w-full px-4 mt-2">
              <h2 className="ml-auto ">Paid: </h2>
              <p className="w-[200px] text-right">
                {debt.items
                  ? debt.items[0].full
                    ? currency(debt.items[0].total)
                    : currency(debt.items[0].total - (debt.items[0].debt || 0))
                  : ""}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-[400px] items-center justify-between my-4 px-4">
        <button
          className="bg-purple-900 p-2 text-gray-100 w-[100px] text-center"
          type="button"
          onClick={downloadPng}
        >
          Save Jpeg
        </button>
        <ReactToPrint
          trigger={() => (
            <button className="bg-purple-900 p-2 text-gray-100 w-[100px] text-center">
              Print
            </button>
          )}
          content={() => ref.current}
        />
      </div>
    </div>
  );
}
