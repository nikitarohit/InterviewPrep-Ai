import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import NavBar from "./components/NavBar.jsx";
import SideBar from "./components/SideBar.jsx";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Notes from "./pages/Notes.jsx";
import Profile from "./pages/Profile.jsx";
import Result from "./pages/Result.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Settings from "./pages/Settings.jsx";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fafaf8" }}>
      <div style={{ width: 32, height: 32, borderRadius: "50%", border: "3px solid #f0edff", borderTopColor: "#6b5cf6", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
}

// FIX: Home, Login, and Register are public marketing/auth pages —
// they should NEVER show the app sidebar, even if the user happens to be
// logged in. The sidebar belongs to the authenticated app shell
// (Dashboard, Notes, Profile, Results, Settings) only.
// Previously SideBar rendered on every route whenever `user` existed,
// which caused the sidebar to appear on Home's long marketing scroll —
// since Home's content is much taller/differently structured than the
// sidebar's own height, this produced a visual "sidebar stuck at top,
// blank space below" mismatch.
const NO_SIDEBAR_ROUTES = ["/", "/login", "/register"];

function Layout() {
  const { user } = useAuth();
  const location = useLocation();

  const showSidebar = user && !NO_SIDEBAR_ROUTES.includes(location.pathname);

  return (
    <>
      <NavBar />
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        {showSidebar && <SideBar />}
        <div style={{ flex: 1, minWidth: 0 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/result" element={<ProtectedRoute><Result /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout />
      </Router>
    </AuthProvider>
  );
}