/**
 * Secure Storage Utility
 * Uses AsyncStorage to store user credentials and tokens securely
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage Keys
const STORAGE_KEYS = {
  USER_TOKEN: '@nudge2grow:userToken',
  USER_PHONE: '@nudge2grow:userPhone',
  USER_COUNTRY_CODE: '@nudge2grow:userCountryCode',
  REMEMBER_ME: '@nudge2grow:rememberMe',
  USER_DATA: '@nudge2grow:userData',
  NOTIFICATION_TOKEN: '@nudge2grow:notificationToken',
  LAST_LOGIN: '@nudge2grow:lastLogin',
};

/**
 * Save user login credentials
 * @param {string} token - Authentication token
 * @param {string} phoneNumber - User's phone number
 * @param {string} countryCode - Country code (e.g., '+91')
 * @param {boolean} rememberMe - Whether to remember the user
 */
export const saveLoginCredentials = async (token, phoneNumber, countryCode, rememberMe = true) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PHONE, phoneNumber);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_COUNTRY_CODE, countryCode);
    await AsyncStorage.setItem(STORAGE_KEYS.REMEMBER_ME, rememberMe.toString());
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_LOGIN, new Date().toISOString());
    
    console.log('[SecureStorage] Login credentials saved successfully');
    return true;
  } catch (error) {
    console.error('[SecureStorage] Error saving login credentials:', error);
    return false;
  }
};

/**
 * Get saved login credentials
 * @returns {Object|null} - { token, phoneNumber, countryCode, rememberMe } or null
 */
export const getLoginCredentials = async () => {
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
    const phoneNumber = await AsyncStorage.getItem(STORAGE_KEYS.USER_PHONE);
    const countryCode = await AsyncStorage.getItem(STORAGE_KEYS.USER_COUNTRY_CODE);
    const rememberMe = await AsyncStorage.getItem(STORAGE_KEYS.REMEMBER_ME);
    const lastLogin = await AsyncStorage.getItem(STORAGE_KEYS.LAST_LOGIN);
    
    const credentials = {
      token,
      phoneNumber,
      countryCode,
      rememberMe: rememberMe === 'true',
      lastLogin,
    };
    
    // Only return credentials if rememberMe is true and token exists
    if (credentials.rememberMe && credentials.token) {
      console.log('[SecureStorage] Retrieved saved credentials for:', credentials.phoneNumber);
      return credentials;
    }
    
    console.log('[SecureStorage] No saved credentials found or rememberMe is false');
    return null;
  } catch (error) {
    console.error('[SecureStorage] Error getting login credentials:', error);
    return null;
  }
};

/**
 * Clear all login credentials (logout)
 */
export const clearLoginCredentials = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_PHONE);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_COUNTRY_CODE);
    await AsyncStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
    await AsyncStorage.removeItem(STORAGE_KEYS.LAST_LOGIN);
    
    console.log('[SecureStorage] Login credentials cleared');
    return true;
  } catch (error) {
    console.error('[SecureStorage] Error clearing login credentials:', error);
    return false;
  }
};

/**
 * Save user data (profile, children, etc.)
 * @param {Object} userData - Complete user data object
 */
export const saveUserData = async (userData) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    console.log('[SecureStorage] User data saved successfully');
    return true;
  } catch (error) {
    console.error('[SecureStorage] Error saving user data:', error);
    return false;
  }
};

/**
 * Get saved user data
 * @returns {Object|null} - User data object or null
 */
export const getUserData = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error('[SecureStorage] Error getting user data:', error);
    return null;
  }
};

/**
 * Clear user data
 */
export const clearUserData = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    console.log('[SecureStorage] User data cleared');
    return true;
  } catch (error) {
    console.error('[SecureStorage] Error clearing user data:', error);
    return false;
  }
};

/**
 * Save notification token (FCM/Push notification token)
 * @param {string} token - Notification token
 */
export const saveNotificationToken = async (token) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATION_TOKEN, token);
    console.log('[SecureStorage] Notification token saved');
    return true;
  } catch (error) {
    console.error('[SecureStorage] Error saving notification token:', error);
    return false;
  }
};

/**
 * Get notification token
 * @returns {string|null} - Notification token or null
 */
export const getNotificationToken = async () => {
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATION_TOKEN);
    return token;
  } catch (error) {
    console.error('[SecureStorage] Error getting notification token:', error);
    return null;
  }
};

/**
 * Check if user is logged in (has valid token)
 * @returns {boolean} - True if user has valid token
 */
export const isUserLoggedIn = async () => {
  try {
    const credentials = await getLoginCredentials();
    return credentials !== null && credentials.token !== null;
  } catch (error) {
    console.error('[SecureStorage] Error checking login status:', error);
    return false;
  }
};

/**
 * Update auth token (after token refresh)
 * @param {string} newToken - New authentication token
 */
export const updateAuthToken = async (newToken) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, newToken);
    console.log('[SecureStorage] Auth token updated');
    return true;
  } catch (error) {
    console.error('[SecureStorage] Error updating auth token:', error);
    return false;
  }
};

/**
 * Clear all app data (complete logout/reset)
 */
export const clearAllData = async () => {
  try {
    await AsyncStorage.clear();
    console.log('[SecureStorage] All app data cleared');
    return true;
  } catch (error) {
    console.error('[SecureStorage] Error clearing all data:', error);
    return false;
  }
};

export default {
  saveLoginCredentials,
  getLoginCredentials,
  clearLoginCredentials,
  saveUserData,
  getUserData,
  clearUserData,
  saveNotificationToken,
  getNotificationToken,
  isUserLoggedIn,
  updateAuthToken,
  clearAllData,
  STORAGE_KEYS,
};
