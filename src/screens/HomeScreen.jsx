/**
 * Home Screen with Side Menu - Enhanced with Full Functionality
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Image,
  RefreshControl,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { getAllNudges, getAllSubjects, getNudgesBySubject, getNudgesByGradeAndLevel } from '../data/nudgesData';
import { BASE_URL, getImageUri, fetchDidYouKnow, fetchRiddles, fetchParentingInsights, fetchPhaseCards, fetchTopicsBySubject, fetchSubjects, fetchFeaturedContent, fetchBeyondSchool, fetchBeyondSchoolTopicsBySubject, fetchFeaturedContentDetail } from '../api';
import { createTopicUploadNotification } from '../services/notificationService';
import { Storage } from '../utils/storage';



const { width } = Dimensions.get('window');
const isTablet = width >= 768;
const isSmallDevice = width < 375;

const HomeScreen = ({ userData, completedTopics = new Set(), onNavigate, onMarkTopicComplete }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuAnimation] = useState(new Animated.Value(-width * 0.75));
  const [refreshing, setRefreshing] = useState(false);
  const [completedNudges, setCompletedNudges] = useState([]);
  const [showQuickAction, setShowQuickAction] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [avatarCache, setAvatarCache] = useState({}); // { _id: base64 }
  const [didYouKnowFacts, setDidYouKnowFacts] = useState([]);
  const [riddlesData, setRiddlesData] = useState([]);
  const [parentingInsights, setParentingInsights] = useState([]);
  const [phaseCards, setPhaseCards] = useState([]);
  const [riddleAnswers, setRiddleAnswers] = useState({}); // { [id]: bool }
  const [riddleHints, setRiddleHints] = useState({});    // { [id]: bool }
  const [showAllRiddles, setShowAllRiddles] = useState(false);
  const [todaysTopics, setTodaysTopics] = useState([]);
  const [todaysBeyondSchoolNudge, setTodaysBeyondSchoolNudge] = useState(null);
  const [beyondSchoolSubjectInfo, setBeyondSchoolSubjectInfo] = useState(null);
  const [allBeyondSchoolSubjects, setAllBeyondSchoolSubjects] = useState([]); // all enrolled beyond school subjects
  const [upcomingTopics, setUpcomingTopics] = useState([]);
  const [apiSubjects, setApiSubjects] = useState([]);
  const [allTopicsFromApi, setAllTopicsFromApi] = useState([]);
  const [featuredContent, setFeaturedContent] = useState([]);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [featuredModalVisible, setFeaturedModalVisible] = useState(false);
  const [featuredDetailData, setFeaturedDetailData] = useState(null);
  const [featuredDetailLoading, setFeaturedDetailLoading] = useState(false);

  const toggleMenu = () => {
    const toValue = menuVisible ? -width * 0.75 : 0;
    
    Animated.timing(menuAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    setMenuVisible(!menuVisible);
  };

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Load unread notification count — fetch directly from backend
  useEffect(() => {
    const loadUnreadCount = async () => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      try {
        const token = await Storage.getItem('authToken');
        if (!token) { setUnreadNotificationCount(0); return; }
        const res = await fetch(`${BASE_URL}/notifications/unread/count`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        clearTimeout(timeout);
        if (res.ok) {
          const data = await res.json();
          setUnreadNotificationCount(data.count || 0);
        }
      } catch (error) {
        clearTimeout(timeout);
        // Silently fail — badge just won't show, not a critical error
        setUnreadNotificationCount(0);
      }
    };

    loadUnreadCount();
    // Refresh every 30 seconds so badge stays current
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [userData]);

  // Fetch admin avatars to resolve _id → base64 image
  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    fetch(`${BASE_URL}/avatars`, { signal: controller.signal })
      .then(r => { clearTimeout(timeout); return r.json(); })
      .then(data => {
        if (Array.isArray(data)) {
          const cache = {};
          data.forEach(a => { cache[a._id] = a.image; });
          setAvatarCache(cache);
        }
      })
      .catch(() => { clearTimeout(timeout); });

    // Fetch Did You Know facts from admin panel
    fetchDidYouKnow()
      .then(data => setDidYouKnowFacts(data))
      .catch(() => {});

    // Fetch Riddles from admin panel
    fetchRiddles()
      .then(data => setRiddlesData(data))
      .catch(() => {});

    // Fetch Parenting Insights from admin panel
    fetchParentingInsights()
      .then(data => setParentingInsights(data))
      .catch(() => {});

    // Fetch Phase Cards from admin panel
    fetchPhaseCards()
      .then(data => setPhaseCards(data))
      .catch(() => {});

    // Fetch subjects
    fetchSubjects()
      .then(data => setApiSubjects(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // Fetch featured content — only show items matching the student's grade or "All Grades"
  useEffect(() => {
    const studentGrade = userData?.children?.[0]?.grade || '';
    fetchFeaturedContent()
      .then(data => {
        if (!Array.isArray(data)) { setFeaturedContent([]); return; }
        const filtered = data.filter(item =>
          item.grade === 'All Grades' || item.grade === studentGrade
        );
        setFeaturedContent(filtered);
      })
      .catch(() => setFeaturedContent([]));
  }, [userData]);

  // Fetch topics and filter by scheduled date, student's enrolled subjects, and levels
  useEffect(() => {
    const loadTodaysTopics = async () => {
      try {
        const child = userData?.children?.[0];
        const studentSubjectLevels = child?.subjectLevels || {};
        const enrolledSubjectIds = Object.keys(studentSubjectLevels);
        const studentGrade = child?.grade;

        if (enrolledSubjectIds.length === 0) {
          setTodaysTopics([]);
          setUpcomingTopics([]);
          setAllTopicsFromApi([]);
          return;
        }

        // Fetch all topics
        const allTopics = await fetchTopicsBySubject();

        // Filter topics by student's enrolled subjects, grade, and level
        const studentTopics = allTopics.filter(topic => {
          const isEnrolledSubject = enrolledSubjectIds.includes(String(topic.subjectId));
          if (!isEnrolledSubject) return false;
          const gradeMatch = !topic.grade || !studentGrade || topic.grade === studentGrade;
          if (!gradeMatch) return false;
          const studentLevel = studentSubjectLevels[String(topic.subjectId)];
          const levelMatch = !topic.level || !studentLevel || topic.level === studentLevel;
          return levelMatch;
        });

        setAllTopicsFromApi(studentTopics);

        const topicsWithDates = studentTopics.filter(t => t.scheduledDate);

        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const todayEnd   = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

        // --- Per-subject: pick the best available topic ---
        // Priority: today first, then the most recently scheduled past topic (no day limit)
        const nudgeCards = [];

        for (const subjectId of enrolledSubjectIds) {
          const subjectTopics = topicsWithDates.filter(t => String(t.subjectId) === subjectId);

          // 1. Try today
          const todayTopic = subjectTopics.find(t => {
            const d = new Date(t.scheduledDate);
            return d >= todayStart && d <= todayEnd;
          });
          if (todayTopic) { nudgeCards.push(todayTopic); continue; }

          // 2. Fall back to the most recently scheduled past topic (any number of days ago)
          const pastTopics = subjectTopics
            .filter(t => new Date(t.scheduledDate) < todayStart)
            .sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate));
          if (pastTopics.length > 0) { nudgeCards.push(pastTopics[0]); }
        }

        // Max 2 cards
        setTodaysTopics(nudgeCards.slice(0, 2));

        // Upcoming topics (tomorrow onwards) — 1 per day, max 3 days
        const tomorrowStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        const upcomingScheduled = topicsWithDates
          .filter(t => new Date(t.scheduledDate) >= tomorrowStart)
          .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));

        const topicsByDate = {};
        upcomingScheduled.forEach(topic => {
          const dateKey = new Date(topic.scheduledDate).toDateString();
          if (!topicsByDate[dateKey]) topicsByDate[dateKey] = topic;
        });
        setUpcomingTopics(Object.values(topicsByDate).slice(0, 3));

      } catch (error) {
        console.error('[HomeScreen] Error loading topics:', error);
        setTodaysTopics([]);
        setUpcomingTopics([]);
        setAllTopicsFromApi([]);
      }
    };

    if (userData?.children?.[0]) {
      loadTodaysTopics();
    }
  }, [userData]);

  // Fetch today's Beyond School nudge
  useEffect(() => {
    const loadBeyondSchoolNudge = async () => {
      try {
        const child = userData?.children?.[0];
        const childTopics = child?.topics || []; // array of CustomizeLearning IDs
        if (childTopics.length === 0) return;

        const allBeyondSubjects = await fetchBeyondSchool();
        const enrolledSubjects = allBeyondSubjects.filter(s =>
          childTopics.includes(String(s._id)),
        );
        if (enrolledSubjects.length === 0) return;

        // Store all enrolled beyond school subjects for weekly impact calculation
        setAllBeyondSchoolSubjects(enrolledSubjects);

        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const todayEnd   = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

        // Try each enrolled beyond school subject until we find a topic
        for (const subject of enrolledSubjects) {
          const topics = await fetchBeyondSchoolTopicsBySubject(subject._id);
          const topicsWithDates = topics.filter(t => t.scheduledDate);

          // 1. Try today
          let pick = topicsWithDates.find(t => {
            const d = new Date(t.scheduledDate);
            return d >= todayStart && d <= todayEnd;
          });

          // 2. Fall back to the most recently scheduled past topic (any number of days ago)
          if (!pick) {
            const pastTopics = topicsWithDates
              .filter(t => new Date(t.scheduledDate) < todayStart)
              .sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate));
            pick = pastTopics[0] || null;
          }

          if (pick) {
            setTodaysBeyondSchoolNudge(pick);
            setBeyondSchoolSubjectInfo(subject);
            return;
          }
        }
      } catch (error) {
        console.error('[HomeScreen] Error loading beyond school nudge:', error);
      }
    };

    if (userData?.children?.[0]) {
      loadBeyondSchoolNudge();
    }
  }, [userData]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const token = await Storage.getItem('authToken');
      if (token) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);
        try {
          const res = await fetch(`${BASE_URL}/notifications/unread/count`, {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          });
          clearTimeout(timeout);
          if (res.ok) {
            const data = await res.json();
            setUnreadNotificationCount(data.count || 0);
          }
        } catch (_) {
          clearTimeout(timeout);
        }
      }
    } catch (error) {
      // silent
    }
    setTimeout(() => setRefreshing(false), 1500);
  };

  // Calculate weekly impact data based on completed topics
  const calculateWeeklyImpact = () => {
    const now = new Date();
    const child = userData?.children?.[0];
    
    // Get the start of current week (Monday)
    const currentDay = now.getDay();
    const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1;
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - daysFromMonday);
    startOfWeek.setHours(0, 0, 0, 0);
    
    console.log('[HomeScreen] Calculating weekly impact...');
    console.log('[HomeScreen] Start of week:', startOfWeek.toISOString());
    console.log('[HomeScreen] Total completed topics:', completedTopics.size);
    
    let weeklyCompleted = 0;
    let totalTopicsThisWeek = 0;
    const subjectScores = {}; // Track scores per subject
    const daysWithActivity = new Set();
    
    // Count topics completed this week
    completedTopics.forEach(topicKey => {
      const parts = topicKey.split('::');
      if (parts.length >= 2) {
        const subjectName = parts[0];
        
        // Extract timestamp if available
        let timestamp = null;
        if (parts.length >= 3 && !isNaN(parts[2])) {
          timestamp = new Date(parseInt(parts[2]));
        }
        
        // Only count if completed this week
        if (!timestamp || timestamp >= startOfWeek) {
          weeklyCompleted++;
          
          // Track subject scores (assume 100% for completed topics)
          if (!subjectScores[subjectName]) {
            subjectScores[subjectName] = { total: 0, count: 0 };
          }
          subjectScores[subjectName].total += 100;
          subjectScores[subjectName].count += 1;
          
          // Track days with activity
          if (timestamp) {
            const dayKey = timestamp.toDateString();
            daysWithActivity.add(dayKey);
            console.log('[HomeScreen] Added activity day:', dayKey);
          } else {
            // If no timestamp, assume it's today
            const todayKey = now.toDateString();
            daysWithActivity.add(todayKey);
            console.log('[HomeScreen] Added activity day (no timestamp, using today):', todayKey);
          }
        }
      }
    });
    
    console.log('[HomeScreen] Weekly completed:', weeklyCompleted);
    console.log('[HomeScreen] Days with activity:', daysWithActivity.size);
    console.log('[HomeScreen] Activity days:', Array.from(daysWithActivity));
    
    // Calculate total topics for the week (from student's subjects)
    const subjectLevels = child?.subjectLevels || {};
    Object.entries(subjectLevels).forEach(([subjectKey, level]) => {
      // Estimate topics per subject per week (20% of total)
      const levelMultiplier = {
        'Basic': 8,
        'Intermediate': 12,
        'Advanced': 15
      };
      const estimatedTotal = levelMultiplier[level] || 10;
      totalTopicsThisWeek += Math.max(Math.ceil(estimatedTotal * 0.2), 3);
    });

    // Add beyond school subjects to weekly total (estimate 3 topics/week each)
    totalTopicsThisWeek += allBeyondSchoolSubjects.length * 3;

    // If no subjects, use a default
    if (totalTopicsThisWeek === 0) {
      totalTopicsThisWeek = 10;
    }
    
    // Calculate completion rate
    const completionRate = totalTopicsThisWeek > 0 
      ? Math.round((weeklyCompleted / totalTopicsThisWeek) * 100)
      : 0;
    
    // Calculate active days (out of 7)
    const activeDays = daysWithActivity.size;
    
    // Check if there's activity today
    const todayKey = now.toDateString();
    const hasActivityToday = daysWithActivity.has(todayKey);
    
    console.log('[HomeScreen] Has activity today:', hasActivityToday);
    
    // Calculate streak days array (Monday to Sunday)
    const streakDaysArray = [];
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(startOfWeek);
      checkDate.setDate(startOfWeek.getDate() + i);
      checkDate.setHours(0, 0, 0, 0);
      
      const checkDateKey = checkDate.toDateString();
      const hasActivity = daysWithActivity.has(checkDateKey);
      
      // Only mark as active if the day has passed or is today
      const isPastOrToday = checkDate <= now;
      streakDaysArray.push(hasActivity && isPastOrToday);
    }
    
    console.log('[HomeScreen] Streak days array (Mon-Sun):', streakDaysArray);
    
    // Calculate remaining days from today until Sunday
    const currentDayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const daysUntilSunday = currentDayOfWeek === 0 ? 0 : 7 - currentDayOfWeek;
    
    console.log('[HomeScreen] Current day of week:', currentDayOfWeek, 'Days until Sunday:', daysUntilSunday);
    
    // Find best subject (highest average score)
    let bestSubject = 'Math';
    let bestScore = 0;
    Object.entries(subjectScores).forEach(([subject, data]) => {
      const avgScore = data.total / data.count;
      if (avgScore > bestScore) {
        bestScore = avgScore;
        bestSubject = subject;
      }
    });
    
    // If no subjects completed, use first enrolled subject (normal or beyond school)
    if (Object.keys(subjectScores).length === 0) {
      const subjectLevels = child?.subjectLevels || {};
      const firstSubjectKey = Object.keys(subjectLevels)[0];
      if (firstSubjectKey) {
        const isObjectId = (str) => /^[0-9a-fA-F]{24}$/.test(str);
        if (isObjectId(firstSubjectKey)) {
          const apiSubject = apiSubjects.find(s => s._id === firstSubjectKey);
          bestSubject = apiSubject?.name || 'Math';
        } else {
          bestSubject =
            firstSubjectKey === 'mathematics' ? 'Math' :
            firstSubjectKey === 'science' ? 'Science' :
            firstSubjectKey === 'english' ? 'English' :
            'Math';
        }
      } else if (allBeyondSchoolSubjects.length > 0) {
        // Fall back to first beyond school subject
        bestSubject = allBeyondSchoolSubjects[0].name;
      }
    }
    
    return {
      completionRate: completionRate,
      completionGrowth: completionRate > 0 ? Math.min(Math.round(completionRate * 0.15), 15) : 0,
      activeDays: activeDays,
      totalDays: 7,
      bestSubject: bestSubject,
      bestSubjectScore: Math.round(bestScore),
      hasActivityToday: hasActivityToday,
      streakDaysArray: streakDaysArray, // Array of 7 booleans (Mon-Sun)
      daysRemaining: daysUntilSunday, // Days remaining from today until Sunday
    };
  };
  
  const weeklyImpact = useMemo(() => calculateWeeklyImpact(), [completedTopics, userData, apiSubjects, allBeyondSchoolSubjects]);

  const handleNudgeComplete = (nudgeId) => {
    if (!completedNudges.includes(nudgeId)) {
      setCompletedNudges([...completedNudges, nudgeId]);
    }
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Morning';
    if (hour < 18) return 'Afternoon';
    return 'Evening';
  };

  const getTimeBasedRecommendation = () => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 9) {
      return {
        title: 'Morning Curiosity Spark',
        description: 'Start the day with wonder! Perfect conversation for breakfast time.',
        icon: 'weather-sunny',
        color: '#FFB84D',
      };
    } else if (hour >= 12 && hour < 14) {
      return {
        title: 'Lunchtime Learning',
        description: 'Quick activities perfect for your lunch break together.',
        icon: 'food-apple',
        color: '#E74C3C',
      };
    } else if (hour >= 17 && hour < 20) {
      return {
        title: 'Evening Wind-Down',
        description: 'Calm activities to transition from day to night.',
        icon: 'weather-sunset',
        color: '#9B59B6',
      };
    } else if (hour >= 20 || hour < 6) {
      return {
        title: 'Bedtime Stories & Reflection',
        description: 'Perfect for winding down and reflecting on the day.',
        icon: 'moon-waning-crescent',
        color: '#4A90E2',
      };
    }
    return {
      title: 'Afternoon Adventures',
      description: 'Engaging activities for quality afternoon time.',
      icon: 'cloud',
      color: '#00CED1',
    };
  };

  const getAvatarSource = (avatarId) => {
    if (!avatarId) return require('../assets/images/A1.jpeg');
    // Custom uploaded photo (file URI)
    if (avatarId.startsWith('file://') || avatarId.startsWith('content://') ||
        avatarId.startsWith('data:') || avatarId.startsWith('http')) {
      return { uri: avatarId };
    }
    // Local fallback avatars (A1-A6)
    const localMap = {
      'A1': require('../assets/images/A1.jpeg'),
      'A2': require('../assets/images/A2.jpeg'),
      'A3': require('../assets/images/A3.jpeg'),
      'A4': require('../assets/images/A4.jpeg'),
      'A5': require('../assets/images/A5.jpeg'),
      'A6': require('../assets/images/A6.jpeg'),
    };
    if (localMap[avatarId]) return localMap[avatarId];
    // MongoDB ObjectId (24-char hex) — resolve from cache
    if (/^[a-f0-9]{24}$/i.test(avatarId) && avatarCache[avatarId]) {
      return { uri: avatarCache[avatarId] };
    }
    return require('../assets/images/A1.jpeg');
  };

  const getDateLabel = (dateString) => {
    const scheduledDate = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Reset time parts for comparison
    const resetTime = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const schedDate = resetTime(scheduledDate);
    const todayDate = resetTime(today);
    const tomorrowDate = resetTime(tomorrow);

    if (schedDate.getTime() === tomorrowDate.getTime()) {
      return 'Tomorrow';
    } else {
      // Format as "Mon, Dec 6" for all other dates
      const options = { weekday: 'short', month: 'short', day: 'numeric' };
      return scheduledDate.toLocaleDateString('en-US', options);
    }
  };

  const child = userData?.children?.[0];
  console.log('[HomeScreen] child:', child?.name, '| avatar:', child?.avatar?.substring(0, 20));
  console.log('[HomeScreen] Featured content state:', featuredContent.length, 'items');
  if (featuredContent.length > 0) {
    console.log('[HomeScreen] First featured item:', featuredContent[0]);
  }
  const timeRecommendation = getTimeBasedRecommendation();
  
  // Did You Know — show 2 most recently added active facts from admin panel
  const fallbackFacts = [
    { _id: '1', fact: 'Bananas are berries, but strawberries are not.', prompt: 'Can you think of other foods that might not be what we usually call them?', source: 'Britannica Kids' },
    { _id: '2', fact: 'Honey never spoils. Archaeologists have found 3,000-year-old honey in Egyptian tombs that was still perfectly edible.', prompt: 'Why do you think honey lasts so long?', source: 'Britannica Kids' },
  ];
  // API already filters isActive — take last 2 (most recently added)
  const todaysFacts = (didYouKnowFacts.length > 0 ? didYouKnowFacts : fallbackFacts).slice(-2).reverse();

  // Get nudges filtered by child's grade and subject levels
  const todaysNudges = getNudgesByGradeAndLevel(child?.grade, child?.subjectLevels);

  // Pick one nudge per subject for Today's Nudges section (last added = most recent)
  const todaysNudgesBySubject = Object.values(
    todaysNudges.reduce((acc, nudge) => {
      acc[nudge.subject] = nudge; // always overwrite → last one wins
      return acc;
    }, {})
  );

  // Get all subjects dynamically from data
  const allSubjects = getAllSubjects();
  
  // Calculate statistics
  const totalNudges = todaysNudges.length;
  const totalSubjects = allSubjects.length;
  const totalTopics = todaysNudges.length; // Each nudge is a topic
  const estimatedHours = (totalNudges * 20 / 60).toFixed(1); // Assuming 20 min per nudge
  
  // Subject configuration for icons and colors
  const subjectConfig = {
    'Mathematics': {
      image: require('../assets/images/math.png'),
      color: '#42A5F5',
      bgColor: '#E3F2FD',
    },
    'Science': {
      image: require('../assets/images/sci.png'),
      color: '#8B5CF6',
      bgColor: '#F5F3FF',
    },
    'English': {
      image: require('../assets/images/eng.png'),
      color: '#42A5F5',
      bgColor: '#E3F2FD',
    },
    'Environmental Studies': {
      image: require('../assets/images/sci.png'),
      color: '#10B981',
      bgColor: '#ECFDF5',
    },
    'Values & Character': {
      image: require('../assets/images/ss.png'),
      color: '#EC4899',
      bgColor: '#FDF2F8',
    },
    'Arts & Creativity': {
      image: require('../assets/images/Ai s.png'),
      color: '#F59E0B',
      bgColor: '#FFFBEB',
    },
    'Financial Literacy': {
      image: require('../assets/images/Fl.png'),
      color: '#10B981',
      bgColor: '#ECFDF5',
    },
    'Sex & Safety Education': {
      image: require('../assets/images/ss.png'),
      color: '#EC4899',
      bgColor: '#FDF2F8',
    },
    'Artificial Intelligence': {
      image: require('../assets/images/Ai s.png'),
      color: '#8B5CF6',
      bgColor: '#F5F3FF',
    },
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
          <Icon name="menu" size={28} color="#333333" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Nudge2Grow</Text>
        
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => onNavigate('notifications')}
          >
            <Icon name="notifications-outline" size={24} color="#333333" />
            {unreadNotificationCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          {/* Always show avatar — child data or placeholder */}
          <TouchableOpacity style={styles.avatarContainer}>
            {child?.avatar ? (
              <Image
                source={getAvatarSource(child.avatar)}
                style={styles.avatar}
                onError={() => {}}
              />
            ) : child?.name ? (
              <View style={[styles.avatar, { backgroundColor: '#45a578', justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 18 }}>
                  {child.name[0].toUpperCase()}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#45a578']} />
        }
      >
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>
            Good {getGreeting()}! 👋
          </Text>
          <Text style={styles.subtitleText}>
            Ready to create magical learning moments? Here are today's conversation starters designed just for your family.
          </Text>
        </View>

        {/* Featured Nudge of the Day */}
        {console.log('[HomeScreen RENDER] About to check featuredContent.length:', featuredContent.length)}
        {featuredContent.length > 0 ? (
          <View style={styles.section}>
            <View style={styles.featuredBadge}>
              <MaterialIcon name="star" size={16} color="#FFB84D" />
              <Text style={styles.featuredBadgeText}>Featured Today</Text>
            </View>
            <View style={styles.featuredCard}>
              <View style={styles.featuredContent}>
                <View style={styles.featuredHeader}>
                  <View style={[styles.featuredIconLarge, { backgroundColor: featuredContent[0].iconColor + '20' }]}>
                    <MaterialIcon
                      name={featuredContent[0].icon || 'telescope'}
                      size={32}
                      color={featuredContent[0].iconColor || '#4A90E2'}
                    />
                  </View>
                  <View style={styles.featuredInfo}>
                    <Text style={styles.featuredTitle}>{featuredContent[0].title}</Text>
                    {featuredContent[0].subtitle ? (
                      <Text style={styles.featuredSubtitle}>{featuredContent[0].subtitle}</Text>
                    ) : null}
                  </View>
                </View>
                <Text style={styles.featuredDescription}>
                  {featuredContent[0].description}
                </Text>
                <View style={styles.featuredMeta}>
                  <View style={styles.metaChip}>
                    <Icon name="people-outline" size={14} color="#666666" />
                    <Text style={styles.metaChipText}>{child?.grade || 'All Grades'}</Text>
                  </View>
                  <View style={styles.metaChip}>
                    <MaterialIcon name="star" size={14} color="#FFB84D" />
                    <Text style={styles.metaChipText}>Popular</Text>
                  </View>
                </View>
                {/* Button now opens modal instead of navigating directly */}
                <TouchableOpacity
                  style={styles.featuredButton}
                  onPress={async () => {
                    setFeaturedModalVisible(true);
                    if (!featuredDetailData && featuredContent[0]?._id) {
                      setFeaturedDetailLoading(true);
                      try {
                        const data = await fetchFeaturedContentDetail(featuredContent[0]._id);
                        setFeaturedDetailData(data || null);
                      } catch (e) {
                        setFeaturedDetailData(null);
                      } finally {
                        setFeaturedDetailLoading(false);
                      }
                    }
                  }}
                >
                  <LinearGradient
                    colors={['#00CED1', '#45a578', '#90EE90']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.featuredButtonGradient}
                  >
                    <Text style={styles.featuredButtonText}>Start This Nudge</Text>
                    <Icon name="arrow-forward" size={18} color="#FFFFFF" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>

            {/* ── Popup Modal — full content, no navigation ── */}
            <Modal
              visible={featuredModalVisible}
              transparent
              animationType="fade"
              onRequestClose={() => setFeaturedModalVisible(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalCard}>
                  {/* Close */}
                  <TouchableOpacity
                    style={styles.modalCloseBtn}
                    onPress={() => setFeaturedModalVisible(false)}
                    activeOpacity={0.7}
                  >
                    <Icon name="close" size={22} color="#555" />
                  </TouchableOpacity>

                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.modalScrollContent}
                  >
                    {/* Icon */}
                    <View style={[styles.modalIconCircle, { backgroundColor: (featuredContent[0].iconColor || '#4A90E2') + '22' }]}>
                      <MaterialIcon
                        name={featuredContent[0].icon || 'telescope'}
                        size={52}
                        color={featuredContent[0].iconColor || '#4A90E2'}
                      />
                    </View>

                    {/* Featured badge */}
                    <View style={styles.modalBadge}>
                      <MaterialIcon name="star" size={13} color="#FFB84D" />
                      <Text style={styles.modalBadgeText}>Featured Today</Text>
                    </View>

                    {/* Title */}
                    <Text style={styles.modalTitle}>{featuredContent[0].title}</Text>
                    {featuredContent[0].subtitle ? (
                      <Text style={styles.modalSubtitle}>{featuredContent[0].subtitle}</Text>
                    ) : null}

                    {/* Meta chips */}
                    <View style={styles.modalMetaRow}>
                      <View style={styles.modalMetaChip}>
                        <Icon name="people-outline" size={13} color="#666" />
                        <Text style={styles.modalMetaText}>{child?.grade || 'All Grades'}</Text>
                      </View>
                      {featuredContent[0].isPopular && (
                        <View style={[styles.modalMetaChip, { backgroundColor: '#FEF3C7' }]}>
                          <MaterialIcon name="fire" size={13} color="#F59E0B" />
                          <Text style={[styles.modalMetaText, { color: '#F59E0B' }]}>Popular</Text>
                        </View>
                      )}
                    </View>

                    {/* About section */}
                    <View style={styles.modalSection}>
                      <View style={styles.modalSectionHeader}>
                        <MaterialIcon name="text-box-outline" size={18} color="#45a578" />
                        <Text style={styles.modalSectionTitle}>About This Nudge</Text>
                      </View>
                      <Text style={styles.modalDesc}>{featuredContent[0].description}</Text>
                    </View>

                    {/* Detail sections */}
                    {featuredDetailLoading ? (
                      <View style={styles.modalLoadingBox}>
                        <ActivityIndicator size="small" color="#45a578" />
                        <Text style={styles.modalLoadingText}>Loading details...</Text>
                      </View>
                    ) : featuredDetailData?.sections?.length > 0 ? (
                      featuredDetailData.sections.map((section, idx) => (
                        <View key={idx} style={styles.modalDetailSection}>
                          {section.title ? (
                            <Text style={styles.modalDetailTitle}>{section.title}</Text>
                          ) : null}
                          {section.subtitle ? (
                            <Text style={styles.modalDetailSubtitle}>{section.subtitle}</Text>
                          ) : null}
                          {section.description ? (
                            <Text style={styles.modalDetailDesc}>{section.description}</Text>
                          ) : null}
                          {section.heading ? (
                            <Text style={styles.modalDetailHeading}>{section.heading}</Text>
                          ) : null}
                          {section.points?.length > 0 && (
                            <View style={styles.modalPointsList}>
                              {section.points.map((pt, pi) =>
                                pt ? (
                                  <Text key={pi} style={styles.modalPointItem}>• {pt}</Text>
                                ) : null
                              )}
                            </View>
                          )}
                        </View>
                      ))
                    ) : null}
                  </ScrollView>
                </View>
              </View>
            </Modal>
          </View>
        ) : null}

        {/* Today's Nudges Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Nudges</Text>
          </View>

          {todaysTopics.length === 0 && !todaysBeyondSchoolNudge ? (
            <View style={styles.emptyNudgesCard}>
              <MaterialIcon name="book-clock-outline" size={36} color="#9CA3AF" />
              <Text style={styles.emptyNudgesTitle}>No topics available</Text>
              <Text style={styles.emptyNudgesText}>
                {Object.keys(child?.subjectLevels || {}).length === 0 
                  ? 'Please select subjects in Settings to see scheduled topics.'
                  : 'No topics scheduled for today or the past 2 days for your enrolled subjects.'}
              </Text>
            </View>
          ) : (
            <>
              {/* Normal school subject card — first enrolled subject topic */}
              {todaysTopics.slice(0, 1).map((topic) => {
                const subject = apiSubjects.find(s => String(s._id) === String(topic.subjectId));
                const subjectName = subject?.name || topic.subjectName || 'Learning';

                // Pick a good icon: use admin-set rnIcon, else derive from subject name
                const getSubjectIcon = (name = '') => {
                  const n = name.toLowerCase();
                  if (n.includes('math'))           return 'calculator-variant';
                  if (n.includes('science') || n.includes('evs') || n.includes('biology')) return 'flask-outline';
                  if (n.includes('english') || n.includes('language') || n.includes('grammar')) return 'book-alphabet';
                  if (n.includes('social') || n.includes('history') || n.includes('geography')) return 'earth';
                  if (n.includes('computer') || n.includes('coding') || n.includes('ai') || n.includes('artificial')) return 'code-braces';
                  if (n.includes('art') || n.includes('drawing') || n.includes('craft')) return 'palette-outline';
                  if (n.includes('music'))          return 'music-note-outline';
                  if (n.includes('physical') || n.includes('sport') || n.includes('yoga')) return 'run-fast';
                  if (n.includes('financial') || n.includes('economics')) return 'cash-multiple';
                  if (n.includes('moral') || n.includes('value') || n.includes('character')) return 'heart-outline';
                  if (n.includes('environment'))    return 'leaf-circle-outline';
                  if (n.includes('health') || n.includes('nutrition')) return 'medical-bag';
                  if (n.includes('general') || n.includes('knowledge')) return 'lightbulb-outline';
                  return 'book-open-variant';
                };
                const subjectIcon = subject?.rnIcon || subject?.icon || getSubjectIcon(subjectName);

                return (
                  <TouchableOpacity
                    key={topic._id}
                    style={styles.card}
                    onPress={async () => {
                      if (onNavigate) {
                        try {
                          const allTopicsForSubject = await fetchTopicsBySubject(topic.subjectId);
                          const topicsWithDates = allTopicsForSubject.filter(t => t.scheduledDate);
                          // Include ALL topics in allNudges so initialTopicId is always found
                          const allNudgesForSubject = allTopicsForSubject.map(t => ({
                            subject: subjectName,
                            topic: t.topic || t.title,
                            apiTopic: t,
                          }));
                          onNavigate('topicDetail', {
                            subjectName: subjectName,
                            initialTopicId: topic._id,
                            topicData: {
                              subject: subjectName,
                              topic: topic.topic || topic.title,
                              apiTopics: topicsWithDates,
                            },
                            allNudges: allNudgesForSubject,
                          });
                        } catch (error) {
                          console.error('[HomeScreen] Error fetching topics:', error);
                          onNavigate('topicDetail', {
                            subjectName: subjectName,
                            initialTopicId: topic._id,
                            topicData: {
                              subject: subjectName,
                              topic: topic.topic || topic.title,
                              apiTopics: [topic],
                            },
                            allNudges: [{
                              subject: subjectName,
                              topic: topic.topic || topic.title,
                              apiTopic: topic,
                            }],
                          });
                        }
                      }
                    }}
                  >
                    <View style={styles.cardLeftSection}>
                      <View style={styles.cardIcon}>
                        <MaterialIcon name={subjectIcon} size={24} color="#45a578" />
                      </View>
                    </View>
                    <View style={styles.cardContent}>
                      <Text style={styles.cardTitle}>{topic.topic || topic.title}</Text>
                      <Text style={styles.cardDescription}>
                        {topic.description || 'Explore this topic together'}
                      </Text>
                      <View style={styles.cardMeta}>
                        <Text style={styles.cardCategory}>{subjectName}  </Text>
                        {topic.title && (
                          <>
                            <Text style={styles.cardDot}>• </Text>
                            <Text style={styles.cardCategory}>{topic.title}</Text>
                          </>
                        )}
                      </View>
                    </View>
                    <Icon name="chevron-forward" size={24} color="#45a578" />
                  </TouchableOpacity>
                );
              })}

              {/* Beyond School subject card */}
              {todaysBeyondSchoolNudge && beyondSchoolSubjectInfo && (
                <TouchableOpacity
                  key={todaysBeyondSchoolNudge._id}
                  style={styles.card}
                  onPress={async () => {
                    if (onNavigate) {
                      try {
                        const allTopicsForSubject = await fetchBeyondSchoolTopicsBySubject(beyondSchoolSubjectInfo._id);
                        const topicsWithDates = allTopicsForSubject.filter(t => t.scheduledDate);
                        onNavigate('topicDetail', {
                          subjectName: beyondSchoolSubjectInfo.name,
                          isBeyondSchool: true,
                          initialTopicId: todaysBeyondSchoolNudge._id,
                          topicData: {
                            subject: beyondSchoolSubjectInfo.name,
                            topic: todaysBeyondSchoolNudge.topic || todaysBeyondSchoolNudge.title,
                            apiTopics: topicsWithDates,
                          },
                          allNudges: topicsWithDates.map(t => ({
                            subject: beyondSchoolSubjectInfo.name,
                            topic: t.topic || t.title,
                            apiTopic: t,
                          })),
                        });
                      } catch (error) {
                        console.error('[HomeScreen] Error fetching beyond school topics:', error);
                        onNavigate('topicDetail', {
                          subjectName: beyondSchoolSubjectInfo.name,
                          isBeyondSchool: true,
                          initialTopicId: todaysBeyondSchoolNudge._id,
                          topicData: {
                            subject: beyondSchoolSubjectInfo.name,
                            topic: todaysBeyondSchoolNudge.topic || todaysBeyondSchoolNudge.title,
                            apiTopics: [todaysBeyondSchoolNudge],
                          },
                          allNudges: [{
                            subject: beyondSchoolSubjectInfo.name,
                            topic: todaysBeyondSchoolNudge.topic || todaysBeyondSchoolNudge.title,
                            apiTopic: todaysBeyondSchoolNudge,
                          }],
                        });
                      }
                    }
                  }}
                >
                  <View style={styles.cardLeftSection}>
                    <View style={styles.cardIcon}>
                      <MaterialIcon
                        name={beyondSchoolSubjectInfo.rnIcon || beyondSchoolSubjectInfo.icon || 'star-circle-outline'}
                        size={24}
                        color="#45a578"
                      />
                    </View>
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{todaysBeyondSchoolNudge.topic || todaysBeyondSchoolNudge.title}</Text>
                    <Text style={styles.cardDescription}>
                      {todaysBeyondSchoolNudge.description || 'Explore this life skill together'}
                    </Text>
                    <View style={styles.cardMeta}>
                      <Text style={styles.cardCategory}>{beyondSchoolSubjectInfo.name}  </Text>
                      {todaysBeyondSchoolNudge.title && (
                        <>
                          <Text style={styles.cardDot}>• </Text>
                          <Text style={styles.cardCategory}>{todaysBeyondSchoolNudge.title}</Text>
                        </>
                      )}
                    </View>
                  </View>
                  <Icon name="chevron-forward" size={24} color="#45a578" />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

 {/* Did You Know */}
        <View style={styles.section}>
          <View style={styles.didYouKnowCard}>
            <View style={styles.didYouKnowHeader}>
              <MaterialIcon name="lightbulb-on-outline" size={22} color="#1D4ED8" />
              <Text style={styles.didYouKnowTitle}>DID YOU KNOW?</Text>
            </View>
            {todaysFacts.map((item, index) => (
              <View key={item._id || item.id || index} style={[styles.didYouKnowFactBlock, index < todaysFacts.length - 1 && styles.didYouKnowFactDivider]}>
                <Text style={styles.didYouKnowFact}>{item.fact}</Text>
                <View style={styles.didYouKnowPromptRow}>
                  <MaterialIcon name="arrow-right" size={16} color="#2563EB" />
                  <Text style={styles.didYouKnowPrompt}>{item.prompt}</Text>
                </View>
                {item.source ? (
                  <Text style={styles.didYouKnowSource}>Source: {item.source}</Text>
                ) : null}
              </View>
            ))}
          </View>
        </View>
        {/* Weekly Streak */}
        <View style={styles.section}>
          <View style={styles.streakCard}>
            <View style={styles.streakTitleRow}>
              <MaterialIcon name="flash" size={24} color={weeklyImpact.activeDays >= 7 ? '#FFA500' : '#9CA3AF'} />
              <Text style={styles.streakTitle}>
                {weeklyImpact.activeDays >= 7 ? '7 Day Streak! 🎉' : `${weeklyImpact.activeDays} Day${weeklyImpact.activeDays !== 1 ? 's' : ''} Active`}
              </Text>
            </View>
            <Text style={styles.streakSubtitle}>
              {weeklyImpact.activeDays >= 7 
                ? 'Amazing! You\'re building consistent learning habits' 
                : weeklyImpact.activeDays > 0
                  ? 'Keep going! Build your learning streak'
                  : 'Start your learning streak today!'}
            </Text>
            <View style={styles.streakDays}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => {
                const hasActivity = weeklyImpact.streakDaysArray[index];
                return (
                  <View key={index} style={styles.streakDayContainer}>
                    <View style={[
                      styles.streakDay, 
                      hasActivity && styles.streakDayActive
                    ]}>
                      {hasActivity && (
                        <Icon name="checkmark" size={20} color="#FFFFFF" />
                      )}
                    </View>
                    <Text style={[
                      styles.streakDayLabel, 
                      hasActivity && styles.streakDayLabelActive
                    ]}>{day}</Text>
                  </View>
                );
              })}
            </View>
            <Text style={styles.streakMessage}>
              {weeklyImpact.daysRemaining === 0
                ? weeklyImpact.activeDays >= 7
                  ? 'Perfect week! You completed all 7 days! Keep up the amazing work 💛'
                  : 'Today is Sunday! Complete the week strong 💛'
                : weeklyImpact.daysRemaining === 1
                  ? 'Just 1 more day to complete the week! 💛'
                  : weeklyImpact.daysRemaining === 2
                    ? 'Just 2 more days to complete the week! 💛'
                    : weeklyImpact.daysRemaining === 3
                      ? '3 more days to complete the week! 💛'
                      : weeklyImpact.daysRemaining === 4
                        ? '4 more days to complete the week! 💛'
                        : weeklyImpact.daysRemaining === 5
                          ? '5 more days to complete the week! 💛'
                          : weeklyImpact.daysRemaining === 6
                            ? '6 more days to complete the week! 💛'
                            : 'Complete a topic today to start your streak! 💛'}
            </Text>
          </View>
        </View>

     
                {/* Today's Riddles */}
        {(() => {
          const fallbackRiddles = [
            { _id: 'r1', question: 'I have cities, but no houses live there. I have mountains, but no trees grow there. What am I?', answer: 'A map', hint: 'You might find me folded up in a car.' },
            { _id: 'r2', question: 'The more you take, the more you leave behind. What am I?', answer: 'Footsteps', hint: 'Think about what you create when you walk.' },
            { _id: 'r3', question: 'I speak without a mouth and hear without ears. I come alive with wind. What am I?', answer: 'An echo', hint: 'You might hear me in a canyon.' },
          ];
          const allRiddles = riddlesData.length > 0 ? riddlesData : fallbackRiddles;
          const displayedRiddles = allRiddles.slice(-3).reverse(); // last 3 added, newest first
          return (
            <View style={styles.section}>
              <View style={styles.riddlesCard}>
                <View style={styles.riddlesHeader}>
                  <MaterialIcon name="head-question" size={24} color="#000000" />
                  <Text style={styles.riddlesTitle}>TODAY'S RIDDLES</Text>
                  <View style={styles.riddlesBadge}>
                    <TouchableOpacity onPress={() => onNavigate && onNavigate('riddles', { riddles: allRiddles })}>
                      <Text style={styles.riddlesBadgeText}>Explore more</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.riddlesCarouselScroll}>
                  {displayedRiddles.map((riddle) => {
                    const id = riddle._id;
                    return (
                      <View key={id} style={styles.riddleItem}>
                        <Text style={styles.riddleQuestion}>{riddle.question}</Text>
                        {riddleHints[id] && !riddleAnswers[id] && (
                          <TouchableOpacity style={styles.riddleHintBox} onPress={() => setRiddleHints(p => ({ ...p, [id]: false }))}>
                            <Text style={styles.riddleHintText}>{riddle.hint || 'Think carefully!'}</Text>
                          </TouchableOpacity>
                        )}
                        {riddleAnswers[id] ? (
                          <TouchableOpacity style={styles.riddleAnswerBox} onPress={() => setRiddleAnswers(p => ({ ...p, [id]: false }))}>
                            <View style={styles.riddleAnswerLabelContainer}>
                              <MaterialIcon name="eye-off" size={18} color="#10B981" />
                              <Text style={styles.riddleAnswerLabel}>ANSWER</Text>
                            </View>
                            <Text style={styles.riddleAnswerText}>{riddle.answer}</Text>
                          </TouchableOpacity>
                        ) : (
                          <>
                            {riddle.hint && !riddleHints[id] && (
                              <TouchableOpacity style={styles.riddleNeedHintButton} onPress={() => setRiddleHints(p => ({ ...p, [id]: true }))}>
                                <Text style={styles.riddleNeedHintText}>Need a hint?</Text>
                              </TouchableOpacity>
                            )}
                            <TouchableOpacity style={styles.riddleRevealButton} onPress={() => setRiddleAnswers(p => ({ ...p, [id]: true }))}>
                              <Icon name="eye-outline" size={16} color="#999999" />
                              <Text style={styles.riddleRevealText}>Tap to reveal answer</Text>
                            </TouchableOpacity>
                          </>
                        )}
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            </View>
          );
        })()}

        {/* Laughing at Parenthood */}
       
        {/* <View style={styles.section}>
          <View style={styles.laughingCard}>
            <View style={styles.laughingHeader}>
              <Icon name="happy-outline" size={24} color="#45a578" />
              <Text style={styles.laughingTitle}>Laughing at parenthood</Text>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.laughingScroll}
            >
              <View style={styles.memeCard}>
                <Text style={styles.memeText}>
                  Me, when my kid is sleeping in till 10, playing video games with friends, and going to the water park, but I have to go to work.
                </Text>
                <Image 
                  source={require('../assets/images/memes1.png')}
                  style={styles.memeImage}
                  resizeMode="cover"
                />
              </View>

              <View style={styles.memeCard}>
                <Text style={styles.memeText}>
                  When you put your kid to bed 30 minutes ago, but they keep requesting water and the restroom.
                </Text>
                <Image 
                  source={require('../assets/images/meme2.png')}
                  style={styles.memeImage}
                  resizeMode="cover"
                />
              </View>

              <View style={styles.memeCard}>
                <Text style={styles.memeText}>
                  When your child asks "Why?" for the 100th time today and you're running out of answers.
                </Text>
                <Image 
                  source={require('../assets/images/meme3.png')}
                  style={styles.memeImage}
                  resizeMode="cover"
                />
              </View>

              <View style={styles.memeCard}>
                <Text style={styles.memeText}>
                  That moment when you finally get 5 minutes of peace and your child suddenly needs you urgently.
                </Text>
                <Image 
                  source={require('../assets/images/meme4.png')}
                  style={styles.memeImage}
                  resizeMode="cover"
                />
              </View>
            </ScrollView>
           
          </View>
        </View> */}

        {/* This Week's Impact */}
        <View style={styles.section}>
          <View style={styles.impactHeaderSection}>
            <View>
              <Text style={styles.impactMainTitle}>This Week's Impact</Text>
              <Text style={styles.impactSubtitle}>Your child's learning journey at a glance</Text>
            </View>
            <TouchableOpacity 
              style={styles.viewReportButton}
              onPress={() => onNavigate && onNavigate('learningProgress')}
            >
              <Text style={styles.viewReportText}>View Report</Text>
              <Icon name="arrow-forward" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.impactCardsRow}>
            {/* Completion Rate Card */}
            <View style={[styles.impactSmallCard, { backgroundColor: '#D5F5F6' }]}>
              <View style={[styles.impactCardIconContainer, { backgroundColor: '#FFFFFF' }]}>
                <MaterialIcon name="bullseye-arrow" size={18} color="#10B981" />
              </View>
              <Text style={styles.impactCardNumber}>{weeklyImpact.completionRate}%</Text>
              <Text style={styles.impactCardLabel}>Completion Rate</Text>
              {weeklyImpact.completionGrowth > 0 && (
                <View style={styles.impactCardGrowth}>
                  <Icon name="trending-up" size={12} color="#10B981" />
                  <Text style={styles.impactCardGrowthText}>+{weeklyImpact.completionGrowth}%</Text>
                </View>
              )}
            </View>

            {/* Active Days Card */}
            <View style={[styles.impactSmallCard, { backgroundColor: weeklyImpact.hasActivityToday ? '#FFEDD5' : '#F3F4F6' }]}>
              <View style={[styles.impactCardIconContainer, { backgroundColor: '#FFFFFF' }]}>
                <MaterialIcon name="lightning-bolt" size={18} color={weeklyImpact.hasActivityToday ? '#F59E0B' : '#9CA3AF'} />
              </View>
              <Text style={[styles.impactCardNumber, { color: weeklyImpact.hasActivityToday ? '#1F2937' : '#6B7280' }]}>{weeklyImpact.activeDays}/{weeklyImpact.totalDays}</Text>
              <Text style={[styles.impactCardLabel, { color: weeklyImpact.hasActivityToday ? '#1F2937' : '#9CA3AF' }]}>Active Days</Text>
              <Text style={[styles.impactCardSubtext, { color: weeklyImpact.hasActivityToday ? '#F59E0B' : '#9CA3AF' }]}>
                {weeklyImpact.hasActivityToday ? 'Active today!' : 'This week'}
              </Text>
            </View>

            {/* Best Subject Card */}
            <View style={[styles.impactSmallCard, { backgroundColor: '#E8E5F5' }]}>
              <View style={[styles.impactCardIconContainer, { backgroundColor: '#FFFFFF' }]}>
                <MaterialIcon name="medal" size={18} color="#8B5CF6" />
              </View>
              <Text style={styles.impactCardNumber}>{weeklyImpact.bestSubject}</Text>
              <Text style={styles.impactCardLabel}>Best Subject</Text>
              {weeklyImpact.bestSubjectScore > 0 && (
                <View style={styles.impactCardGrowth}>
                  <Icon name="arrow-up" size={12} color="#8B5CF6" />
                  <Text style={[styles.impactCardGrowthText, { color: '#8B5CF6' }]}>{weeklyImpact.bestSubjectScore}% avg</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Learning Subjects Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Nudge Library</Text>
              
            </View>
            <TouchableOpacity 
              style={styles.addMoreButton}
              onPress={() => onNavigate && onNavigate('subjectsList')}
            >
              <Text style={styles.addMoreText}>Browse All →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.subjectsGrid}>
            {(() => {
              // Filter API subjects to show only those the student enrolled in
              const studentSubjectLevels = child?.subjectLevels || {};
              const enrolledSubjectIds = Object.keys(studentSubjectLevels);
              
              console.log('[HomeScreen] Student subject levels:', studentSubjectLevels);
              console.log('[HomeScreen] Enrolled subject IDs:', enrolledSubjectIds);
              
              // Filter subjects by enrollment
              const enrolledSubjects = apiSubjects.filter(subject => 
                enrolledSubjectIds.includes(subject._id)
              );
              
              console.log('[HomeScreen] Enrolled subjects to display:', enrolledSubjects.map(s => s.name));
              
              // If no enrolled subjects, show empty state
              if (enrolledSubjects.length === 0) {
                return (
                  <View style={styles.emptySubjectsCard}>
                    <MaterialIcon name="book-open-variant" size={40} color="#9CA3AF" />
                    <Text style={styles.emptySubjectsTitle}>No subjects enrolled</Text>
                    <Text style={styles.emptySubjectsText}>
                      Visit Settings to select subjects for {child?.name || 'your child'}.
                    </Text>
                  </View>
                );
              }
              
              // Show up to 4 enrolled subjects
              return enrolledSubjects.slice(0, 4).map((subject, index) => {
                // Get the student's selected level for this subject
                const studentLevel = child?.subjectLevels?.[subject._id] || null;
                
                console.log(`[HomeScreen] Subject: ${subject.name}, Level: ${studentLevel}`);
                
                // Count topics for this subject from allTopicsFromApi
                const subjectTopics = allTopicsFromApi.filter(topic => 
                  String(topic.subjectId) === String(subject._id)
                );
                
                // Count topics that match the student's grade and level
                const childGrade = child?.grade;
                const topicsForStudent = subjectTopics.filter(topic => {
                  const gradeMatch = !topic.grade || !childGrade || topic.grade === childGrade;
                  const levelMatch = !topic.level || !studentLevel || topic.level === studentLevel;
                  return gradeMatch && levelMatch;
                });
                
                const activityCount = topicsForStudent.length;

                // Use API image if available, otherwise use default icon
                const hasApiImage = subject.imageUrl && subject.imageUrl.trim() !== '';
                
                const imageSource = hasApiImage 
                  ? { uri: getImageUri(subject.imageUrl) }
                  : null;

                return (
                  <TouchableOpacity 
                    key={subject._id}
                    style={styles.subjectImageCard}
                    onPress={() => {
                      onNavigate && onNavigate('subjectsList');
                    }}
                  >
                    <View style={[styles.subjectImageGradient, { backgroundColor: '#FFFFFF' }]}>
                      <View style={styles.subjectIconBox}>
                        {imageSource ? (
                          <Image 
                            source={imageSource}
                            style={styles.subjectImage}
                            resizeMode="contain"
                          />
                        ) : (
                          <MaterialIcon 
                            name="book-outline"
                            size={28}
                            color="#666666"
                          />
                        )}
                      </View>
                      
                      <View style={styles.subjectImageCardContent}>
                        <Text style={styles.subjectImageCardTitle}>{subject.name}</Text>
                        <Text style={styles.subjectImageCardActivityCount}>
                          {activityCount} {activityCount === 1 ? 'activity' : 'activities'}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              });
            })()}
          </View>

          {/* Unlock Premium Subjects Banner
          <TouchableOpacity 
            style={styles.unlockPremiumBanner}
            onPress={() => onNavigate && onNavigate('subscription')}
          >
            <View style={styles.unlockPremiumIconContainer}>
              <Icon name="lock-closed" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.unlockPremiumContent}>
              <Text style={styles.unlockPremiumTitle}>Unlock Premium Subjects</Text>
              <Text style={styles.unlockPremiumSubtitle}>Access Financial Literacy & AI courses</Text>
            </View>
            <View style={styles.unlockPremiumButton}>
              <Text style={styles.unlockPremiumButtonText}>Upgrade</Text>
            </View>
          </TouchableOpacity> */}
        </View>
  {/* For This Phase - Dynamic Card Carousel */}
        {(() => {
          const fallbackCards = [
            { _id: 'p1', title: 'Thinks like a philosopher', description: 'You help them learn when you... ask questions.', image: null },
            { _id: 'p2', title: 'Wants to know, "Why should I believe?"', description: 'You capture their heart when you... clarify their values.', image: null },
            { _id: 'p3', title: 'Is motivated by freedom.', description: 'You coach them when you... catch them doing something good.', image: null },
          ];
          const cards = (phaseCards.length > 0 ? phaseCards : fallbackCards).slice(-3).reverse();
          return (
            <View style={styles.section}>
              <View style={styles.phaseCardWrapper}>
                <View style={styles.phaseCardHeader}>
                  <View style={styles.phaseCardHeaderContent}>
                    <MaterialIcon name="lightning-bolt" size={24} color="#1A1A1A" />
                    <Text style={styles.phaseCardHeaderTitle}>For This Phase</Text>
                  </View>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.phaseCarouselScroll}>
                  {cards.map((card, idx) => (
                    <View key={card._id || idx} style={[styles.phaseCard, idx === cards.length - 1 && styles.phaseCardLast]}>
                      {card.image ? (
                        <Image source={{ uri: card.image }} style={styles.phaseCardImage} resizeMode="cover" />
                      ) : (
                        <Image source={require('../assets/images/phase 1.png')} style={styles.phaseCardImage} resizeMode="cover" />
                      )}
                      <View style={styles.phaseCardContent}>
                        <Text style={styles.phaseCardTitle}>{card.title}</Text>
                        {card.description ? <Text style={styles.phaseCardDescription}>{card.description}</Text> : null}
                      </View>
                    </View>
                  ))}
                </ScrollView>
                <View style={styles.phaseCarouselDots}>
                  {cards.map((_, idx) => (
                    <View key={idx} style={[styles.phaseDot, idx === 0 && styles.phaseDotActive]} />
                  ))}
                </View>
              </View>
            </View>
          );
        })()}
        {/* Parenting Tips */}
        {(() => {
          const fallbackInsight = { insight: 'The Power of "Why?"', tip: 'When your child asks "why?", resist the urge to give immediate answers. Instead, ask "What do you think?" This builds critical thinking and shows you value their ideas.' };
          const latest = parentingInsights.length > 0 ? parentingInsights[parentingInsights.length - 1] : fallbackInsight;
          return (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Today's Parenting Insight</Text>
              </View>
              <View style={styles.tipCard}>
                <MaterialIcon name="lightbulb-on-outline" size={28} color="#45a578" />
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>{latest.insight}</Text>
                  {latest.tip ? (
                    <Text style={styles.tipText}>{latest.tip}</Text>
                  ) : null}
                </View>
              </View>
            </View>
          );
        })()}

        {/* Coming Up - Dynamic from scheduled topics (filtered by student's enrolled subjects and levels) */}
        {upcomingTopics.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Coming Up</Text>
                <Text style={styles.sectionSubtitle}>Upcoming scheduled topics for your enrolled subjects</Text>
              </View>
            </View>

            <View style={styles.comingUpContainer}>
              {upcomingTopics.map((topic) => {
                // Find the subject for this topic
                const subject = apiSubjects.find(s => String(s._id) === String(topic.subjectId));
                const subjectName = subject?.name || topic.subjectName || 'Learning';
                
                return (
                  <View 
                    key={topic._id}
                    style={styles.comingUpItem}
                  >
                    <View style={styles.comingUpContent}>
                      <Text style={styles.comingUpTitle}>{topic.topic || topic.title}</Text>
                      <Text style={styles.comingUpSubject}>{subjectName}</Text>
                    </View>
                    <View style={styles.comingUpDateContainer}>
                      <View style={styles.comingUpDateBadge}>
                        <Icon name="calendar-outline" size={14} color="#FFFFFF" />
                        <Text style={styles.comingUpDateText}>{getDateLabel(topic.scheduledDate)}</Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

      

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Side Menu */}
      <Animated.View 
        style={[
          styles.sideMenu,
          { transform: [{ translateX: menuAnimation }] }
        ]}
      >
        <View style={styles.menuHeader}>
          <Text style={styles.menuTitle}>Menu</Text>
          <TouchableOpacity onPress={toggleMenu}>
            <Icon name="close" size={28} color="#333333" />
          </TouchableOpacity>
        </View>

        <View style={styles.menuItems}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => {
              toggleMenu();
            }}
          >
            <Icon name="home" size={24} color="#45a578" />
            <Text style={styles.menuItemText}>Home</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => {
              toggleMenu();
              if (onNavigate) onNavigate('subscription');
            }}
          >
            <MaterialIcon name="calendar-check" size={24} color="#45a578" />
            <Text style={styles.menuItemText}>Subscription Plan</Text>
          </TouchableOpacity> */}

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => {
              toggleMenu();
              if (onNavigate) onNavigate('learningProgress');
            }}
          >
            <MaterialIcon name="chart-line" size={24} color="#45a578" />
            <Text style={styles.menuItemText}>Progress</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => {
              toggleMenu();
              if (onNavigate) onNavigate('assessmentHub');
            }}
          >
            <MaterialIcon name="file-document-outline" size={24} color="#45a578" />
            <Text style={styles.menuItemText}>Create Quiz</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => {
              toggleMenu();
              if (onNavigate) onNavigate('milestones');
            }}
          >
            <MaterialIcon name="trophy-outline" size={24} color="#45a578" />
            <Text style={styles.menuItemText}>Milestones</Text>
          </TouchableOpacity> */}

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => {
              toggleMenu();
              if (onNavigate) onNavigate('subjectsList');
            }}
          >
            <MaterialIcon name="book-open-variant" size={24} color="#45a578" />
            <Text style={styles.menuItemText}>Nudge Library</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => {
              toggleMenu();
              if (onNavigate) onNavigate('settings');
            }}
          >
            <Icon name="settings" size={24} color="#45a578" />
            <Text style={styles.menuItemText}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => {
              toggleMenu();
              if (onNavigate) onNavigate('helpSupport');
            }}
          >
            <Icon name="help-circle" size={24} color="#45a578" />
            <Text style={styles.menuItemText}>Help & Support</Text>
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity 
            style={[styles.menuItem, styles.logoutItem]}
            onPress={() => {
              toggleMenu();
              if (onNavigate) onNavigate('logout');
            }}
          >
            <Icon name="log-out-outline" size={24} color="#FF6B6B" />
            <Text style={[styles.menuItemText, styles.logoutText]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Overlay */}
      {menuVisible && (
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1} 
          onPress={toggleMenu}
        />
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },

  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#45a578',
    flex: 1,
    textAlign: 'center',
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  notificationButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#27AE60',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },

  notificationBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#4B5563',
  },

  avatar: {
    width: '100%',
    height: '100%',
  },

  content: {
    flex: 1,
  },

  welcomeSection: {
    padding: 10,
    backgroundColor: '#FFFFFF',
    marginBottom: 0,
  },

  welcomeText: {
    fontSize: isTablet ? 20 : isSmallDevice ? 18 : 19,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },

  subtitleText: {
    fontSize: isTablet ? 15 : isSmallDevice ? 13 : 14,
    color: '#666666',
    lineHeight: isTablet ? 22 : isSmallDevice ? 19 : 20,
  },

  quickActionBanner: {
    backgroundColor: '#FFF9E6',
    marginHorizontal: 20,
    marginBottom: 0,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE4A3',
    flexDirection: 'row',
    alignItems: 'center',
  },

  quickActionSection: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    marginBottom: 0,
  },

  quickActionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  quickActionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },

  quickActionDescription: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 18,
  },

  quickActionClose: {
    padding: 4,
  },

  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 8,
    gap: 4,
  },

  featuredBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFB84D',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  featuredCard: {
    backgroundColor: '#F0F8FF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#4A90E2',
    overflow: 'hidden',
  },

  featuredContent: {
    padding: 18,
  },

  featuredHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  featuredIconLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  featuredInfo: {
    flex: 1,
  },

  featuredTitle: {
    fontSize: isTablet ? 19 : isSmallDevice ? 16 : 17,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 4,
  },

  featuredSubtitle: {
    fontSize: isTablet ? 14 : isSmallDevice ? 12 : 13,
    color: '#666666',
    fontStyle: 'italic',
  },

  featuredDescription: {
    fontSize: isTablet ? 15 : isSmallDevice ? 13 : 14,
    color: '#444444',
    lineHeight: isTablet ? 22 : isSmallDevice ? 19 : 20,
    marginBottom: 12,
  },

  featuredMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },

  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },

  metaChipText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },

  featuredButton: {
    marginTop: 2,
  },

  featuredButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },

  featuredButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // ── Featured Nudge Modal ────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    maxHeight: '55%',
    paddingTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 12,
  },

  modalCloseBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  modalScrollContent: {
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 2,
    paddingBottom: 20,
  },

  modalIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },

  modalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    marginBottom: 6,
  },

  modalBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFB84D',
  },

  modalTitle: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 4,
    fontFamily: 'Montserrat-Bold',
  },

  modalSubtitle: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginBottom: 8,
    fontStyle: 'italic',
  },

  modalMetaRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  modalMetaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 3,
  },

  modalMetaText: {
    fontSize: 11,
    color: '#555',
    fontWeight: '500',
  },

  modalSection: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },

  modalSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },

  modalSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },

  modalDesc: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 20,
  },

  modalLoadingBox: {
    paddingVertical: 24,
    alignItems: 'center',
    gap: 10,
  },

  modalLoadingText: {
    fontSize: 13,
    color: '#9CA3AF',
  },

  modalDetailSection: {
    width: '100%',
    marginBottom: 16,
  },

  modalDetailTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
    lineHeight: 28,
  },

  modalDetailSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 22,
  },

  modalDetailDesc: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 8,
  },

  modalDetailHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#45a578',
    marginTop: 10,
    marginBottom: 8,
  },

  modalPointsList: {
    gap: 6,
  },

  modalPointItem: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
    paddingLeft: 4,
  },

  modalGoBtn: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 4,
  },

  modalGoBtnGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalGoBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  section: {
    padding: 10,
    backgroundColor: '#FFFFFF',
    marginBottom: 0,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: isTablet ? 22 : isSmallDevice ? 18 : 20,
    fontWeight: '700',
    color: '#333333',
    fontFamily: 'Montserrat-Bold',
  },

  sectionSubtitle: {
    fontSize: 12,
    color: '#999999',
    marginTop: 2,
    fontFamily: 'Montserrat-Regular',
  },

  seeAllText: {
    fontSize: 14,
    color: '#45a578',
    fontWeight: '600',
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  cardLeftSection: {
    alignItems: 'center',
    marginRight: 12,
  },

  cardTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },

  cardTimeLeft: {
    fontSize: 11,
    color: '#999999',
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    fontSize: isTablet ? 18 : isSmallDevice ? 15 : 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },

  cardDescription: {
    fontSize: isTablet ? 15 : isSmallDevice ? 13 : 14,
    color: '#666666',
    lineHeight: isTablet ? 22 : isSmallDevice ? 19 : 20,
  },

  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },

  emptyNudgesCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  emptyNudgesTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
    marginTop: 4,
  },
  emptyNudgesText: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },

  emptySubjectsCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 24,
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  emptySubjectsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
    marginTop: 4,
  },
  emptySubjectsText: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },

  cardTimeSpacer: {
    flex: 1,
  },

  cardTime: {
    fontSize: 12,
    color: '#999999',
  },

  cardDot: {
    fontSize: 12,
    color: '#999999',
    marginHorizontal: 6,
  },

  cardCategory: {
    fontSize: 12,
    color: '#45a578',
    fontWeight: '600',
  },

  cardDot: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '600',
  },

  cardChapter: {
    fontSize: 12,
    color: '#45a578',
    fontWeight: '600',
  },

  // Beyond School card styles (no extra styling — matches normal card)
  cardChapterLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    paddingLeft: 38,
  },

  cardHierarchy: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },

  cardHierarchyText: {
    fontSize: 11,
    color: '#666666',
    fontStyle: 'italic',
  },

  streakCard: {
    backgroundColor: '#FFEDD5',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 0,
    marginTop: -10,
    borderWidth: 2,
    borderColor: '#FDBA74',
  },

  streakTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },

  streakTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'Montserrat-Bold',
  },

  streakSubtitle: {
    fontSize: 15,
    color: '#555555',
    marginBottom: 14,
    fontFamily: 'Montserrat-Regular',
    lineHeight: 20,
  },

  streakMessage: {
    fontSize: 14,
    color: '#555555',
    marginTop: 12,
    fontFamily: 'Montserrat-Regular',
    lineHeight: 20,
  },

  streakDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  streakDayContainer: {
    alignItems: 'center',
    gap: 6,
  },

  streakDay: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  streakDayActive: {
    backgroundColor: '#faac6cff',
  },

  streakDayLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#999999',
    fontFamily: 'Montserrat-Medium',
    textAlign: 'center',
  },

  streakDayLabelActive: {
    color: '#f5a05aff',
    fontWeight: '600',
  },

  currentStreakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  currentStreakText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666666',
    fontFamily: 'Montserrat-SemiBold',
  },

  currentStreakDays: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333333',
    marginLeft: 'auto',
    fontFamily: 'Montserrat-Bold',
  },

  impactHeaderSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: isSmallDevice ? 14 : 16,
  },

  impactMainTitle: {
    fontSize: isTablet ? 20 : isSmallDevice ? 17 : 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
    fontFamily: 'Montserrat-Bold',
  },

  impactSubtitle: {
    fontSize: isTablet ? 13 : isSmallDevice ? 11 : 12,
    color: '#6B7280',
    fontFamily: 'Montserrat-Regular',
  },

  viewReportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: isSmallDevice ? 14 : 16,
    paddingVertical: isSmallDevice ? 8 : 10,
    borderRadius: isSmallDevice ? 10 : 12,
    gap: 6,
  },

  viewReportText: {
    fontSize: isTablet ? 14 : isSmallDevice ? 12 : 13,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Montserrat-SemiBold',
  },

  impactCardsRow: {
    flexDirection: 'row',
    gap: isSmallDevice ? 8 : 10,
  },

  impactSmallCard: {
    flex: 1,
    borderRadius: isSmallDevice ? 12 : 14,
    padding: isSmallDevice ? 10 : 12,
    minHeight: isSmallDevice ? 90 : 100,
  },

  impactCardIconContainer: {
    width: isSmallDevice ? 26 : 28,
    height: isSmallDevice ? 26 : 28,
    borderRadius: isSmallDevice ? 13 : 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: isSmallDevice ? 6 : 8,
  },

  impactCardNumber: {
    fontSize: isTablet ? 20 : isSmallDevice ? 16 : 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 3,
    fontFamily: 'Montserrat-Bold',
  },

  impactCardLabel: {
    fontSize: isTablet ? 12 : isSmallDevice ? 10 : 11,
    color: '#6B7280',
    fontWeight: '500',
    fontFamily: 'Montserrat-Medium',
  },

  impactCardSubtext: {
    fontSize: isTablet ? 11 : isSmallDevice ? 9 : 10,
    color: '#9CA3AF',
    marginTop: 2,
    fontFamily: 'Montserrat-Regular',
  },

  impactCardGrowth: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },

  impactCardGrowthText: {
    fontSize: isTablet ? 12 : isSmallDevice ? 10 : 11,
    fontWeight: '600',
    color: '#10B981',
    fontFamily: 'Montserrat-SemiBold',
  },

  impactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  impactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },

  impactHeaderText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
    fontFamily: 'Montserrat-Bold',
  },

  fullReportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  fullReportText: {
    fontSize: 14,
    color: '#45a578',
    fontWeight: '600',
    fontFamily: 'Montserrat-SemiBold',
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginBottom: 16,
  },

  statCard: {
    width: '50%',
    paddingHorizontal: 6,
    marginBottom: 12,
  },

  statCardInner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minHeight: 140,
    justifyContent: 'space-between',
  },

  statIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },

  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 4,
    fontFamily: 'Montserrat-Bold',
  },

  statLabel: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: 'Montserrat-Medium',
    lineHeight: 16,
  },

  statBadgeGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 3,
    marginTop: 5,
  },

  statChangeGreen: {
    fontSize: 10,
    color: '#45a578',
    fontWeight: '700',
    fontFamily: 'Montserrat-Bold',
  },

  statBadgeOrange: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 3,
    marginTop: 5,
  },

  statChangeOrange: {
    fontSize: 10,
    color: '#FF9800',
    fontWeight: '700',
    fontFamily: 'Montserrat-Bold',
  },

  statBadgeBlue: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 3,
    marginTop: 5,
  },

  statChangeBlue: {
    fontSize: 10,
    color: '#2196F3',
    fontWeight: '700',
    fontFamily: 'Montserrat-Bold',
  },

  statBadgePink: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCE4EC',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 3,
    marginTop: 5,
  },

  statChangePink: {
    fontSize: 10,
    color: '#27AE60',
    fontWeight: '700',
    fontFamily: 'Montserrat-Bold',
  },

  statIconLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  statIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  statSubtext: {
    fontSize: 12,
    color: '#999999',
    fontFamily: 'Montserrat-Regular',
  },

  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },

  statChange: {
    fontSize: 11,
    color: '#45a578',
    fontWeight: '600',
    fontFamily: 'Montserrat-SemiBold',
  },

  impactInsight: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBF0',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#FFE8B3',
  },

  impactInsightText: {
    flex: 1,
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    fontFamily: 'Montserrat-Regular',
  },

  topicCount: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
  },

  topicProgress: {
    width: '100%',
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },

  topicProgressBar: {
    height: '100%',
    backgroundColor: '#45a578',
    borderRadius: 2,
  },

  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },

  tipContent: {
    flex: 1,
    marginLeft: 16,
  },

  tipTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },

  tipText: {
    fontSize: 14,
    color: '#444444',
    lineHeight: 22,
    marginBottom: 12,
  },

  tipButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
  },

  tipButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#45a578',
  },

  progressCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  // Learning Subjects with Image Cards
  subjectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  addMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: isSmallDevice ? 10 : 12,
    paddingVertical: isSmallDevice ? 6 : 8,
    borderRadius: isSmallDevice ? 8 : 10,
    gap: 4,
  },

  addMoreText: {
    fontSize: isTablet ? 14 : isSmallDevice ? 12 : 13,
    fontWeight: '700',
    color: '#45a578',
    fontFamily: 'Montserrat-Bold',
  },

  subjectImageCard: {
    width: '48.5%',
    backgroundColor: 'transparent',
    borderRadius: isSmallDevice ? 14 : 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: isSmallDevice ? 12 : 16,
  },

  subjectImageGradient: {
    height: isSmallDevice ? 150 : 170,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: isSmallDevice ? 14 : 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: isSmallDevice ? 16 : 20,
    flexDirection: 'column',
  },

  subjectIconBox: {
    width: isSmallDevice ? 56 : 64,
    height: isSmallDevice ? 56 : 64,
    borderRadius: isSmallDevice ? 12 : 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: isSmallDevice ? 12 : 14,
    backgroundColor: 'transparent',
  },

  subjectImage: {
    width: '100%',
    height: '100%',
  },

  subjectAccentShape: {
    position: 'absolute',
    bottom: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    opacity: 0.25,
  },

  subjectImageCardContent: {
    zIndex: 10,
    width: '100%',
    alignItems: 'center',
  },

  subjectImageCardTitle: {
    fontSize: isTablet ? 16 : isSmallDevice ? 14 : 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
  },

  subjectImageCardActivityCount: {
    fontSize: isTablet ? 13 : isSmallDevice ? 12 : 13,
    color: '#9CA3AF',
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
  },

  subjectProgressBarBg: {
    height: isSmallDevice ? 5 : 6,
    backgroundColor: '#E5E7EB',
    borderRadius: isSmallDevice ? 2.5 : 3,
    overflow: 'hidden',
    marginBottom: 8,
  },

  subjectProgressBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: isSmallDevice ? 4 : 5,
  },

  // Unlock Premium Banner
  unlockPremiumBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
    borderRadius: isSmallDevice ? 10 : 12,
    padding: isSmallDevice ? 10 : 12,
    marginTop: isSmallDevice ? 12 : 14,
    gap: isSmallDevice ? 10 : 12,
  },

  unlockPremiumIconContainer: {
    width: isSmallDevice ? 40 : 44,
    height: isSmallDevice ? 40 : 44,
    borderRadius: isSmallDevice ? 20 : 22,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  unlockPremiumContent: {
    flex: 1,
  },

  unlockPremiumTitle: {
    fontSize: isTablet ? 14 : isSmallDevice ? 12 : 13,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
    fontFamily: 'Montserrat-Bold',
  },

  unlockPremiumSubtitle: {
    fontSize: isTablet ? 11 : isSmallDevice ? 9 : 10,
    color: '#6B7280',
    fontFamily: 'Montserrat-Regular',
  },

  unlockPremiumButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: isSmallDevice ? 12 : 16,
    paddingVertical: isSmallDevice ? 6 : 8,
    borderRadius: isSmallDevice ? 8 : 10,
  },

  unlockPremiumButtonText: {
    fontSize: isTablet ? 13 : isSmallDevice ? 11 : 12,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
  },

  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  topicCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  topicIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },

  topicName: {
    fontSize: isTablet ? 20 : 15,
    fontWeight: '700',
    color: '#333333',
    marginTop: 0,
    marginBottom: 2,
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
  },

  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  activityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 6,
    marginRight: 12,
  },

  activityContent: {
    flex: 1,
  },

  activityTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 6,
  },

  activityDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 6,
  },

  activityTime: {
    fontSize: 12,
    color: '#999999',
  },

  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },

  viewAllButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#45a578',
  },

  // Coming Up styles
  comingUpContainer: {
    gap: 8,
  },

  comingUpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  comingUpIconContainer: {
    marginRight: 12,
  },

  comingUpIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  comingUpContent: {
    flex: 1,
  },

  comingUpTitle: {
    fontSize: isTablet ? 16 : 15,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 4,
    fontFamily: 'Montserrat-Bold',
  },

  comingUpSubject: {
    fontSize: isTablet ? 13 : 12,
    color: '#666666',
    fontFamily: 'Montserrat-Regular',
  },

  comingUpDateContainer: {
    marginLeft: 8,
  },

  comingUpDateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },

  comingUpDateText: {
    fontSize: isTablet ? 12 : 11,
    color: '#FFFFFF',
    fontWeight: '600',
    fontFamily: 'Montserrat-SemiBold',
  },

  bottomPadding: {
    height: 40,
  },

  sideMenu: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: width * 0.75,
    backgroundColor: '#FFFFFF',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },

  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },

  menuTitle: {
    fontSize: isTablet ? 26 : 22,
    fontWeight: '700',
    color: '#333333',
    fontFamily: 'Montserrat-Bold',
  },

  menuItems: {
    paddingTop: 20,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },

  menuItemText: {
    fontSize: isTablet ? 20 : 17,
    color: '#333333',
    marginLeft: 16,
    fontWeight: '600',
    fontFamily: 'Montserrat-SemiBold',
  },

  logoutItem: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },

  logoutText: {
    color: '#FF6B6B',
  },

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },

  // Did You Know styles
  didYouKnowCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },

  didYouKnowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },

  didYouKnowTitle: {
    fontSize: isTablet ? 18 : isSmallDevice ? 15 : 16,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 0.5,
    fontFamily: 'Montserrat-Bold',
  },

  didYouKnowFact: {
    fontSize: isTablet ? 16 : isSmallDevice ? 14 : 15,
    color: '#333333',
    lineHeight: isTablet ? 24 : isSmallDevice ? 21 : 22,
    marginBottom: 10,
    fontFamily: 'Montserrat-Regular',
  },

  didYouKnowQuestion: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    gap: 8,
  },

  didYouKnowQuestionText: {
    flex: 1,
    fontSize: isTablet ? 15 : isSmallDevice ? 13 : 14,
    color: '#45a578',
    fontFamily: 'Montserrat-Medium',
    fontWeight: '500',
  },

  didYouKnowSource: {
    fontSize: isTablet ? 14 : isSmallDevice ? 12 : 13,
    color: '#666666',
    fontStyle: 'italic',
    fontFamily: 'Montserrat-Regular',
  },

  // Riddles styles
  riddlesCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  riddlesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },

  riddlesTitle: {
    fontSize: isTablet ? 18 : isSmallDevice ? 15 : 16,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 0.5,
    flex: 1,
    fontFamily: 'Montserrat-Bold',
  },

  riddlesBadge: {
    backgroundColor: '#45a578',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  riddlesBadgeText: {
    fontSize: isTablet ? 14 : isSmallDevice ? 12 : 13,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
  },

  riddlesCarouselScroll: {
    marginBottom: 0,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },

  riddleItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    minWidth: 240,
    maxWidth: 240,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  riddleQuestion: {
    fontSize: isTablet ? 14 : isSmallDevice ? 12 : 13,
    color: '#1A1A1A',
    lineHeight: isTablet ? 20 : isSmallDevice ? 18 : 19,
    marginBottom: 12,
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '600',
    flexWrap: 'wrap',
  },

  riddleHint: {
    fontSize: isTablet ? 15 : isSmallDevice ? 13 : 14,
    color: '#666666',
    fontStyle: 'italic',
    marginBottom: 10,
    fontFamily: 'Montserrat-Regular',
  },

  riddleNeedHintButton: {
    alignSelf: 'flex-start',
    marginTop: 12,
    marginBottom: 12,
  },

  riddleNeedHintText: {
    fontSize: isTablet ? 14 : isSmallDevice ? 12 : 13,
    color: '#10B981',
    fontWeight: '600',
    fontFamily: 'Montserrat-SemiBold',
  },

  riddleRevealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },

  riddleRevealText: {
    fontSize: isTablet ? 13 : isSmallDevice ? 11 : 12,
    color: '#888888',
    fontFamily: 'Montserrat-Regular',
    fontWeight: '500',
  },

  riddleHintBox: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    padding: 0,
    marginBottom: 12,
    borderLeftWidth: 0,
    borderLeftColor: 'transparent',
  },

  riddleHintText: {
    fontSize: 13,
    color: '#999999',
    lineHeight: 18,
    fontFamily: 'Montserrat-Regular',
    fontStyle: 'italic',
    marginBottom: 12,
  },

  riddleAnswerBox: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    padding: 0,
    borderWidth: 0,
    borderColor: 'transparent',
    marginBottom: 12,
  },

  riddleAnswerLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },

  riddleAnswerLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10B981',
    letterSpacing: 2,
    fontFamily: 'Montserrat-Bold',
  },

  riddleAnswerText: {
    fontSize: 18,
    color: '#1A1A1A',
    fontWeight: '600',
    fontFamily: 'Montserrat-SemiBold',
  },

  riddleAnswerContainer: {
    display: 'none',
  },

  riddleAnswerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },

  riddleAnswerLabel: {
    fontSize: isTablet ? 14 : isSmallDevice ? 12 : 13,
    fontWeight: '700',
    color: '#45a578',
    letterSpacing: 1,
    fontFamily: 'Montserrat-Bold',
  },

  riddleAnswerText: {
    fontSize: isTablet ? 17 : isSmallDevice ? 15 : 16,
    color: '#333333',
    fontWeight: '600',
    fontFamily: 'Montserrat-SemiBold',
  },

  // Did You Know styles
  didYouKnowCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },

  didYouKnowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },

  didYouKnowTitle: {
    fontSize: isTablet ? 15 : 13,
    fontWeight: '800',
    color: '#1E40AF',
    letterSpacing: 1,
    fontFamily: 'Montserrat-Bold',
  },

  didYouKnowFactBlock: {
    paddingBottom: 14,
    marginBottom: 2,
  },

  didYouKnowFactDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#BFDBFE',
    marginBottom: 14,
  },

  didYouKnowFact: {
    fontSize: isTablet ? 15 : 14,
    color: '#1A1A1A',
    lineHeight: 22,
    marginBottom: 10,
    fontFamily: 'Montserrat-Regular',
    fontWeight: '500',
  },

  didYouKnowPromptRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },

  didYouKnowPrompt: {
    flex: 1,
    fontSize: isTablet ? 14 : 13,
    color: '#1A1A1A',
    lineHeight: 20,
    fontFamily: 'Montserrat-Italic',
    fontWeight: '500',
    fontStyle: 'italic',
  },

  didYouKnowSource: {
    fontSize: 11,
    color: '#9CA3AF',
    fontStyle: 'italic',
    fontFamily: 'Montserrat-Regular',
  },

  // Laughing at Parenthood styles
  laughingCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFE4A3',
  },

  laughingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },

  laughingTitle: {
    fontSize: isTablet ? 19 : isSmallDevice ? 17 : 18,
    fontWeight: '700',
    color: '#333333',
    fontFamily: 'Montserrat-Bold',
  },

  laughingScroll: {
    marginBottom: 8,
  },

  memeCard: {
    width: 280,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  memeText: {
    fontSize: isTablet ? 16 : isSmallDevice ? 14 : 15,
    color: '#333333',
    lineHeight: isTablet ? 22 : isSmallDevice ? 20 : 21,
    marginBottom: 10,
    fontFamily: 'Montserrat-Regular',
  },

  memePlaceholder: {
    width: '100%',
    height: 180,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },

  memeImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
  },

  memePlaceholderText: {
    fontSize: isTablet ? 16 : 14,
    color: '#999999',
    marginTop: 8,
    fontFamily: 'Montserrat-Regular',
  },

  laughingNote: {
    fontSize: isTablet ? 16 : 14,
    color: '#666666',
    fontStyle: 'italic',
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
  },

  // For This Phase - 3 Card Carousel
  phaseCardWrapper: {
    backgroundColor: '#E3F2FD',
    borderRadius: 20,
    overflow: 'hidden',
    marginHorizontal: 0,
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },

  phaseCardHeader: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 0,
  },

  phaseCardHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  phaseCardHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'Montserrat-Bold',
    letterSpacing: 0.3,
  },

  phaseCarouselScroll: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    paddingRight: 30,
    backgroundColor: '#E3F2FD',
  },

  phaseCard: {
    width: 240,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginRight: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#D8D8D8',
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },

  phaseCardLast: {
    marginRight: 30,
  },

  phaseCardImage: {
    width: '100%',
    height: 160,
  },

  phaseCardImageArea: {
    display: 'none',
  },

  phaseCardContent: {
    padding: 18,
    backgroundColor: '#FFFFFF',
    marginTop: 0,
  },

  phaseCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    fontFamily: 'Montserrat-Bold',
    lineHeight: 22,
  },

  phaseCardDescription: {
    fontSize: 13,
    color: '#777777',
    lineHeight: 19,
    fontFamily: 'Montserrat-Regular',
  },

  phaseCarouselDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    backgroundColor: '#E3F2FD',
    borderTopWidth: 0,
  },

  phaseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D8D8D8',
  },

  phaseDotActive: {
    backgroundColor: '#4A90E2',
    width: 24,
  },
});
