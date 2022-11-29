import { useEffect, useReducer, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import {
  Product,
  Cart,
  Transaction,
  ModalData,
  BuyData,
  CustomerData,
} from "./type";
import Menu from "./components/menubar";
import Login from "./loginscreen";
import Overview from "./overviewscreen";
import CartSc from "./cartscreen";
import PrintSc from "./printsreen";
import DebtSc from "./debtscreen";
import ProductSc from "./productscreen";

interface LoginP {
  host: string;
  port: number;
}

export default function Main() {
  const useDidMountEffect = (func: () => void, deps: any) => {
    const didMount = useRef(false);

    useEffect(() => {
      if (didMount.current) func();
      else didMount.current = true;
    }, deps);
  };
  const [product, setProduct] = useState({} as Product);
  const [cart, setCart] = useState({} as Cart);
  const [debt, setDebt] = useState({} as Transaction);
  const [login, setLogin] = useState(false);
  const [logData, setLogData] = useState({} as LoginP);
  const [newPage, setNewPage] = useState(0);
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
  const changeEvent = async (data: ModalData, unit: number) => {
    const fullUnit = Number(data.unit) + data.stock;
    const data_cart = JSON.parse(
      await invoke("change_update", {
        host: logData.host,
        port: logData.port,
        rest: fullUnit - unit,
        unit: unit,
        id: data.id,
        cid: data.cid,
      })
    ) as BuyData;
    setProduct(JSON.parse(data_cart.product) as Product);
    setCart(JSON.parse(data_cart.cart) as Cart);
  };
  const deleteEvent = async (data: ModalData, unit: number) => {
    const data_cart = JSON.parse(
      await invoke("delete_update", {
        host: logData.host,
        port: logData.port,
        unit: unit + data.stock,
        id: data.cid,
        pid: data.id,
      })
    ) as BuyData;
    setProduct(JSON.parse(data_cart.product) as Product);
    setCart(JSON.parse(data_cart.cart) as Cart);
  };
  const cencelEvent = async () => {
    const data_cart = JSON.parse(
      await invoke("cencel_all", {
        host: logData.host,
        port: logData.port,
      })
    ) as BuyData;
    setProduct(JSON.parse(data_cart.product) as Product);
    setCart(JSON.parse(data_cart.cart) as Cart);
  };
  const submitEvent = async (data: CustomerData) => {
    const data_cart = JSON.parse(
      await invoke("transaction_all", {
        host: logData.host,
        port: logData.port,
        name: data.name,
        paid: data.paid,
        address: undefined,
        company: data.company,
        due: data.due,
      })
    ) as BuyData;
    setProduct(JSON.parse(data_cart.product) as Product);
    setCart(JSON.parse(data_cart.cart) as Cart);
  };
  const idkItis = () => {
    const newList = [
      <Overview />,
      <ProductSc product={product} handleEvent={buyEvent} />,
      <CartSc
        data={cart}
        handleDelete={deleteEvent}
        handleChange={changeEvent}
        handleCencel={cencelEvent}
        handleSubmit={submitEvent}
      />,
      <PrintSc />,
      <DebtSc />,
    ];
    return newList[newPage];
  };
  return (
    <>
      {login ? (
        <>
          <Menu clicked={(index: number) => setNewPage(index)} />
          {/* {page} */}
          {idkItis()}
          <div className="flex flex-col items-center absolute bottom-0 right-0">
            <h1>Its main Screen</h1>
            <button onClick={() => setLogin(false)}>Back</button>
          </div>
        </>
      ) : (
        <Login
          logged={() => {
            setLogin(true);
            setNewPage(0);
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
