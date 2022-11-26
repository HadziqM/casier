interface Prop {
  children: React.ReactNode;
}
export default function Table({ children }: Prop) {
  return (
    <div className="p-[10px] border-[3px] border-purple-600 rounded-2xl bg-[rgba(30,0,30,0.8)]">
      <div className="relative flex-flex-col w-[632px] h-[380px] overflow-auto">
        {children}
      </div>
    </div>
  );
}
