import { open } from "@tauri-apps/api/dialog";
import { LoginP } from "./type";

interface Prop {
  path: (dir: string) => Promise<void>;
  back: () => void;
  log: LoginP;
}
export default function Overview({ path, back, log }: Prop) {
  return (
    <div className="flex flex-col gap-4 absolute top-0 right-0 w-[calc(100vw-100px)] h-screen justify-center items-center">
      <button
        className="bg-purple-900 p-1 text-gray-100"
        onClick={async () => {
          const dir = await open({
            filters: [{ name: "Image", extensions: ["jpg", "png"] }],
          });
          if (dir == null || dir instanceof Array) return;
          await path(dir);
        }}
      >
        Change Background
      </button>
      <button
        className="bg-purple-900 p-1 text-gray-100"
        onClick={() => back()}
      >
        Original BG
      </button>
      <button className="bg-purple-900 p-1 text-gray-100">
        <a href={log.host + ":" + log.port + "/_/"} target={"_blank"}>
          Admin Dashboard
        </a>
      </button>
    </div>
  );
}
