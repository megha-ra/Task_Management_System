import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser } from "../api/client";

const AuthContext = createContext(null);

/** Provide authentication state and actions to descendant components. */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("smart_tasks_user") || "null"));
  const [loading, setLoading] = useState(false);
  useEffect(() => { document.title = user ? "My Tasks | Smart Tasks" : "Smart Tasks"; }, [user]);
  
  /** Save token and user details after a successful authentication response. */
  function saveSession(session) { 
        localStorage.setItem("smart_tasks_token", session.access_token); 
        localStorage.setItem("smart_tasks_user", 
        JSON.stringify(session.user)); 
        setUser(session.user); 
    }

  /** Register then save the returned authenticated session. */
  async function register(data) { 
        setLoading(true); 
        try { saveSession(await registerUser(data)); } 
        finally { setLoading(false); } 
    }

  /** Log in then save the returned authenticated session. */
  async function login(data) { 
        setLoading(true); 
        try { saveSession(await loginUser(data)); } 
        finally { setLoading(false); } 
    }

  /** Clear local authentication data to log out. */
  function logout() { 
    localStorage.removeItem("smart_tasks_token"); 
    localStorage.removeItem("smart_tasks_user"); 
    setUser(null); }
    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>);
}

/** Return the shared authentication context. */
export function useAuth() { 
    const context = useContext(AuthContext); 
    if (!context) 
        throw new Error("useAuth must be used within AuthProvider"); 
    return context; }
