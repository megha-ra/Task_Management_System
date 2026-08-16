import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TasksPage from "./pages/TasksPage";

/** Redirect unauthenticated visitors to the login page. */
function ProtectedRoute({ children }) { 
    const { user } = useAuth(); 
    return user ? children : <Navigate to="/login" replace/>; 
}
/** Define the application's public and protected routes. */
export default function App() { 
  return( 
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/tasks" element={<ProtectedRoute><TasksPage/></ProtectedRoute>}/>
        <Route path="*" element={<Navigate to="/tasks" replace/>}/>
      </Routes>
    </BrowserRouter>
    ); 
  }
