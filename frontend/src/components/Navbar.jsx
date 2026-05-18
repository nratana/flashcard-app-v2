import { useState } from "react";

function Navbar({ user, onNavigate, onLogout, currentPage }) {
  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => onNavigate("dashboard")}>
        FlashCard
      </div>
      <div className="nav-links">
        <button
          className={`nav-btn ${currentPage === "dashboard" ? "active" : ""}`}
          onClick={() => onNavigate("dashboard")}
        >
          My Cards
        </button>
        <button
          className={`nav-btn ${currentPage === "history" ? "active" : ""}`}
          onClick={() => onNavigate("history")}
        >
          History
        </button>
        <button
          className={`nav-btn ${currentPage === "profile" ? "active" : ""}`}
          onClick={() => onNavigate("profile")}
        >
          Profile
        </button>
        {user?.role === "admin" && (
          <button
            className={`nav-btn ${currentPage === "admin" ? "active" : ""}`}
            onClick={() => onNavigate("admin")}
          >
            Admin
          </button>
        )}
        <button className="nav-btn nav-logout" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
