import { toPng, toJpeg } from "html-to-image";
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
    toPng(ref.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "wtf.png";
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
      <div ref={ref}>
        <div>
          <div className="flex">
            <h2>Name:</h2>
            <p>{debt.items ? debt.items[0].expand.customer.name : ""}</p>
          </div>
          <div className="flex">
            <h2>Address:</h2>
            <p>{debt.items ? debt.items[0].expand.customer.address : ""}</p>
          </div>
          <div className="flex">
            <h2>Phone:</h2>
            <p>{debt.items ? debt.items[0].expand.customer.phone : ""}</p>
          </div>
          <div className="flex">
            <h2>Date:</h2>
            <p>
              {debt.items
                ? new Date(debt.items[0].created).toLocaleString()
                : ""}
            </p>
          </div>
        </div>
        {debt.items ? debt.items[0].expand.customer.name : "hello"}
        {debt.items
          ? debt.items[0].expand.product.map((e) => (
              <div className="flex">
                <p>{e.expand.product.name}</p>
                <p>{e.expand.product.price}</p>
                <p>{e.unit}</p>
                <p>{currency(e.total)}</p>
              </div>
            ))
          : "hello"}
        <div className="flex">
          <h2>Total:</h2>
          <p>{debt.items ? debt.items[0].total : ""}</p>
        </div>
      </div>
    </div>
  );
}
