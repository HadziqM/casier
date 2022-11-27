import { invoke } from "@tauri-apps/api/tauri";
import { GrStatusWarning, GrStatusGood, GrStatusUnknown } from "react-icons/gr";
import {
  FaCheck,
  FaExclamationTriangle,
  FaExclamationCircle,
} from "react-icons/fa";
import { Product, Cart, Transaction, InitialData } from "./type";
import { useState } from "react";
interface Props {
  logged: () => void;
  productData: (data: Product) => void;
  cartData: (data: Cart) => void;
  debtData: (data: Transaction) => void;
  loginData: (data: { host: string; port: number }) => void;
}

export default function Login({
  logged,
  productData,
  loginData,
  cartData,
  debtData,
}: Props) {
  const icon = [
    <FaExclamationCircle className="w-8 h-8 text-[rgba(50,0,200,0.5)] mr-4" />,
    <FaCheck className="w-8 h-8 text-[rgba(30,200,30,0.5)] mr-4" />,
    <FaExclamationTriangle className="w-8 h-8 text-[rgba(200,200,0,0.5)] mr-4" />,
  ];
  const [host, setHost] = useState("http://127.0.0.1");
  const [port, setPort] = useState(8090);
  const [icons, setIcons] = useState(icon[0]);
  const [loading, setLoading] = useState("Waiting for your input");
  const login = async () => {
    setLoading("loading..........");
    const data = JSON.parse(
      await invoke("get_all_data", {
        host: host,
        port: port,
      })
    ) as InitialData;
    const product: Product = JSON.parse(data.product);
    const cart: Cart = JSON.parse(data.cart);
    const debt: Transaction = JSON.parse(data.debt);
    if (product.error || cart.error || debt.error) {
      setLoading("Error Connecting");
      setIcons(icon[2]);
    } else if (product.code || cart.code || debt.code) {
      setIcons(icon[2]);
      setLoading("Doesnt have access ");
    } else {
      setIcons(icon[1]);
      setLoading("Succesfully Connected");
      productData(product);
      cartData(cart);
      debtData(debt);
      loginData({ host, port });
      setTimeout(() => logged(), 700);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login();
  };
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <div className="flex bg-[rgba(30,0,30,0.7)] items-center p-2 rounded-lg m-2">
        {icons}
        <h1 className="w-[250px] truncate">{loading}</h1>
      </div>
      <form
        className="flex flex-col justify-center gap-4 px-8 py-4 border border-black rounded-lg"
        onSubmit={onSubmit}
      >
        <label>Host</label>
        <input
          type={"text"}
          required
          className="p-2"
          value={host}
          onChange={(e) => {
            setHost(e.currentTarget.value);
          }}
        />
        <label>Port</label>
        <input
          type={"number"}
          required
          className="p-2"
          value={port}
          onChange={(e) => {
            setPort(Number(e.currentTarget.value));
          }}
        />
        <button type={"submit"} className="cursor-pointer bg-[rgba(0,0,0,0.8)]">
          Connect
        </button>
      </form>
    </div>
  );
}
