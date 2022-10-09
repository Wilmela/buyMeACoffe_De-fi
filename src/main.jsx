import React from "react";
import ReactDOM from "react-dom/client";
import App from "./client/App";
import "./index.css";

import { AppContextProvider } from "./client/context/AppContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </React.StrictMode>
);
