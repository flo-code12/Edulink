import ReactDOM from "react-dom/client";
import { App } from "./App";
// @ts-ignore: allow side-effect CSS import without type declarations
import "./index.css";

const rootEl = document.getElementById("root");
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(<App />);
}
