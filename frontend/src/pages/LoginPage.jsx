import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/** Render the login form for existing users. */
export default function LoginPage() { 
    const { user, login, loading } = useAuth(); 
    const [form, setForm] = useState({ email: "", password: "" }); 
    const [error, setError] = useState(""); 
    if (user) return <Navigate to="/tasks" replace/>; async function submit(event) { 
        event.preventDefault(); 
        setError(""); 
        try { 
            await login(form); 
        } catch (err) { 
            setError(err.message); 
        } 
    } 
    
    return( 
        <main className="auth-page">
            <form className="panel auth-form" onSubmit={submit}>
            <h1>Welcome back</h1>
            <p>Log in to manage your tasks.</p>
            {error && <p className="error">{error}</p>}
            <input type="email" required placeholder="Email" value={form.email} 
            onChange={(e) => 
                setForm({ ...form, email: e.target.value })}/>
                <input type="password" required placeholder="Password" value={form.password} 
                    onChange={(e) => setForm({ ...form, password: e.target.value })}/>
                    <button className="button" disabled={loading}>
                        {loading ? "Logging in…" : "Log in"}
                    </button>
                    <p>New here? <Link to="/register">Create an account</Link></p>
            </form>
        </main>
    ); 
}
