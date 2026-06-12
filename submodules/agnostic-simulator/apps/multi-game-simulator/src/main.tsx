import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import "./app.css";
import "@tcg/simulator-ui/styles/theme.css";

const appRoot = document.querySelector<HTMLDivElement>("#app");

if (!appRoot) {
  throw new Error("Missing #app root element.");
}

createRoot(appRoot).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
