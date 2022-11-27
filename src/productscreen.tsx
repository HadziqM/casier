import { useEffect, useState } from "react";
import Card from "./components/productdata";
import Modal from "./components/modal";
import { Product } from "./type";
import { AnimatePresence } from "framer-motion";
import Table from "./components/table";
interface Props {
  product: Product;
  logData: {
    host: string;
    port: number;
  };
}
interface ProdData {
  price: number;
  stock: number;
  name: string;
  id: string;
}
export default function ProductSc({ product, logData }: Props) {
  const category = ["All", ...new Set(product.items?.map((e) => e.category))];
  const [selected, setSelected] = useState("All");
  const [count, setCount] = useState(product.totalItems || 0);
  const [modalView, setModalView] = useState(false);
  const [prod, setProd] = useState({} as ProdData);

  return (
    <>
      <div className="flex flex-col absolute top-0 right-0 w-[calc(100vw-100px)] h-screen justify-center items-center">
        <p>{product.totalItems || 0}</p>
        <Table useCase={"product"}>
          {product.items?.map((e) => (
            <Card
              useCase={"product"}
              name={e.name}
              price={e.price}
              stock={e.stock}
              selected={() => {
                setProd({
                  name: e.name,
                  price: e.price,
                  stock: e.stock,
                  id: e.id,
                });
                setModalView(true);
              }}
            />
          ))}
        </Table>
      </div>
      <AnimatePresence
        initial={false}
        exitBeforeEnter
        onExitComplete={() => null}
      >
        {modalView && (
          <Modal data={prod} handleClose={() => setModalView(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
