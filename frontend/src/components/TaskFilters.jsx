/** Provide search and filter inputs for a task list. */
export default function TaskFilters({ 
    filters, 
    setFilters, 
    categories 
}) { 
    const change = (key, value) => 
        setFilters({ ...filters, [key]: value }); 
return (
    <section className="filters">
        {/* Search */}
        <input 
            placeholder="Search title or description…" value={filters.search} 
            onChange={(e) => 
                change("search", e.target.value)
            }
        />
        {/* Status filter */}
        <select 
            value={filters.status} 
            onChange={(e) => 
                change("status", e.target.value)
            }
        >
            <option value="">All statuses</option>
            <option>Pending</option>
            <option>Completed</option>
        </select>
        {/* Priority Filter*/}
        <select 
            value={filters.priority} 
            onChange={(e) => 
                change("priority", e.target.value)
            }
        >
            <option value="">All priorities</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
        </select>
        {/* Category Filter */}
        <select 
            value={filters.category} 
            onChange={(e) => 
                change("category", e.target.value)
            }
        >
            <option value="">All categories</option>
            {categories.map((category) => (
                <option key={category}>{category}</option>
            ))}
        </select>
    </section>
    ); 
}
