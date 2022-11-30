interface Prop {
  useCase: "product" | "cart" | "debt";
  children: React.ReactNode;
}
export default function Table({ children, useCase }: Prop) {
  const stock = () => {
    if (useCase == "product") {
      return "Stok";
    } else if (useCase == "cart") {
      return "Dibeli";
    } else {
      return "Jatuh Tempo";
    }
  };
  const price = () => {
    if (useCase == "product") {
      return "Harga";
    } else if (useCase == "cart") {
      return "Total";
    } else {
      return "Hutang";
    }
  };
  return (
    <div className="p-[10px] border-[3px] border-purple-600 rounded-2xl bg-[rgba(30,0,30,0.8)]">
      <div className="relative flex-flex-col w-[632px] h-[380px] overflow-auto">
        <div className="flex w-[600px] top-0 text-gray-200 text-[1rem] text-center bg-purple-600 rounded-t-lg sticky">
          <p className="w-[270px] truncate py-[2px] border-r border-purple-900 text-[0.9rem]">
            Nama
          </p>
          <p className="w-[100px] truncate py-[2px] border-r border-purple-900 text-[0.9rem]">
            {stock()}
          </p>
          <p className="w-[180px] truncate py-[2px] border-r border-purple-900 text-[0.9rem]">
            {price()}
          </p>
          <p className="w-[50px] truncate py-[2px]">🖱️</p>
        </div>
        {children}
      </div>
    </div>
  );
}
