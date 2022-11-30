import Table from "./components/table";
import { Transaction } from "./type";
import Card from "./components/productdata";
import Modal from "./components/modal";

interface Prop {
  debt: Transaction;
}

export default function DebtSc({ debt }: Prop) {
  return (
    <div className="flex flex-col absolute top-0 right-0 w-[calc(100vw-100px)] h-screen justify-center items-center">
      <div className="flex flex-col">
        <Table useCase="debt">
          {debt.items?.map((e) => (
            <Card
              name={e.expand.customer.name}
              telp={e.telephone}
              stock={e.due ? e.due : 0}
              useCase="debt"
              price={e.debt || 0}
              selected={() => window.alert("clicked")}
            />
          ))}
        </Table>
      </div>
    </div>
  );
}
