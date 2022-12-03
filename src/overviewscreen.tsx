import { Body, ResponseType, getClient } from "@tauri-apps/api/http";
import { open } from "@tauri-apps/api/dialog";

interface Prop {
  path: (dir: string) => Promise<void>;
}
export default function Overview({ path }: Prop) {
  return (
    <div className="flex flex-col absolute top-0 right-0 w-[calc(100vw-100px)] h-screen justify-center items-center">
      {/* <img src="/hertz.png" /> */}
      <button
        onClick={async () => {
          const dir = await open({
            filters: [{ name: "Image", extensions: ["jpg", "png"] }],
          });
          if (dir == null || dir instanceof Array) return;
          await path(dir);
        }}
      >
        Hello
      </button>
    </div>
  );
}
