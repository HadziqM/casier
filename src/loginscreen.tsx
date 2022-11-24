import { invoke } from "@tauri-apps/api/tauri";
import { Product } from "./type";
import { useRef, useState } from "react";
interface Props {
  logged: () => void;
  productData: (data: Product) => void;
}

export default function Login({ logged, productData }: Props) {
  const [host, setHost] = useState("http://127.0.0.1");
  const [port, setPort] = useState(8090);
  const [loading, setLoading] = useState(false);
  const login = async () => {
    setLoading(true);
    const data: Product = JSON.parse(
      await invoke("list_data", {
        collection: "product",
        host: host,
        port: port,
        param: "perPage=1",
      })
    );
    setLoading(false);
    productData(data);
    logged();
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login();
  };
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      {loading && <div>Loanding...</div>}
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
        <input type={"submit"} />
      </form>
    </div>
  );
}
