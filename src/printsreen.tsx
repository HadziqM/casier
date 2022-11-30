import { toPng, toJpeg } from "html-to-image";
import { useCallback, useRef } from "react";

export default function PrintSc() {
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
    <div
      ref={ref}
      className="flex flex-col absolute top-0 right-0 w-[calc(100vw-100px)] h-screen justify-center items-center"
    >
      <button type="button" onClick={downloadPng}>
        Save png
      </button>
      wth
    </div>
  );
}
