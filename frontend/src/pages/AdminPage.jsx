import { useState, useEffect } from "react";
import { getAllUsers, deleteUser, getAllHistory, deleteHistoryEntry } from "../api";

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, historyData] = await Promise.all([getAllUsers(), getAllHistory()]);
      setUsers(usersData);
      setHistory(historyData);
    } catch (err) {
      setError("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      setError("Failed to delete user");
    }
  };

  const handleDeleteHistory = async (id) => {
    try {
      await deleteHistoryEntry(id);
      setHistory(history.filter((h) => h._id !== id));
    } catch (err) {
      setError("Failed to delete history");
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div>
      <div className="page-header">
        <h2>Admin Dashboard</h2>
        <p className="subtitle">Manage users and view activity</p>
      </div>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError("")} className="error-close">×</button>
        </div>
      )}

      <div className="admin-tabs">
        <button
          className={`btn ${activeTab === "users" ? "btn-primary" : "btn-cancel"}`}
          onClick={() => setActiveTab("users")}
        >
          Users ({users.length})
        </button>
        <button
          className={`btn ${activeTab === "history" ? "btn-primary" : "btn-cancel"}`}
          onClick={() => setActiveTab("history")}
        >
          All History ({history.length})
        </button>
      </div>

      {loading && <p className="loading-text">Loading...</p>}

      {/* users tab */}
      {activeTab === "users" && !loading && (
        <div className="admin-list">
          {users.map((u) => (
            <div key={u._id} className="admin-item">
              <div className="admin-item-info">
                <p className="admin-item-name">{u.name}</p>
                <p className="admin-item-detail">{u.email} · {u.role} · joined {formatDate(u.createdAt)}</p>
              </div>
              {u.role !== "admin" && (
                <button onClick={() => handleDeleteUser(u._id)} className="btn btn-delete">
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* history tab */}
      {activeTab === "history" && !loading && (
        <div className="admin-list">
          {history.length === 0 && <p className="empty-text">No study history yet</p>}
          {history.map((h) => (
            <div key={h._id} className="admin-item">
              <div className="admin-item-info">
                <p className="admin-item-name">{h.question}</p>
                <p className="admin-item-detail">
                  by {h.userId?.name || "Unknown"} ({h.userId?.email || ""}) · {formatDate(h.viewedAt)}
                </p>
              </div>
              <button onClick={() => handleDeleteHistory(h._id)} className="btn btn-delete">
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminPage;
