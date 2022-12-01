import { toJpeg } from "html-to-image";
import { useCallback, useRef, useState } from "react";
import { currency } from "./lib/math";
import { Transaction } from "./type";

interface Prop {
  debt: Transaction;
}

export default function PrintSc({ debt }: Prop) {
  const ref = useRef<HTMLDivElement | null>(null);
  const downloadPng = useCallback(() => {
    if (ref.current === null) {
      return;
    }
    toJpeg(ref.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `${debt.items ? debt.items[0].id : ""}.png`;
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
      <button type="button" onClick={downloadPng}>
        Save png
      </button>
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
                  {debt.items ? debt.items[0].expand.customer.name : ""}
                </p>
              </div>
              <div className="flex">
                <h2 className="w-[80px]">Address:</h2>
                <p className="w-[270px]">
                  {debt.items ? debt.items[0].expand.customer.address : ""}
                </p>
              </div>
              <div className="flex">
                <h2 className="w-[80px]">Phone:</h2>
                <p className="w-[270px]">
                  {debt.items ? debt.items[0].expand.customer.phone : ""}
                </p>
              </div>
              <div className="flex">
                <h2 className="w-[80px]">Date:</h2>
                <p className="w-[270px]">
                  {debt.items
                    ? new Date(debt.items[0].created).toLocaleString()
                    : ""}
                </p>
              </div>
            </div>
            <div className="flex">
              <p className="w-[150px] border border-black text-center">Name</p>
              <p className="w-[50px] border border-black text-center">Qty</p>
              <p className="w-[150px] border border-black text-center">Price</p>
            </div>
            {debt.items
              ? debt.items[0].expand.product.map((e) => (
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
                    : currency(debt.items[0].debt || 0 - debt.items[0].total)
                  : ""}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
