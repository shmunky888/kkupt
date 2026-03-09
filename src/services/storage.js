// src/services/storage.js
// Description: Thin wrapper around localStorage with JSON serialization.

export const LS = {
  get: (k) => { try { return JSON.parse(localStorage.getItem(k)) } catch { return null } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch(e) { console.error("LS set failed:", e); } }
};
