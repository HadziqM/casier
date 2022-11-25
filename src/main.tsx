import React from "react";
import Title from "./components/titlebar";
import Background from "./components/background";
import ReactDOM from "react-dom/client";
import Main from "./mainscreen";
import "./style.css";
import "./tailwind.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <div className="font-mono">
      <Background />
      <Title />
      <Main />
    </div>
  </React.StrictMode>
);
