import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Boards from "./pages/Boards";
import BoardPage from "./pages/BoardPage";
import Inbox from "./pages/Inbox";
import Planner from "./pages/Planner";
import Activity from "./pages/Activity";
import Account from "./pages/Account";
import AuthPage from "./pages/AuthPage";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh"
      }}>
        Loading...
      </div>
    );
  }

  return (
    <>
      <Routes>

        {/* ✅ Public Routes */}
        <Route
          path="/"
          element={user ? <Navigate to="/boards" replace /> : <Landing />}
        />

        <Route
          path="/login"
          element={user ? <Navigate to="/boards" replace /> : <AuthPage />}
        />

        {/* ✅ Protected Routes */}
        <Route
          path="/boards"
          element={user ? <Boards /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/board/:id"
          element={user ? <BoardPage /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/inbox"
          element={user ? <Inbox /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/planner"
          element={user ? <Planner /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/activity"
          element={user ? <Activity /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/account"
          element={user ? <Account /> : <Navigate to="/login" replace />}
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>

      {/* ✅ Show navbar ONLY if logged in */}
      {user && <Navbar />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
