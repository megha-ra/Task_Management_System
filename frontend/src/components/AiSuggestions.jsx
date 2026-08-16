import { useState } from "react";
import { getSuggestions } from "../api/client";

/** Ask for task suggestions and let a user add a suggestion as a task. */
export default function AiSuggestions({ onAdd }) { 
    const [goal, setGoal] = useState(""); 
    const [suggestions, setSuggestions] = useState([]); const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(""); 
    
    async function submit(event) { 
        event.preventDefault(); 

        setLoading(true); 
        setError("");
        try { 
            setSuggestions(await getSuggestions(goal)); 
        } catch (err) { 
            setError(err.message); 
        } finally { setLoading(false); 

        } 
    } 
    
    return (
        <section className="panel ai">
            <h2>AI Suggest Tasks</h2>
            <p>Enter a goal and get practical next steps. Works offline with built-in suggestions.</p>
            <form onSubmit={submit} className="inline-form">
                <input 
                required 
                minLength="3" 
                placeholder="e.g. Prepare for exams" 
                value={goal} 
                onChange={(e) => setGoal(e.target.value)}
                />
                <button className="button" disabled={loading}>
                    {loading ? "Thinking…" : "Suggest"}
                </button>
            </form>
            {error && <p className="error">{error}</p>}
            <div className="suggestions">
                {suggestions.map((item) => 
                <div key={item.title}>
                    <strong>{item.title}</strong>
                    <span>{item.description}</span>
                    <button className="button small" onClick={() => onAdd({ ...item, status: "Pending", due_date: null })}>Add task</button>
                </div>)}
            </div>
        </section>); 
}
