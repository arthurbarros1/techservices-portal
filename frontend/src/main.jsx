import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import { SessaoProvider } from "./context/SessaoContext.jsx";

import "./styles/global.css";
import "./styles/auth.css";
import "./styles/home.css";
import "./styles/services.css";
import "./styles/app.css";

// Único ponto de contato com o DOM real: o "root" exigido pelo React.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <SessaoProvider>
        <App />
      </SessaoProvider>
    </BrowserRouter>
  </StrictMode>
);
