/**
 * Notification Screen - Shows user notifications with All/Unread tabs
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isTablet = width >= 768;

const NotificationScreen = ({ onBack }) => {
  const [selectedTab, setSelectedTab] = useState('all'); // 'all' or 'unread'
  const [deletePressed, setDeletePressed] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      icon: 'bulb',
      iconBg: '#FEF3C7',
      iconColor: '#F59E0B',
      title: 'New Daily Nudge Available!',
      message: 'Explore "Solar System" in Science. Perfect for today\'s learning!',
      time: '2 hours ago',
      isRead: false,
    },
    {
      id: 2,
      icon: 'trophy',
      iconBg: '#FEF3C7',
      iconColor: '#F59E0B',
      title: 'Milestone Achieved! ',
      message: 'Congratulations! You\'ve completed 50 nudges this month.',
      time: '5 hours ago',
      isRead: false,
    },
    {
      id: 3,
      icon: 'time',
      iconBg: '#DBEAFE',
      iconColor: '#3B82F6',
      title: 'Daily Learning Reminder',
      message: 'Don\'t forget your daily learning session with your child!',
      time: '1 day ago',
      isRead: false,
    },
    {
      id: 4,
      icon: 'checkmark-circle',
      iconBg: '#D1FAE5',
      iconColor: '#10B981',
      title: 'Topic Completed!',
      message: 'Great job! You completed "Water Cycle" in Environmental Studies.',
      time: '2 days ago',
      isRead: true,
    },
    {
      id: 5,
      icon: 'star',
      iconBg: '#E0E7FF',
      iconColor: '#6366F1',
      title: 'New Achievement Unlocked',
      message: 'You\'ve earned the "Consistent Learner" badge!',
      time: '3 days ago',
      isRead: true,
    },
    {
      id: 6,
      icon: 'heart',
      iconBg: '#FCE7F3',
      iconColor: '#EC4899',
      title: 'Weekly Progress Report',
      message: 'Your child completed 7 topics this week. Keep up the great work!',
      time: '5 days ago',
      isRead: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const allCount = notifications.length;

  const displayedNotifications = selectedTab === 'all' 
    ? notifications 
    : notifications.filter(n => !n.isRead);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const deleteAllNotifications = () => {
    setNotifications([]);
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

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
          onPress={deleteAllNotifications}
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
        <TouchableOpacity style={styles.markAllBtn} onPress={markAllAsRead} activeOpacity={0.7}>
          <MaterialIcon name="check-all" size={18} color="#6B5DD3" />
          <Text style={styles.markAllText}>Mark all as read</Text>
        </TouchableOpacity>
      )}

      {/* Notifications List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {displayedNotifications.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Icon name="checkmark-done" size={32} color="#6B5DD3" />
            </View>
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptyMessage}>No unread notifications</Text>
          </View>
        ) : (
          <View style={styles.notificationsList}>
            {displayedNotifications.map((notification) => (
              <View key={notification.id} style={styles.notificationCard}>
                <View style={[styles.iconContainer, { backgroundColor: notification.iconBg }]}>
                  <Icon name={notification.icon} size={20} color={notification.iconColor} />
                </View>

                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>{notification.title}</Text>
                  <Text style={styles.notificationMessage}>{notification.message}</Text>
                  <Text style={styles.notificationTime}>{notification.time}</Text>
                </View>

                <View style={styles.rightSection}>
                  {!notification.isRead && <View style={styles.unreadDot} />}
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => deleteNotification(notification.id)}
                    activeOpacity={0.7}
                  >
                    <Icon name="close-circle" size={20} color="#D1D5DB" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
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
