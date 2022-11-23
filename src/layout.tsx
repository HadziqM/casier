import Sidebar from "./sidebar";
import { invoke } from "@tauri-apps/api/tauri";
import { AllUser } from "./type";
import { useState } from "react";
export default function Layout() {
  const defaultnum: AllUser = {
    page: 0,
    perPage: 0,
    totalItems: 0,
    totalPages: 0,
    items: [],
  };
  const [greetMsg, setGreetMsg] = useState(defaultnum);
  const [just, setJust] = useState("");
  async function greet(url: string) {
    const data: string = await invoke("get_user", { url });
    const json: AllUser = JSON.parse(data);
    setGreetMsg(json);
  }
  async function newData() {
    setJust(await invoke("new_data"));
  }
  return (
    <div className="flex">
      <div className="h-screen flex relative py-4 flex-col">
        <h1>Hello World!</h1>
        <button onClick={() => greet("http://192.168.0.110:8090")}>
          Rust Invoke!
        </button>
        {greetMsg.items.length > 0 && greetMsg.items[0].username}
      </div>
      <div className="flex flex-col">
        <h1>Add data!</h1>
        <button>New data from rust</button>
        {just}
      </div>
    </div>
  );
}
