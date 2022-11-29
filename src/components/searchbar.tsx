import { useRef } from "react";

interface Prop {
  get_list: (data: string) => void;
}

export default function Search({ get_list }: Prop) {
  // const inputString = useRef<HTMLInputElement|null>(null)
  return (
    <form>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            aria-hidden="true"
            className="w-5 h-5 text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <input
          onChange={(e) => get_list(e.currentTarget.value)}
          type="search"
          id="default-search"
          className="block w-full p-2 pl-10 text-sm text-gray-200 border border-purple-700 rounded-lg bg-[rgba(30,0,30,0.5)] focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search..."
          required
        />
      </div>
    </form>
  );
}
