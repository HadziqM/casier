import Table from "./components/table";
import { Cart, ModalData } from "./type";
import Modal from "./components/modal";
import { currency } from "./lib/math";
import Card from "./components/productdata";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
interface Prop {
  data: Cart;
  handleChange: (data: ModalData, unit: number) => Promise<void>;
  handleDelete: (data: ModalData, unit: number) => Promise<void>;
  handleCencel: () => Promise<void>;
}

export default function CartSc({
  data,
  handleChange,
  handleDelete,
  handleCencel,
}: Prop) {
  const [modalView, setModalView] = useState(false);
  const [cartData, setCartData] = useState({} as ModalData);
  const [bought, setBought] = useState(false);
  const total = () => {
    return data.items
      ?.map((e) => e.expand.product.price * e.unit)
      .reduce((a, b) => a + b, 0);
  };
  return (
    <div className="flex flex-col absolute top-0 right-0 w-[calc(100vw-100px)] h-screen justify-center items-center gap-4">
      <div className="">
        <div>
          <button className="" onClick={async () => await handleCencel()}>
            Kosongkan
          </button>
          <button onClick={() => setBought(true)}>Beli</button>
        </div>
      </div>
      <Table useCase="cart">
        {data.items?.map((e) => (
          <Card
            useCase="cart"
            name={e.expand.product.name}
            price={e.expand.product.price * e.unit}
            stock={e.unit}
            selected={() => {
              setCartData({
                name: e.expand.product.name,
                stock: e.expand.product.stock,
                price: e.expand.product.price,
                id: e.expand.product.id,
                unit: e.unit,
                cid: e.id,
              });
              setModalView(true);
            }}
          />
        ))}
      </Table>
      <div>{currency(total() || 0)}</div>
      <AnimatePresence
        initial={false}
        exitBeforeEnter
        onExitComplete={() => null}
      >
        {modalView && (
          <Modal
            cart
            data={cartData}
            handleClose={() => setModalView(false)}
            handleEvent={handleChange}
            handleDelete={handleDelete}
          />
        )}
      </AnimatePresence>
      <AnimatePresence
        initial={false}
        exitBeforeEnter
        onExitComplete={() => null}
      >
        {bought && (
          <Modal
            cart
            buy
            data={{ name: "idk", stock: 0, price: 0, id: "idk" }}
            handleClose={() => setBought(false)}
            handleEvent={handleChange}
            handleDelete={handleDelete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
