import { invoke } from "@tauri-apps/api/tauri";
import { Product } from "./type";
import { useState } from "react";
interface Props {
  logged: () => void;
  productData: (data: Product) => void;
  loginData: (data: { host: string; port: number }) => void;
}

export default function Login({ logged, productData, loginData }: Props) {
  const [host, setHost] = useState("http://127.0.0.1");
  const [port, setPort] = useState(8090);
  const [loading, setLoading] = useState("Waiting for submit");
  const login = async () => {
    setLoading("loading....");
    const data = JSON.parse(
      await invoke("get_all", {
        collection: "product",
        host: host,
        port: port,
      })
    ) as Product;
    if (data.error) {
      setLoading("Error connecting to database");
    } else if (data.status) {
      setLoading("Connected to database but doesnt have access");
    } else {
      setLoading("Connected to database successfully");
      productData(data);
      loginData({ host, port });
      setTimeout(() => logged(), 1000);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login();
  };
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <div>{loading}</div>
      <form
        className="flex flex-col justify-center gap-4 p-4 border border-black"
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
          Submit
        </button>
      </form>
    </div>
  );
}
