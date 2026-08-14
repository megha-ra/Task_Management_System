import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/** Render the account-registration form. */
export default function RegisterPage() { 
    const { user, register, loading } = useAuth(); 
    const [form, setForm] = 
    useState({ name: "", email: "", password: "" }); 
    const [error, setError] = useState(""); 
    if (user) return <Navigate to="/tasks" replace/>; 
    async function submit(event) { 
        event.preventDefault(); 
        setError(""); 
        try { 
            await register(form); 
        } catch (err) { 
            setError(err.message); 
        } 
    } 
    return (
        <main className="auth-page">
            <form className="panel auth-form" onSubmit={submit}>
                <h1>Create account</h1>
                <p>Start organizing your work today.</p>
                {error && <p className="error">{error}</p>}
                <input required minLength="2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}/>
                <input type="email" required placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}/>
                <input type="password" required minLength="6" placeholder="Password (6+ characters)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}/>
                <button className="button" disabled={loading}>
                    {loading ? "Creating…" : "Create account"}
                </button>
                <p>Already registered? <Link to="/login">Log in</Link></p>
            </form>
        </main>
    ); }
