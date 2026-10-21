import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  addEventListener("load", () => {
    navigator.serviceWorker
      .register(import.meta.env.BASE_URL + "sw.js", { scope: import.meta.env.BASE_URL })
      .then((reg) => {
        // Hors ligne : demander un stockage durable (évite que le navigateur vide le cache), et chercher les mises à jour au retour dans l’appli.
        navigator.storage?.persist?.().catch(() => {});
        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "visible" && navigator.onLine) reg.update().catch(() => {});
        });
      })
      .catch(() => {});
  });
}
