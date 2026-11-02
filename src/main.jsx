// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

// const saved = localStorage.getItem("theme");
// if (saved === "dark") document.documentElement.dataset.theme = "dark";

// // Force dark mode
document.documentElement.dataset.theme = "dark";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);


// // Change theme:
// function setTheme(mode) {
//   document.documentElement.dataset.theme = mode === "dark" ? "dark" : "";
//   localStorage.setItem("theme", mode);
// }
