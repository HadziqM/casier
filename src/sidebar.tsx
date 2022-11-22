import { useEffect, useState } from "react";
interface AllUser {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: {
    collectionId: string;
    collectionName: string;
    created: number;
    created_at: number;
    field: string;
    id: string;
    money: number;
    updated: number;
    username: string;
  }[];
}
export default function Sidebar() {
  const defaultnum: AllUser = {
    page: 0,
    perPage: 0,
    totalItems: 0,
    totalPages: 0,
    items: [],
  };
  const [user, setUser] = useState(defaultnum);
  const dataNow = async () => {
    const data = await fetch(
      "http://192.168.0.110:8090/api/collections/user/records"
    );
    const json = (await data.json()) as AllUser;
    setUser(json);
  };
  return (
    <>
      <button onClick={() => dataNow()}>Typescrpt API</button>
      <div>{user.items[0].username}</div>
    </>
  );
}
