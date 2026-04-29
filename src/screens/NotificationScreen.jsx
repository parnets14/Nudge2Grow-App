/**
 * Notification Screen - Shows user notifications with All/Unread tabs
 * Integrated with backend API and local storage
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  fetchNotifications,
  getNotificationsFromStorage,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
  shouldRefreshNotifications,
} from '../services/notificationService';
import { Storage } from '../utils/storage';

// FIX: removed unused `height` destructure
const { width } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isTablet = width >= 768;

const NotificationScreen = ({ onBack, userData }) => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [deletePressed, setDeletePressed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [token, setToken] = useState(null);

  // Stable userId from the logged-in user
  const userId = userData?._id || userData?.id || null;

  useEffect(() => {
    const init = async () => {
      try {
        // Always wipe ALL notification caches when screen loads for a user
        // This ensures switching accounts never shows stale data
        const allKeys = await AsyncStorage.getAllKeys();
        const notifKeys = allKeys.filter(k => k.startsWith('@nudge2grow:notifications'));
        const fetchKeys = allKeys.filter(k => k.startsWith('@nudge2grow:lastNotificationFetch'));
        await Promise.all([...notifKeys, ...fetchKeys].map(k => AsyncStorage.removeItem(k)));
      } catch (_) {}
      loadNotifications();
    };
    init();
  }, [userId]); // re-run when user changes

  const loadNotifications = async () => {
    try {
      setLoading(true);

      let currentToken = null;
      try {
        const storedToken = await Storage.getItem('authToken');
        if (storedToken) {
          currentToken = storedToken;
          setToken(currentToken);
        }
      } catch (credError) {
        console.log('[NotificationScreen] Error getting token:', credError.message);
      }

      // Always fetch fresh from backend — never show another user's cached data
      const freshNotifications = await fetchNotifications(currentToken, 50, userId);
      setNotifications(freshNotifications);
      setLoading(false);
    } catch (error) {
      console.error('[NotificationScreen] Error loading notifications:', error);
      setNotifications([]);
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const storedToken = await Storage.getItem('authToken');
      if (storedToken) {
        const freshNotifications = await fetchNotifications(storedToken, 50, userId);
        setNotifications(freshNotifications);
      }
    } catch (error) {
      console.error('[NotificationScreen] Error refreshing notifications:', error);
    }
    setRefreshing(false);
  }, [userId]);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const allCount = notifications.length;

  const displayedNotifications =
    selectedTab === 'all' ? notifications : notifications.filter(n => !n.isRead);

  // FIX: helper to get a fresh token — uses the same Storage system as App.jsx
  const getToken = async () => {
    if (token) return token;
    try {
      const storedToken = await Storage.getItem('authToken');
      if (storedToken) {
        setToken(storedToken);
        return storedToken;
      }
    } catch (_) {}
    return null;
  };

  const handleMarkAllAsRead = async () => {
    const currentToken = await getToken();
    if (!currentToken) {
      Alert.alert('Session Expired', 'Please log in again to manage notifications.');
      return;
    }
    try {
      const success = await markAllNotificationsAsRead(currentToken, userId);
      if (success) setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      Alert.alert('Error', 'Failed to mark all notifications as read');
    }
  };

  const handleDeleteAll = async () => {
    const currentToken = await getToken();
    if (!currentToken) {
      Alert.alert('Session Expired', 'Please log in again to manage notifications.');
      return;
    }
    Alert.alert('Delete All Notifications', 'Are you sure? This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete All', style: 'destructive',
        onPress: async () => {
          try {
            const success = await deleteAllNotifications(currentToken, userId);
            if (success) setNotifications([]);
          } catch (error) {
            Alert.alert('Error', 'Failed to delete all notifications');
          }
        },
      },
    ]);
  };

  const handleDeleteNotification = async (id) => {
    const currentToken = await getToken();
    if (!currentToken) {
      Alert.alert('Session Expired', 'Please log in again to manage notifications.');
      return;
    }
    try {
      const success = await deleteNotification(id, currentToken, userId);
      if (success) setNotifications(prev => prev.filter(n => n._id !== id && n.id !== id));
    } catch (error) {
      Alert.alert('Error', 'Failed to delete notification');
    }
  };

  const handleNotificationTap = async (notification) => {
    if (!notification.isRead) {
      const currentToken = await getToken();
      if (!currentToken) return;
      try {
        const notificationId = notification._id || notification.id;
        await markNotificationAsRead(notificationId, currentToken, userId);
        setNotifications(prev =>
          prev.map(n =>
            n._id === notificationId || n.id === notificationId ? { ...n, isRead: true } : n
          )
        );
      } catch (error) {
        console.error('[NotificationScreen] Error marking as read:', error);
      }
    }
  };

  // Get icon configuration based on notification type
  const getNotificationIcon = (notification) => {
    const type = notification.type || 'info';

    const iconConfig = {
      new_nudge:   { icon: 'bulb',                 iconBg: '#FEF3C7', iconColor: '#F59E0B' },
      milestone:   { icon: 'trophy',               iconBg: '#FEF3C7', iconColor: '#F59E0B' },
      reminder:    { icon: 'time',                 iconBg: '#DBEAFE', iconColor: '#3B82F6' },
      completed:   { icon: 'checkmark-circle',     iconBg: '#D1FAE5', iconColor: '#10B981' },
      achievement: { icon: 'star',                 iconBg: '#E0E7FF', iconColor: '#6366F1' },
      report:      { icon: 'heart',                iconBg: '#FCE7F3', iconColor: '#EC4899' },
      quiz:        { icon: 'mail',                 iconBg: '#EDE9FE', iconColor: '#7C3AED' },
      info:        { icon: 'information-circle',   iconBg: '#DBEAFE', iconColor: '#3B82F6' },
    };

    return iconConfig[type] || iconConfig.info;
  };

  // Format time ago
  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Just now';

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;

    return date.toLocaleDateString();
  };

  if (loading && notifications.length === 0) {
    return (
      <View style={styles.screen}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
            <Icon name="arrow-back" size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={styles.deleteAllBtn} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6B5DD3" />
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
          <Icon name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity
          style={styles.deleteAllBtn}
          activeOpacity={0.7}
          onPressIn={() => setDeletePressed(true)}
          onPressOut={() => setDeletePressed(false)}
          onPress={handleDeleteAll}
        >
          <Icon name="trash-outline" size={22} color={deletePressed ? '#EF4444' : '#9CA3AF'} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'all' && styles.tabActive]}
          onPress={() => setSelectedTab('all')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, selectedTab === 'all' && styles.tabTextActive]}>
            All ({allCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === 'unread' && styles.tabActive]}
          onPress={() => setSelectedTab('unread')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, selectedTab === 'unread' && styles.tabTextActive]}>
            Unread ({unreadCount})
          </Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Mark all as read */}
      {unreadCount > 0 && (
        <TouchableOpacity style={styles.markAllBtn} onPress={handleMarkAllAsRead} activeOpacity={0.7}>
          <MaterialIcon name="check-all" size={18} color="#6B5DD3" />
          <Text style={styles.markAllText}>Mark all as read</Text>
        </TouchableOpacity>
      )}

      {/* Notifications List */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#6B5DD3']}
            tintColor="#6B5DD3"
          />
        }
      >
        {displayedNotifications.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Icon name="checkmark-done" size={32} color="#6B5DD3" />
            </View>
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptyMessage}>
              {selectedTab === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </Text>
          </View>
        ) : (
          <View style={styles.notificationsList}>
            {displayedNotifications.map((notification) => {
              const iconConfig = getNotificationIcon(notification);
              const notificationId = notification._id || notification.id;

              return (
                <TouchableOpacity
                  key={notificationId}
                  style={styles.notificationCard}
                  onPress={() => handleNotificationTap(notification)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconContainer, { backgroundColor: iconConfig.iconBg }]}>
                    <Icon name={iconConfig.icon} size={20} color={iconConfig.iconColor} />
                  </View>

                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                    <Text style={styles.notificationMessage}>
                      {notification.message || notification.body}
                    </Text>
                    <Text style={styles.notificationTime}>
                      {formatTimeAgo(notification.createdAt || notification.time)}
                    </Text>
                  </View>

                  <View style={styles.rightSection}>
                    {!notification.isRead && <View style={styles.unreadDot} />}
                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => handleDeleteNotification(notificationId)}
                      activeOpacity={0.7}
                    >
                      <Icon name="close-circle" size={20} color="#D1D5DB" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  // FIX: replaced non-existent 'Montserrat-Medium' with system default
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    color: '#6B7280',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: isSmallDevice ? 12 : 16,
    paddingBottom: isSmallDevice ? 12 : 16,
    paddingHorizontal: isSmallDevice ? 16 : 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backBtn: {
    width: isSmallDevice ? 36 : 40,
    height: isSmallDevice ? 36 : 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: isTablet ? 22 : isSmallDevice ? 18 : 20,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
    marginLeft: 8,
  },
  deleteAllBtn: {
    width: isSmallDevice ? 36 : 40,
    height: isSmallDevice ? 36 : 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: isSmallDevice ? 16 : 20,
    paddingTop: isSmallDevice ? 16 : 20,
    paddingBottom: isSmallDevice ? 10 : 12,
    gap: isSmallDevice ? 10 : 12,
    backgroundColor: '#FFFFFF',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: isSmallDevice ? 10 : 12,
    paddingHorizontal: isSmallDevice ? 12 : 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#6B5DD3',
  },
  tabText: {
    fontSize: isTablet ? 16 : isSmallDevice ? 13 : 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#6B5DD3',
  },
  unreadBadge: {
    backgroundColor: '#6B5DD3',
    borderRadius: 10,
    paddingHorizontal: isSmallDevice ? 5 : 6,
    paddingVertical: 2,
    minWidth: isSmallDevice ? 18 : 20,
    alignItems: 'center',
  },
  unreadBadgeText: {
    fontSize: isSmallDevice ? 10 : 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  markAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: isSmallDevice ? 16 : 20,
    paddingVertical: isSmallDevice ? 10 : 12,
    gap: 6,
    backgroundColor: '#FFFFFF',
  },
  markAllText: {
    fontSize: isTablet ? 15 : isSmallDevice ? 13 : 14,
    fontWeight: '600',
    color: '#6B5DD3',
  },

  scrollView: {
    flex: 1,
  },
  notificationsList: {
    padding: isSmallDevice ? 16 : 20,
  },

  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: isSmallDevice ? 10 : 12,
    padding: isSmallDevice ? 10 : 12,
    marginBottom: isSmallDevice ? 6 : 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: isSmallDevice ? 36 : 40,
    height: isSmallDevice ? 36 : 40,
    borderRadius: isSmallDevice ? 18 : 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: isSmallDevice ? 10 : 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: isTablet ? 15 : isSmallDevice ? 13 : 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 3,
  },
  notificationMessage: {
    fontSize: isTablet ? 13 : isSmallDevice ? 11 : 12,
    color: '#6B7280',
    lineHeight: isSmallDevice ? 16 : 18,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: isTablet ? 12 : isSmallDevice ? 10 : 11,
    color: '#9CA3AF',
  },
  rightSection: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: isSmallDevice ? 6 : 8,
  },
  unreadDot: {
    width: isSmallDevice ? 7 : 8,
    height: isSmallDevice ? 7 : 8,
    borderRadius: isSmallDevice ? 3.5 : 4,
    backgroundColor: '#6B5DD3',
    marginBottom: isSmallDevice ? 6 : 8,
  },
  deleteBtn: {
    padding: 4,
  },

  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: isSmallDevice ? 60 : 80,
    paddingHorizontal: isSmallDevice ? 30 : 40,
  },
  emptyIconCircle: {
    width: isSmallDevice ? 70 : 80,
    height: isSmallDevice ? 70 : 80,
    borderRadius: isSmallDevice ? 35 : 40,
    backgroundColor: '#EDE9FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: isSmallDevice ? 16 : 20,
  },
  emptyTitle: {
    fontSize: isTablet ? 22 : isSmallDevice ? 18 : 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: isSmallDevice ? 6 : 8,
  },
  emptyMessage: {
    fontSize: isTablet ? 15 : isSmallDevice ? 13 : 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});

export default NotificationScreen;
