import { useState } from "react";
import { Product } from "./type";
import Menu from "./components/menubar";
import Login from "./loginscreen";
import CartSc from "./cartscreen";
import PrintSc from "./printsreen";
import DebtSc from "./debtscreen";
import ProductSc from "./productscreen";

export default function Main() {
  const [product, setProduct] = useState({} as Product);
  const [login, setLogin] = useState(false);
  const pageList = [
    <ProductSc product={product} />,
    <CartSc />,
    <PrintSc />,
    <DebtSc />,
  ];
  const [page, setPage] = useState(pageList[0]);
  return (
    <>
      {login ? (
        <>
          <Menu clicked={(index: number) => setPage(pageList[index])} />
          {page}
          <div className="flex flex-col items-center absolute bottom-0 right-0">
            <h1>Its main Screen</h1>
            <button onClick={() => setLogin(false)}>Back</button>
          </div>
        </>
      ) : (
        <Login
          logged={() => setLogin(true)}
          productData={(data: Product) => setProduct(data)}
        />
      )}
    </>
  );
}
