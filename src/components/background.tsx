export default function Background() {
  return (
    <div className="w-screen h-screen fixed bg-[url(/bg.png)] -z-10 bg-cover bg-center">
      <div className="w-full h-full bg-[rgba(0,0,0,0.6)]" />
    </div>
  );
}
