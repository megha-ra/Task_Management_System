import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

/** Display app branding, theme selection, and account controls. */
export default function Navbar() { 
    const { user, logout } = useAuth(); 
    const { theme, toggleTheme } = useTheme(); 
    return (
        <nav className="navbar">
            <strong>Smart Tasks</strong>
            <div>
                <button 
                    className="icon-button" 
                    onClick={toggleTheme} aria-label="Toggle theme"
                >
                    {theme === "light" ? "☾" : "☀"}
                </button>
                <span className="welcome">
                    Hi, {user?.name}
                    </span>
                    <button 
                        className="button secondary" onClick={logout}>
                        Log out
                    </button>
            </div>
        </nav>
        ); 
    }
