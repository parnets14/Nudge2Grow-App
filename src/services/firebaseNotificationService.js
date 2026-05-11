/**
 * Firebase Cloud Messaging (FCM) Integration Service
 * Handles push notifications from Firebase
 * Uses modular API compatible with @react-native-firebase v22+
 */

import {
  getMessaging,
  getToken,
  deleteToken,
  onMessage,
  onTokenRefresh,
  onNotificationOpenedApp,
  getInitialNotification,
  requestPermission,
  hasPermission,
  setBackgroundMessageHandler,
  subscribeToTopic,
  unsubscribeFromTopic,
  AuthorizationStatus,
} from '@react-native-firebase/messaging';
import { getApp } from '@react-native-firebase/app';
import notifee, { AndroidImportance, AndroidVisibility } from '@notifee/react-native';
import { Platform, PermissionsAndroid } from 'react-native';
import { addNotificationToStorage } from './notificationService';
import { saveNotificationToken, getLoginCredentials } from '../utils/secureStorage';
import { BASE_URL } from '../api';

/**
 * Get the messaging instance using the modular API.
 * Wrapped in a try/catch so it never throws during headless JS boot.
 */
const getMessagingInstance = () => {
  try {
    return getMessaging(getApp());
  } catch (e) {
    console.error('[FCM] getMessagingInstance error:', e.message);
    return null;
  }
};

/**
 * IMPORTANT: Background & killed-state handler must be registered at module level,
 * outside of any React component or async function. FCM calls this even when the
 * app is fully closed via a headless JS task.
 */
try {
  const messagingInstance = getMessagingInstance();
  if (messagingInstance) {
    setBackgroundMessageHandler(messagingInstance, async (remoteMessage) => {
      console.log('[FCM] Background/killed notification received:', remoteMessage);

      const title = remoteMessage.notification?.title || remoteMessage.data?.title || 'New Notification';
      const body  = remoteMessage.notification?.body  || remoteMessage.data?.body  || remoteMessage.data?.message || '';

      const notification = {
        _id: remoteMessage.messageId || `fcm_${Date.now()}`,
        title,
        message: body,
        type: remoteMessage.data?.type || 'info',
        isRead: false,
        createdAt: new Date().toISOString(),
        // Spread data but avoid overwriting the fields we just set
        ...(remoteMessage.data || {}),
        // Re-apply to ensure correct values
        title,
        message: body,
      };

      try {
        await addNotificationToStorage(notification);
        console.log('[FCM] Background notification saved to storage');
      } catch (storageErr) {
        console.error('[FCM] Failed to save background notification:', storageErr.message);
      }
    });
    console.log('[FCM] Background message handler registered successfully');
  } else {
    console.warn('[FCM] Could not register background handler — messaging instance unavailable');
  }
} catch (bgHandlerErr) {
  console.error('[FCM] Error registering background message handler:', bgHandlerErr.message);
}

/**
 * Get authentication token from secure storage
 */
const getAuthToken = async () => {
  try {
    const credentials = await getLoginCredentials();
    return credentials?.token || null;
  } catch (error) {
    console.error('[FCM] Error getting auth token:', error);
    return null;
  }
};

/**
 * Request notification permissions (iOS and Android 13+)
 * @returns {Promise<boolean>}
 */
export const requestNotificationPermission = async () => {
  try {
    console.log('[FCM] Requesting notification permission...');
    const messaging = getMessagingInstance();

    if (Platform.OS === 'ios') {
      const authStatus = await requestPermission(messaging);
      const enabled =
        authStatus === AuthorizationStatus.AUTHORIZED ||
        authStatus === AuthorizationStatus.PROVISIONAL;

      console.log('[FCM] iOS permission status:', authStatus, 'Enabled:', enabled);
      return enabled;
    } else if (Platform.OS === 'android') {
      if (Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        console.log('[FCM] Android 13+ permission:', granted);
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        console.log('[FCM] Android 12 and below - permission granted by default');
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error('[FCM] Error requesting permission:', error);
    return false;
  }
};

/**
 * Get FCM token
 * @returns {Promise<string|null>}
 */
export const getFCMToken = async () => {
  try {
    console.log('[FCM] Getting FCM token...');
    const messaging = getMessagingInstance();

    const permission = await hasPermission(messaging);
    if (!permission) {
      console.log('[FCM] No permission, requesting...');
      const granted = await requestNotificationPermission();
      if (!granted) {
        console.log('[FCM] Permission denied');
        return null;
      }
    }

    const token = await getToken(messaging);
    console.log('[FCM] Token obtained:', token ? token.substring(0, 20) + '...' : 'null');

    if (token) {
      await saveNotificationToken(token);
      console.log('[FCM] Token saved to secure storage');

      try {
        const authToken = await getAuthToken();
        if (authToken) {
          await sendTokenToBackend(token, authToken);
          console.log('[FCM] Token sent to backend');
        } else {
          console.log('[FCM] No auth token found, skipping backend registration');
        }
      } catch (error) {
        console.error('[FCM] Failed to send token to backend:', error);
      }
    }

    return token;
  } catch (error) {
    console.error('[FCM] Error getting FCM token:', error);
    return null;
  }
};

/**
 * Initialize Firebase Cloud Messaging
 * @param {Function} onNotificationReceived - Callback when notification is received
 * @returns {Function} - Unsubscribe function
 */
export const initializeFCM = async (onNotificationReceived) => {
  if (initializeFCM._unsubscribe) {
    console.log('[FCM] Already initialized, cleaning up previous listeners first');
    initializeFCM._unsubscribe();
    initializeFCM._unsubscribe = null;
  }

  try {
    console.log('[FCM] Initializing Firebase Cloud Messaging...');
    const messaging = getMessagingInstance();

    const permission = await hasPermission(messaging);
    if (!permission) {
      console.log('[FCM] Notification permission not granted, skipping FCM init');
      return () => {};
    }

    const token = await getFCMToken();
    if (!token) {
      console.log('[FCM] Failed to get FCM token');
      return () => {};
    }

    // Listen for token refresh
    const unsubscribeTokenRefresh = onTokenRefresh(messaging, async (newToken) => {
      console.log('[FCM] Token refreshed:', newToken.substring(0, 20) + '...');
      await saveNotificationToken(newToken);

      try {
        const authToken = await getAuthToken();
        if (authToken) {
          await sendTokenToBackend(newToken, authToken);
        }
      } catch (error) {
        console.error('[FCM] Failed to send refreshed token to backend:', error);
      }
    });

    // Handle foreground notifications
    const unsubscribeForeground = onMessage(messaging, async (remoteMessage) => {
      console.log('[FCM] Foreground notification received:', remoteMessage);

      const notification = {
        _id: remoteMessage.messageId || `fcm_${Date.now()}`,
        title: remoteMessage.notification?.title || remoteMessage.data?.title || 'New Notification',
        message: remoteMessage.notification?.body || remoteMessage.data?.body || remoteMessage.data?.message || '',
        type: remoteMessage.data?.type || 'info',
        isRead: false,
        createdAt: new Date().toISOString(),
        ...(remoteMessage.data || {}),
      };

      await addNotificationToStorage(notification);
      console.log('[FCM] Foreground notification saved to storage');

      try {
        const channelId = await notifee.createChannel({
          id: 'nudge2grow_notifications',
          name: 'Nudge2Grow Notifications',
          importance: AndroidImportance.HIGH,
          visibility: AndroidVisibility.PUBLIC,
          sound: 'default',
          vibration: true,
        });

        await notifee.displayNotification({
          title: notification.title,
          body: notification.message,
          android: {
            channelId,
            smallIcon: 'ic_launcher',
            color: '#00bf62',
            pressAction: { id: 'default' },
            importance: AndroidImportance.HIGH,
            visibility: AndroidVisibility.PUBLIC,
          },
        });
        console.log('[FCM] Foreground notification displayed via notifee');
      } catch (notifeeErr) {
        console.error('[FCM] notifee display failed:', notifeeErr.message);
      }

      if (onNotificationReceived) {
        onNotificationReceived(notification);
      }
    });

    // Handle notification opened (app in background)
    const unsubscribeNotificationOpened = onNotificationOpenedApp(messaging, (remoteMessage) => {
      console.log('[FCM] Notification opened app:', remoteMessage);
      if (onNotificationReceived && remoteMessage.data) {
        onNotificationReceived(remoteMessage.data);
      }
    });

    // Handle app opened from quit state
    getInitialNotification(messaging).then((remoteMessage) => {
      if (remoteMessage) {
        console.log('[FCM] App opened from quit state by notification:', remoteMessage);
        if (onNotificationReceived && remoteMessage.data) {
          onNotificationReceived(remoteMessage.data);
        }
      }
    });

    console.log('[FCM] Firebase Cloud Messaging initialized successfully');

    const unsubscribeAll = () => {
      unsubscribeTokenRefresh();
      unsubscribeForeground();
      unsubscribeNotificationOpened();
      initializeFCM._unsubscribe = null;
    };
    initializeFCM._unsubscribe = unsubscribeAll;
    return unsubscribeAll;
  } catch (error) {
    console.error('[FCM] Error initializing FCM:', error);
    return () => {};
  }
};

/**
 * Send FCM token to backend
 * @param {string} token - FCM token
 * @param {string} authToken - User authentication token
 * @param {string} baseUrl - Backend base URL
 * @returns {Promise<boolean>}
 */
export const sendTokenToBackend = async (token, authToken, baseUrl = BASE_URL) => {
  try {
    console.log('[FCM] Sending token to backend...');

    const response = await fetch(`${baseUrl}/user/fcm-token`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fcmToken: token }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send token: ${response.status}`);
    }

    const result = await response.json();
    console.log('[FCM] Token sent to backend successfully:', result.message);
    return true;
  } catch (error) {
    console.error('[FCM] Error sending token to backend:', error);
    return false;
  }
};

/**
 * Subscribe to a topic
 * @param {string} topic
 * @returns {Promise<boolean>}
 */
export const subscribeToUserTopic = async (topic) => {
  try {
    console.log('[FCM] Subscribing to topic:', topic);
    await subscribeToTopic(getMessagingInstance(), topic);
    console.log('[FCM] Subscribed to topic successfully');
    return true;
  } catch (error) {
    console.error('[FCM] Error subscribing to topic:', error);
    return false;
  }
};

/**
 * Unsubscribe from a topic
 * @param {string} topic
 * @returns {Promise<boolean>}
 */
export const unsubscribeFromUserTopic = async (topic) => {
  try {
    console.log('[FCM] Unsubscribing from topic:', topic);
    await unsubscribeFromTopic(getMessagingInstance(), topic);
    console.log('[FCM] Unsubscribed from topic successfully');
    return true;
  } catch (error) {
    console.error('[FCM] Error unsubscribing from topic:', error);
    return false;
  }
};

/**
 * Subscribe to user's grade and subjects
 * @param {Object} userData
 */
export const subscribeToUserTopics = async (userData) => {
  try {
    const child = userData?.children?.[0];
    if (!child) {
      console.log('[FCM] No child data found');
      return;
    }

    console.log('[FCM] Subscribing to user topics...');

    if (child.grade) {
      const gradeTopic = child.grade.toLowerCase().replace(/\s+/g, '_');
      await subscribeToUserTopic(gradeTopic);
    }

    if (child.subjectLevels) {
      const subjects = Object.keys(child.subjectLevels);
      for (const subject of subjects) {
        const subjectTopic = subject.toLowerCase().replace(/\s+/g, '_');
        await subscribeToUserTopic(subjectTopic);
      }
    }

    await subscribeToUserTopic('all_users');
    console.log('[FCM] Subscribed to all user topics');
  } catch (error) {
    console.error('[FCM] Error subscribing to user topics:', error);
  }
};

/**
 * Check notification permission status
 * @returns {Promise<number>}
 */
export const checkNotificationPermission = async () => {
  try {
    const authStatus = await hasPermission(getMessagingInstance());
    console.log('[FCM] Current permission status:', authStatus);
    return authStatus;
  } catch (error) {
    console.error('[FCM] Error checking permission:', error);
    return -1;
  }
};

/**
 * Delete FCM token (for logout)
 * @returns {Promise<boolean>}
 */
export const deleteFCMToken = async () => {
  try {
    console.log('[FCM] Deleting FCM token...');
    await deleteToken(getMessagingInstance());
    console.log('[FCM] Token deleted successfully');
    return true;
  } catch (error) {
    console.error('[FCM] Error deleting token:', error);
    return false;
  }
};

/**
 * Register FCM token immediately after login/registration.
 * @param {string} authToken - JWT from login/registration
 * @returns {Promise<string|null>}
 */
export const registerFCMOnLogin = async (authToken) => {
  try {
    console.log('[FCM] Registering FCM token on login...');

    const granted = await requestNotificationPermission();
    if (!granted) {
      console.log('[FCM] Permission denied, skipping token registration');
      return null;
    }

    const fcmToken = await getToken(getMessagingInstance());
    if (!fcmToken) {
      console.log('[FCM] Could not get FCM token');
      return null;
    }

    console.log('[FCM] Got token:', fcmToken.substring(0, 30) + '...');
    console.log('[FCM] FULL TOKEN FOR TESTING:', fcmToken);

    await saveNotificationToken(fcmToken);

    const success = await sendTokenToBackend(fcmToken, authToken);
    if (success) {
      console.log('[FCM] ✅ Token registered to backend successfully');
    } else {
      console.log('[FCM] ⚠️ Token saved locally but backend registration failed');
    }

    return fcmToken;
  } catch (error) {
    console.error('[FCM] Error registering FCM token on login:', error);
    return null;
  }
};

export default {
  requestNotificationPermission,
  getFCMToken,
  initializeFCM,
  registerFCMOnLogin,
  sendTokenToBackend,
  subscribeToTopic: subscribeToUserTopic,
  unsubscribeFromTopic: unsubscribeFromUserTopic,
  subscribeToUserTopics,
  checkNotificationPermission,
  deleteFCMToken,
};
