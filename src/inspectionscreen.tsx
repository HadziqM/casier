import { save } from "@tauri-apps/api/dialog";
import Status from "./components/statusmodal";
import { useRef, useState } from "react";

interface Prop {
  handleData: (start: string, stop: string, dir: string) => Promise<string>;
  handleTransaction: (
    start: string,
    stop: string,
    dir: string
  ) => Promise<string>;
  handleInspect: (start: string, stop: string) => Promise<string>;
}

export default function InspectionSc({
  handleData,
  handleInspect,
  handleTransaction,
}: Prop) {
  const dayDate = useRef<HTMLInputElement>(null);
  const startDate = useRef<HTMLInputElement>(null);
  const endDate = useRef<HTMLInputElement>(null);
  const [modal, setModal] = useState(false);
  const [data, setData] = useState("");
  const [notif, setNotif] = useState("");
  const [useCase, setUseCase] = useState("" as "notif" | "info");
  return (
    <div className="flex flex-col absolute top-0 right-0 w-[calc(100vw-100px)] h-screen justify-center items-center">
      <div className="flex gap-8">
        <div className="flex flex-col items-center justify-between h-[280px] rounded-lg p-4 bg-[rgba(30,0,30,0.5)]">
          <h1 className="text-[1.2rem] text-gray-100">
            {"Day Transaction Data"}
          </h1>
          <form
            className="flex flex-col gap-4 h-full justify-center items-center pt-[60px]"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="flex">
              <label className="w-[100px]" htmlFor="a day date">
                Full Day
              </label>
              <input ref={dayDate} type={"date"} required />
            </div>
            <button
              onClick={async () => {
                if (!dayDate.current?.value) return;
                const direction = await save({
                  filters: [
                    {
                      extensions: ["csv"],
                      name: "data",
                    },
                  ],
                });
                if (direction == null) return;
                setNotif(
                  await handleData(
                    new Date(dayDate.current?.value + "T00:00").toISOString(),
                    new Date(dayDate.current?.value + "T23:59").toISOString(),
                    direction
                  )
                );
                setUseCase("notif");
                setModal(true);
              }}
              className="mt-auto bg-purple-900 p-1 text-gray-100"
              type="submit"
            >
              Get History Data
            </button>
            <button
              onClick={async () => {
                if (!dayDate.current?.value) return;
                const direction = await save({
                  filters: [
                    {
                      extensions: ["csv"],
                      name: "data",
                    },
                  ],
                });
                if (direction == null) return;
                setNotif(
                  await handleTransaction(
                    new Date(dayDate.current?.value + "T00:00").toISOString(),
                    new Date(dayDate.current?.value + "T23:59").toISOString(),
                    direction
                  )
                );
                setUseCase("notif");
                setModal(true);
              }}
              className="mt-auto bg-purple-900 p-1 text-gray-100"
              type="submit"
            >
              Get Transaction Data
            </button>
            <button
              className="mt-auto bg-purple-900 p-1 text-gray-100"
              type="submit"
              onClick={async () => {
                if (!dayDate.current?.value) return;
                setData(
                  await handleInspect(
                    new Date(dayDate.current?.value + "T00:00").toISOString(),
                    new Date(dayDate.current?.value + "T23:59").toISOString()
                  )
                );
                setUseCase("info");
                setModal(true);
              }}
            >
              Inspect
            </button>
          </form>
        </div>
        <div className="flex flex-col items-center justify-between h-[280px] rounded-lg p-4 bg-[rgba(30,0,30,0.5)]">
          <h1 className="text-[1.2rem] text-gray-100">
            {"Range Transaction Data"}
          </h1>
          <form
            className="flex flex-col gap-4 h-full justify-center items-center pt-[60px]"
            onSubmit={async (e) => {
              e.preventDefault();
              const direction = await save({
                filters: [
                  {
                    extensions: ["csv"],
                    name: "data",
                  },
                ],
              });
              if (direction == null) return;
              await handleData(
                new Date(startDate.current?.value + "T00:00").toISOString(),
                new Date(endDate.current?.value + "T23:59").toISOString(),
                direction
              );
            }}
          >
            <div className="flex">
              <label className="w-[100px]" htmlFor="a day start">
                Start Date
              </label>
              <input ref={startDate} type={"date"} required />
            </div>
            <div className="flex">
              <label className="w-[100px]" htmlFor="a day end">
                End Date
              </label>
              <input ref={endDate} type={"date"} required />
            </div>
            <button
              className="mt-auto bg-purple-900 p-1 text-gray-100"
              type="submit"
            >
              Get Data
            </button>
            <button
              className="mt-auto bg-purple-900 p-1 text-gray-100"
              type="submit"
            >
              Inspection
            </button>
          </form>
        </div>
      </div>
      {modal ? (
        <Status
          handleClose={() => setModal(false)}
          notifData={notif}
          useCase={useCase}
          infoData={data}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
