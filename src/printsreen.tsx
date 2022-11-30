import { toPng, toJpeg } from "html-to-image";
import { useCallback, useRef, useState } from "react";
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
        {debt.items ? debt.items[0].expand.customer.name : "hello"}
        {debt.items
          ? debt.items[0].expand.product.map((e) => (
              <p>{e.expand.product.name}</p>
            ))
          : "hello"}
      </div>
    </div>
  );
}
