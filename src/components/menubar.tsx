import { useState } from "react";
import {
  FaHome,
  FaShoppingCart,
  FaMoneyBill,
  FaPrint,
  FaList,
  FaBackspace,
  FaGlasses,
  FaBackward,
  FaArrowCircleLeft,
} from "react-icons/fa";

interface Iprop {
  children: React.ReactNode;
  click: () => void;
  act: boolean;
}

function Icons({ children, click, act }: Iprop) {
  return (
    <div
      style={act ? { background: "rgba(0,0,0,0.5)" } : {}}
      className="w-full flex items-center justify-center"
      onClick={() => click()}
    >
      {children}
    </div>
  );
}

export default function Menu(prop: {
  clicked: (index: number) => void;
  backClick: () => void;
}) {
  const init = [
    <FaHome className="w-8 h-8 my-4 text-purple-700 cursor-pointer" />,
    <FaList className="w-8 h-8 my-4 text-purple-700 cursor-pointer" />,
    <FaShoppingCart className="w-8 h-8 my-4 text-purple-700 cursor-pointer" />,
    <FaPrint className="w-8 h-8 my-4 text-purple-700 cursor-pointer" />,
    <FaMoneyBill className="w-8 h-8 my-4 text-purple-700 cursor-pointer" />,
    <FaGlasses className="w-8 h-8 my-4 text-purple-700 cursor-pointer" />,
  ];
  const init2 = [false, false, false, false, false];
  const initCopy = [true, false, false, false, false];
  const [styleNow, setStyleNow] = useState(initCopy);
  return (
    <div className="flex absolute left-0 h-screen flex-col justify-center items-center w-[100px] bg-[rgba(20,0,20,0.8)] gap-1">
      {init.map((e) => (
        <Icons
          act={styleNow[init.indexOf(e)]}
          click={() => {
            let copy = [...init2];
            copy[init.indexOf(e)] = true;
            setStyleNow(copy);
            prop.clicked(init.indexOf(e));
          }}
        >
          {e}
        </Icons>
      ))}
      <div className="absolute bottom-0 left-0 w-[100px] flex justify-center items-center">
        <FaArrowCircleLeft
          onClick={() => prop.backClick()}
          className="w-8 h-8 my-4 text-purple-700 cursor-pointer"
        />
      </div>
    </div>
  );
}
