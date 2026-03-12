/**
 * Learning Progress Screen - Learning Summary with Weekly/Monthly data
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
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Svg, { Circle, Polyline } from 'react-native-svg';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;
const isSmallDevice = width < 375;

// Circular Progress Component
const CircularProgress = ({ percentage, color, size = 50 }) => {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text style={{
          fontSize: isSmallDevice ? 11 : 12,
          fontWeight: '700',
          color: color,
          fontFamily: 'Montserrat-Bold',
        }}>
          {percentage}%
        </Text>
      </View>
    </View>
  );
};

const LearningProgressScreen = ({ userData, onBack, onNavigate }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');
  const [selectedBar, setSelectedBar] = useState(null);
  const [showAllKnownTopics, setShowAllKnownTopics] = useState(false);
  const [showAllPracticeTopics, setShowAllPracticeTopics] = useState(false);

  const child = userData?.children?.[0];

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Adjust age if birthday hasn't occurred this year yet
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const childAge = child?.dateOfBirth ? calculateAge(child.dateOfBirth) : child?.age;

  // Weekly data (current week)
  const weeklyData = {
    topicsKnown: 12,
    topicsNeedsPractice: 7,
    skillsMastered: 8,
    timeSpent: '45min',
    overview: {
      completed: 24,
      timeSpent: '3.5 hours',
      streak: '7 days',
      topics: 8,
      growth: '+25%',
    },
    activity: [
      { day: 'Mon', activities: 3, hours: 0.5, activityHeight: 60, hoursHeight: 20 },
      { day: 'Tue', activities: 4, hours: 0.6, activityHeight: 80, hoursHeight: 24 },
      { day: 'Wed', activities: 3, hours: 0.5, activityHeight: 60, hoursHeight: 20 },
      { day: 'Thu', activities: 4, hours: 0.7, activityHeight: 80, hoursHeight: 28 },
      { day: 'Fri', activities: 5, hours: 0.8, activityHeight: 100, hoursHeight: 32 },
      { day: 'Sat', activities: 3, hours: 0.4, activityHeight: 60, hoursHeight: 16 },
      { day: 'Sun', activities: 2, hours: 0.3, activityHeight: 40, hoursHeight: 12 },
    ],
    knownTopics: [
      'Water Conservation',
      'Simple Addition',
      'Basic Shapes',
      'Animal Homes',
      'Reading Skills',
      'Patterns',
      'Five Senses',
      'Healthy Habits',
      'Story Time',
      'Sharing & Caring',
      'Color Mixing',
      'Rainwater Harvesting',
    ],
    knownTopicsDetailed: [
      { name: 'Water Conservation', subject: 'EVS', progress: 95, daysAgo: 2 },
      { name: 'Simple Addition', subject: 'Math', progress: 92, daysAgo: 1 },
      { name: 'Basic Shapes', subject: 'Math', progress: 88, daysAgo: 3 },
      { name: 'Animal Homes', subject: 'EVS', progress: 90, daysAgo: 2 },
      { name: 'Story Reading', subject: 'English', progress: 85, daysAgo: 1 },
      { name: 'Plant Parts', subject: 'EVS', progress: 87, daysAgo: 4 },
    ],
    needsPracticeTopics: [
      'Measurement',
      'Water Cycle',
      'Number Games',
      'Writing Letters',
      'Rhyming Words',
      'Honesty',
      'Drawing Fun',
    ],
    needsPracticeTopicsDetailed: [
      { name: 'Measurement', subject: 'Math', progress: 45, attempts: 3, priority: 'High' },
      { name: 'Water Cycle', subject: 'EVS', progress: 52, attempts: 4, priority: '' },
      { name: 'Number Games', subject: 'Math', progress: 48, attempts: 5, priority: 'High' },
      { name: 'Writing Letters', subject: 'English', progress: 55, attempts: 3, priority: '' },
      { name: 'Subtraction Basics', subject: 'Math', progress: 42, attempts: 2, priority: 'High' },
    ],
    subjects: [
      { name: 'Math', icon: 'calculator', progress: 80, completed: 8, total: 10, growth: '+15%', color: '#6366F1' },
      { name: 'Eng', icon: 'book', progress: 75, completed: 6, total: 8, growth: '+20%', color: '#EC4899' },
      { name: 'EVS', icon: 'leaf', progress: 83, completed: 5, total: 6, growth: '+30%', color: '#10B981' },
      { name: 'S.St', icon: 'earth', progress: 67, completed: 4, total: 6, growth: '+18%', color: '#F59E0B' },
      { name: 'Fin', icon: 'cash', progress: 60, completed: 3, total: 5, growth: '+10%', color: '#14B8A6' },
      { name: 'AI', icon: 'hardware-chip', progress: 80, completed: 4, total: 5, growth: '+25%', color: '#8B5CF6' },
    ],
  };

  // Monthly data (last month)
  const monthlyData = {
    topicsKnown: 45,
    topicsNeedsPractice: 18,
    skillsMastered: 28,
    timeSpent: '6.5hrs',
    overview: {
      completed: 96,
      timeSpent: '14.2 hours',
      streak: '28 days',
      topics: 32,
      growth: '+42%',
    },
    activity: [
      { day: 'Week 1', activities: 22, hours: 2.5, activityHeight: 75, hoursHeight: 30 },
      { day: 'Week 2', activities: 26, hours: 3.2, activityHeight: 90, hoursHeight: 38 },
      { day: 'Week 3', activities: 24, hours: 2.8, activityHeight: 82, hoursHeight: 34 },
      { day: 'Week 4', activities: 24, hours: 2.7, activityHeight: 82, hoursHeight: 32 },
    ],
    knownTopics: [
      'Water Conservation', 'Simple Addition', 'Basic Shapes', 'Animal Homes',
      'Reading Skills', 'Patterns', 'Five Senses', 'Healthy Habits',
      'Story Time', 'Sharing & Caring', 'Color Mixing', 'Rainwater Harvesting',
      'Water Cycle', 'Saving Water', 'Parts of a Plant', 'Growing Plants',
      'Trees & Nature', 'Recycling', 'Amazing Animals', 'My Body',
      'Food & Nutrition', 'Weather', 'Vocabulary', 'Creative Writing',
      'Acts of Kindness', 'Respect', 'Empathy', 'Gratitude',
      'Helping Others', 'Craft Time', 'Music & Rhythm', 'Creative Expression',
      'Art Gallery', 'Recycled Art', 'Counting Money', 'Math in Daily Life',
      'Wednesday Topics', 'Thursday Topics', 'Friday Topics', 'Saturday Topics',
      'Sunday Topics', 'Monday Topics', 'Tuesday Topics', 'Additional Topic 1',
      'Additional Topic 2',
    ],
    needsPracticeTopics: [
      'Measurement', 'Number Games', 'Writing Letters', 'Rhyming Words',
      'Honesty', 'Drawing Fun', 'Story Elements', 'Forgiveness',
      'Patience', 'Being Patient', 'Understanding Emotions', 'Problem Solving',
      'Critical Thinking', 'Advanced Patterns', 'Complex Shapes', 'Time Management',
      'Organization Skills', 'Communication',
    ],
    knownTopicsDetailed: [
      { name: 'Water Conservation', subject: 'EVS', progress: 95, daysAgo: 2 },
      { name: 'Simple Addition', subject: 'Math', progress: 92, daysAgo: 1 },
      { name: 'Basic Shapes', subject: 'Math', progress: 88, daysAgo: 3 },
      { name: 'Animal Homes', subject: 'EVS', progress: 90, daysAgo: 2 },
      { name: 'Story Reading', subject: 'English', progress: 85, daysAgo: 1 },
      { name: 'Plant Parts', subject: 'EVS', progress: 87, daysAgo: 4 },
    ],
    needsPracticeTopicsDetailed: [
      { name: 'Measurement', subject: 'Math', progress: 45, attempts: 3, priority: 'High' },
      { name: 'Water Cycle', subject: 'EVS', progress: 52, attempts: 4, priority: '' },
      { name: 'Number Games', subject: 'Math', progress: 48, attempts: 5, priority: 'High' },
      { name: 'Writing Letters', subject: 'English', progress: 55, attempts: 3, priority: '' },
      { name: 'Subtraction Basics', subject: 'Math', progress: 42, attempts: 2, priority: 'High' },
    ],
    subjects: [
      { name: 'Math', icon: 'calculator', progress: 80, completed: 8, total: 10, growth: '+15%', color: '#6366F1' },
      { name: 'Eng', icon: 'book', progress: 75, completed: 6, total: 8, growth: '+20%', color: '#EC4899' },
      { name: 'EVS', icon: 'leaf', progress: 83, completed: 5, total: 6, growth: '+30%', color: '#10B981' },
      { name: 'S.St', icon: 'earth', progress: 67, completed: 4, total: 6, growth: '+18%', color: '#F59E0B' },
      { name: 'Fin', icon: 'cash', progress: 60, completed: 3, total: 5, growth: '+10%', color: '#14B8A6' },
      { name: 'AI', icon: 'hardware-chip', progress: 80, completed: 4, total: 5, growth: '+25%', color: '#8B5CF6' },
    ],
  };

  const currentData = selectedPeriod === 'weekly' ? weeklyData : monthlyData;

  const getAvatarSource = (avatarId) => {
    const avatarMap = {
      'A1': require('../assets/images/A1.jpeg'),
      'A2': require('../assets/images/A2.jpeg'),
      'A3': require('../assets/images/A3.jpeg'),
      'A4': require('../assets/images/A4.jpeg'),
      'A5': require('../assets/images/A5.jpeg'),
      'A6': require('../assets/images/A6.jpeg'),
    };
    return avatarMap[avatarId] || avatarMap['A1'];
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Icon name="arrow-back" size={isSmallDevice ? 22 : 24} color="#1A1A1A" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Learning Summary</Text>
          <Text style={styles.headerSubtitle}>Detailed insights & progress</Text>
        </View>
        <TouchableOpacity style={styles.shareButton}>
          <Icon name="share-social-outline" size={isSmallDevice ? 20 : 22} color="#666666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.downloadButton}>
          <Icon name="download-outline" size={isSmallDevice ? 20 : 22} color="#666666" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <View style={styles.profileImageContainer}>
              {child && (
                <>
                  <Image 
                    source={getAvatarSource(child.avatar)} 
                    style={styles.profileImage}
                    resizeMode="cover"
                  />
                  <View style={styles.onlineBadge}>
                    <Icon name="trophy" size={isSmallDevice ? 12 : 14} color="#FFFFFF" />
                  </View>
                </>
              )}
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{child?.name || 'Zues'}</Text>
              <Text style={styles.profileDetails}>
                Age {childAge || 8} · Grade {child?.grade || '3'} · Active Learner
              </Text>
              <View style={styles.badgesContainer}>
                <View style={styles.badge}>
                  <Text style={styles.badgeEmoji}>🔥</Text>
                  <Text style={styles.badgeText}>On Fire!</Text>
                </View>
                <View style={[styles.badge, styles.badgePurple]}>
                  <Text style={styles.badgeEmoji}>⭐</Text>
                  <Text style={styles.badgeText}>Top Performer</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Period Toggle */}
        <View style={styles.periodToggle}>
          <TouchableOpacity
            style={[styles.periodToggleButton, selectedPeriod === 'weekly' && styles.periodToggleButtonActive]}
            onPress={() => setSelectedPeriod('weekly')}
            activeOpacity={0.7}
          >
            <Text style={[styles.periodToggleText, selectedPeriod === 'weekly' && styles.periodToggleTextActive]}>
              Weekly
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodToggleButton, selectedPeriod === 'monthly' && styles.periodToggleButtonActive]}
            onPress={() => setSelectedPeriod('monthly')}
            activeOpacity={0.7}
          >
            <Text style={[styles.periodToggleText, selectedPeriod === 'monthly' && styles.periodToggleTextActive]}>
              Monthly
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats Grid or Monthly Overview */}
        {selectedPeriod === 'weekly' ? (
          <>
            <View style={styles.statsGrid} key="weekly-stats">
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Icon name="checkmark-circle-outline" size={isSmallDevice ? 20 : 22} color="#9CA3AF" />
                </View>
                <Text style={styles.statNumber}>{currentData.overview.completed}</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Icon name="time-outline" size={isSmallDevice ? 20 : 22} color="#9CA3AF" />
                </View>
                <Text style={styles.statNumber}>{currentData.overview.timeSpent}</Text>
                <Text style={styles.statLabel}>Time Spent</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Icon name="flame-outline" size={isSmallDevice ? 20 : 22} color="#9CA3AF" />
                </View>
                <Text style={styles.statNumber}>{currentData.overview.streak}</Text>
                <Text style={styles.statLabel}>Streak</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Icon name="book-outline" size={isSmallDevice ? 20 : 22} color="#9CA3AF" />
                </View>
                <Text style={styles.statNumber}>{currentData.overview.topics}</Text>
                <Text style={styles.statLabel}>Topics</Text>
              </View>
            </View>

            {/* Growth Insight Card - Blue */}
            <View style={styles.growthInsightCard}>
              <View style={styles.growthInsightIcon}>
                <MaterialIcon name="trending-up" size={isSmallDevice ? 20 : 24} color="#3B82F6" />
              </View>
              <View style={styles.growthInsightContent}>
                <Text style={styles.growthInsightTitle}>+25% growth from last week</Text>
                <Text style={styles.growthInsightSubtitle}>Zues is on an incredible learning streak! 🚀</Text>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.monthlyOverviewCard} key="monthly-stats">
            <View style={styles.monthlyOverviewHeader}>
              <View>
                <Text style={styles.monthlyOverviewLabel}>Monthly Overview</Text>
                <Text style={styles.monthlyOverviewMonth}>February 2025</Text>
              </View>
              <Icon name="calendar-outline" size={isSmallDevice ? 20 : 24} color="#FFFFFF" />
            </View>
            
            <View style={styles.monthlyStatsGrid}>
              <View style={styles.monthlyStatItem}>
                <Text style={styles.monthlyStatNumber}>{currentData.overview.completed}</Text>
                <Text style={styles.monthlyStatLabel}>Activities</Text>
                <Text style={styles.monthlyStatChange}>+33% vs Jan</Text>
              </View>
              
              <View style={styles.monthlyStatItem}>
                <Text style={styles.monthlyStatNumber}>15.6</Text>
                <Text style={styles.monthlyStatLabel}>Hrs Logged</Text>
                <Text style={styles.monthlyStatChange}>+8h vs Jan</Text>
              </View>
              
              <View style={styles.monthlyStatItem}>
                <Text style={styles.monthlyStatNumber}>74%</Text>
                <Text style={styles.monthlyStatLabel}>Avg Score</Text>
                <Text style={styles.monthlyStatChange}>+9% vs Jan</Text>
              </View>
              
              <View style={styles.monthlyStatItem}>
                <Text style={styles.monthlyStatNumber}>28d</Text>
                <Text style={styles.monthlyStatLabel}>Streak</Text>
                <Text style={styles.monthlyStatChange}>Personal best!</Text>
              </View>
            </View>
          </View>
        )}

        {/* Weekly Trend Chart (Monthly View Only) */}
        {selectedPeriod === 'monthly' && (
          <View style={styles.weeklyTrendCard}>
            <View style={styles.weeklyTrendHeader}>
              <View style={styles.weeklyTrendIconContainer}>
                <MaterialIcon name="chart-line" size={isSmallDevice ? 18 : 20} color="#6366F1" />
              </View>
              <View>
                <Text style={styles.weeklyTrendTitle}>Weekly Trend</Text>
                <Text style={styles.weeklyTrendSubtitle}>Activities, hours & scores by week</Text>
              </View>
            </View>

            <View style={styles.trendChartContainer}>
              <View style={styles.trendYAxisLabels}>
                <Text style={styles.trendYAxisLabel}>100</Text>
                <Text style={styles.trendYAxisLabel}>75</Text>
                <Text style={styles.trendYAxisLabel}>50</Text>
                <Text style={styles.trendYAxisLabel}>25</Text>
                <Text style={styles.trendYAxisLabel}>0</Text>
              </View>

              <View style={styles.trendChartWithGrid}>
                <View style={styles.trendGridLines}>
                  <View style={styles.trendGridLine} />
                  <View style={styles.trendGridLine} />
                  <View style={styles.trendGridLine} />
                  <View style={styles.trendGridLine} />
                  <View style={styles.trendGridLine} />
                </View>

                <View style={styles.trendChartArea}>
                  <Svg width="100%" height="100%" style={styles.trendSvg}>
                    {/* Activities Line (Blue) */}
                    <Polyline
                      points="10,120 110,110 210,105 310,100"
                      fill="none"
                      stroke="#6366F1"
                      strokeWidth="3"
                    />
                    {/* Activities Dots */}
                    <Circle cx="10" cy="120" r="5" fill="#6366F1" />
                    <Circle cx="110" cy="110" r="5" fill="#6366F1" />
                    <Circle cx="210" cy="105" r="5" fill="#6366F1" />
                    <Circle cx="310" cy="100" r="5" fill="#6366F1" />

                    {/* Score Line (Green) */}
                    <Polyline
                      points="10,80 110,75 210,70 310,50"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="3"
                    />
                    {/* Score Dots */}
                    <Circle cx="10" cy="80" r="5" fill="#10B981" />
                    <Circle cx="110" cy="75" r="5" fill="#10B981" />
                    <Circle cx="210" cy="70" r="5" fill="#10B981" />
                    <Circle cx="310" cy="50" r="5" fill="#10B981" />
                  </Svg>

                  <View style={styles.trendXAxisLabels}>
                    <Text style={styles.trendXAxisLabel}>Wk 1</Text>
                    <Text style={styles.trendXAxisLabel}>Wk 2</Text>
                    <Text style={styles.trendXAxisLabel}>Wk 3</Text>
                    <Text style={styles.trendXAxisLabel}>Wk 4</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.trendLegend}>
              <View style={styles.trendLegendItem}>
                <View style={[styles.trendLegendLine, { backgroundColor: '#6366F1' }]} />
                <Text style={styles.trendLegendText}>Activities</Text>
              </View>
              <View style={styles.trendLegendItem}>
                <View style={[styles.trendLegendLine, { backgroundColor: '#10B981' }]} />
                <Text style={styles.trendLegendText}>Score %</Text>
              </View>
            </View>
          </View>
        )}

        {/* Streak Calendar - Monthly View Only */}
        {selectedPeriod === 'monthly' && (
          <View style={styles.streakCard}>
            <View style={styles.streakHeader}>
              <View style={styles.streakIconContainer}>
                <Icon name="flame" size={isSmallDevice ? 24 : 28} color="#C4B5FD" />
              </View>
              <View>
                <Text style={styles.streakTitle}>Streak</Text>
                <Text style={styles.streakSubtitle}>1 Day</Text>
              </View>
            </View>

            <View style={styles.streakCalendar}>
              <View style={styles.streakWeekHeader}>
                <Text style={styles.streakDayLabel}>S</Text>
                <Text style={styles.streakDayLabel}>M</Text>
                <Text style={styles.streakDayLabel}>T</Text>
                <Text style={styles.streakDayLabel}>W</Text>
                <Text style={styles.streakDayLabel}>T</Text>
                <Text style={styles.streakDayLabel}>F</Text>
                <Text style={styles.streakDayLabel}>S</Text>
              </View>

              <View style={styles.streakGrid}>
                {[...Array(30)].map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.streakDot,
                      index < 28 && styles.streakDotActive,
                    ]}
                  >
                    <Text style={styles.streakDayNumber}>{index + 1}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Subject Growth - Monthly View Only */}
        {selectedPeriod === 'monthly' && (
          <View style={styles.subjectGrowthCard}>
            <View style={styles.subjectGrowthHeader}>
              <View style={styles.subjectGrowthIconContainer}>
                <MaterialIcon name="chart-bar" size={isSmallDevice ? 18 : 20} color="#8B5CF6" />
              </View>
              <View>
                <Text style={styles.subjectGrowthTitle}>Subject Growth</Text>
                <Text style={styles.subjectGrowthSubtitle}>Start vs end of February</Text>
              </View>
            </View>

            <View style={styles.subjectGrowthList}>
              {/* Math */}
              <View style={styles.subjectGrowthItem}>
                <Text style={styles.subjectGrowthName}>Math</Text>
                <View style={styles.subjectGrowthRight}>
                  <Text style={styles.subjectGrowthStart}>65%</Text>
                  <Text style={styles.subjectGrowthArrow}>→</Text>
                  <Text style={styles.subjectGrowthEnd}>80%</Text>
                  <Text style={styles.subjectGrowthChange}>+15%</Text>
                </View>
                <View style={styles.subjectGrowthBarContainer}>
                  <View style={styles.subjectGrowthBarBackground}>
                    <View style={[styles.subjectGrowthBarFill, { width: '80%', backgroundColor: '#6366F1' }]} />
                  </View>
                </View>
              </View>

              {/* English */}
              <View style={styles.subjectGrowthItem}>
                <Text style={styles.subjectGrowthName}>English</Text>
                <View style={styles.subjectGrowthRight}>
                  <Text style={styles.subjectGrowthStart}>55%</Text>
                  <Text style={styles.subjectGrowthArrow}>→</Text>
                  <Text style={styles.subjectGrowthEnd}>75%</Text>
                  <Text style={styles.subjectGrowthChange}>+20%</Text>
                </View>
                <View style={styles.subjectGrowthBarContainer}>
                  <View style={styles.subjectGrowthBarBackground}>
                    <View style={[styles.subjectGrowthBarFill, { width: '75%', backgroundColor: '#EC4899' }]} />
                  </View>
                </View>
              </View>

              {/* EVS */}
              <View style={styles.subjectGrowthItem}>
                <Text style={styles.subjectGrowthName}>EVS</Text>
                <View style={styles.subjectGrowthRight}>
                  <Text style={styles.subjectGrowthStart}>53%</Text>
                  <Text style={styles.subjectGrowthArrow}>→</Text>
                  <Text style={styles.subjectGrowthEnd}>83%</Text>
                  <Text style={styles.subjectGrowthChange}>+30%</Text>
                </View>
                <View style={styles.subjectGrowthBarContainer}>
                  <View style={styles.subjectGrowthBarBackground}>
                    <View style={[styles.subjectGrowthBarFill, { width: '83%', backgroundColor: '#10B981' }]} />
                  </View>
                </View>
              </View>

              {/* S.St */}
              <View style={styles.subjectGrowthItem}>
                <Text style={styles.subjectGrowthName}>S.St</Text>
                <View style={styles.subjectGrowthRight}>
                  <Text style={styles.subjectGrowthStart}>49%</Text>
                  <Text style={styles.subjectGrowthArrow}>→</Text>
                  <Text style={styles.subjectGrowthEnd}>67%</Text>
                  <Text style={styles.subjectGrowthChange}>+18%</Text>
                </View>
                <View style={styles.subjectGrowthBarContainer}>
                  <View style={styles.subjectGrowthBarBackground}>
                    <View style={[styles.subjectGrowthBarFill, { width: '67%', backgroundColor: '#F59E0B' }]} />
                  </View>
                </View>
              </View>

              {/* Fin */}
              <View style={styles.subjectGrowthItem}>
                <Text style={styles.subjectGrowthName}>Fin</Text>
                <View style={styles.subjectGrowthRight}>
                  <Text style={styles.subjectGrowthStart}>50%</Text>
                  <Text style={styles.subjectGrowthArrow}>→</Text>
                  <Text style={styles.subjectGrowthEnd}>60%</Text>
                  <Text style={styles.subjectGrowthChange}>+10%</Text>
                </View>
                <View style={styles.subjectGrowthBarContainer}>
                  <View style={styles.subjectGrowthBarBackground}>
                    <View style={[styles.subjectGrowthBarFill, { width: '60%', backgroundColor: '#14B8A6' }]} />
                  </View>
                </View>
              </View>

              {/* AI */}
              <View style={styles.subjectGrowthItem}>
                <Text style={styles.subjectGrowthName}>AI</Text>
                <View style={styles.subjectGrowthRight}>
                  <Text style={styles.subjectGrowthStart}>55%</Text>
                  <Text style={styles.subjectGrowthArrow}>→</Text>
                  <Text style={styles.subjectGrowthEnd}>80%</Text>
                  <Text style={styles.subjectGrowthChange}>+25%</Text>
                </View>
                <View style={styles.subjectGrowthBarContainer}>
                  <View style={styles.subjectGrowthBarBackground}>
                    <View style={[styles.subjectGrowthBarFill, { width: '80%', backgroundColor: '#8B5CF6' }]} />
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.subjectGrowthLegend}>
              <View style={styles.subjectGrowthLegendItem}>
                <View style={[styles.subjectGrowthLegendDot, { backgroundColor: '#E5E7EB' }]} />
                <Text style={styles.subjectGrowthLegendText}>Start of month</Text>
              </View>
              <View style={styles.subjectGrowthLegendItem}>
                <View style={[styles.subjectGrowthLegendDot, { backgroundColor: '#6366F1' }]} />
                <Text style={styles.subjectGrowthLegendText}>End of month</Text>
              </View>
            </View>
          </View>
        )}

        {/* Monthly AI Insights - Monthly View Only */}
        {selectedPeriod === 'monthly' && (
          <View style={styles.monthlyAIInsightsCard}>
            <View style={styles.monthlyAIInsightsHeader}>
              <Icon name="sparkles" size={isSmallDevice ? 18 : 20} color="#FFFFFF" />
              <Text style={styles.monthlyAIInsightsTitle}>Monthly AI Insights</Text>
            </View>

            {/* Consistency Improved - Growth */}
            <View style={styles.monthlyInsightItem}>
              <View style={styles.monthlyInsightIconContainer}>
                <MaterialIcon name="chart-line-variant" size={isSmallDevice ? 20 : 22} color="#FFFFFF" />
              </View>
              <View style={styles.monthlyInsightContent}>
                <View style={styles.monthlyInsightHeader}>
                  <Text style={styles.monthlyInsightTitle}>Consistency Improved</Text>
                  <View style={styles.monthlyInsightBadge}>
                    <Icon name="checkmark" size={isSmallDevice ? 10 : 12} color="#FFFFFF" />
                    <Text style={styles.monthlyInsightBadgeText}>Growth</Text>
                  </View>
                </View>
                <Text style={styles.monthlyInsightSubtitle}>Activity count grew 33% vs last month</Text>
                <View style={styles.monthlyInsightAction}>
                  <Icon name="chevron-forward" size={isSmallDevice ? 10 : 12} color="#C4B5FD" />
                  <Text style={styles.monthlyInsightActionText}>Maintain the daily habit</Text>
                </View>
              </View>
            </View>

            {/* EVS is Zues's Strength */}
            <View style={styles.monthlyInsightItem}>
              <View style={styles.monthlyInsightIconContainer}>
                <Icon name="leaf" size={isSmallDevice ? 20 : 22} color="#FFFFFF" />
              </View>
              <View style={styles.monthlyInsightContent}>
                <View style={styles.monthlyInsightHeader}>
                  <Text style={styles.monthlyInsightTitle}>EVS is Zues's Strength</Text>
                  <View style={[styles.monthlyInsightBadge, { backgroundColor: 'rgba(251, 191, 36, 0.3)' }]}>
                    <Icon name="star" size={isSmallDevice ? 10 : 12} color="#FFFFFF" />
                    <Text style={styles.monthlyInsightBadgeText}>Strength</Text>
                  </View>
                </View>
                <Text style={styles.monthlyInsightSubtitle}>Highest improvement (+30%) this month</Text>
                <View style={styles.monthlyInsightAction}>
                  <Icon name="chevron-forward" size={isSmallDevice ? 10 : 12} color="#C4B5FD" />
                  <Text style={styles.monthlyInsightActionText}>Explore advanced EVS topics</Text>
                </View>
              </View>
            </View>

            {/* Fin. Literacy Lagging */}
            <View style={styles.monthlyInsightItem}>
              <View style={styles.monthlyInsightIconContainer}>
                <Icon name="alert-circle" size={isSmallDevice ? 20 : 22} color="#FFFFFF" />
              </View>
              <View style={styles.monthlyInsightContent}>
                <View style={styles.monthlyInsightHeader}>
                  <Text style={styles.monthlyInsightTitle}>Fin. Literacy Lagging</Text>
                  <View style={[styles.monthlyInsightBadge, { backgroundColor: 'rgba(251, 146, 60, 0.3)' }]}>
                    <Icon name="warning" size={isSmallDevice ? 10 : 12} color="#FFFFFF" />
                    <Text style={styles.monthlyInsightBadgeText}>Attention</Text>
                  </View>
                </View>
                <Text style={styles.monthlyInsightSubtitle}>Lowest score (60%) — needs more focus</Text>
                <View style={styles.monthlyInsightAction}>
                  <Icon name="chevron-forward" size={isSmallDevice ? 10 : 12} color="#C4B5FD" />
                  <Text style={styles.monthlyInsightActionText}>Add 2 sessions per week</Text>
                </View>
              </View>
            </View>

            {/* Goal for Next Month */}
            <View style={styles.monthlyInsightItem}>
              <View style={styles.monthlyInsightIconContainer}>
                <Icon name="flag" size={isSmallDevice ? 20 : 22} color="#FFFFFF" />
              </View>
              <View style={styles.monthlyInsightContent}>
                <View style={styles.monthlyInsightHeader}>
                  <Text style={styles.monthlyInsightTitle}>Goal for Next Month</Text>
                  <View style={[styles.monthlyInsightBadge, { backgroundColor: 'rgba(244, 114, 182, 0.3)' }]}>
                    <Icon name="trophy" size={isSmallDevice ? 10 : 12} color="#FFFFFF" />
                    <Text style={styles.monthlyInsightBadgeText}>Goal</Text>
                  </View>
                </View>
                <Text style={styles.monthlyInsightSubtitle}>Target 90%+ in Math by end of March</Text>
                <View style={styles.monthlyInsightAction}>
                  <Icon name="chevron-forward" size={isSmallDevice ? 10 : 12} color="#C4B5FD" />
                  <Text style={styles.monthlyInsightActionText}>Focus on subtraction & measurement</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Monthly Milestones - Monthly View Only */}
        {selectedPeriod === 'monthly' && (
          <View style={styles.monthlyMilestonesCard}>
            <View style={styles.monthlyMilestonesHeader}>
              <Icon name="hourglass" size={isSmallDevice ? 18 : 20} color="#F59E0B" />
              <Text style={styles.monthlyMilestonesTitle}>Monthly Milestones</Text>
            </View>

            <View style={styles.milestonesGrid}>
              {/* Top 10% Learner */}
              <View style={[styles.milestoneCard, { backgroundColor: '#F59E0B' }]}>
                <View style={styles.milestoneIcon}>
                  <Icon name="trophy" size={isSmallDevice ? 24 : 28} color="#FFFFFF" />
                </View>
                <Text style={styles.milestoneTitle}>Top 10% Learner</Text>
                <View style={styles.milestoneDate}>
                  <Icon name="calendar-outline" size={isSmallDevice ? 10 : 12} color="#FEF3C7" />
                  <Text style={styles.milestoneDateText}>Feb 28</Text>
                </View>
              </View>

              {/* Math Champion */}
              <View style={[styles.milestoneCard, { backgroundColor: '#8B5CF6' }]}>
                <View style={styles.milestoneIcon}>
                  <Icon name="medal" size={isSmallDevice ? 24 : 28} color="#FFFFFF" />
                </View>
                <Text style={styles.milestoneTitle}>Math Champion</Text>
                <View style={styles.milestoneDate}>
                  <Icon name="calendar-outline" size={isSmallDevice ? 10 : 12} color="#EDE9FE" />
                  <Text style={styles.milestoneDateText}>Feb 24</Text>
                </View>
              </View>

              {/* 30-Day Streak */}
              <View style={[styles.milestoneCard, { backgroundColor: '#10B981' }]}>
                <View style={styles.milestoneIcon}>
                  <Icon name="flame" size={isSmallDevice ? 24 : 28} color="#FFFFFF" />
                </View>
                <Text style={styles.milestoneTitle}>30-Day Streak</Text>
                <View style={styles.milestoneDate}>
                  <Icon name="calendar-outline" size={isSmallDevice ? 10 : 12} color="#D1FAE5" />
                  <Text style={styles.milestoneDateText}>Feb 20</Text>
                </View>
              </View>

              {/* 25% Growth */}
              <View style={[styles.milestoneCard, { backgroundColor: '#EC4899' }]}>
                <View style={styles.milestoneIcon}>
                  <Icon name="trending-up" size={isSmallDevice ? 24 : 28} color="#FFFFFF" />
                </View>
                <Text style={styles.milestoneTitle}>25% Growth</Text>
                <View style={styles.milestoneDate}>
                  <Icon name="calendar-outline" size={isSmallDevice ? 10 : 12} color="#FCE7F3" />
                  <Text style={styles.milestoneDateText}>Feb 14</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* February Snapshot - Monthly View Only */}
        {selectedPeriod === 'monthly' && (
          <View style={styles.februarySnapshotCard}>
            <View style={styles.februarySnapshotHeader}>
              <Icon name="trending-up" size={isSmallDevice ? 20 : 24} color="#FFFFFF" />
              <View>
                <Text style={styles.februarySnapshotTitle}>February Snapshot</Text>
                <Text style={styles.februarySnapshotSubtitle}>Zues's best month yet!</Text>
              </View>
            </View>

            <View style={styles.snapshotStatsGrid}>
              <View style={styles.snapshotStatItem}>
                <Text style={styles.snapshotStatLabel}>EVS</Text>
                <Text style={styles.snapshotStatTitle}>Best Subject</Text>
                <Text style={styles.snapshotStatValue}>+30% growth</Text>
              </View>

              <View style={styles.snapshotStatItem}>
                <Text style={styles.snapshotStatLabel}>Fin</Text>
                <Text style={styles.snapshotStatTitle}>Most Active</Text>
                <Text style={styles.snapshotStatValue}>Avg 5 activities</Text>
              </View>

              <View style={styles.snapshotStatItem}>
                <Text style={styles.snapshotStatLabel}>Fin. Lit.</Text>
                <Text style={styles.snapshotStatTitle}>Next Focus</Text>
                <Text style={styles.snapshotStatValue}>Needs attention</Text>
              </View>
            </View>
          </View>
        )}

        {/* Plan March Learning Goals - Monthly View Only */}
        {selectedPeriod === 'monthly' && (
          <View style={styles.planMarchGoalsCard}>
            <View style={styles.planMarchIconContainer}>
              <Icon name="flash" size={isSmallDevice ? 28 : 32} color="#FFFFFF" />
            </View>
            <Text style={styles.planMarchTitle}>Plan March Learning Goals</Text>
            <Text style={styles.planMarchSubtitle}>
              Based on February's data, set personalised goals and create targeted assessments for March.
            </Text>
            <TouchableOpacity style={styles.planMarchButton}>
              <Text style={styles.planMarchButtonText}>Set March Goals</Text>
              <Icon name="arrow-forward" size={isSmallDevice ? 16 : 18} color="#6366F1" />
            </TouchableOpacity>
          </View>
        )}

        {/* Growth Badge - Weekly View Only */}
        {selectedPeriod === 'weekly' && (
          <View style={styles.growthBadge}>
            <View style={styles.growthIconContainer}>
              <MaterialIcon name="trending-up" size={isSmallDevice ? 20 : 24} color="#27AE60" />
            </View>
            <View style={styles.growthTextContainer}>
              <Text style={styles.growthTitle}>
                <Text style={styles.growthPercentage}>{currentData.overview.growth} growth</Text>
                <Text style={styles.growthSubtext}> from last {selectedPeriod === 'weekly' ? 'week' : 'month'}</Text>
              </Text>
              <Text style={styles.growthMessage}>
                {child?.name || 'Zues'} is on an <Text style={styles.growthHighlight}>incredible</Text> learning streak! 🚀
              </Text>
            </View>
          </View>
        )}

        {/* Weekly Activity Card - Bar Chart (Weekly View Only) */}
        {selectedPeriod === 'weekly' && (
          <View style={styles.weeklyActivityCard}>
            <View style={styles.weeklyActivityHeader}>
              <View style={styles.activityHeaderLeft}>
                <MaterialIcon name="chart-bar" size={isSmallDevice ? 18 : 20} color="#6B5DD3" />
                <Text style={styles.weeklyActivityTitle}>Weekly Activity</Text>
              </View>
            </View>
            
            <Text style={styles.activitySubtitle}>Daily nudges this week</Text>
            
            <View style={styles.chartContainer}>
              <View style={styles.yAxisLabels}>
                <Text style={styles.yAxisLabel}>8</Text>
                <Text style={styles.yAxisLabel}>6</Text>
                <Text style={styles.yAxisLabel}>4</Text>
                <Text style={styles.yAxisLabel}>2</Text>
                <Text style={styles.yAxisLabel}>0</Text>
              </View>
              
              <View style={styles.chartWithGrid}>
                <View style={styles.gridLines}>
                  <View style={styles.gridLine} />
                  <View style={styles.gridLine} />
                  <View style={styles.gridLine} />
                  <View style={styles.gridLine} />
                  <View style={styles.gridLine} />
                </View>
                
                <View style={styles.activityChart}>
                  {currentData.activity.map((item, index) => (
                    <TouchableOpacity 
                      key={index} 
                      style={styles.activityBarContainer}
                      onPress={() => setSelectedBar(selectedBar === index ? null : index)}
                      activeOpacity={0.7}
                    >
                      {selectedBar === index && (
                        <View style={styles.tooltip}>
                        <Text style={styles.tooltipDay}>{item.day}</Text>
                        <View style={styles.tooltipRow}>
                          <View style={[styles.tooltipDot, { backgroundColor: '#10B981' }]} />
                          <Text style={styles.tooltipText}>{item.activities} activities</Text>
                        </View>
                        <View style={styles.tooltipRow}>
                          <View style={[styles.tooltipDot, { backgroundColor: '#9CA3AF' }]} />
                          <Text style={styles.tooltipText}>{item.hours}h spent</Text>
                        </View>
                      </View>
                    )}
                    <View style={styles.activityBarWrapper}>
                      <View style={[styles.activityBar, { height: `${item.activityHeight}%`, backgroundColor: '#10B981' }]} />
                      <View style={[styles.activityBar, { height: `${item.hoursHeight}%`, backgroundColor: '#D1D5DB', marginLeft: 2 }]} />
                    </View>
                    <Text style={styles.activityDay}>{item.day}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
          
          <View style={styles.activityLegendBottom}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
              <Text style={styles.legendText}>Activities</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#D1D5DB' }]} />
              <Text style={styles.legendText}>Hours</Text>
            </View>
          </View>
          </View>
        )}

        {/* Subject Breakdown - Weekly View Only */}
        {selectedPeriod === 'weekly' && (
          <View style={styles.subjectBreakdownCard}>
          <View style={styles.subjectBreakdownHeader}>
            <Icon name="pie-chart" size={isSmallDevice ? 18 : 20} color="#8B5CF6" />
            <Text style={styles.subjectBreakdownTitle}>Subject Breakdown</Text>
          </View>
          <Text style={styles.subjectBreakdownSubtitle}>Progress across all subjects</Text>
          
          <View style={styles.subjectsGrid}>
            {currentData.subjects.map((subject, index) => (
              <View key={index} style={styles.subjectCard}>
                <View style={styles.subjectHeader}>
                  <Icon name={subject.icon} size={isSmallDevice ? 18 : 20} color={subject.color} />
                  <View style={styles.subjectGrowth}>
                    <Icon name="trending-up" size={isSmallDevice ? 10 : 11} color="#10B981" />
                    <Text style={styles.subjectGrowthText}>{subject.growth}</Text>
                  </View>
                </View>
                
                <View style={styles.progressCircleContainer}>
                  <CircularProgress 
                    percentage={subject.progress} 
                    color={subject.color}
                    size={isSmallDevice ? 45 : 50}
                  />
                </View>
                
                <Text style={styles.subjectName}>{subject.name}</Text>
                <Text style={styles.subjectProgress}>{subject.completed}/{subject.total}</Text>
              </View>
            ))}
          </View>
        </View>
        )}

        {/* AI-Powered Insights - Weekly View Only */}
        {selectedPeriod === 'weekly' && (
          <View style={styles.aiInsightsCard}>
          <View style={styles.aiInsightsHeader}>
            <Icon name="sparkles" size={isSmallDevice ? 18 : 20} color="#FCD34D" />
            <Text style={styles.aiInsightsTitle}>AI-Powered Insights</Text>
          </View>
          
          {/* Peak Learning Time - Blue/Gray */}
          <View style={[styles.insightCard, styles.insightCardBlue]}>
            <View style={styles.insightIconContainer}>
              <Icon name="bulb-outline" size={isSmallDevice ? 20 : 24} color="#FFFFFF" />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Peak Learning Time</Text>
              <Text style={styles.insightSubtitle}>{child?.name || 'Zues'} performs best between 4-6 PM</Text>
              <View style={styles.insightAction}>
                <Icon name="chevron-forward" size={isSmallDevice ? 12 : 14} color="#9CA3AF" />
                <Text style={styles.insightActionText}>Schedule activities accordingly</Text>
              </View>
            </View>
          </View>
          
          {/* Needs Attention - Yellow/Brown */}
          <View style={[styles.insightCard, styles.insightCardYellow]}>
            <View style={styles.insightIconContainer}>
              <Icon name="alert-circle-outline" size={isSmallDevice ? 20 : 24} color="#FFFFFF" />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Measurement Needs Attention</Text>
              <Text style={styles.insightSubtitle}>3 attempts with 45% accuracy</Text>
              <View style={styles.insightAction}>
                <Icon name="chevron-forward" size={isSmallDevice ? 12 : 14} color="#D97706" />
                <Text style={[styles.insightActionText, { color: '#D97706' }]}>Try interactive games</Text>
              </View>
            </View>
          </View>
        </View>
        )}

        {/* Topics Known - Weekly View Only */}
        {selectedPeriod === 'weekly' && (
          <View style={styles.topicsKnownCard}>
          <View style={styles.topicsKnownHeader}>
            <View style={styles.topicsKnownLeft}>
              <Icon name="checkmark-circle" size={isSmallDevice ? 18 : 20} color="#10B981" />
              <Text style={styles.topicsKnownTitle}>Topics Known</Text>
              <View style={styles.topicsCountBadge}>
                <Text style={styles.topicsCountText}>{currentData.knownTopicsDetailed.length}</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.toggleButton}
              onPress={() => setShowAllKnownTopics(!showAllKnownTopics)}
            >
              <Text style={styles.toggleButtonText}>{showAllKnownTopics ? 'Less' : 'More'}</Text>
              <Icon 
                name={showAllKnownTopics ? "chevron-up" : "chevron-down"} 
                size={isSmallDevice ? 16 : 18} 
                color="#10B981" 
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.topicsGrid}>
            {currentData.knownTopicsDetailed
              .slice(0, showAllKnownTopics ? currentData.knownTopicsDetailed.length : 2)
              .map((topic, index) => (
                <View key={index} style={styles.topicCard}>
                  <View style={styles.topicHeader}>
                    <Text style={styles.topicName}>{topic.name}</Text>
                    <View style={styles.topicProgressBadge}>
                      <Text style={styles.topicProgressText}>{topic.progress}%</Text>
                    </View>
                  </View>
                  <Text style={styles.topicSubject}>{topic.subject}</Text>
                  
                  <View style={styles.progressBarContainer}>
                    <View style={styles.progressBarBackground}>
                      <View style={[styles.progressBarFill, { width: `${topic.progress}%` }]} />
                    </View>
                  </View>
                  
                  <View style={styles.topicFooter}>
                    <Icon name="star" size={isSmallDevice ? 12 : 14} color="#10B981" />
                    <Text style={styles.topicDaysAgo}>{topic.daysAgo} {topic.daysAgo === 1 ? 'day' : 'days'} ago</Text>
                  </View>
                </View>
              ))}
          </View>
        </View>
        )}

        {/* Needs Practice - Weekly View Only */}
        {selectedPeriod === 'weekly' && (
          <View style={styles.needsPracticeCard}>
          <View style={styles.needsPracticeHeader}>
            <View style={styles.needsPracticeLeft}>
              <Icon name="alert-circle" size={isSmallDevice ? 18 : 20} color="#F59E0B" />
              <Text style={styles.needsPracticeTitle}>Needs Practice</Text>
              <View style={styles.practiceCountBadge}>
                <Text style={styles.practiceCountText}>{currentData.needsPracticeTopicsDetailed.length}</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.toggleButton}
              onPress={() => setShowAllPracticeTopics(!showAllPracticeTopics)}
            >
              <Text style={[styles.toggleButtonText, { color: '#F59E0B' }]}>
                {showAllPracticeTopics ? 'Less' : 'More'}
              </Text>
              <Icon 
                name={showAllPracticeTopics ? "chevron-up" : "chevron-down"} 
                size={isSmallDevice ? 16 : 18} 
                color="#F59E0B" 
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.practiceTopicsContainer}>
            {currentData.needsPracticeTopicsDetailed
              .slice(0, showAllPracticeTopics ? currentData.needsPracticeTopicsDetailed.length : 2)
              .map((topic, index) => (
                <View key={index} style={styles.practiceTopicCard}>
                  <View style={styles.practiceTopicContent}>
                    <View style={styles.practiceTopicHeader}>
                      <Text style={styles.practiceTopicName}>{topic.name}</Text>
                      {topic.priority && (
                        <View style={styles.priorityBadge}>
                          <Text style={styles.priorityText}>{topic.priority}</Text>
                        </View>
                      )}
                      <Text style={styles.practiceTopicProgress}>{topic.progress}%</Text>
                    </View>
                    <Text style={styles.practiceTopicSubject}>
                      {topic.subject} · {topic.attempts} attempts
                    </Text>
                    
                    <View style={styles.practiceProgressBarContainer}>
                      <View style={styles.practiceProgressBarBackground}>
                        <View style={[styles.practiceProgressBarFill, { width: `${topic.progress}%` }]} />
                      </View>
                    </View>
                  </View>
                  
                  <TouchableOpacity style={styles.practiceButton}>
                    <Text style={styles.practiceButtonText}>Practice</Text>
                  </TouchableOpacity>
                </View>
              ))}
          </View>
        </View>
        )}

        {/* Recent Achievements - Weekly View Only */}
        {selectedPeriod === 'weekly' && (
          <View style={styles.achievementsCard}>
          <View style={styles.achievementsHeader}>
            <Icon name="trophy" size={isSmallDevice ? 18 : 20} color="#F59E0B" />
            <Text style={styles.achievementsTitle}>Recent Achievements</Text>
          </View>
          
          <View style={styles.achievementsGrid}>
            <View style={styles.achievementItem}>
              <View style={[styles.achievementIcon, { backgroundColor: '#FED7AA' }]}>
                <Icon name="flame" size={isSmallDevice ? 20 : 22} color="#F97316" />
              </View>
              <Text style={styles.achievementTitle}>7-Day Streak</Text>
              <Text style={styles.achievementSubtitle}>Longest streak this month</Text>
            </View>
            
            <View style={styles.achievementItem}>
              <View style={[styles.achievementIcon, { backgroundColor: '#FDE68A' }]}>
                <Icon name="star" size={isSmallDevice ? 20 : 22} color="#F59E0B" />
              </View>
              <Text style={styles.achievementTitle}>24 Activities</Text>
              <Text style={styles.achievementSubtitle}>Completed this week</Text>
            </View>
            
            <View style={styles.achievementItem}>
              <View style={[styles.achievementIcon, { backgroundColor: '#A7F3D0' }]}>
                <Icon name="checkmark-circle" size={isSmallDevice ? 20 : 22} color="#10B981" />
              </View>
              <Text style={styles.achievementTitle}>8 Topics</Text>
              <Text style={styles.achievementSubtitle}>Mastered recently</Text>
            </View>
          </View>
        </View>
        )}

        {/* Test Knowledge Card - Weekly View Only */}
        {selectedPeriod === 'weekly' && (
          <View style={styles.testKnowledgeCard}>
          <View style={styles.testKnowledgeIconContainer}>
            <Icon name="flash" size={isSmallDevice ? 24 : 26} color="#FFFFFF" />
          </View>
          <Text style={styles.testKnowledgeTitle}>Ready to Test Knowledge?</Text>
          <Text style={styles.testKnowledgeSubtitle}>
            Create personalized assessments based on {child?.name || 'Zues'}'s progress to identify gaps faster.
          </Text>
          <TouchableOpacity 
            style={styles.testKnowledgeButton}
            onPress={() => onNavigate && onNavigate('assessmentHub')}
          >
            <Text style={styles.testKnowledgeButtonText}>Create Assessment Online</Text>
          </TouchableOpacity>
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: isSmallDevice ? 42 : 50,
    paddingBottom: isSmallDevice ? 14 : 16,
    paddingHorizontal: isSmallDevice ? 16 : 20,
  },
  backButton: {
    width: isSmallDevice ? 36 : 40,
    height: isSmallDevice ? 36 : 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: isSmallDevice ? 8 : 12,
  },
  headerTitle: {
    fontSize: isTablet ? 22 : isSmallDevice ? 18 : 20,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'Montserrat-Bold',
  },
  headerSubtitle: {
    fontSize: isTablet ? 14 : isSmallDevice ? 12 : 13,
    color: '#9CA3AF',
    marginTop: 2,
    fontFamily: 'Montserrat-Regular',
  },
  shareButton: {
    width: isSmallDevice ? 36 : 40,
    height: isSmallDevice ? 36 : 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: isSmallDevice ? 4 : 8,
  },
  downloadButton: {
    width: isSmallDevice ? 36 : 40,
    height: isSmallDevice ? 36 : 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },

  // Profile Card
  profileCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: isSmallDevice ? 12 : 16,
    marginTop: isSmallDevice ? 8 : 10,
    marginBottom: isSmallDevice ? 4 : 6,
    padding: isSmallDevice ? 14 : 16,
    borderRadius: isSmallDevice ? 14 : 16,
  },
  profileTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  profileImageContainer: {
    width: isSmallDevice ? 70 : 80,
    height: isSmallDevice ? 70 : 80,
    borderRadius: isSmallDevice ? 35 : 40,
    overflow: 'visible',
    marginRight: isSmallDevice ? 10 : 12,
    position: 'relative',
    borderWidth: 3,
    borderColor: '#27AE60',
    padding: 3,
    backgroundColor: '#FFFFFF',
  },
  profileImage: {
    width: '110%',
    height: '110%',
    borderRadius: isSmallDevice ? 32 : 37,
    marginLeft: '-5%',
    marginTop: '-5%',
    overflow: 'hidden',
  },
  trophyBadge: {
    position: 'absolute',
    top: -8,
    left: -8,
    width: isSmallDevice ? 30 : 34,
    height: isSmallDevice ? 30 : 34,
    borderRadius: isSmallDevice ? 15 : 17,
    backgroundColor: '#FEF3C7',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: isSmallDevice ? 22 : 26,
    height: isSmallDevice ? 22 : 26,
    borderRadius: isSmallDevice ? 11 : 13,
    backgroundColor: '#27AE60',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: isTablet ? 20 : isSmallDevice ? 17 : 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 3,
    fontFamily: 'Montserrat-Bold',
  },
  profileDetails: {
    fontSize: isTablet ? 13 : isSmallDevice ? 11 : 12,
    color: '#9CA3AF',
    marginBottom: isSmallDevice ? 8 : 10,
    fontFamily: 'Montserrat-Regular',
  },
  badgesContainer: {
    flexDirection: 'row',
    gap: isSmallDevice ? 6 : 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: isSmallDevice ? 8 : 10,
    paddingVertical: isSmallDevice ? 5 : 6,
    borderRadius: isSmallDevice ? 10 : 12,
    gap: 3,
  },
  badgePurple: {
    backgroundColor: '#EDE9FE',
  },
  badgeEmoji: {
    fontSize: isSmallDevice ? 11 : 12,
  },
  badgeText: {
    fontSize: isTablet ? 12 : isSmallDevice ? 10 : 11,
    fontWeight: '600',
    color: '#1A1A1A',
    fontFamily: 'Montserrat-SemiBold',
  },
  prizeIcon: {
    position: 'absolute',
    top: isSmallDevice ? 10 : 12,
    right: isSmallDevice ? 10 : 12,
    width: isSmallDevice ? 32 : 36,
    height: isSmallDevice ? 32 : 36,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  // Period Toggle
  periodToggle: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    marginHorizontal: isSmallDevice ? 12 : 16,
    marginBottom: isSmallDevice ? 6 : 8,
    padding: 6,
    borderRadius: isSmallDevice ? 12 : 14,
    gap: 6,
  },
  periodToggleButton: {
    flex: 1,
    paddingVertical: isSmallDevice ? 12 : 14,
    borderRadius: isSmallDevice ? 10 : 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  periodToggleButtonActive: {
    backgroundColor: '#C4B5FD',
    shadowColor: '#C4B5FD',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  periodToggleText: {
    fontSize: isTablet ? 16 : isSmallDevice ? 13 : 14,
    fontWeight: '600',
    color: '#6B7280',
    fontFamily: 'Montserrat-SemiBold',
  },
  periodToggleTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    marginHorizontal: isSmallDevice ? 8 : 12,
    marginBottom: isSmallDevice ? 8 : 10,
    gap: isSmallDevice ? 6 : 8,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: isSmallDevice ? 10 : 12,
    padding: isSmallDevice ? 12 : 14,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    minHeight: isSmallDevice ? 85 : 95,
  },
  statIconContainer: {
    marginBottom: isSmallDevice ? 8 : 10,
  },
  statNumber: {
    fontSize: isTablet ? 18 : isSmallDevice ? 15 : 17,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
    fontFamily: 'Montserrat-Bold',
  },
  statLabel: {
    fontSize: isTablet ? 10 : isSmallDevice ? 8 : 9,
    fontWeight: '600',
    color: '#9CA3AF',
    textAlign: 'center',
    fontFamily: 'Montserrat-SemiBold',
  },

  // Growth Insight Card
  growthInsightCard: {
    backgroundColor: '#EFF6FF',
    marginHorizontal: isSmallDevice ? 12 : 16,
    marginBottom: isSmallDevice ? 12 : 16,
    marginTop: isSmallDevice ? 8 : 10,
    padding: isSmallDevice ? 12 : 14,
    borderRadius: isSmallDevice ? 12 : 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: isSmallDevice ? 10 : 12,
  },
  growthInsightIcon: {
    width: isSmallDevice ? 40 : 48,
    height: isSmallDevice ? 40 : 48,
    borderRadius: isSmallDevice ? 8 : 10,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  growthInsightContent: {
    flex: 1,
  },
  growthInsightTitle: {
    fontSize: isTablet ? 14 : isSmallDevice ? 12 : 13,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
    fontFamily: 'Montserrat-Bold',
  },
  growthInsightSubtitle: {
    fontSize: isTablet ? 12 : isSmallDevice ? 10 : 11,
    fontWeight: '500',
    color: '#9CA3AF',
    fontFamily: 'Montserrat-Regular',
  },

  // Monthly Overview Card
  monthlyOverviewCard: {
    backgroundColor: '#6366F1',
    marginHorizontal: isSmallDevice ? 12 : 16,
    marginBottom: isSmallDevice ? 8 : 10,
    padding: isSmallDevice ? 16 : 20,
    borderRadius: isSmallDevice ? 14 : 16,
  },
  monthlyOverviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: isSmallDevice ? 16 : 20,
  },
  monthlyOverviewLabel: {
    fontSize: isTablet ? 13 : isSmallDevice ? 11 : 12,
    fontWeight: '600',
    color: '#E0E7FF',
    marginBottom: 4,
    fontFamily: 'Montserrat-SemiBold',
  },
  monthlyOverviewMonth: {
    fontSize: isTablet ? 20 : isSmallDevice ? 17 : 18,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
  },
  monthlyStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: isSmallDevice ? 10 : 12,
    justifyContent: 'space-between',
  },
  monthlyStatItem: {
    width: isSmallDevice ? '48%' : '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: isSmallDevice ? 10 : 12,
    padding: isSmallDevice ? 10 : 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthlyStatNumber: {
    fontSize: isTablet ? 24 : isSmallDevice ? 20 : 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    fontFamily: 'Montserrat-Bold',
  },
  monthlyStatLabel: {
    fontSize: isTablet ? 11 : isSmallDevice ? 9 : 10,
    fontWeight: '600',
    color: '#E0E7FF',
    marginBottom: 4,
    fontFamily: 'Montserrat-SemiBold',
    textAlign: 'center',
  },
  monthlyStatChange: {
    fontSize: isTablet ? 10 : isSmallDevice ? 8 : 9,
    fontWeight: '600',
    color: '#A5B4FC',
    fontFamily: 'Montserrat-SemiBold',
    textAlign: 'center',
  },

  // Weekly Trend Chart (Monthly View)
  weeklyTrendCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: isSmallDevice ? 12 : 16,
    marginBottom: isSmallDevice ? 8 : 10,
    padding: isSmallDevice ? 16 : 20,
    borderRadius: isSmallDevice ? 14 : 16,
  },
  weeklyTrendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isSmallDevice ? 10 : 12,
    marginBottom: isSmallDevice ? 16 : 20,
  },
  weeklyTrendIconContainer: {
    width: isSmallDevice ? 40 : 44,
    height: isSmallDevice ? 40 : 44,
    borderRadius: isSmallDevice ? 10 : 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  weeklyTrendTitle: {
    fontSize: isTablet ? 18 : isSmallDevice ? 15 : 16,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'Montserrat-Bold',
  },
  weeklyTrendSubtitle: {
    fontSize: isTablet ? 13 : isSmallDevice ? 11 : 12,
    color: '#9CA3AF',
    marginTop: 2,
    fontFamily: 'Montserrat-Regular',
  },
  trendChartContainer: {
    flexDirection: 'row',
    marginBottom: isSmallDevice ? 12 : 16,
  },
  trendYAxisLabels: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: isSmallDevice ? 8 : 10,
    height: isSmallDevice ? 160 : 180,
    paddingBottom: isSmallDevice ? 28 : 32,
  },
  trendYAxisLabel: {
    fontSize: isSmallDevice ? 10 : 11,
    color: '#9CA3AF',
    fontFamily: 'Montserrat-Regular',
  },
  trendChartWithGrid: {
    flex: 1,
    position: 'relative',
  },
  trendGridLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: isSmallDevice ? 160 : 180,
    justifyContent: 'space-between',
    paddingBottom: isSmallDevice ? 28 : 32,
  },
  trendGridLine: {
    height: 1,
    backgroundColor: '#F3F4F6',
    width: '100%',
  },
  trendChartArea: {
    height: isSmallDevice ? 160 : 180,
    position: 'relative',
  },
  trendSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: isSmallDevice ? 28 : 32,
  },
  trendXAxisLabels: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: isSmallDevice ? 4 : 8,
  },
  trendXAxisLabel: {
    fontSize: isTablet ? 13 : isSmallDevice ? 11 : 12,
    fontWeight: '600',
    color: '#9CA3AF',
    fontFamily: 'Montserrat-SemiBold',
  },
  trendLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: isSmallDevice ? 20 : 24,
    paddingTop: isSmallDevice ? 12 : 14,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  trendLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isSmallDevice ? 6 : 8,
  },
  trendLegendLine: {
    width: isSmallDevice ? 20 : 24,
    height: 3,
    borderRadius: 2,
  },
  trendLegendText: {
    fontSize: isTablet ? 13 : isSmallDevice ? 11 : 12,
    color: '#6B7280',
    fontFamily: 'Montserrat-Medium',
  },

  // Streak Calendar (Monthly View)
  streakCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: isSmallDevice ? 12 : 16,
    marginBottom: isSmallDevice ? 12 : 16,
    padding: isSmallDevice ? 14 : 16,
    borderRadius: isSmallDevice ? 14 : 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isSmallDevice ? 10 : 12,
    marginBottom: isSmallDevice ? 14 : 16,
  },
  streakIconContainer: {
    width: isSmallDevice ? 40 : 48,
    height: isSmallDevice ? 40 : 48,
    borderRadius: isSmallDevice ? 10 : 12,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakTitle: {
    fontSize: isTablet ? 16 : isSmallDevice ? 14 : 15,
    fontWeight: '800',
    color: '#1A1A1A',
    fontFamily: 'Montserrat-Bold',
  },
  streakSubtitle: {
    fontSize: isTablet ? 12 : isSmallDevice ? 10 : 11,
    fontWeight: '500',
    color: '#9CA3AF',
    fontFamily: 'Montserrat-Regular',
  },
  streakCalendar: {
    gap: isSmallDevice ? 8 : 10,
  },
  streakWeekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: isSmallDevice ? 8 : 10,
  },
  streakDayLabel: {
    fontSize: isTablet ? 11 : isSmallDevice ? 9 : 10,
    fontWeight: '600',
    color: '#9CA3AF',
    width: '14.28%',
    textAlign: 'center',
    fontFamily: 'Montserrat-SemiBold',
  },
  streakGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: isSmallDevice ? 6 : 8,
  },
  streakDot: {
    width: isSmallDevice ? 28 : 32,
    height: isSmallDevice ? 28 : 32,
    borderRadius: isSmallDevice ? 14 : 16,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakDotActive: {
    backgroundColor: '#C4B5FD',
  },
  streakDayNumber: {
    fontSize: isTablet ? 10 : isSmallDevice ? 8 : 9,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'Montserrat-Bold',
  },

  // Subject Growth (Monthly View)
  subjectGrowthCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: isSmallDevice ? 12 : 16,
    marginBottom: isSmallDevice ? 8 : 10,
    padding: isSmallDevice ? 14 : 16,
    borderRadius: isSmallDevice ? 14 : 16,
  },
  subjectGrowthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isSmallDevice ? 8 : 10,
    marginBottom: isSmallDevice ? 12 : 14,
  },
  subjectGrowthIconContainer: {
    width: isSmallDevice ? 36 : 40,
    height: isSmallDevice ? 36 : 40,
    borderRadius: isSmallDevice ? 10 : 12,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subjectGrowthTitle: {
    fontSize: isTablet ? 17 : isSmallDevice ? 14 : 15,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'Montserrat-Bold',
  },
  subjectGrowthSubtitle: {
    fontSize: isTablet ? 12 : isSmallDevice ? 10 : 11,
    color: '#9CA3AF',
    marginTop: 2,
    fontFamily: 'Montserrat-Regular',
  },
  subjectGrowthList: {
    gap: isSmallDevice ? 12 : 14,
  },
  subjectGrowthItem: {
    marginBottom: isSmallDevice ? 2 : 3,
  },
  subjectGrowthName: {
    fontSize: isTablet ? 15 : isSmallDevice ? 12 : 13,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: isSmallDevice ? 4 : 5,
    fontFamily: 'Montserrat-Bold',
  },
  subjectGrowthRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isSmallDevice ? 5 : 6,
    marginBottom: isSmallDevice ? 4 : 5,
  },
  subjectGrowthStart: {
    fontSize: isTablet ? 13 : isSmallDevice ? 10 : 11,
    fontWeight: '600',
    color: '#9CA3AF',
    fontFamily: 'Montserrat-SemiBold',
  },
  subjectGrowthArrow: {
    fontSize: isTablet ? 13 : isSmallDevice ? 10 : 11,
    color: '#9CA3AF',
    fontFamily: 'Montserrat-Regular',
  },
  subjectGrowthEnd: {
    fontSize: isTablet ? 15 : isSmallDevice ? 12 : 13,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'Montserrat-Bold',
  },
  subjectGrowthChange: {
    fontSize: isTablet ? 13 : isSmallDevice ? 10 : 11,
    fontWeight: '700',
    color: '#10B981',
    marginLeft: isSmallDevice ? 3 : 4,
    fontFamily: 'Montserrat-Bold',
  },
  subjectGrowthBarContainer: {
    width: '100%',
  },
  subjectGrowthBarBackground: {
    height: isSmallDevice ? 6 : 7,
    backgroundColor: '#F3F4F6',
    borderRadius: isSmallDevice ? 4 : 5,
    overflow: 'hidden',
  },
  subjectGrowthBarFill: {
    height: '100%',
    borderRadius: isSmallDevice ? 4 : 5,
  },
  subjectGrowthLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: isSmallDevice ? 16 : 20,
    paddingTop: isSmallDevice ? 12 : 14,
    marginTop: isSmallDevice ? 8 : 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  subjectGrowthLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isSmallDevice ? 5 : 6,
  },
  subjectGrowthLegendDot: {
    width: isSmallDevice ? 8 : 10,
    height: isSmallDevice ? 8 : 10,
    borderRadius: isSmallDevice ? 4 : 5,
  },
  subjectGrowthLegendText: {
    fontSize: isTablet ? 11 : isSmallDevice ? 9 : 10,
    color: '#6B7280',
    fontFamily: 'Montserrat-Medium',
  },

  // Monthly AI Insights
  monthlyAIInsightsCard: {
    backgroundColor: '#8B5CF6',
    marginHorizontal: isSmallDevice ? 12 : 16,
    marginBottom: isSmallDevice ? 8 : 10,
    padding: isSmallDevice ? 12 : 14,
    borderRadius: isSmallDevice ? 14 : 16,
  },
  monthlyAIInsightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isSmallDevice ? 6 : 8,
    marginBottom: isSmallDevice ? 10 : 12,
  },
  monthlyAIInsightsTitle: {
    fontSize: isTablet ? 16 : isSmallDevice ? 13 : 14,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
  },
  monthlyInsightItem: {
    backgroundColor: 'rgba(167, 139, 250, 0.3)',
    borderRadius: isSmallDevice ? 10 : 12,
    padding: isSmallDevice ? 8 : 10,
    marginBottom: isSmallDevice ? 6 : 8,
    flexDirection: 'row',
    gap: isSmallDevice ? 8 : 10,
  },
  monthlyInsightIconContainer: {
    width: isSmallDevice ? 32 : 36,
    height: isSmallDevice ? 32 : 36,
    borderRadius: isSmallDevice ? 8 : 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthlyInsightContent: {
    flex: 1,
  },
  monthlyInsightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: isSmallDevice ? 2 : 3,
  },
  monthlyInsightTitle: {
    fontSize: isTablet ? 13 : isSmallDevice ? 10 : 11,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    fontFamily: 'Montserrat-Bold',
  },
  monthlyInsightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(16, 185, 129, 0.3)',
    paddingHorizontal: isSmallDevice ? 5 : 6,
    paddingVertical: 2,
    borderRadius: isSmallDevice ? 6 : 8,
  },
  monthlyInsightBadgeText: {
    fontSize: isSmallDevice ? 8 : 9,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Montserrat-SemiBold',
  },
  monthlyInsightSubtitle: {
    fontSize: isTablet ? 11 : isSmallDevice ? 9 : 10,
    color: '#EDE9FE',
    marginBottom: isSmallDevice ? 3 : 4,
    fontFamily: 'Montserrat-Regular',
  },
  monthlyInsightAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  monthlyInsightActionText: {
    fontSize: isTablet ? 10 : isSmallDevice ? 8 : 9,
    color: '#DDD6FE',
    fontFamily: 'Montserrat-Medium',
  },

  // Monthly Milestones
  monthlyMilestonesCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: isSmallDevice ? 12 : 16,
    marginBottom: isSmallDevice ? 8 : 10,
    padding: isSmallDevice ? 12 : 14,
    borderRadius: isSmallDevice ? 14 : 16,
  },
  monthlyMilestonesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isSmallDevice ? 6 : 8,
    marginBottom: isSmallDevice ? 10 : 12,
  },
  monthlyMilestonesTitle: {
    fontSize: isTablet ? 16 : isSmallDevice ? 13 : 14,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'Montserrat-Bold',
  },
  milestonesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: isSmallDevice ? 8 : 10,
  },
  milestoneCard: {
    width: '48%',
    borderRadius: isSmallDevice ? 12 : 14,
    padding: isSmallDevice ? 10 : 12,
    minHeight: isSmallDevice ? 85 : 95,
  },
  milestoneIcon: {
    width: isSmallDevice ? 36 : 40,
    height: isSmallDevice ? 36 : 40,
    borderRadius: isSmallDevice ? 10 : 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: isSmallDevice ? 6 : 8,
  },
  milestoneTitle: {
    fontSize: isTablet ? 14 : isSmallDevice ? 11 : 12,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: isSmallDevice ? 5 : 6,
    fontFamily: 'Montserrat-Bold',
  },
  milestoneDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  milestoneDateText: {
    fontSize: isTablet ? 11 : isSmallDevice ? 9 : 10,
    color: 'rgba(255, 255, 255, 0.85)',
    fontFamily: 'Montserrat-Medium',
  },

  // February Snapshot
  februarySnapshotCard: {
    backgroundColor: '#34D399',
    marginHorizontal: isSmallDevice ? 12 : 16,
    marginBottom: isSmallDevice ? 8 : 10,
    padding: isSmallDevice ? 12 : 14,
    borderRadius: isSmallDevice ? 14 : 16,
  },
  februarySnapshotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isSmallDevice ? 8 : 10,
    marginBottom: isSmallDevice ? 12 : 14,
  },
  februarySnapshotTitle: {
    fontSize: isTablet ? 17 : isSmallDevice ? 14 : 15,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
  },
  februarySnapshotSubtitle: {
    fontSize: isTablet ? 12 : isSmallDevice ? 10 : 11,
    color: '#ECFDF5',
    marginTop: 2,
    fontFamily: 'Montserrat-Regular',
  },
  snapshotStatsGrid: {
    flexDirection: 'row',
    gap: isSmallDevice ? 8 : 10,
  },
  snapshotStatItem: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: isSmallDevice ? 10 : 12,
    padding: isSmallDevice ? 8 : 10,
  },
  snapshotStatLabel: {
    fontSize: isTablet ? 12 : isSmallDevice ? 10 : 11,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: isSmallDevice ? 3 : 4,
    fontFamily: 'Montserrat-Bold',
  },
  snapshotStatTitle: {
    fontSize: isTablet ? 11 : isSmallDevice ? 9 : 10,
    fontWeight: '600',
    color: '#ECFDF5',
    marginBottom: isSmallDevice ? 2 : 3,
    fontFamily: 'Montserrat-SemiBold',
  },
  snapshotStatValue: {
    fontSize: isTablet ? 10 : isSmallDevice ? 8 : 9,
    color: '#F0FDF4',
    fontFamily: 'Montserrat-Regular',
  },

  // Plan March Learning Goals
  planMarchGoalsCard: {
    backgroundColor: '#8B5CF6',
    marginHorizontal: isSmallDevice ? 12 : 16,
    marginBottom: isSmallDevice ? 8 : 10,
    padding: isSmallDevice ? 14 : 16,
    borderRadius: isSmallDevice ? 14 : 16,
    alignItems: 'center',
  },
  planMarchIconContainer: {
    width: isSmallDevice ? 50 : 56,
    height: isSmallDevice ? 50 : 56,
    borderRadius: isSmallDevice ? 14 : 16,
    backgroundColor: 'rgba(167, 139, 250, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: isSmallDevice ? 10 : 12,
  },
  planMarchTitle: {
    fontSize: isTablet ? 18 : isSmallDevice ? 15 : 16,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: isSmallDevice ? 6 : 8,
    fontFamily: 'Montserrat-Bold',
  },
  planMarchSubtitle: {
    fontSize: isTablet ? 13 : isSmallDevice ? 11 : 12,
    color: '#EDE9FE',
    textAlign: 'center',
    lineHeight: isSmallDevice ? 16 : 18,
    marginBottom: isSmallDevice ? 12 : 14,
    fontFamily: 'Montserrat-Regular',
  },
  planMarchButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: isSmallDevice ? 5 : 6,
    paddingHorizontal: isSmallDevice ? 16 : 20,
    paddingVertical: isSmallDevice ? 10 : 12,
    borderRadius: isSmallDevice ? 10 : 12,
  },
  planMarchButtonText: {
    fontSize: isTablet ? 14 : isSmallDevice ? 12 : 13,
    fontWeight: '700',
    color: '#6366F1',
    fontFamily: 'Montserrat-Bold',
  },

  // Growth Badge
  growthBadge: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: isSmallDevice ? 12 : 16,
    marginBottom: isSmallDevice ? 8 : 10,
    paddingVertical: isSmallDevice ? 14 : 16,
    paddingHorizontal: isSmallDevice ? 14 : 16,
    borderRadius: isSmallDevice ? 14 : 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: isSmallDevice ? 10 : 12,
  },
  growthIconContainer: {
    width: isSmallDevice ? 36 : 40,
    height: isSmallDevice ? 36 : 40,
    borderRadius: isSmallDevice ? 8 : 10,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  growthTextContainer: {
    flex: 1,
  },
  growthTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  growthPercentage: {
    fontSize: isTablet ? 16 : isSmallDevice ? 13 : 14,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'Montserrat-Bold',
  },
  growthSubtext: {
    fontSize: isTablet ? 15 : isSmallDevice ? 12 : 13,
    fontWeight: '500',
    color: '#6B7280',
    fontFamily: 'Montserrat-Medium',
  },
  growthMessage: {
    fontSize: isTablet ? 14 : isSmallDevice ? 11 : 12,
    color: '#6B7280',
    fontFamily: 'Montserrat-Regular',
  },
  growthHighlight: {
    color: '#6B5DD3',
    fontWeight: '600',
  },

  // Weekly Activity Card
  weeklyActivityCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: isSmallDevice ? 12 : 16,
    marginBottom: isSmallDevice ? 8 : 10,
    padding: isSmallDevice ? 16 : 20,
    borderRadius: isSmallDevice ? 14 : 16,
  },
  weeklyActivityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: isSmallDevice ? 6 : 8,
  },
  activityHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isSmallDevice ? 6 : 8,
  },
  weeklyActivityTitle: {
    fontSize: isTablet ? 18 : isSmallDevice ? 15 : 16,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'Montserrat-Bold',
  },
  activityLegend: {
    flexDirection: 'row',
    gap: isSmallDevice ? 10 : 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: isSmallDevice ? 6 : 8,
    height: isSmallDevice ? 6 : 8,
    borderRadius: isSmallDevice ? 3 : 4,
  },
  legendText: {
    fontSize: isTablet ? 12 : isSmallDevice ? 10 : 11,
    color: '#9CA3AF',
    fontFamily: 'Montserrat-Regular',
  },
  activitySubtitle: {
    fontSize: isTablet ? 13 : isSmallDevice ? 11 : 12,
    color: '#9CA3AF',
    marginBottom: isSmallDevice ? 16 : 18,
    fontFamily: 'Montserrat-Regular',
  },
  chartContainer: {
    flexDirection: 'row',
    marginBottom: isSmallDevice ? 12 : 16,
  },
  yAxisLabels: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: isSmallDevice ? 6 : 8,
    height: isSmallDevice ? 140 : 160,
    paddingBottom: isSmallDevice ? 24 : 28,
  },
  yAxisLabel: {
    fontSize: isSmallDevice ? 10 : 11,
    color: '#9CA3AF',
    fontFamily: 'Montserrat-Regular',
  },
  chartWithGrid: {
    flex: 1,
    position: 'relative',
  },
  gridLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: isSmallDevice ? 140 : 160,
    justifyContent: 'space-between',
    paddingBottom: isSmallDevice ? 24 : 28,
  },
  gridLine: {
    height: 1,
    backgroundColor: '#F3F4F6',
    width: '100%',
  },
  activityChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: isSmallDevice ? 140 : 160,
    paddingHorizontal: isSmallDevice ? 4 : 8,
  },
  activityBarContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
    position: 'relative',
  },
  tooltip: {
    position: 'absolute',
    top: -70,
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 8,
    minWidth: 100,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  tooltipDay: {
    fontSize: isSmallDevice ? 11 : 12,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    fontFamily: 'Montserrat-Bold',
  },
  tooltipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  tooltipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  tooltipText: {
    fontSize: isSmallDevice ? 10 : 11,
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Regular',
  },
  activityBarWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: '80%',
    justifyContent: 'center',
    marginBottom: isSmallDevice ? 6 : 8,
  },
  activityBar: {
    borderRadius: isSmallDevice ? 4 : 6,
    width: isSmallDevice ? 8 : 10,
  },
  activityDay: {
    fontSize: isTablet ? 13 : isSmallDevice ? 11 : 12,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 4,
    fontFamily: 'Montserrat-SemiBold',
  },
  activityLegendBottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: isSmallDevice ? 16 : 20,
    paddingTop: isSmallDevice ? 8 : 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },

  // Subject Breakdown
  subjectBreakdownCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: isSmallDevice ? 12 : 16,
    marginBottom: isSmallDevice ? 8 : 10,
    padding: isSmallDevice ? 16 : 20,
    borderRadius: isSmallDevice ? 14 : 16,
  },
  subjectBreakdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isSmallDevice ? 6 : 8,
    marginBottom: isSmallDevice ? 4 : 6,
  },
  subjectBreakdownTitle: {
    fontSize: isTablet ? 18 : isSmallDevice ? 15 : 16,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'Montserrat-Bold',
  },
  subjectBreakdownSubtitle: {
    fontSize: isTablet ? 13 : isSmallDevice ? 11 : 12,
    color: '#9CA3AF',
    marginBottom: isSmallDevice ? 16 : 18,
    fontFamily: 'Montserrat-Regular',
  },
  subjectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: isSmallDevice ? 8 : 10,
  },
  subjectCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: isSmallDevice ? 10 : 12,
    padding: isSmallDevice ? 8 : 10,
    width: '31%',
    alignItems: 'center',
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: isSmallDevice ? 4 : 6,
  },
  subjectGrowth: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  subjectGrowthText: {
    fontSize: isSmallDevice ? 9 : 10,
    fontWeight: '600',
    color: '#10B981',
    fontFamily: 'Montserrat-SemiBold',
  },
  progressCircleContainer: {
    marginVertical: isSmallDevice ? 4 : 6,
  },
  subjectName: {
    fontSize: isTablet ? 13 : isSmallDevice ? 10 : 11,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
    fontFamily: 'Montserrat-Bold',
  },
  subjectProgress: {
    fontSize: isTablet ? 11 : isSmallDevice ? 8 : 9,
    color: '#9CA3AF',
    fontFamily: 'Montserrat-Regular',
  },

  // AI-Powered Insights
  aiInsightsCard: {
    backgroundColor: '#1F2937',
    marginHorizontal: isSmallDevice ? 12 : 16,
    marginBottom: isSmallDevice ? 8 : 10,
    padding: isSmallDevice ? 16 : 20,
    borderRadius: isSmallDevice ? 14 : 16,
  },
  aiInsightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isSmallDevice ? 6 : 8,
    marginBottom: isSmallDevice ? 14 : 16,
  },
  aiInsightsTitle: {
    fontSize: isTablet ? 18 : isSmallDevice ? 15 : 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
  },
  insightCard: {
    flexDirection: 'row',
    padding: isSmallDevice ? 14 : 16,
    borderRadius: isSmallDevice ? 12 : 14,
    marginBottom: isSmallDevice ? 10 : 12,
    borderWidth: 1,
  },
  insightCardBlue: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
  },
  insightCardGreen: {
    backgroundColor: '#2D5F5D',
    borderColor: '#3D7A78',
  },
  insightCardYellow: {
    backgroundColor: '#5C5438',
    borderColor: '#7A6F4D',
  },
  insightIconContainer: {
    width: isSmallDevice ? 40 : 48,
    height: isSmallDevice ? 40 : 48,
    borderRadius: isSmallDevice ? 10 : 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: isSmallDevice ? 10 : 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: isTablet ? 16 : isSmallDevice ? 13 : 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    fontFamily: 'Montserrat-Bold',
  },
  insightSubtitle: {
    fontSize: isTablet ? 14 : isSmallDevice ? 11 : 12,
    color: '#D1D5DB',
    marginBottom: isSmallDevice ? 6 : 8,
    fontFamily: 'Montserrat-Regular',
  },
  insightAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  insightActionText: {
    fontSize: isTablet ? 13 : isSmallDevice ? 10 : 11,
    color: '#9CA3AF',
    fontFamily: 'Montserrat-Medium',
  },

  // Topics Known
  topicsKnownCard: {
    backgroundColor: '#ECFDF5',
    marginHorizontal: isSmallDevice ? 12 : 16,
    marginBottom: isSmallDevice ? 8 : 10,
    padding: isSmallDevice ? 14 : 16,
    borderRadius: isSmallDevice ? 14 : 16,
  },
  topicsKnownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: isSmallDevice ? 12 : 14,
  },
  topicsKnownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isSmallDevice ? 6 : 8,
  },
  topicsKnownTitle: {
    fontSize: isTablet ? 17 : isSmallDevice ? 14 : 15,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'Montserrat-Bold',
  },
  topicsCountBadge: {
    backgroundColor: '#10B981',
    borderRadius: isSmallDevice ? 10 : 12,
    paddingHorizontal: isSmallDevice ? 7 : 8,
    paddingVertical: isSmallDevice ? 2 : 3,
  },
  topicsCountText: {
    fontSize: isSmallDevice ? 10 : 11,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  toggleButtonText: {
    fontSize: isSmallDevice ? 12 : 13,
    fontWeight: '600',
    color: '#10B981',
    fontFamily: 'Montserrat-SemiBold',
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: isSmallDevice ? 8 : 10,
  },
  topicCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: isSmallDevice ? 10 : 12,
    padding: isSmallDevice ? 10 : 12,
    width: '48%',
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 3,
  },
  topicName: {
    fontSize: isTablet ? 14 : isSmallDevice ? 11 : 12,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
    fontFamily: 'Montserrat-Bold',
  },
  topicProgressBadge: {
    backgroundColor: '#D1FAE5',
    borderRadius: isSmallDevice ? 8 : 10,
    paddingHorizontal: isSmallDevice ? 5 : 6,
    paddingVertical: 2,
    marginLeft: 4,
  },
  topicProgressText: {
    fontSize: isSmallDevice ? 9 : 10,
    fontWeight: '700',
    color: '#10B981',
    fontFamily: 'Montserrat-Bold',
  },
  topicSubject: {
    fontSize: isSmallDevice ? 10 : 11,
    color: '#9CA3AF',
    marginBottom: isSmallDevice ? 6 : 8,
    fontFamily: 'Montserrat-Regular',
  },
  progressBarContainer: {
    marginBottom: isSmallDevice ? 6 : 8,
  },
  progressBarBackground: {
    height: isSmallDevice ? 5 : 6,
    backgroundColor: '#E5E7EB',
    borderRadius: isSmallDevice ? 3 : 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: isSmallDevice ? 3 : 4,
  },
  topicFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  topicDaysAgo: {
    fontSize: isSmallDevice ? 9 : 10,
    color: '#9CA3AF',
    fontFamily: 'Montserrat-Regular',
  },

  // Needs Practice
  needsPracticeCard: {
    backgroundColor: '#FFFBEB',
    marginHorizontal: isSmallDevice ? 12 : 16,
    marginBottom: isSmallDevice ? 8 : 10,
    padding: isSmallDevice ? 14 : 16,
    borderRadius: isSmallDevice ? 14 : 16,
  },
  needsPracticeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: isSmallDevice ? 12 : 14,
  },
  needsPracticeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isSmallDevice ? 6 : 8,
  },
  needsPracticeTitle: {
    fontSize: isTablet ? 17 : isSmallDevice ? 14 : 15,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'Montserrat-Bold',
  },
  practiceCountBadge: {
    backgroundColor: '#FCD34D',
    borderRadius: isSmallDevice ? 10 : 12,
    paddingHorizontal: isSmallDevice ? 7 : 8,
    paddingVertical: isSmallDevice ? 2 : 3,
  },
  practiceCountText: {
    fontSize: isSmallDevice ? 10 : 11,
    fontWeight: '700',
    color: '#78350F',
    fontFamily: 'Montserrat-Bold',
  },
  practiceTopicsContainer: {
    gap: isSmallDevice ? 8 : 10,
  },
  practiceTopicCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: isSmallDevice ? 10 : 12,
    padding: isSmallDevice ? 10 : 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: isSmallDevice ? 10 : 12,
  },
  practiceTopicContent: {
    flex: 1,
  },
  practiceTopicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
    gap: 6,
  },
  practiceTopicName: {
    fontSize: isTablet ? 14 : isSmallDevice ? 11 : 12,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
    fontFamily: 'Montserrat-Bold',
  },
  priorityBadge: {
    backgroundColor: '#FEE2E2',
    borderRadius: isSmallDevice ? 6 : 8,
    paddingHorizontal: isSmallDevice ? 5 : 6,
    paddingVertical: 2,
  },
  priorityText: {
    fontSize: isSmallDevice ? 8 : 9,
    fontWeight: '700',
    color: '#EF4444',
    fontFamily: 'Montserrat-Bold',
  },
  practiceTopicProgress: {
    fontSize: isSmallDevice ? 11 : 12,
    fontWeight: '700',
    color: '#D97706',
    fontFamily: 'Montserrat-Bold',
  },
  practiceTopicSubject: {
    fontSize: isSmallDevice ? 10 : 11,
    color: '#9CA3AF',
    marginBottom: isSmallDevice ? 6 : 8,
    fontFamily: 'Montserrat-Regular',
  },
  practiceProgressBarContainer: {
    width: '100%',
  },
  practiceProgressBarBackground: {
    height: isSmallDevice ? 5 : 6,
    backgroundColor: '#FEF3C7',
    borderRadius: isSmallDevice ? 3 : 4,
    overflow: 'hidden',
  },
  practiceProgressBarFill: {
    height: '100%',
    backgroundColor: '#FBBF24',
    borderRadius: isSmallDevice ? 3 : 4,
  },
  practiceButton: {
    backgroundColor: '#FCD34D',
    borderRadius: isSmallDevice ? 10 : 12,
    paddingHorizontal: isSmallDevice ? 14 : 16,
    paddingVertical: isSmallDevice ? 8 : 10,
  },
  practiceButtonText: {
    fontSize: isSmallDevice ? 11 : 12,
    fontWeight: '700',
    color: '#78350F',
    fontFamily: 'Montserrat-Bold',
  },

  // Recent Achievements
  achievementsCard: {
    backgroundColor: '#F9FAFB',
    marginHorizontal: isSmallDevice ? 12 : 16,
    marginBottom: isSmallDevice ? 8 : 10,
    padding: isSmallDevice ? 12 : 14,
    borderRadius: isSmallDevice ? 14 : 16,
  },
  achievementsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isSmallDevice ? 6 : 8,
    marginBottom: isSmallDevice ? 12 : 14,
  },
  achievementsTitle: {
    fontSize: isTablet ? 17 : isSmallDevice ? 14 : 15,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'Montserrat-Bold',
  },
  achievementsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: isSmallDevice ? 8 : 10,
  },
  achievementItem: {
    flex: 1,
    alignItems: 'center',
  },
  achievementIcon: {
    width: isSmallDevice ? 48 : 52,
    height: isSmallDevice ? 48 : 52,
    borderRadius: isSmallDevice ? 12 : 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: isSmallDevice ? 6 : 8,
  },
  achievementTitle: {
    fontSize: isTablet ? 13 : isSmallDevice ? 10 : 11,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
    textAlign: 'center',
    fontFamily: 'Montserrat-Bold',
  },
  achievementSubtitle: {
    fontSize: isTablet ? 11 : isSmallDevice ? 8 : 9,
    color: '#9CA3AF',
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
  },

  // Test Knowledge Card
  testKnowledgeCard: {
    backgroundColor: '#6366F1',
    marginHorizontal: isSmallDevice ? 12 : 16,
    marginBottom: isSmallDevice ? 8 : 10,
    padding: isSmallDevice ? 16 : 18,
    borderRadius: isSmallDevice ? 14 : 16,
    alignItems: 'center',
  },
  testKnowledgeIconContainer: {
    width: isSmallDevice ? 48 : 52,
    height: isSmallDevice ? 48 : 52,
    borderRadius: isSmallDevice ? 12 : 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: isSmallDevice ? 10 : 12,
  },
  testKnowledgeTitle: {
    fontSize: isTablet ? 18 : isSmallDevice ? 14 : 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: isSmallDevice ? 6 : 8,
    textAlign: 'center',
    fontFamily: 'Montserrat-Bold',
  },
  testKnowledgeSubtitle: {
    fontSize: isTablet ? 13 : isSmallDevice ? 10 : 11,
    color: '#E0E7FF',
    marginBottom: isSmallDevice ? 12 : 14,
    textAlign: 'center',
    lineHeight: isSmallDevice ? 16 : 18,
    fontFamily: 'Montserrat-Regular',
  },
  testKnowledgeButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: isSmallDevice ? 10 : 12,
    paddingHorizontal: isSmallDevice ? 18 : 20,
    paddingVertical: isSmallDevice ? 10 : 12,
    width: '100%',
    alignItems: 'center',
  },
  testKnowledgeButtonText: {
    fontSize: isTablet ? 14 : isSmallDevice ? 11 : 12,
    fontWeight: '700',
    color: '#6366F1',
    fontFamily: 'Montserrat-Bold',
  },

  bottomSpacing: {
    height: isSmallDevice ? 20 : 30,
  },
});

export default LearningProgressScreen;
