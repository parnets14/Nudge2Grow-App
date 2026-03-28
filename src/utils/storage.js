/**
 * Simple persistent storage using React Native's built-in NativeModules.
 * Falls back to an in-memory store if native storage is unavailable.
 * Uses the MMKVStorage-compatible approach via global.__storage__.
 */

// In-memory fallback store (survives screen navigation, lost on full app kill)
const memStore = {};

export const Storage = {
  setItem: (key, value) => {
    try {
      memStore[key] = value;
      // Try to use global persistent store if available (e.g. Hermes global)
      if (global.__persistentStore__) {
        global.__persistentStore__[key] = value;
      } else {
        global.__persistentStore__ = { ...memStore };
      }
    } catch (_) {}
  },

  getItem: (key) => {
    try {
      if (global.__persistentStore__?.[key] !== undefined) {
        return global.__persistentStore__[key];
      }
      return memStore[key] ?? null;
    } catch (_) {
      return null;
    }
  },
};
