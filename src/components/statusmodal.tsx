import { currency } from "../lib/math";
import { motion } from "framer-motion";
import Backdrop from "./backdrop";
interface Prop {
  useCase: "notif" | "confirm" | "info";
  notifData?: string;
  confirmData?: string;
  infoData?: string;
  handleClose: (con: boolean) => void;
}
interface Info {
  money: number;
  debt: number;
}

export default function Status(prop: Prop) {
  const dataInput = () => {
    if (prop.useCase == "notif") {
      return prop.notifData;
    } else if (prop.useCase == "confirm") {
      return prop.confirmData;
    } else {
      if (!prop.infoData) return "";
      const data: Info = JSON.parse(prop.infoData);
      return (
        <>
          <div className="flex">
            <span className="w-[100px]">Terjual</span>
            <p>{currency(data.money)}</p>
          </div>
          <div className="flex">
            <span className="w-[100px]">Hutang</span>
            <p>{currency(data.debt)}</p>
          </div>
          <div className="flex">
            <span className="w-[100px]">Total</span>
            <p>{currency(data.money - data.debt)}</p>
          </div>
        </>
      );
    }
  };
  const dropIn = {
    hiden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.2,
      },
    },
  };
  return (
    <Backdrop>
      <motion.div
        onClick={(e) => e.stopPropagation}
        className="w-[500px] m-auto p-4 rounded-xl flex flex-col items-center bg-[#404] text-gray-300 z-50 justify-between relative"
        style={{ height: "200px" }}
        variants={dropIn}
        initial="hiden"
        animate="visible"
      >
        <h1 className="uppercase text-[1.5rem] font-bold">Notifications</h1>
        <p>{dataInput()}</p>
        {prop.useCase == "confirm" ? (
          <>
            <button onClick={() => prop.handleClose(true)}>Yes</button>
            <button onClick={() => prop.handleClose(false)}>No</button>
          </>
        ) : (
          <button onClick={() => prop.handleClose(false)}>Ok</button>
        )}
      </motion.div>
    </Backdrop>
  );
}
