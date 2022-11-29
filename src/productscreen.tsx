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
export default function ProductSc({ product, handleEvent }: Props) {
  const category = ["All", ...new Set(product.items?.map((e) => e.category))];
  const [selected, setSelected] = useState("All");
  const [filtered, setFiltered] = useState(product.items);
  const [modalView, setModalView] = useState(false);
  const [prod, setProd] = useState({} as ModalData);
  useEffect(() => {
    setFiltered(
      product.items?.filter((e) => filtered?.map((i) => i.id).includes(e.id))
    );
  }, [product]);
  return (
    <>
      <div className="flex flex-col absolute top-0 right-0 w-[calc(100vw-100px)] h-screen justify-center items-center gap-2">
        <div className="flex justify-around w-[652px] items-center">
          <select
            id="countries"
            className="bg-[rgba(30,0,30,0.5)] text-gray-200 border border-purple-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 "
            onChange={(e) => {
              if (e.currentTarget.value !== "All") {
                const filter = product.items?.filter(
                  (i) => i.category == e.currentTarget.value
                );
                setFiltered(filter);
              } else {
                setFiltered(product.items);
              }
              setSelected(e.currentTarget.value);
            }}
          >
            {category.map((e) => (
              <option style={{ background: "rgba(30,0,30,1)" }} value={e}>
                {e}
              </option>
            ))}
          </select>
          <div className="flex">
            <h2 className="flex font-bold text-lg text-gray-200 mr-2">
              Total Items:
            </h2>
            <p className="w-[100px] p-1 bg-[rgba(30,0,30,0.5)] rounded-md text-center text-gray-100">
              {filtered?.length || 0}
            </p>
          </div>
          <Search
            get_list={(data: string) => {
              if (selected == "All") {
                if (data === "") {
                  setFiltered(product.items);
                } else {
                  setFiltered(
                    filtered?.filter((e) =>
                      e.name.toLowerCase().startsWith(data.toLowerCase())
                    )
                  );
                }
              } else {
                const filter = product.items?.filter(
                  (i) => i.category == selected
                );
                if (data === "") {
                  setFiltered(filter);
                } else {
                  setFiltered(
                    filter?.filter((e) =>
                      e.name.toLowerCase().startsWith(data.toLowerCase())
                    )
                  );
                }
              }
            }}
          />
        </div>
        <Table useCase={"product"}>
          {filtered?.map((e) => (
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
