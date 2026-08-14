
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

/** Provide light and dark theme preferences to the app. */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = 
    useState(() => localStorage.getItem("smart_tasks_theme") || "light");
    useEffect(() => { 
        document.documentElement.dataset.theme = theme; 
        localStorage.setItem("smart_tasks_theme", theme); }, [theme]);
    /** Toggle the current visual theme. */
    function toggleTheme() { setTheme((value) => value === "light" ? "dark" : "light"); }
    return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

/** Return the shared theme context. */
export function useTheme() { 
    const context = useContext(ThemeContext); 
    if (!context) 
        throw new Error("useTheme must be used within ThemeProvider"); 
    return context; 
}
