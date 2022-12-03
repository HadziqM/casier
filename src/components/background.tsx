interface Prop {
  path?: string;
}

export default function Background({ path }: Prop) {
  return (
    <div
      className="w-screen h-screen fixed -z-10 bg-cover bg-center"
      style={
        path == "nope"
          ? { backgroundImage: "url(/5442673.jpg)" }
          : { backgroundImage: `url(${path})` }
      }
    >
      <div className="w-full h-full bg-[rgba(0,0,0,0.6)]" />
    </div>
  );
}
