/**
 * Progress Reports Screen — dynamic, includes normal + Beyond School subjects
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  fetchSubjects,
  fetchTopicsBySubject,
  fetchBeyondSchool,
  fetchBeyondSchoolTopicsBySubject,
} from '../api';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;
const isSmallDevice = width < 375;

const ProgressReportsScreen = ({ onBack, userData, completedTopics = new Set() }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [loading, setLoading] = useState(true);

  // All subjects with their topics
  const [subjectData, setSubjectData] = useState([]); // { name, icon, color, topics[], isBeyondSchool }

  const periods = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'all', label: 'All Time' },
  ];

  const child = userData?.children?.[0];

  // ── Load all subjects + topics ──────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const studentSubjectLevels = child?.subjectLevels || {};
        const enrolledSubjectIds = Object.keys(studentSubjectLevels);
        const childBeyondTopics = child?.topics || [];

        const results = [];

        // 1. Normal school subjects
        if (enrolledSubjectIds.length > 0) {
          const [allSubjects, allTopics] = await Promise.all([
            fetchSubjects().catch(() => []),
            fetchTopicsBySubject().catch(() => []),
          ]);

          for (const subjectId of enrolledSubjectIds) {
            const subject = allSubjects.find(s => String(s._id) === subjectId);
            if (!subject) continue;

            const topics = allTopics.filter(t => String(t.subjectId) === subjectId);
            results.push({
              _id: subjectId,
              name: subject.name,
              icon: subject.rnIcon || subject.icon || 'book-open-variant',
              color: '#45a578',
              topics,
              isBeyondSchool: false,
            });
          }
        }

        // 2. Beyond School subjects
        if (childBeyondTopics.length > 0) {
          const allBeyond = await fetchBeyondSchool().catch(() => []);
          const enrolledBeyond = allBeyond.filter(s =>
            childBeyondTopics.includes(String(s._id)),
          );

          for (const subject of enrolledBeyond) {
            const topics = await fetchBeyondSchoolTopicsBySubject(subject._id).catch(() => []);
            results.push({
              _id: String(subject._id),
              name: subject.name,
              icon: subject.rnIcon || subject.icon || 'star-circle-outline',
              color: '#45a578',
              topics,
              isBeyondSchool: true,
            });
          }
        }

        setSubjectData(results);
      } catch (err) {
        console.error('[ProgressReports] load error:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [child?.subjectLevels, child?.topics]);

  // ── Compute period boundaries ───────────────────────────────────────────────
  const periodBounds = useMemo(() => {
    const now = new Date();
    if (selectedPeriod === 'week') {
      const day = now.getDay();
      const daysFromMon = day === 0 ? 6 : day - 1;
      const start = new Date(now);
      start.setDate(now.getDate() - daysFromMon);
      start.setHours(0, 0, 0, 0);
      return { start, end: now };
    }
    if (selectedPeriod === 'month') {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return { start, end: now };
    }
    return { start: new Date(0), end: now };
  }, [selectedPeriod]);

  // ── Build per-subject progress ──────────────────────────────────────────────
  const subjectProgress = useMemo(() => {
    return subjectData.map(subject => {
      const total = subject.topics.length;

      // Count completed topics for this subject within the period
      let completed = 0;
      let recentCount = 0;

      completedTopics.forEach(key => {
        // key format: "SubjectName::topicTitle" or "SubjectName::topicTitle::timestamp"
        const parts = key.split('::');
        if (parts[0] !== subject.name) return;

        const timestamp = parts.length >= 3 && !isNaN(parts[2])
          ? new Date(parseInt(parts[2]))
          : null;

        const inPeriod = !timestamp || (timestamp >= periodBounds.start && timestamp <= periodBounds.end);
        if (inPeriod) completed++;

        // "recent" = this week regardless of period selector
        const weekStart = (() => {
          const d = new Date();
          const diff = d.getDay() === 0 ? 6 : d.getDay() - 1;
          const s = new Date(d);
          s.setDate(d.getDate() - diff);
          s.setHours(0, 0, 0, 0);
          return s;
        })();
        if (timestamp && timestamp >= weekStart) recentCount++;
      });

      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      const recentActivity = recentCount > 0
        ? `${recentCount} nudge${recentCount !== 1 ? 's' : ''} this week`
        : completed > 0 ? 'Keep going!' : 'Start learning';

      return {
        ...subject,
        completed,
        total,
        percentage,
        recentActivity,
      };
    });
  }, [subjectData, completedTopics, periodBounds]);

  // ── Overview stats ──────────────────────────────────────────────────────────
  const overviewStats = useMemo(() => {
    let totalCompleted = 0;
    const daysWithActivity = new Set();

    completedTopics.forEach(key => {
      const parts = key.split('::');
      const timestamp = parts.length >= 3 && !isNaN(parts[2])
        ? new Date(parseInt(parts[2]))
        : null;
      const inPeriod = !timestamp || (timestamp >= periodBounds.start && timestamp <= periodBounds.end);
      if (inPeriod) {
        totalCompleted++;
        if (timestamp) daysWithActivity.add(timestamp.toDateString());
      }
    });

    // Weekly activity bars (Mon–Sun of current week)
    const now = new Date();
    const day = now.getDay();
    const daysFromMon = day === 0 ? 6 : day - 1;
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - daysFromMon + i);
      d.setHours(0, 0, 0, 0);
      const dEnd = new Date(d);
      dEnd.setHours(23, 59, 59, 999);

      let count = 0;
      completedTopics.forEach(key => {
        const parts = key.split('::');
        const ts = parts.length >= 3 && !isNaN(parts[2]) ? new Date(parseInt(parts[2])) : null;
        if (ts && ts >= d && ts <= dEnd) count++;
      });
      return { day: label, nudges: count, active: count > 0 };
    });

    const streak = daysWithActivity.size;
    const topicsExplored = subjectData.reduce((sum, s) => sum + s.topics.length, 0);

    return { totalCompleted, streak, topicsExplored, weekDays };
  }, [completedTopics, periodBounds, subjectData]);

  const periodLabel = selectedPeriod === 'week' ? 'Weekly' : selectedPeriod === 'month' ? 'Monthly' : 'All-Time';
  const maxBar = Math.max(...overviewStats.weekDays.map(d => d.nudges), 1);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Icon name="chevron-back" size={28} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Progress Reports</Text>
        <View style={styles.shareButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.id}
              style={[styles.periodButton, selectedPeriod === period.id && styles.periodButtonActive]}
              onPress={() => setSelectedPeriod(period.id)}
            >
              <Text style={[styles.periodText, selectedPeriod === period.id && styles.periodTextActive]}>
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#45a578" />
            <Text style={styles.loadingText}>Loading your progress...</Text>
          </View>
        ) : (
          <>
            {/* Overview Stats */}
            <View style={styles.overviewCard}>
              <View style={styles.overviewHeader}>
                <MaterialIcon name="chart-box" size={24} color="#45a578" />
                <Text style={styles.overviewTitle}>{periodLabel} Overview</Text>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <View style={[styles.statIconCircle, { backgroundColor: '#E8F5E9' }]}>
                    <MaterialIcon name="check-circle" size={28} color="#45a578" />
                  </View>
                  <Text style={styles.statBoxNumber}>{overviewStats.totalCompleted}</Text>
                  <Text style={styles.statBoxLabel}>Completed</Text>
                </View>

                <View style={styles.statBox}>
                  <View style={[styles.statIconCircle, { backgroundColor: '#FFEBEE' }]}>
                    <MaterialIcon name="fire" size={28} color="#FF6B35" />
                  </View>
                  <Text style={styles.statBoxNumber}>{overviewStats.streak}</Text>
                  <Text style={styles.statBoxLabel}>Active Days</Text>
                </View>

                <View style={styles.statBox}>
                  <View style={[styles.statIconCircle, { backgroundColor: '#E3F2FD' }]}>
                    <MaterialIcon name="book-open-variant" size={28} color="#2196F3" />
                  </View>
                  <Text style={styles.statBoxNumber}>{overviewStats.topicsExplored}</Text>
                  <Text style={styles.statBoxLabel}>Topics</Text>
                </View>

                <View style={styles.statBox}>
                  <View style={[styles.statIconCircle, { backgroundColor: '#F3E5F5' }]}>
                    <MaterialIcon name="school" size={28} color="#9C27B0" />
                  </View>
                  <Text style={styles.statBoxNumber}>{subjectData.length}</Text>
                  <Text style={styles.statBoxLabel}>Subjects</Text>
                </View>
              </View>
            </View>

            {/* Weekly Activity Chart */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialIcon name="calendar-week" size={22} color="#333333" />
                <Text style={styles.sectionTitle}>Weekly Activity</Text>
              </View>

              <View style={styles.activityChart}>
                {overviewStats.weekDays.map((day, index) => (
                  <View key={index} style={styles.activityDay}>
                    <View style={styles.activityBarContainer}>
                      <View
                        style={[
                          styles.activityBar,
                          { height: `${(day.nudges / maxBar) * 100}%` },
                          day.nudges === 0 && { height: 4, opacity: 0.3 },
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

            {/* Subject Progress — normal + beyond school */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialIcon name="school" size={22} color="#333333" />
                <Text style={styles.sectionTitle}>Progress by Subject</Text>
              </View>

              {subjectProgress.length === 0 ? (
                <View style={styles.emptyState}>
                  <MaterialIcon name="book-clock-outline" size={36} color="#9CA3AF" />
                  <Text style={styles.emptyStateText}>No subjects enrolled yet.</Text>
                  <Text style={styles.emptyStateSubText}>Add subjects in Settings to track progress.</Text>
                </View>
              ) : (
                subjectProgress.map((subject, index) => (
                  <View key={subject._id || index} style={styles.subjectCard}>
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
                ))
              )}
            </View>

            {/* Insights */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialIcon name="lightbulb-on-outline" size={22} color="#333333" />
                <Text style={styles.sectionTitle}>Insights</Text>
              </View>

              {(() => {
                const insights = [];
                const best = [...subjectProgress].sort((a, b) => b.percentage - a.percentage)[0];
                const needsWork = [...subjectProgress].sort((a, b) => a.percentage - b.percentage)[0];

                if (overviewStats.streak >= 5) {
                  insights.push({
                    icon: 'fire',
                    color: '#FF6B35',
                    title: `${overviewStats.streak}-Day Streak!`,
                    description: 'Amazing consistency! Daily learning builds strong habits.',
                  });
                } else if (overviewStats.streak > 0) {
                  insights.push({
                    icon: 'trending-up',
                    color: '#45a578',
                    title: 'Keep the momentum!',
                    description: `You've been active ${overviewStats.streak} day${overviewStats.streak !== 1 ? 's' : ''} this week. Keep going!`,
                  });
                } else {
                  insights.push({
                    icon: 'lightbulb-on',
                    color: '#2196F3',
                    title: 'Start your streak today!',
                    description: 'Complete a nudge today to begin building your learning habit.',
                  });
                }

                if (best && best.percentage > 0) {
                  insights.push({
                    icon: best.icon,
                    color: '#45a578',
                    title: `Top subject: ${best.name}`,
                    description: `You've completed ${best.percentage}% of topics in ${best.name}. Great work!`,
                  });
                }

                if (needsWork && needsWork.percentage < 30 && needsWork.total > 0) {
                  insights.push({
                    icon: 'star-outline',
                    color: '#FF9800',
                    title: `Explore ${needsWork.name}`,
                    description: `Only ${needsWork.percentage}% done. Try a nudge in ${needsWork.name} today!`,
                  });
                }

                return insights.map((insight, i) => (
                  <View key={i} style={styles.insightCard}>
                    <View style={[styles.insightIcon, { backgroundColor: `${insight.color}20` }]}>
                      <MaterialIcon name={insight.icon} size={24} color={insight.color} />
                    </View>
                    <View style={styles.insightContent}>
                      <Text style={styles.insightTitle}>{insight.title}</Text>
                      <Text style={styles.insightText}>{insight.description}</Text>
                    </View>
                  </View>
                ));
              })()}
            </View>
          </>
        )}

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

  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },

  loadingText: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Montserrat-Regular',
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

  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },

  emptyStateText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666666',
    fontFamily: 'Montserrat-SemiBold',
  },

  emptyStateSubText: {
    fontSize: 13,
    color: '#999999',
    textAlign: 'center',
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
