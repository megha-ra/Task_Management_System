/** Display a task, its status, and its available actions. */
export default function TaskCard({ 
    task, 
    onEdit, 
    onDelete, 
    onStatus 
}) {
  const overdue = 
  task.due_date && task.status !== "Completed" && task.due_date < new Date().toISOString().slice(0, 10);

  return (
        <article className="task-card">
            <div className="task-top">
                <div>
                <h3>{task.title}</h3>
                <p>{task.description || "No description"}</p>
                </div>
                <span className={`badge ${task.status.toLowerCase()}`}>{task.status}</span>
            </div>
            <div className="meta">
                <span className={`badge priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
                {task.category && <span>#{task.category}</span>}
                {task.due_date && <span className={overdue ? "overdue" : ""}>Due {task.due_date}{overdue ? " (overdue)" : ""}</span>}
            </div>
            <div className="actions">
                <button className="button small" onClick={() => onStatus(task)}>
                    {task.status === "Completed" ? "Mark pending" : "Complete"}
                </button>
                <button className="button secondary small" onClick={() => onEdit(task)}>Edit</button>
                <button className="button danger small" onClick={() => onDelete(task)}>Delete</button>
            </div>
        </article>
    );
}
