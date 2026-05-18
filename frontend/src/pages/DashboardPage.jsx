import { useState, useEffect, useRef } from "react";
import { getFlashcards, createFlashcard, updateFlashcard, deleteFlashcard, recordView } from "../api";

function DashboardPage({ user }) {
  const [cards, setCards] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [search, setSearch] = useState("");
  const [flippedId, setFlippedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");
  const [showUsed, setShowUsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const questionRef = useRef(null);

  useEffect(() => {
    loadCards();
  }, []);

  useEffect(() => {
    if (!editingId) questionRef.current?.focus();
  }, [editingId]);

  const loadCards = async () => {
    try {
      setLoading(true);
      const data = await getFlashcards();
      setCards(data);
      setError("");
    } catch (err) {
      setError("Could not load flashcards. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!question.trim() || !answer.trim()) return;
    try {
      const newCard = await createFlashcard(question, answer);
      setCards([newCard, ...cards]);
      setQuestion("");
      setAnswer("");
      questionRef.current?.focus();
    } catch (err) {
      setError("Failed to add card");
    }
  };

  const handleUpdate = async (id) => {
    if (!editQuestion.trim() || !editAnswer.trim()) return;
    try {
      const updated = await updateFlashcard(id, { question: editQuestion, answer: editAnswer });
      setCards(cards.map((c) => (c._id === id ? updated : c)));
      setEditingId(null);
    } catch (err) {
      setError("Failed to update card");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteFlashcard(id);
      setCards(cards.filter((c) => c._id !== id));
      if (flippedId === id) setFlippedId(null);
    } catch (err) {
      setError("Failed to delete card");
    }
  };

  const handleFlip = async (id) => {
    if (editingId) return;
    if (flippedId !== id) {
      // record view when revealing answer
      try { await recordView(id); } catch (err) { /* silent fail */ }
    }
    setFlippedId(flippedId === id ? null : id);
  };

  const handleMarkUsed = async (id) => {
    try {
      const updated = await updateFlashcard(id, { used: true });
      setCards(cards.map((c) => (c._id === id ? updated : c)));
      setFlippedId(null);
    } catch (err) {
      setError("Failed to mark card");
    }
  };

  const handleRestore = async (id) => {
    try {
      const updated = await updateFlashcard(id, { used: false });
      setCards(cards.map((c) => (c._id === id ? updated : c)));
    } catch (err) {
      setError("Failed to restore card");
    }
  };

  const startEdit = (card) => {
    setEditingId(card._id);
    setEditQuestion(card.question);
    setEditAnswer(card.answer);
    setFlippedId(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAdd();
  };

  // live search filter
  const activeCards = cards
    .filter((c) => !c.used)
    .filter((c) =>
      c.question.toLowerCase().includes(search.toLowerCase()) ||
      c.answer.toLowerCase().includes(search.toLowerCase())
    );
  const usedCards = cards.filter((c) => c.used);

  return (
    <div>
      <div className="page-header">
        <h2>Welcome back, {user?.name}</h2>
        <p className="subtitle">Study your flashcards</p>
      </div>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError("")} className="error-close">×</button>
        </div>
      )}

      {/* add card form */}
      <div className="section-box">
        <h3>Add New Card</h3>
        <div className="form-row">
          <input
            ref={questionRef}
            type="text"
            placeholder="Enter your question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            className="input"
          />
          <input
            type="text"
            placeholder="Enter the answer..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            className="input"
          />
          <button onClick={handleAdd} className="btn btn-primary">Add Card</button>
        </div>
      </div>

      {/* search bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search flashcards..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-search"
        />
        <div className="stats-inline">
          <span>Active: <strong>{activeCards.length}</strong></span>
          <span>Used: <strong>{usedCards.length}</strong></span>
          <span>Total: <strong>{cards.length}</strong></span>
        </div>
      </div>

      {loading && <p className="loading-text">Loading flashcards...</p>}

      {!loading && activeCards.length === 0 && !search && (
        <p className="empty-text">No flashcards yet. Add one above!</p>
      )}

      {!loading && activeCards.length === 0 && search && (
        <p className="empty-text">No cards match "{search}"</p>
      )}

      {/* cards grid */}
      <div className="cards-grid">
        {activeCards.map((card) => (
          <div
            key={card._id}
            className={`card ${flippedId === card._id ? "flipped" : ""}`}
            onClick={() => handleFlip(card._id)}
          >
            {editingId === card._id ? (
              <div className="card-edit" onClick={(e) => e.stopPropagation()}>
                <input
                  type="text"
                  value={editQuestion}
                  onChange={(e) => setEditQuestion(e.target.value)}
                  className="input input-edit"
                  placeholder="Question"
                  autoFocus
                />
                <input
                  type="text"
                  value={editAnswer}
                  onChange={(e) => setEditAnswer(e.target.value)}
                  className="input input-edit"
                  placeholder="Answer"
                />
                <div className="card-edit-actions">
                  <button onClick={() => handleUpdate(card._id)} className="btn btn-save">Save</button>
                  <button onClick={() => setEditingId(null)} className="btn btn-cancel">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="card-front">
                  <span className="card-label">Question</span>
                  <p className="card-text">{card.question}</p>
                  <span className="card-hint">Click to reveal</span>
                </div>
                <div className="card-back">
                  <span className="card-label">Answer</span>
                  <p className="card-text">{card.answer}</p>
                  <div className="card-actions" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => handleMarkUsed(card._id)} className="btn btn-used">✓ Used</button>
                    <button onClick={() => startEdit(card)} className="btn btn-edit">Edit</button>
                    <button onClick={() => handleDelete(card._id)} className="btn btn-delete">Delete</button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* used cards */}
      {usedCards.length > 0 && (
        <div className="used-section">
          <button onClick={() => setShowUsed(!showUsed)} className="btn btn-toggle">
            {showUsed ? "Hide" : "Show"} Used Cards ({usedCards.length})
          </button>
          {showUsed && (
            <div className="used-cards-list">
              {usedCards.map((card) => (
                <div key={card._id} className="used-card">
                  <div className="used-card-content">
                    <p><strong>Q:</strong> {card.question}</p>
                    <p><strong>A:</strong> {card.answer}</p>
                  </div>
                  <div className="used-card-actions">
                    <button onClick={() => handleRestore(card._id)} className="btn btn-restore">Restore</button>
                    <button onClick={() => handleDelete(card._id)} className="btn btn-delete">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
