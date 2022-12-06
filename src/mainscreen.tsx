import { useEffect, useReducer, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import {
  Product,
  Cart,
  Transaction,
  ModalData,
  BuyData,
  CustomerData,
  TransactionOut,
} from "./type";
import Menu from "./components/menubar";
import Login from "./loginscreen";
import Overview from "./overviewscreen";
import CartSc from "./cartscreen";
import PrintSc from "./printsreen";
import DebtSc from "./debtscreen";
import InspectionSc from "./inspectionscreen";
import Background from "./components/background";
import ProductSc from "./productscreen";
interface LoginP {
  host: string;
  port: number;
}
interface BackgroundUp {
  id: string;
  img: string;
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
  const [background, setBackground] = useState("nope");
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
      await invoke("transaction_all_debt", {
        host: logData.host,
        port: logData.port,
        name: data.name,
        paid: data.paid,
        total: data.total,
        address: data.adrress,
        telp: data.telp,
        due: data.due,
      })
    ) as TransactionOut;
    setDebt(JSON.parse(data_cart.debt) as Transaction);
    setCart(JSON.parse(data_cart.cart) as Cart);
    setNewPage(3);
  };
  const payEvent = async (id: string, paid: number) => {
    const data_cart = JSON.parse(
      await invoke("debt_collected", {
        host: logData.host,
        port: logData.port,
        id,
        paid,
      })
    ) as Transaction;
    setDebt(data_cart);
  };
  const dataEvent = async (start: string, stop: string, dir: string) => {
    const res = (await invoke("csv_history_writer", {
      host: logData.host,
      port: logData.port,
      start,
      stop,
      dir,
    })) as string;
    return res;
  };
  const transactionEvent = async (start: string, stop: string, dir: string) => {
    const res = (await invoke("csv_transaction_writer", {
      host: logData.host,
      port: logData.port,
      start,
      stop,
      dir,
    })) as string;
    return res;
  };
  const inspectionEvent = async (start: string, stop: string) => {
    const res = (await invoke("analyze", {
      host: logData.host,
      port: logData.port,
      start,
      stop,
    })) as string;
    return res;
  };
  const bgEvent = async (dir: string) => {
    const res = JSON.parse(
      await invoke("update_test", {
        host: logData.host,
        port: logData.port,
        path: dir,
        id: "tah122iaqjoz0ts",
      })
    ) as BackgroundUp;
    const url =
      logData.host +
      ":" +
      logData.port +
      "/api/files/background/" +
      res.id +
      "/" +
      res.img;
    alert(url);
    setBackground(url);
  };

  const idkItis = () => {
    const newList = [
      <Overview path={bgEvent} />,
      <ProductSc product={product} handleEvent={buyEvent} />,
      <CartSc
        data={cart}
        handleDelete={deleteEvent}
        handleChange={changeEvent}
        handleCencel={cencelEvent}
        handleSubmit={submitEvent}
      />,
      <PrintSc debt={debt} />,
      <DebtSc debt={debt} handlePay={payEvent} />,
      <InspectionSc
        handleData={dataEvent}
        handleInspect={inspectionEvent}
        handleTransaction={transactionEvent}
      />,
    ];
    return newList[newPage];
  };
  return (
    <>
      <Background path={background} />
      {login ? (
        <>
          <Menu
            clicked={(index: number) => setNewPage(index)}
            backClick={() => setLogin(false)}
          />
          {idkItis()}
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
