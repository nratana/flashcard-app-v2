import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import HistoryPage from "./pages/HistoryPage";
import AdminPage from "./pages/AdminPage";
import { getProfile } from "./api";

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("login");
  const [authPage, setAuthPage] = useState("login");
  const [loading, setLoading] = useState(true);

  // check if already logged in on load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getProfile()
        .then((data) => {
          setUser(data);
          setPage("dashboard");
        })
        .catch(() => {
          localStorage.removeItem("token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setPage("login");
    setAuthPage("login");
  };

  const handleUpdateUser = (updated) => {
    setUser({ ...user, ...updated });
  };

  if (loading) {
    return (
      <div className="app">
        <p className="loading-text">Loading...</p>
      </div>
    );
  }

  // not logged in - show login or register
  if (!user) {
    return authPage === "login" ? (
      <LoginPage onLogin={handleLogin} onSwitch={() => setAuthPage("register")} />
    ) : (
      <RegisterPage onLogin={handleLogin} onSwitch={() => setAuthPage("login")} />
    );
  }

  // logged in - show app
  return (
    <div className="app">
      <Navbar user={user} onNavigate={setPage} onLogout={handleLogout} currentPage={page} />
      <div className="main-content">
        {page === "dashboard" && <DashboardPage user={user} />}
        {page === "profile" && <ProfilePage user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />}
        {page === "history" && <HistoryPage />}
        {page === "admin" && user.role === "admin" && <AdminPage />}
      </div>
      <footer className="footer">
        <p>Flashcard Learning App</p>
      </footer>
    </div>
  );
}

export default App;
