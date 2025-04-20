import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { IsEditingAndLoadingProvider } from "./context/IsLoadingandEditingContext.jsx";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <IsEditingAndLoadingProvider>
    <App />
  </IsEditingAndLoadingProvider>

  // </StrictMode>,
);
