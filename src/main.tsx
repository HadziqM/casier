import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Layout from "./layout";
import "./style.css";
import "./tailwind.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Layout />
  </React.StrictMode>
);
