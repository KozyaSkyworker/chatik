import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./main.css";
import { RouterProvider } from "./router/router-provider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider />
  </StrictMode>
);
