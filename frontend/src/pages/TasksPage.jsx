import { useEffect, useState } from "react";
import { createTask, deleteTask, getDashboardStats, getTasks, updateTask, updateTaskStatus } from "../api/client";
import AiSuggestions from "../components/AiSuggestions";
import Dashboard from "../components/Dashboard";
import Navbar from "../components/Navbar";
import TaskFilters from "../components/TaskFilters";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

/** Render the authenticated task workspace and coordinate task actions. */
export default function TasksPage() {
  const [tasks, setTasks] = useState([]); 
  const [stats, setStats] = useState(null); 
  const [filters, setFilters] = 
    useState({ search: "", status: "", priority: "", category: "" }); 
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [saving, setSaving] = useState(false); 
  const [error, setError] = useState(""); 
  const [notice, setNotice] = useState("");

  /** Load tasks that match active filters and refresh dashboard counts. */
  
  async function loadTasks() { setLoading(true); setError(""); try { const [items, summary] = await Promise.all([getTasks(filters), getDashboardStats()]); setTasks(items); setStats(summary); } catch (err) { setError(err.message); } finally { setLoading(false); } }
  useEffect(() => { const timer = setTimeout(loadTasks, 250); return () => clearTimeout(timer); }, [filters.search, filters.status, filters.priority, filters.category]);
  /** Create a task or save an edit, then refresh the workspace. */
  async function saveTask(task) { setSaving(true); setError(""); try { if (editingTask) { await updateTask(editingTask.id, task); setNotice("Task updated."); } else { await createTask(task); setNotice("Task created."); } setEditingTask(null); await loadTasks(); } catch (err) { setError(err.message); } finally { setSaving(false); } }
  /** Delete a task after the browser confirmation prompt. */
  async function removeTask(task) { if (!window.confirm(`Delete “${task.title}”? This cannot be undone.`)) return; try { await deleteTask(task.id); setNotice("Task deleted."); await loadTasks(); } catch (err) { setError(err.message); } }
  /** Show the delete confirmation on the page. */
  function removeTask(task) { setTaskToDelete(task);}
  async function confirmDelete() { try { await deleteTask(taskToDelete.id); setNotice("Task deleted."); setTaskToDelete(null); await loadTasks(); } catch (err) { setError(err.message);}}
  /** Toggle a task between Pending and Completed. */
  async function changeStatus(task) { try { await updateTaskStatus(task.id, task.status === "Completed" ? "Pending" : "Completed"); await loadTasks(); } catch (err) { setError(err.message); } }
  const categories = [...new Set(tasks.map((task) => task.category).filter(Boolean))];
  return <><Navbar/><main className="container"><header className="page-header"><div><h1>My tasks</h1><p>Plan clearly. Finish confidently.</p></div></header><Dashboard stats={stats}/>{error && <p className="error">{error}</p>}{notice && <p className="notice">{notice}</p>}<div className="workspace"><div><TaskForm editingTask={editingTask} onSave={saveTask} onCancel={() => setEditingTask(null)} saving={saving}/><AiSuggestions onAdd={saveTask}/></div><div><TaskFilters filters={filters} setFilters={setFilters} categories={categories}/>
  {/* Delete confirmation */} {taskToDelete && ( <div className="delete-confirmation"> <span> Are you sure you want to delete{" "}<strong>"{taskToDelete.title}"</strong>? </span> <button className="confirm-delete" onClick={confirmDelete}> Yes, Delete </button><button className="cancel-delete" onClick={() => setTaskToDelete(null)}> Cancel</button></div>)}
<TaskList tasks={tasks} loading={loading} onEdit={setEditingTask} onDelete={removeTask} onStatus={changeStatus}/></div></div></main></>;
}
