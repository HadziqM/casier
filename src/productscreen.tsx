import { useEffect, useState } from "react";
import Search from "./components/searchbar";
import Card from "./components/productdata";
import Modal from "./components/modal";
import { ModalData, Product } from "./type";
import { AnimatePresence } from "framer-motion";
import Table from "./components/table";
interface Props {
  product: Product;
  handleEvent: (data: ModalData, unit: number) => Promise<void>;
}
interface ProdData {
  price: number;
  stock: number;
  name: string;
  id: string;
}
export default function ProductSc({ product, handleEvent }: Props) {
  const category = ["All", ...new Set(product.items?.map((e) => e.category))];
  const [selected, setSelected] = useState("All");
  const [count, setCount] = useState(product.totalItems || 0);
  const [modalView, setModalView] = useState(false);
  const [prod, setProd] = useState({} as ProdData);
  const [viewed, setViewed] = useState(product.items);
  return (
    <>
      <div className="flex flex-col absolute top-0 right-0 w-[calc(100vw-100px)] h-screen justify-center items-center">
        <p>{product.totalItems || 0}</p>
        <Search
          get_list={(data: string) => {
            if (data === "") {
              setViewed(product.items);
            } else {
              setViewed(
                viewed?.filter((e) =>
                  e.name.toLowerCase().startsWith(data.toLowerCase())
                )
              );
            }
          }}
        />
        <Table useCase={"product"}>
          {viewed?.map((e) => (
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
          <Modal
            data={prod}
            handleClose={() => setModalView(false)}
            handleEvent={handleEvent}
          />
        )}
      </AnimatePresence>
    </>
  );
}
