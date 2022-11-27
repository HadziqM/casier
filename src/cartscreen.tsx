import Table from "./components/table";
import { Cart } from "./type";
import { currency } from "./lib/math";
import Card from "./components/productdata";
interface Prop {
  data: Cart;
}

export default function CartSc({ data }: Prop) {
  const total = () => {
    return data.items
      ?.map((e) => e.expand.product.price * e.unit)
      .reduce((a, b) => a + b, 0);
  };
  return (
    <div className="flex flex-col absolute top-0 right-0 w-[calc(100vw-100px)] h-screen justify-center items-center">
      <Table useCase="cart">
        {data.items?.map((e) => (
          <Card
            useCase="cart"
            name={e.expand.product.name}
            price={e.expand.product.price * e.unit}
            stock={e.unit}
            selected={() => console.log("")}
          />
        ))}
      </Table>
      <div>{currency(total() || 0)}</div>
    </div>
  );
}
