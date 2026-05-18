import { useState, useEffect } from "react";
import { getMyHistory, clearMyHistory } from "../api";

function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await getMyHistory();
      setHistory(data);
    } catch (err) {
      setError("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    try {
      await clearMyHistory();
      setHistory([]);
    } catch (err) {
      setError("Failed to clear history");
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div>
      <div className="page-header">
        <h2>Study History</h2>
        <p className="subtitle">Cards you've studied</p>
      </div>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError("")} className="error-close">×</button>
        </div>
      )}

      {history.length > 0 && (
        <button onClick={handleClear} className="btn btn-delete" style={{ marginBottom: 16 }}>
          Clear History
        </button>
      )}

      {loading && <p className="loading-text">Loading history...</p>}

      {!loading && history.length === 0 && (
        <p className="empty-text">No study history yet. Go flip some cards!</p>
      )}

      <div className="history-list">
        {history.map((entry) => (
          <div key={entry._id} className="history-item">
            <div className="history-question">{entry.question}</div>
            <div className="history-date">{formatDate(entry.viewedAt)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HistoryPage;
