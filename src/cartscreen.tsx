import Table from "./components/table";
import { Cart, CustomerData, ModalData } from "./type";
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
  handleSubmit: (data: CustomerData) => Promise<void>;
}

export default function CartSc({
  data,
  handleChange,
  handleDelete,
  handleCencel,
  handleSubmit,
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
      <div className="flex justify-between">
        <div className="flex items-center w-[600px] justify-between">
          <button
            className="bg-purple-700  px-1 py-[2px] text-gray-50"
            onClick={async () => await handleCencel()}
          >
            Kosongkan
          </button>
          <div className="flex gap-4">
            <h1 className="font-bold">Total</h1>
            <p className="w-[200px] bg-[rgba(30,0,30,0.5)] p-[3px] rounded-md text-center">
              {currency(total() || 0)}
            </p>
          </div>
          <button
            className="bg-purple-700 px-1 py-[2px] text-gray-50"
            onClick={() => setBought(true)}
          >
            Beli
          </button>
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
            data={{
              name: "idk",
              stock: 0,
              price: 0,
              id: "idk",
              total: total() || 0,
            }}
            handleClose={() => setBought(false)}
            handleEvent={handleChange}
            handleDelete={handleDelete}
            handleSubmit={handleSubmit}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
