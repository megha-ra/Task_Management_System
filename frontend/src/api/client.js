/** Get the configured backend base URL. */
const API_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:8000";
/** Make an API request and return JSON when the response contains it. */
export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("smart_tasks_token");
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail || "Something went wrong. Please try again.");
  }
  return response.status === 204 ? null : response.json();
}

/** Register a user and return their authentication data. */
export function registerUser(data) { 
    return apiRequest("/auth/register", { method: "POST", body: JSON.stringify(data) }); 
}

/** Log in a user and return their authentication data. */
export function loginUser(data) { 
    return apiRequest("/auth/login", { method: "POST", body: JSON.stringify(data) }); 
}

/** Get the signed-in user's tasks with optional filters. */
export function getTasks(filters = {}) { 
    const query = new URLSearchParams(Object.entries(filters).filter(([, value]) => value)); 
    return apiRequest(`/tasks${query.size ? `?${query}` : ""}`); 
}

/** Create a task. */
export function createTask(data) { 
    return apiRequest("/tasks", { method: "POST", body: JSON.stringify(data) }); 
}

/** Update a task. */
export function updateTask(id, data) { 
    return apiRequest(`/tasks/${id}`, { method: "PUT", body: JSON.stringify(data) }); 
}

/** Remove a task. */
export function deleteTask(id) { 
    return apiRequest(`/tasks/${id}`, { method: "DELETE" }); 
}

/** Change task completion status. */
export function updateTaskStatus(id, status) { 
    return apiRequest(`/tasks/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }); 
}

/** Get dashboard counts for the signed-in user. */
export function getDashboardStats() { 
    return apiRequest("/tasks/stats/dashboard"); 
}

/** Ask the backend for task ideas for one goal. */
export function getSuggestions(goal) {
     return apiRequest("/ai/suggest-tasks", { method: "POST", body: JSON.stringify({ goal }) }); 
}
