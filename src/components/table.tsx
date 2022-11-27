interface Prop {
  useCase: "product" | "cart" | "debt";
  children: React.ReactNode;
}
export default function Table({ children, useCase }: Prop) {
  const stock = () => {
    if (useCase == "product") {
      return "stok";
    } else if (useCase == "cart") {
      return "dibeli";
    } else {
      return "tanggal";
    }
  };
  const price = () => {
    if (useCase == "product") {
      return "harga";
    } else if (useCase == "cart") {
      return "total";
    } else {
      return "hutang";
    }
  };
  return (
    <div className="p-[10px] border-[3px] border-purple-600 rounded-2xl bg-[rgba(30,0,30,0.8)]">
      <div className="relative flex-flex-col w-[632px] h-[380px] overflow-auto">
        <div className="flex w-[600px] top-0 text-gray-200 text-[1rem] text-center bg-purple-600 rounded-t-lg sticky">
          <p className="w-[300px] truncate py-[2px] border-r border-purple-900">
            Nama
          </p>
          <p className="w-[70px] truncate py-[2px] border-r border-purple-900">
            {stock()}
          </p>
          <p className="w-[180px] truncate py-[2px] border-r border-purple-900">
            {price()}
          </p>
          <p className="w-[50px] truncate py-[2px]">🖱️</p>
        </div>
        {children}
      </div>
    </div>
  );
}
