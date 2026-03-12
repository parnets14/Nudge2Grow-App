/**
 * Progress Reports Screen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;
const isSmallDevice = width < 375;

const ProgressReportsScreen = ({ onBack }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const periods = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'all', label: 'All Time' },
  ];

  const weeklyData = {
    nudgesCompleted: 24,
    totalTime: '3.5 hours',
    streak: 7,
    topicsExplored: 8,
    weeklyGrowth: 25,
  };

  const subjectProgress = [
    { 
      name: 'Environmental Studies', 
      completed: 8, 
      total: 12, 
      color: '#27AE60', 
      percentage: 67,
      icon: 'leaf',
      recentActivity: '2 nudges this week'
    },
    { 
      name: 'Mathematics', 
      completed: 6, 
      total: 10, 
      color: '#27AE60', 
      percentage: 60,
      icon: 'calculator-variant',
      recentActivity: '3 nudges this week'
    },
    { 
      name: 'Science', 
      completed: 5, 
      total: 8, 
      color: '#9B59B6', 
      percentage: 62,
      icon: 'flask-outline',
      recentActivity: '1 nudge this week'
    },
    { 
      name: 'Language Arts', 
      completed: 3, 
      total: 6, 
      color: '#E74C3C', 
      percentage: 50,
      icon: 'book-alphabet',
      recentActivity: '1 nudge this week'
    },
    { 
      name: 'Values & Character', 
      completed: 2, 
      total: 5, 
      color: '#FF9800', 
      percentage: 40,
      icon: 'heart-multiple-outline',
      recentActivity: 'Start learning'
    },
  ];

  const recentAchievements = [
    {
      id: 1,
      title: '7-Day Streak Champion!',
      description: 'Completed nudges for 7 consecutive days',
      icon: 'fire',
      color: '#FF6B35',
      date: 'Today',
      points: '+50 points'
    },
    {
      id: 2,
      title: 'Environmental Explorer',
      description: 'Completed 8 environmental studies nudges',
      icon: 'leaf',
      color: '#27AE60',
      date: '2 days ago',
      points: '+30 points'
    },
    {
      id: 3,
      title: 'Math Wizard',
      description: 'Solved 20 math challenges successfully',
      icon: 'calculator-variant',
      color: '#27AE60',
      date: '4 days ago',
      points: '+40 points'
    },
  ];

  const weeklyActivity = [
    { day: 'Mon', nudges: 3, active: true },
    { day: 'Tue', nudges: 4, active: true },
    { day: 'Wed', nudges: 3, active: true },
    { day: 'Thu', nudges: 4, active: true },
    { day: 'Fri', nudges: 5, active: true },
    { day: 'Sat', nudges: 3, active: true },
    { day: 'Sun', nudges: 2, active: true },
  ];

  const insights = [
    {
      icon: 'trending-up',
      color: '#45a578',
      title: 'Amazing Progress!',
      description: 'You\'re 25% more active this week compared to last week. Keep up the great work!'
    },
    {
      icon: 'star',
      color: '#FFB84D',
      title: 'Consistency is Key',
      description: 'You\'ve maintained a 7-day streak! Daily learning builds strong habits.'
    },
    {
      icon: 'lightbulb-on',
      color: '#2196F3',
      title: 'Try Something New',
      description: 'Explore "Values & Character" topics to add variety to your learning journey.'
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Icon name="chevron-back" size={28} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Progress Reports</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Icon name="share-social-outline" size={24} color="#45a578" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.id}
              style={[
                styles.periodButton,
                selectedPeriod === period.id && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod(period.id)}
            >
              <Text
                style={[
                  styles.periodText,
                  selectedPeriod === period.id && styles.periodTextActive,
                ]}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Overview Stats */}
        <View style={styles.overviewCard}>
          <View style={styles.overviewHeader}>
            <MaterialIcon name="chart-box" size={24} color="#45a578" />
            <Text style={styles.overviewTitle}>Weekly Overview</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <View style={[styles.statIconCircle, { backgroundColor: '#E8F5E9' }]}>
                <MaterialIcon name="check-circle" size={28} color="#45a578" />
              </View>
              <Text style={styles.statBoxNumber}>{weeklyData.nudgesCompleted}</Text>
              <Text style={styles.statBoxLabel}>Completed</Text>
            </View>

            <View style={styles.statBox}>
              <View style={[styles.statIconCircle, { backgroundColor: '#FFF3E0' }]}>
                <MaterialIcon name="clock-outline" size={28} color="#FF9800" />
              </View>
              <Text style={styles.statBoxNumber}>{weeklyData.totalTime}</Text>
              <Text style={styles.statBoxLabel}>Time Spent</Text>
            </View>

            <View style={styles.statBox}>
              <View style={[styles.statIconCircle, { backgroundColor: '#FFEBEE' }]}>
                <MaterialIcon name="fire" size={28} color="#FF6B35" />
              </View>
              <Text style={styles.statBoxNumber}>{weeklyData.streak} days</Text>
              <Text style={styles.statBoxLabel}>Streak</Text>
            </View>

            <View style={styles.statBox}>
              <View style={[styles.statIconCircle, { backgroundColor: '#E3F2FD' }]}>
                <MaterialIcon name="book-open-variant" size={28} color="#2196F3" />
              </View>
              <Text style={styles.statBoxNumber}>{weeklyData.topicsExplored}</Text>
              <Text style={styles.statBoxLabel}>Topics</Text>
            </View>
          </View>

          <View style={styles.growthBanner}>
            <Icon name="trending-up" size={20} color="#45a578" />
            <Text style={styles.growthText}>
              <Text style={styles.growthPercent}>+{weeklyData.weeklyGrowth}%</Text> growth from last week
            </Text>
          </View>
        </View>

        {/* Weekly Activity Chart */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcon name="calendar-week" size={22} color="#333333" />
            <Text style={styles.sectionTitle}>Weekly Activity</Text>
          </View>
          
          <View style={styles.activityChart}>
            {weeklyActivity.map((day, index) => (
              <View key={index} style={styles.activityDay}>
                <View style={styles.activityBarContainer}>
                  <View
                    style={[
                      styles.activityBar,
                      { height: `${(day.nudges / 5) * 100}%` },
                    ]}
                  />
                </View>
                <Text style={styles.activityDayLabel}>{day.day}</Text>
                <Text style={styles.activityDayCount}>{day.nudges}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.chartNote}>Daily nudges completed this week</Text>
        </View>

        {/* Subject Progress */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcon name="school" size={22} color="#333333" />
            <Text style={styles.sectionTitle}>Progress by Subject</Text>
          </View>
          
          {subjectProgress.map((subject, index) => (
            <View key={index} style={styles.subjectCard}>
              <View style={styles.subjectHeader}>
                <View style={styles.subjectLeft}>
                  <View style={[styles.subjectIcon, { backgroundColor: `${subject.color}20` }]}>
                    <MaterialIcon name={subject.icon} size={24} color={subject.color} />
                  </View>
                  <View style={styles.subjectInfo}>
                    <Text style={styles.subjectName}>{subject.name}</Text>
                    <Text style={styles.subjectActivity}>{subject.recentActivity}</Text>
                  </View>
                </View>
                <View style={styles.subjectRight}>
                  <Text style={styles.subjectPercentage}>{subject.percentage}%</Text>
                  <Text style={styles.subjectStats}>{subject.completed}/{subject.total}</Text>
                </View>
              </View>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    { width: `${subject.percentage}%`, backgroundColor: subject.color },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcon name="trophy" size={22} color="#333333" />
            <Text style={styles.sectionTitle}>Recent Achievements</Text>
          </View>
          
          {recentAchievements.map((achievement) => (
            <View key={achievement.id} style={styles.achievementCard}>
              <View
                style={[
                  styles.achievementIcon,
                  { backgroundColor: `${achievement.color}20` },
                ]}
              >
                <MaterialIcon
                  name={achievement.icon}
                  size={32}
                  color={achievement.color}
                />
              </View>
              <View style={styles.achievementContent}>
                <View style={styles.achievementTop}>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  <Text style={styles.achievementPoints}>{achievement.points}</Text>
                </View>
                <Text style={styles.achievementDescription}>
                  {achievement.description}
                </Text>
                <Text style={styles.achievementDate}>{achievement.date}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Insights */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcon name="lightbulb-on-outline" size={22} color="#333333" />
            <Text style={styles.sectionTitle}>Insights & Tips</Text>
          </View>

          {insights.map((insight, index) => (
            <View key={index} style={styles.insightCard}>
              <View style={[styles.insightIcon, { backgroundColor: `${insight.color}20` }]}>
                <MaterialIcon name={insight.icon} size={24} color={insight.color} />
              </View>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>{insight.title}</Text>
                <Text style={styles.insightText}>{insight.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

export default ProgressReportsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Montserrat-Bold',
  },

  shareButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    flex: 1,
  },

  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    margin: 20,
    marginBottom: 16,
    padding: 4,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  periodButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },

  periodButtonActive: {
    backgroundColor: '#45a578',
  },

  periodText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    fontFamily: 'Montserrat-SemiBold',
  },

  periodTextActive: {
    color: '#FFFFFF',
  },

  overviewCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },

  overviewTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    fontFamily: 'Montserrat-Bold',
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  statBox: {
    alignItems: 'center',
    flex: 1,
  },

  statIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },

  statBoxNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 4,
    fontFamily: 'Montserrat-Bold',
  },

  statBoxLabel: {
    fontSize: 11,
    color: '#666666',
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
  },

  growthBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },

  growthText: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Montserrat-Regular',
  },

  growthPercent: {
    fontWeight: '700',
    color: '#45a578',
    fontFamily: 'Montserrat-Bold',
  },

  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
    fontFamily: 'Montserrat-Bold',
  },

  activityChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 8,
  },

  activityDay: {
    flex: 1,
    alignItems: 'center',
  },

  activityBarContainer: {
    width: 28,
    height: 80,
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },

  activityBar: {
    width: '100%',
    backgroundColor: '#45a578',
    borderRadius: 6,
  },

  activityDayLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 8,
    fontFamily: 'Montserrat-Medium',
  },

  activityDayCount: {
    fontSize: 11,
    color: '#999999',
    marginTop: 2,
    fontFamily: 'Montserrat-Regular',
  },

  chartNote: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    fontStyle: 'italic',
    fontFamily: 'Montserrat-Regular',
  },

  subjectCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },

  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  subjectLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },

  subjectIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  subjectInfo: {
    flex: 1,
  },

  subjectName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 4,
    fontFamily: 'Montserrat-Bold',
  },

  subjectActivity: {
    fontSize: 12,
    color: '#999999',
    fontFamily: 'Montserrat-Regular',
  },

  subjectRight: {
    alignItems: 'flex-end',
  },

  subjectPercentage: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 2,
    fontFamily: 'Montserrat-Bold',
  },

  subjectStats: {
    fontSize: 12,
    color: '#666666',
    fontFamily: 'Montserrat-Regular',
  },

  progressBarContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },

  progressBar: {
    height: '100%',
    borderRadius: 4,
  },

  achievementCard: {
    flexDirection: 'row',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },

  achievementIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  achievementContent: {
    flex: 1,
  },

  achievementTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  achievementTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333333',
    flex: 1,
    fontFamily: 'Montserrat-Bold',
  },

  achievementPoints: {
    fontSize: 12,
    fontWeight: '700',
    color: '#45a578',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontFamily: 'Montserrat-Bold',
  },

  achievementDescription: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 6,
    fontFamily: 'Montserrat-Regular',
  },

  achievementDate: {
    fontSize: 11,
    color: '#999999',
    fontFamily: 'Montserrat-Regular',
  },

  insightCard: {
    flexDirection: 'row',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },

  insightIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  insightContent: {
    flex: 1,
  },

  insightTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 6,
    fontFamily: 'Montserrat-Bold',
  },

  insightText: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 20,
    fontFamily: 'Montserrat-Regular',
  },

  bottomPadding: {
    height: 40,
  },
});
