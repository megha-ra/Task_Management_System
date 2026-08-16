import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./styles.css";

/** Mount the React application into the browser page. */
createRoot(document.getElementById("root")).render(<StrictMode><ThemeProvider><AuthProvider><App/></AuthProvider></ThemeProvider></StrictMode>);
