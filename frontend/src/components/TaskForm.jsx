import { useEffect, useState } from "react";

const emptyTask = { 
    title: "", 
    description: "", 
    status: "Pending", 
    priority: "Medium", 
    category: "", 
    due_date: "" 
};

/** Collect task fields for creating or editing a task. */
export default function TaskForm({ 
    editingTask, 
    onSave, 
    onCancel, 
    saving 
}) {
  const [task, setTask] = useState(emptyTask);

  useEffect(() => setTask(editingTask ? 
    { ...editingTask, due_date: editingTask.due_date || "" } : emptyTask), [editingTask]);

  /** Submit normalized task data to the parent page. */
  function submit(event) { 
    event.preventDefault(); onSave({ ...task, category: task.category || null, due_date: task.due_date || null }); }

  return (
        <form className="panel task-form" onSubmit={submit}>
            <h2>{editingTask ? "Edit task" : "Add a task"}</h2>

            <input
                required
                placeholder="Task title"
                value={task.title}
                onChange={(event) =>
                    updateField("title", event.target.value)
                }
            />

            <textarea
                placeholder="Description (optional)"
                value={task.description}
                onChange={(event) =>
                    updateField("description", event.target.value)
                }
            />

            <div className="form-grid">
                <select
                    value={task.priority}
                    onChange={(event) =>
                        updateField("priority", event.target.value)
                    }
                >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>

                <input
                    placeholder="Category or tag"
                    value={task.category}
                    onChange={(event) =>
                        updateField("category", event.target.value)
                    }
                />

                <input
                    type="date"
                    value={task.due_date}
                    onChange={(event) =>
                        updateField("due_date", event.target.value)
                    }
                />
            </div>

            <div className="actions">
                <button
                    type="submit"
                    className="button"
                    disabled={saving}
                >
                    {saving
                        ? "Saving..."
                        : editingTask
                        ? "Save changes"
                        : "Create task"}
                </button>

                {editingTask && (
                    <button
                        type="button"
                        className="button secondary"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}
