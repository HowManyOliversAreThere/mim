import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import "./index.css";
import { DataService } from "./components/compositions/data-retrieval.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DataService>
      <App />
    </DataService>
  </React.StrictMode>
);
