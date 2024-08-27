import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import "./index.css";
import { DataService } from "./components/compositions/data-retrieval.tsx";
import { Toaster } from "./components/ui/sonner.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DataService>
      <Toaster richColors />
      <App />
    </DataService>
  </React.StrictMode>
);
