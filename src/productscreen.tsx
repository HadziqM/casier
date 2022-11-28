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
      <div className="flex flex-col absolute top-0 right-0 w-[calc(100vw-100px)] h-screen justify-center items-center gap-2">
        <p>{product.totalItems || 0}</p>
        <div className="flex justify-around w-[632px]">
          <select
            id="countries"
            className="bg-[rgba(30,0,30,0.5)] text-gray-200 border border-purple-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 "
          >
            <option className="bg-[rgba(30,0,30,0.5)] text-gray-200" selected>
              Choose a country
            </option>
            <option className="bg-[rgba(30,0,30,0.5)] text-gray-200" value="US">
              United States
            </option>
            <option className="bg-[rgba(30,0,30,0.5)] text-gray-200" value="CA">
              Canada
            </option>
            <option className="bg-[rgba(30,0,30,0.5)] text-gray-200" value="FR">
              France
            </option>
            <option className="bg-[rgba(30,0,30,0.5)] text-gray-200" value="DE">
              Germany
            </option>
          </select>
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
        </div>
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
