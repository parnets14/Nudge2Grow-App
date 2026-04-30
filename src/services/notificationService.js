/**
 * Notification Service
 * Handles fetching, storing, and managing notifications
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../api';

const STORAGE_KEY = '@nudge2grow:notifications';
const LAST_FETCH_KEY = '@nudge2grow:lastNotificationFetch';
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

// Per-user storage keys so different accounts never share cached data
const getUserStorageKey  = (userId) => userId ? `${STORAGE_KEY}:${userId}` : STORAGE_KEY;
const getUserFetchKey    = (userId) => userId ? `${LAST_FETCH_KEY}:${userId}` : LAST_FETCH_KEY;

/**
 * Returns true if a notification is older than 7 days
 */
const isExpired = (notification) => {
  const dateStr = notification.createdAt || notification.time;
  if (!dateStr) return false;
  return (Date.now() - new Date(dateStr).getTime()) > SEVEN_DAYS_MS;
};

/**
 * Fetch notifications from backend
 * @param {string} token - User authentication token
 * @param {number} limit - Number of notifications to fetch
 * @returns {Promise<Array>} - Array of notifications
 */
export const fetchNotifications = async (token, limit = 50, userId = null) => {
  try {
    console.log('[NotificationService] Fetching notifications from backend... userId:', userId);

    const storageKey = getUserStorageKey(userId);
    const fetchKey   = getUserFetchKey(userId);

    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${BASE_URL}/notifications?limit=${limit}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      console.log('[NotificationService] Backend returned error:', response.status);
      throw new Error(`Failed to fetch notifications: ${response.status}`);
    }

    const data = await response.json();
    console.log('[NotificationService] Fetched from backend:', data.length);

    // Get local notifications for THIS user only
    const localNotifications = await getNotificationsFromStorage(userId);

    // Build a map of local isRead state so we never lose it on re-fetch
    const localReadState = {};
    localNotifications.forEach(n => {
      localReadState[String(n._id)] = n.isRead;
    });

    // Normalize backend notifications — preserve local isRead if user already acted on it
    const backendNotifications = data.map(n => {
      const id = String(n._id || n.id);
      const localRead = localReadState[id];
      return {
        ...n,
        _id: id,
        title: n.title,
        message: n.message || n.body,
        type: n.type || 'info',
        // If locally marked read, keep it read; otherwise trust backend
        isRead: localRead === true ? true : (n.isRead || false),
        createdAt: n.createdAt || new Date().toISOString(),
      };
    });

    // Find local-only notifications (ones not in backend, e.g. new_flashcard_ prefix)
    const backendIds = new Set(backendNotifications.map(n => String(n._id)));
    const localOnly = localNotifications.filter(n =>
      !backendIds.has(String(n._id))
    );

    // Merge: backend first, then local-only ones
    const merged = [...backendNotifications, ...localOnly]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Deduplicate
    const seenIds = new Set();
    let reminderSeen = false;
    const seenCompletedTopics = new Set();

    // Today's end-of-day — notifications scheduled for today or earlier are visible,
    // future ones are stored but hidden until their scheduledDate arrives
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const deduped = merged.filter(n => {
      const id = String(n._id);
      if (seenIds.has(id)) return false;
      seenIds.add(id);

      if (n.type === 'reminder') {
        if (reminderSeen) return false;
        reminderSeen = true;
      }

      if (n.type === 'completed' && n.topicId) {
        if (seenCompletedTopics.has(n.topicId)) return false;
        seenCompletedTopics.add(n.topicId);
      }

      return true;
    });

    console.log('[NotificationService] Final count after dedup:', deduped.length);

    // Drop notifications older than 7 days
    const fresh = deduped.filter(n => !isExpired(n));
    console.log('[NotificationService] After 7-day purge:', fresh.length);

    await AsyncStorage.setItem(storageKey, JSON.stringify(fresh));
    await AsyncStorage.setItem(fetchKey, new Date().toISOString());

    return fresh;
  } catch (error) {
    console.error('[NotificationService] Error fetching notifications:', error);
    console.log('[NotificationService] Falling back to cached data');

    const cached = await getNotificationsFromStorage();
    if (cached && cached.length > 0) {
      console.log('[NotificationService] Using cached notifications:', cached.length);
      return cached;
    }

    console.log('[NotificationService] No cached data, returning empty array');
    return [];
  }
};

/**
 * Save notifications to local storage
 * @param {Array} notifications - Array of notification objects
 * @param {string|null} userId - Optional user ID for per-user storage
 */
export const saveNotificationsToStorage = async (notifications, userId = null) => {
  try {
    const key = getUserStorageKey(userId);
    await AsyncStorage.setItem(key, JSON.stringify(notifications));
    console.log('[NotificationService] Saved notifications to storage');
  } catch (error) {
    console.error('[NotificationService] Error saving notifications:', error);
  }
};

/**
 * Get notifications from local storage
 * @param {string|null} userId - Optional user ID for per-user storage
 * @returns {Promise<Array>} - Array of notifications
 */
export const getNotificationsFromStorage = async (userId = null) => {
  try {
    const key = getUserStorageKey(userId);
    const data = await AsyncStorage.getItem(key);
    if (data) {
      const notifications = JSON.parse(data);
      // Purge any notifications older than 7 days
      const fresh = notifications.filter(n => !isExpired(n));
      if (fresh.length !== notifications.length) {
        // Save the cleaned list back silently
        await AsyncStorage.setItem(key, JSON.stringify(fresh));
        console.log(`[NotificationService] Purged ${notifications.length - fresh.length} expired notification(s)`);
      }
      console.log('[NotificationService] Retrieved notifications from storage:', fresh.length);
      return fresh;
    }
    return [];
  } catch (error) {
    console.error('[NotificationService] Error getting notifications from storage:', error);
    return [];
  }
};

/**
 * Mark notification as read
 * @param {string} notificationId - Notification ID
 * @param {string} token - User authentication token
 */
export const markNotificationAsRead = async (notificationId, token, userId = null) => {
  try {
    // Optimistic local update
    const notifications = await getNotificationsFromStorage(userId);
    const updated = notifications.map(n =>
      (n._id === notificationId || n.id === notificationId) ? { ...n, isRead: true } : n
    );
    await saveNotificationsToStorage(updated, userId);

    const response = await fetch(`${BASE_URL}/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
    if (!response.ok) console.log('[NotificationService] Backend markAsRead failed:', response.status);
    return true;
  } catch (error) {
    console.error('[NotificationService] Error marking notification as read:', error);
    return false;
  }
};

export const markAllNotificationsAsRead = async (token, userId = null) => {
  try {
    const notifications = await getNotificationsFromStorage(userId);
    const updated = notifications.map(n => ({ ...n, isRead: true }));
    await saveNotificationsToStorage(updated, userId);

    const response = await fetch(`${BASE_URL}/notifications/read-all`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
    if (!response.ok) console.log('[NotificationService] Backend markAllAsRead failed:', response.status);
    return true;
  } catch (error) {
    console.error('[NotificationService] Error marking all as read:', error);
    return false;
  }
};

export const deleteNotification = async (notificationId, token, userId = null) => {
  try {
    const notifications = await getNotificationsFromStorage(userId);
    const updated = notifications.filter(n => n._id !== notificationId && n.id !== notificationId);
    await saveNotificationsToStorage(updated, userId);

    const response = await fetch(`${BASE_URL}/notifications/${notificationId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
    if (!response.ok) console.log('[NotificationService] Backend delete failed:', response.status);
    return true;
  } catch (error) {
    console.error('[NotificationService] Error deleting notification:', error);
    return false;
  }
};

export const deleteAllNotifications = async (token, userId = null) => {
  try {
    await AsyncStorage.removeItem(getUserStorageKey(userId));

    const response = await fetch(`${BASE_URL}/notifications`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
    if (!response.ok) console.log('[NotificationService] Backend deleteAll failed:', response.status);
    return true;
  } catch (error) {
    console.error('[NotificationService] Error deleting all notifications:', error);
    return false;
  }
};

/**
 * Get unread notification count from local storage
 */
export const getUnreadCount = async (userId = null) => {
  try {
    const notifications = await getNotificationsFromStorage(userId);
    return Array.isArray(notifications) ? notifications.filter(n => !n.isRead).length : 0;
  } catch (error) {
    console.error('[NotificationService] Error getting unread count:', error);
    return 0;
  }
};

/**
 * Add new notification to local storage (for push notifications)
 * @param {Object} notification - Notification object
 */
export const addNotificationToStorage = async (notification) => {
  try {
    const notifications = await getNotificationsFromStorage();
    // Don't add if same _id already exists
    const alreadyExists = notifications.some(n => String(n._id) === String(notification._id));
    if (alreadyExists) {
      console.log('[NotificationService] Notification already in storage, skipping:', notification._id);
      return notifications;
    }
    const updated = [notification, ...notifications];
    await saveNotificationsToStorage(updated);
    console.log('[NotificationService] Added new notification to storage');
    return updated;
  } catch (error) {
    console.error('[NotificationService] Error adding notification:', error);
    return null;
  }
};

/**
 * Create notification for new topic upload
 * @param {Object} topic - Topic object with title, subject, grade, level, scheduledDate
 * @returns {Promise<boolean>} - True if notification created successfully
 */
export const createTopicUploadNotification = async (topic) => {
  try {
    console.log('[NotificationService] Creating notification for new topic:', topic.title);
    
    // Format the scheduled date
    const scheduledDate = topic.scheduledDate ? new Date(topic.scheduledDate) : new Date();
    const dateOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    const formattedDate = scheduledDate.toLocaleDateString('en-US', dateOptions);
    
    // Check if topic is scheduled for today
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    const isToday = scheduledDate >= todayStart && scheduledDate <= todayEnd;
    
    // Create notification object
    const notification = {
      _id: `topic_${topic._id || Date.now()}`,
      title: isToday ? "Today's Nudge Added!" : 'New Topic Available!',
      message: isToday 
        ? `"${topic.title}" in ${topic.subject || 'your subject'} is ready for today. Start learning now!`
        : `"${topic.title}" in ${topic.subject || 'your subject'} is ready for ${formattedDate}. Start learning today!`,
      type: 'new_nudge',
      isRead: false,
      createdAt: new Date().toISOString(),
      topicId: topic._id,
      subject: topic.subject,
      grade: topic.grade,
      level: topic.level,
      scheduledDate: topic.scheduledDate,
      isNewTodayTopic: isToday, // Flag to identify today's topics
    };
    
    // Add to storage
    await addNotificationToStorage(notification);
    
    // Trigger HomeScreen refresh event
    if (isToday) {
      console.log('[NotificationService] New topic added for today - HomeScreen should refresh');
      // Store a flag to indicate HomeScreen needs refresh
      await AsyncStorage.setItem('@nudge2grow:todaysTopicsNeedRefresh', 'true');
    }
    
    console.log('[NotificationService] Topic notification created successfully');
    return true;
  } catch (error) {
    console.error('[NotificationService] Error creating topic notification:', error);
    return false;
  }
};

/**
 * Create notification for today's scheduled topics
 * @param {Array} topics - Array of topics scheduled for today
 * @returns {Promise<boolean>} - True if notifications created successfully
 */
export const createTodaysTopicNotifications = async (topics) => {
  try {
    if (!topics || topics.length === 0) {
      console.log('[NotificationService] No topics to create notifications for');
      return false;
    }
    
    console.log('[NotificationService] Creating notifications for', topics.length, 'topics');
    
    // Create notification for each topic
    for (const topic of topics) {
      await createTopicUploadNotification(topic);
    }
    
    console.log('[NotificationService] All topic notifications created');
    return true;
  } catch (error) {
    console.error('[NotificationService] Error creating today\'s topic notifications:', error);
    return false;
  }
};

/**
 * Check if notifications need refresh (older than 5 minutes)
 * @returns {Promise<boolean>} - True if refresh needed
 */
export const shouldRefreshNotifications = async () => {
  try {
    const lastFetch = await AsyncStorage.getItem(LAST_FETCH_KEY);
    if (!lastFetch) return true;
    
    const lastFetchTime = new Date(lastFetch);
    const now = new Date();
    const diffMinutes = (now - lastFetchTime) / 1000 / 60;
    
    return diffMinutes > 5; // Refresh if older than 5 minutes
  } catch (error) {
    console.error('[NotificationService] Error checking refresh status:', error);
    return true;
  }
};

/**
 * Send topic completion notification to backend
 * @param {Object} completionData - Topic completion data
 * @param {string} token - User authentication token
 * @returns {Promise<boolean>} - True if notification sent successfully
 */
export const sendTopicCompletionNotification = async (completionData, token) => {
  try {
    console.log('[NotificationService] Sending completion notification:', completionData.topicName);

    const response = await fetch(`${BASE_URL}/notifications/completion`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(completionData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[NotificationService] Backend error:', errorText);
      throw new Error(`${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('[NotificationService] ✅ Backend saved completion notification');

    // Use the backend's notification directly (has real MongoDB _id — no duplicates)
    if (result.notification) {
      const backendNotification = {
        ...result.notification,
        _id: result.notification._id,
        isRead: false,
      };
      await addNotificationToStorage(backendNotification);
      console.log('[NotificationService] ✅ Added backend notification to local storage');
    }

    return true;
  } catch (error) {
    console.error('[NotificationService] ❌ Error:', error.message);

    // Fallback: create local-only notification if backend fails
    try {
      const notification = {
        _id: `completion_${completionData.topicId || Date.now()}`,
        title: '🎉 Topic Completed!',
        message: `Great job! You've completed "${completionData.topicName}" in ${completionData.subjectName}. Keep up the excellent work!`,
        type: 'completed',
        isRead: false,
        createdAt: new Date().toISOString(),
        subject: completionData.subjectName,
        grade: completionData.grade,
        level: completionData.level,
        topicId: completionData.topicId,
      };
      await addNotificationToStorage(notification);
      console.log('[NotificationService] ✅ Fallback local notification created');
      return true;
    } catch (localError) {
      console.error('[NotificationService] ❌ Fallback also failed:', localError);
      return false;
    }
  }
};

/**
 * Check for new flashcard sets matching the student's subject, grade, and level,
 * then create in-app notifications for any that were added since the last login check.
 *
 * @param {Object} userData - Logged-in user data (must have children[0] with grade/level/subjectLevels)
 * @param {string} token    - Auth token for API calls
 */
export const checkAndNotifyNewFlashcards = async (userData, token) => {
  try {
    const child = userData?.children?.[0];
    if (!child) {
      console.log('[NotificationService] No child data, skipping flashcard check');
      return;
    }

    const userId = userData?._id || userData?.id || null;
    const grade = child.grade || '';
    const subjectLevels = child.subjectLevels || {};

    // Build a flat list of { subject, level } pairs the student is enrolled in
    const enrollments = Object.entries(subjectLevels).map(([subject, level]) => ({
      subject,
      level,
    }));

    if (enrollments.length === 0) {
      console.log('[NotificationService] No subject enrollments found, skipping flashcard check');
      return;
    }

    // Per-user key to track when we last checked for new flashcards
    const lastCheckKey = `@nudge2grow:lastFlashcardCheck:${userId || 'guest'}`;
    let lastCheckTime = null;
    try {
      const stored = await AsyncStorage.getItem(lastCheckKey);
      if (stored) lastCheckTime = new Date(stored);
    } catch (_) {}

    // Fetch all topics from backend
    const topicsRes = await fetch(`${BASE_URL}/topics`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!topicsRes.ok) throw new Error(`Topics fetch failed: ${topicsRes.status}`);
    const allTopics = await topicsRes.json();

    // Fetch all content sets (flashcard sets) from backend
    const setsRes = await fetch(`${BASE_URL}/content-sets`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!setsRes.ok) throw new Error(`Content sets fetch failed: ${setsRes.status}`);
    const allContentSets = await setsRes.json();

    // Build a map of topicId → contentSet for quick lookup
    const contentSetByTopic = {};
    (Array.isArray(allContentSets) ? allContentSets : []).forEach(cs => {
      if (cs.topicId) contentSetByTopic[String(cs.topicId)] = cs;
    });

    // Filter topics that match the student's grade AND enrolled subject+level exactly
    const matchingTopics = (Array.isArray(allTopics) ? allTopics : []).filter(topic => {
      const topicGrade = (topic.grade || '').toLowerCase().trim();
      const studentGrade = grade.toLowerCase().trim();

      // Both must be present and equal — no grade means skip
      if (!topicGrade || !studentGrade || topicGrade !== studentGrade) return false;

      const topicSubject = (topic.subjectName || topic.subject || '').toLowerCase().trim();
      const subjectMatch = enrollments.some(
        e => e.subject.toLowerCase().trim() === topicSubject
      );

      return subjectMatch;
    });

    console.log(
      `[NotificationService] Found ${matchingTopics.length} matching topics for grade="${grade}"`
    );

    // Find topics that have a content set matching the student's level,
    // AND were added/updated after last check
    const newFlashcardTopics = matchingTopics.filter(topic => {
      const topicId = String(topic._id || topic.id);
      const contentSet = contentSetByTopic[topicId];
      if (!contentSet) return false;

      // Check content set level matches the student's enrolled level for this subject
      const topicSubject = (topic.subjectName || topic.subject || '').toLowerCase().trim();
      const enrolledLevel = enrollments.find(
        e => e.subject.toLowerCase().trim() === topicSubject
      )?.level || '';

      if (enrolledLevel && contentSet.level) {
        if (contentSet.level.toLowerCase() !== enrolledLevel.toLowerCase()) return false;
      }

      if (!lastCheckTime) return true; // First login — show all

      // Use the content set's createdAt (when flashcards were actually added)
      const setDate = new Date(contentSet.createdAt || contentSet.updatedAt || 0);
      return setDate > lastCheckTime;
    });

    console.log(
      `[NotificationService] ${newFlashcardTopics.length} new flashcard set(s) to notify about`
    );

    // Create a notification for each new flashcard set
    for (const topic of newFlashcardTopics) {
      const topicId = String(topic._id || topic.id);
      const topicSubject = topic.subject || topic.subjectName || 'your subject';
      const topicLevel = enrollments.find(
        e => e.subject.toLowerCase().trim() === topicSubject.toLowerCase().trim()
      )?.level || '';

      const notifId = `new_flashcard_${topicId}`;

      // Skip if we already stored this notification
      const existing = await getNotificationsFromStorage(userId);
      if (existing.some(n => String(n._id) === notifId)) continue;

      // Use the topic's scheduledDate as the notification date so it appears
      // on the correct day — fall back to the content set's createdAt
      const contentSet = contentSetByTopic[topicId];
      const notifDate = topic.scheduledDate
        ? new Date(topic.scheduledDate).toISOString()
        : new Date(contentSet.createdAt || contentSet.updatedAt || Date.now()).toISOString();

      const notification = {
        _id: notifId,
        title: `New Flashcards Added — ${topicSubject}`,
        message: `New flashcards for "${topic.title || topic.topic}" in ${topicSubject}${topicLevel ? ` (${topicLevel})` : ''}${grade ? ` · ${grade}` : ''} are ready. Start learning now!`,
        type: 'new_nudge',
        isRead: false,
        createdAt: notifDate,
        topicId,
        subject: topicSubject,
        grade,
        level: topicLevel,
      };

      await addNotificationToStorage(notification);
      console.log(`[NotificationService] Created flashcard notification for "${topic.title || topic.topic}" — date: ${notifDate}`);
    }

    // Update the last check timestamp
    await AsyncStorage.setItem(lastCheckKey, new Date().toISOString());
  } catch (error) {
    console.error('[NotificationService] Error in checkAndNotifyNewFlashcards:', error.message);
  }
};

/**
 * Clear all notification data (for logout)
 */
export const clearNotificationData = async (userId = null) => {
  try {
    const keysToRemove = [STORAGE_KEY, LAST_FETCH_KEY];
    if (userId) {
      keysToRemove.push(getUserStorageKey(userId));
      keysToRemove.push(getUserFetchKey(userId));
    }
    await Promise.all(keysToRemove.map(k => AsyncStorage.removeItem(k)));
    console.log('[NotificationService] Cleared all notification data');
    return true;
  } catch (error) {
    console.error('[NotificationService] Error clearing notification data:', error);
    return false;
  }
};

export default {
  fetchNotifications,
  saveNotificationsToStorage,
  getNotificationsFromStorage,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
  getUnreadCount,
  addNotificationToStorage,
  createTopicUploadNotification,
  createTodaysTopicNotifications,
  sendTopicCompletionNotification,
  shouldRefreshNotifications,
  clearNotificationData,
  checkAndNotifyNewFlashcards,
};
