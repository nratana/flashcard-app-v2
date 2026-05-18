const API_BASE = "http://localhost:8000/api";

// get token from localStorage
const getToken = () => localStorage.getItem("token");

// helper to make fetch requests with auth header
const request = async (url, options = {}) => {
  const token = getToken();
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${url}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Something went wrong");
  return data;
};

// auth
export const login = (email, password) =>
  request("/users/login", { method: "POST", body: JSON.stringify({ email, password }) });

export const register = (name, email, password) =>
  request("/users/register", { method: "POST", body: JSON.stringify({ name, email, password }) });

export const getProfile = () => request("/users/profile");

export const updateProfile = (name, email) =>
  request("/users/profile", { method: "PUT", body: JSON.stringify({ name, email }) });

export const deleteAccount = () =>
  request("/users/profile", { method: "DELETE" });

// flashcards
export const getFlashcards = () => request("/flashcards");

export const createFlashcard = (question, answer) =>
  request("/flashcards", { method: "POST", body: JSON.stringify({ question, answer }) });

export const updateFlashcard = (id, data) =>
  request(`/flashcards/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const deleteFlashcard = (id) =>
  request(`/flashcards/${id}`, { method: "DELETE" });

export const recordView = (id) =>
  request(`/flashcards/${id}/view`, { method: "POST" });

// history
export const getMyHistory = () => request("/history");
export const clearMyHistory = () => request("/history", { method: "DELETE" });

// admin
export const getAllUsers = () => request("/users/all");
export const deleteUser = (id) => request(`/users/${id}`, { method: "DELETE" });
export const getAllHistory = () => request("/history/all");
export const deleteHistoryEntry = (id) => request(`/history/${id}`, { method: "DELETE" });
