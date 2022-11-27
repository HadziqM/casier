import { useEffect, useReducer, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Product, Cart, Transaction, ModalData, BuyData } from "./type";
import Menu from "./components/menubar";
import Login from "./loginscreen";
import Overview from "./overviewscreen";
import CartSc from "./cartscreen";
import PrintSc from "./printsreen";
import DebtSc from "./debtscreen";
import ProductSc from "./productscreen";
import React from "react";

interface LoginP {
  host: string;
  port: number;
}

export default function Main() {
  const [product, setProduct] = useState({} as Product);
  const [cart, setCart] = useState({} as Cart);
  const [debt, setDebt] = useState({} as Transaction);
  const [login, setLogin] = useState(false);
  const [logData, setLogData] = useState({} as LoginP);
  const buyEvent = async (data: ModalData, unit: number) => {
    const data_cart = JSON.parse(
      await invoke("buy_update", {
        host: logData.host,
        port: logData.port,
        rest: data.stock - unit,
        unit: unit,
        id: data.id,
      })
    ) as BuyData;
    setProduct(JSON.parse(data_cart.product) as Product);
    setCart(JSON.parse(data_cart.cart) as Cart);
  };
  const pageList = [
    <Overview />,
    <ProductSc product={product} handleEvent={buyEvent} />,
    <CartSc data={cart} />,
    <PrintSc />,
    <DebtSc />,
  ];
  const [page, setPage] = useState(pageList[0]);
  const changePage = (index: number) => setPage(pageList[index]);
  useEffect(() => {
    changePage(1);
  }, [buyEvent]);
  return (
    <>
      {login ? (
        <>
          <Menu clicked={changePage} />
          {page}
          <div className="flex flex-col items-center absolute bottom-0 right-0">
            <h1>Its main Screen</h1>
            <button onClick={() => setLogin(false)}>Back</button>
          </div>
        </>
      ) : (
        <Login
          logged={() => {
            setLogin(true);
            setPage(pageList[0]);
          }}
          productData={(data: Product) => setProduct(data)}
          cartData={(data: Cart) => setCart(data)}
          debtData={(data: Transaction) => setDebt(data)}
          loginData={(data: LoginP) => setLogData(data)}
        />
      )}
    </>
  );
}
