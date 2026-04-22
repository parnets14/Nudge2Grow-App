/**
 * Persistent storage using AsyncStorage for React Native
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// In-memory cache for synchronous access
const memStore = {};

export const Storage = {
  setItem: async (key, value) => {
    try {
      memStore[key] = value;
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('[Storage] setItem error:', error);
    }
  },

  getItem: async (key) => {
    try {
      // Try memory first
      if (memStore[key] !== undefined) {
        return memStore[key];
      }
      // Then AsyncStorage
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        const parsed = JSON.parse(value);
        memStore[key] = parsed;
        return parsed;
      }
      return null;
    } catch (error) {
      console.error('[Storage] getItem error:', error);
      return null;
    }
  },

  removeItem: async (key) => {
    try {
      delete memStore[key];
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('[Storage] removeItem error:', error);
    }
  },

  clear: async () => {
    try {
      Object.keys(memStore).forEach(key => delete memStore[key]);
      await AsyncStorage.clear();
    } catch (error) {
      console.error('[Storage] clear error:', error);
    }
  },
};
