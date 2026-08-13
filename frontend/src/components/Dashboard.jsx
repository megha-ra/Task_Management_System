/** Present user task statistics in compact dashboard cards. */
export default function Dashboard({ stats }) { 
    const data = stats || { 
        total_tasks: 0, 
        completed_tasks: 0, 
        pending_tasks: 0, 
        overdue_tasks: 0, 
        completion_percentage: 0 
    }; 
    return (
        <section className="dashboard">
        <div>
            <span>Total</span>
            <strong>{data.total_tasks}</strong>
        </div>
        <div>
            <span>Completed</span>
            <strong>{data.completed_tasks}</strong>
        </div>
        <div>
            <span>Pending</span>
            <strong>{data.pending_tasks}</strong>
        </div>
        <div>
            <span>Overdue</span>
            <strong>{data.overdue_tasks}</strong>
        </div>
        <div>
            <span>Progress</span>
            <strong>{data.completion_percentage}%</strong>
        </div>
    </section>); }
