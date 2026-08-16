import TaskCard from "./TaskCard";

/** Render task cards, a loading notice, or an empty state. */
export default function TaskList({
    tasks,
    loading,
    onEdit,
    onDelete,
    onStatus,
}) {
    if (loading) {
        return <p className="state">Loading your tasks...</p>;
    }

    if (!tasks.length) {
        return (
            <div className="empty">
                <h3>No tasks found</h3>
                <p>Create your first task or adjust the filters.</p>
            </div>
        );
    }

    return (
        <section className="task-list">
            {tasks.map((task) => (
                <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onStatus={onStatus}
                />
            ))}
        </section>
    );
}