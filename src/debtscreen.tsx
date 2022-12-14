import Table from "./components/table";
import { ModalData, Transaction } from "./type";
import Card from "./components/productdata";
import Modal from "./components/modal";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

interface Prop {
  debt: Transaction;
  handlePay: (id: string, paid: number) => Promise<void>;
}

export default function DebtSc({ debt, handlePay }: Prop) {
  const [modal, setModal] = useState(false);
  const [selected, setSelected] = useState("");
  return (
    <div className="flex flex-col absolute top-0 right-0 w-[calc(100vw-100px)] h-screen justify-center items-center">
      <div className="flex flex-col">
        <Table useCase="debt">
          {debt.items
            ?.filter((e) => e.full == false)
            .map((e) => (
              <Card
                name={e.customer}
                telp={e.phone}
                stock={e.due ? e.due : 0}
                useCase="debt"
                price={e.debt || 0}
                selected={() => {
                  setSelected(e.id);
                  setModal(true);
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
        {modal && (
          <Modal
            buy
            debt
            debtData={debt.items?.filter((e) => e.id == selected)[0]}
            handleClose={() => setModal(false)}
            handlePay={handlePay}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
