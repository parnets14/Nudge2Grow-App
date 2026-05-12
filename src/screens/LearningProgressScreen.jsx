/**
 * Learning Progress Screen - Learning Summary with Weekly/Monthly data
 * 
 * WEEKLY-BASED SUBJECT BREAKDOWN:
 * - Tracks student performance by subject, level, and topics
 * - Weekly view: Shows topics completed in the last 7 days
 * - Monthly view: Shows all completed topics
 * - Subject breakdown dynamically generated based on:
 *   1. Student's enrolled subjects (from userData.children[0].subjects)
 *   2. Subject levels (from userData.children[0].subjectLevels)
 *   3. Completed topics (from completedTopics Set with format "SubjectName::TopicName")
 * - Progress calculated as: (completed topics / estimated total) * 100
 * - Growth percentage shows improvement trend
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Svg, { Circle, Polyline } from 'react-native-svg';
import { fetchAvatars, fetchSubjects, fetchTopicsBySubject, fetchBeyondSchool, fetchBeyondSchoolTopicsBySubject } from '../api';

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
          fontWeight: '1000',
          color: color,
          fontFamily: 'Montserrat-Bold',
        }}>
          {percentage}%
        </Text>
      </View>
    </View>
  );
};

const LearningProgressScreen = ({ userData, onBack, onNavigate, completedTopics = new Set() }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');
  const [selectedBar, setSelectedBar] = useState(null);
  const [showAllKnownTopics, setShowAllKnownTopics] = useState(false);
  const [showAllPracticeTopics, setShowAllPracticeTopics] = useState(false);
  const [apiAvatars, setApiAvatars] = useState([]); // { id, uri } from admin panel
  const [subjectTopicsMap, setSubjectTopicsMap] = useState({}); // Store actual topic counts
  const [topicsLoaded, setTopicsLoaded] = useState(false);
  const [apiSubjects, setApiSubjects] = useState([]); // Store subjects from API
  const [beyondSchoolSubjects, setBeyondSchoolSubjects] = useState([]); // Beyond school subjects
  const [beyondSchoolTopicsMap, setBeyondSchoolTopicsMap] = useState({}); // Beyond school topics by subject name

  useEffect(() => {
    fetchAvatars()
      .then(data => { if (data.length > 0) setApiAvatars(data.map(a => ({ id: a._id, uri: a.image }))); })
      .catch(() => {});
  }, []);

  const child = userData?.children?.[0];

  // Fetch actual topics from API for accurate counts
  useEffect(() => {
    const loadTopics = async () => {
      try {
        const subjects = await fetchSubjects();
        console.log('[LearningProgress] Fetched subjects from API:', subjects);
        setApiSubjects(subjects); // Store subjects for name lookup
        
        const topicsMap = {};
        const subjectsByIdMap = {}; // Map _id to subject object
        
        // Create a map of subject _id to subject object
        subjects.forEach(subject => {
          subjectsByIdMap[subject._id] = subject;
        });
        
        // Fetch all topics
        const allTopics = await fetchTopicsBySubject(); // Get all topics
        console.log('[LearningProgress] Fetched all topics:', allTopics.length);
        
        // Group topics by subject name
        subjects.forEach(subject => {
          const subjectTopics = allTopics.filter(t => 
            String(t.subjectId) === String(subject._id)
          );
          topicsMap[subject.name] = subjectTopics;
          console.log(`[LearningProgress] ${subject.name}: ${subjectTopics.length} topics`);
        });
        
        setSubjectTopicsMap(topicsMap);
        setTopicsLoaded(true);
      } catch (error) {
        console.error('Error loading topics:', error);
        setTopicsLoaded(true); // Set to true even on error to show UI
      }
    };
    
    loadTopics();
  }, []);

  // Fetch Beyond School subjects + topics for the enrolled child
  useEffect(() => {
    const loadBeyondSchool = async () => {
      try {
        const childTopics = child?.topics || [];
        if (childTopics.length === 0) return;

        const allBeyond = await fetchBeyondSchool().catch(() => []);
        const enrolled = allBeyond.filter(s => childTopics.includes(String(s._id)));
        setBeyondSchoolSubjects(enrolled);

        const topicsMap = {};
        await Promise.all(
          enrolled.map(async s => {
            const topics = await fetchBeyondSchoolTopicsBySubject(s._id).catch(() => []);
            topicsMap[s.name] = topics;
          })
        );
        setBeyondSchoolTopicsMap(topicsMap);
      } catch (err) {
        console.error('[LearningProgress] Error loading beyond school:', err);
      }
    };

    loadBeyondSchool();
  }, [child?.topics]);

  // Calculate subject-wise performance based on completed topics with weekly tracking
  const calculateSubjectPerformance = () => {
    const subjectStats = {};
    const now = new Date();
    
    // Get the start of current week (MONDAY to SUNDAY)
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1; // If Sunday, go back 6 days to Monday
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - daysFromMonday);
    startOfWeek.setHours(0, 0, 0, 0);
    
    console.log('[LearningProgress] Current date:', now.toISOString());
    console.log('[LearningProgress] Start of week (Monday):', startOfWeek.toISOString());
    
    // Parse completedTopics to extract subject and topic information
    completedTopics.forEach(topicKey => {
      // topicKey format: "SubjectName::TopicName" or "SubjectName::TopicName::timestamp"
      const parts = topicKey.split('::');
      if (parts.length >= 2) {
        const subjectName = parts[0];
        const topicName = parts[1];
        
        // Try to extract timestamp if available (for weekly filtering)
        let timestamp = null;
        if (parts.length >= 3 && !isNaN(parts[2])) {
          timestamp = new Date(parseInt(parts[2]));
        }
        
        if (!subjectStats[subjectName]) {
          subjectStats[subjectName] = {
            completed: 0,
            completedThisWeek: 0,
            total: 0,
            topics: new Set(),
            weeklyTopics: new Set()
          };
        }
        
        // Always count for overall
        subjectStats[subjectName].completed++;
        subjectStats[subjectName].topics.add(topicName);
        
        // Track weekly completion - only count if completed this week (Monday onwards)
        if (!timestamp || timestamp >= startOfWeek) {
          subjectStats[subjectName].completedThisWeek++;
          subjectStats[subjectName].weeklyTopics.add(topicName);
          console.log(`[LearningProgress] ${subjectName}::${topicName} completed this week`);
        } else {
          console.log(`[LearningProgress] ${subjectName}::${topicName} completed before this week (${timestamp?.toISOString()})`);
        }
      }
    });
    
    console.log('[LearningProgress] Subject stats:', subjectStats);
    
    return subjectStats;
  };

  // Calculate user activity metrics
  const calculateActivityMetrics = () => {
    const completedCount = completedTopics.size;
    
    // Get activity from last 7 days (you can enhance this with actual timestamp tracking)
    const metrics = {
      completedTopics: completedCount,
      isActive: completedCount > 0,
      isOnFire: completedCount >= 5, // Completed 5+ topics
      isTopPerformer: completedCount >= 10, // Completed 10+ topics
    };
    
    return metrics;
  };

  const activityMetrics = calculateActivityMetrics();
  const subjectPerformance = calculateSubjectPerformance();

  // Determine user status based on activity
  const getUserStatus = () => {
    if (activityMetrics.completedTopics === 0) {
      return 'New Learner';
    } else if (activityMetrics.completedTopics < 3) {
      return 'Getting Started';
    } else if (activityMetrics.completedTopics < 10) {
      return 'Active Learner';
    } else {
      return 'Super Learner';
    }
  };

  // Get dynamic badges based on activity
  const getUserBadges = () => {
    const badges = [];
    
    if (activityMetrics.isOnFire) {
      badges.push({ emoji: '🔥', text: 'On Fire!', color: '#FED7AA' });
    }
    
    if (activityMetrics.isTopPerformer) {
      badges.push({ emoji: '⭐', text: 'Top Performer', color: '#EDE9FE' });
    }
    
    if (activityMetrics.completedTopics >= 20) {
      badges.push({ emoji: '🏆', text: 'Champion', color: '#FEF3C7' });
    }
    
    // If no badges earned yet, show encouraging badge
    if (badges.length === 0 && activityMetrics.isActive) {
      badges.push({ emoji: '🌱', text: 'Growing', color: '#D1FAE5' });
    }
    
    return badges;
  };

  const userStatus = getUserStatus();
  const userBadges = getUserBadges();

  // Calculate real weekly stats based on completed topics
  const calculateWeeklyStats = () => {
    const now = new Date();
    
    // Get the start of current week (MONDAY to SUNDAY)
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1; // If Sunday, go back 6 days to Monday
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - daysFromMonday);
    startOfWeek.setHours(0, 0, 0, 0);
    
    console.log('[LearningProgress] Week starts on Monday:', startOfWeek.toDateString());
    console.log('[LearningProgress] Today is:', now.toDateString());
    
    let weeklyTimeSpent = 0; // in minutes
    const weeklySubjects = new Set();
    const uniqueTopicsThisWeek = new Set(); // Track unique topics
    
    // Count UNIQUE topics completed this week (Monday to Sunday)
    completedTopics.forEach(topicKey => {
      const parts = topicKey.split('::');
      if (parts.length >= 2) {
        const subjectName = parts[0];
        const topicName = parts[1];
        const uniqueKey = `${subjectName}::${topicName}`; // Without timestamp
        
        // Extract timestamp if available
        let timestamp = null;
        if (parts.length >= 3 && !isNaN(parts[2])) {
          timestamp = new Date(parseInt(parts[2]));
        }
        
        // Only count if completed this week (from Monday onwards)
        if (!timestamp || timestamp >= startOfWeek) {
          // Add to unique topics set (this prevents double counting)
          uniqueTopicsThisWeek.add(uniqueKey);
          weeklySubjects.add(subjectName);
          // Estimate 5 minutes per topic completion (only count once per unique topic)
          if (!uniqueTopicsThisWeek.has(uniqueKey + '_counted')) {
            weeklyTimeSpent += 5;
            uniqueTopicsThisWeek.add(uniqueKey + '_counted');
          }
        }
      }
    });
    
    const weeklyCompleted = uniqueTopicsThisWeek.size; // Use unique count
    
    // Calculate streak - check each day from Monday to Sunday
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check each day of the current week (Monday to Sunday)
    const daysWithActivity = [];
    const daysToCheck = currentDay === 0 ? 7 : currentDay; // If Sunday, check all 7 days; otherwise check up to today
    
    for (let i = 0; i < daysToCheck; i++) {
      const checkDate = new Date(startOfWeek);
      checkDate.setDate(startOfWeek.getDate() + i);
      checkDate.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(checkDate);
      nextDay.setDate(checkDate.getDate() + 1);
      nextDay.setHours(0, 0, 0, 0);
      
      // Check if any topic was completed on this day
      let hasActivity = false;
      completedTopics.forEach(topicKey => {
        const parts = topicKey.split('::');
        if (parts.length >= 3 && !isNaN(parts[2])) {
          const timestamp = new Date(parseInt(parts[2]));
          if (timestamp >= checkDate && timestamp < nextDay) {
            hasActivity = true;
          }
        }
      });
      
      if (hasActivity) {
        daysWithActivity.push(checkDate.getDay());
      }
    }
    
    // Streak is the number of days with activity this week
    streak = daysWithActivity.length;
    
    console.log(`[LearningProgress] Weekly: ${weeklyCompleted} unique topics, ${streak} days active`);
    console.log(`[LearningProgress] Days with activity:`, daysWithActivity);
    
    // Format time spent
    const hours = Math.floor(weeklyTimeSpent / 60);
    const minutes = weeklyTimeSpent % 60;
    const timeSpentFormatted = hours > 0 
      ? `${hours}.${Math.round(minutes / 6)} hours` 
      : `${minutes}min`;
    
    return {
      completed: weeklyCompleted,
      timeSpent: timeSpentFormatted,
      streak: `${streak} day${streak !== 1 ? 's' : ''}`,
      topics: weeklySubjects.size + beyondSchoolSubjects.filter(s =>
        !weeklySubjects.has(s.name) // avoid double-counting if already in completedTopics
      ).length,
    };
  };
  
  const weeklyStats = calculateWeeklyStats();
  
  // Generate real Topics Known and Needs Practice based on completed topics
  const generateTopicsData = (isWeekly = true) => {
    const now = new Date();
    
    // Get start date based on period
    let startDate;
    if (isWeekly) {
      const currentDay = now.getDay();
      const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1;
      startDate = new Date(now);
      startDate.setDate(now.getDate() - daysFromMonday);
      startDate.setHours(0, 0, 0, 0);
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      startDate.setHours(0, 0, 0, 0);
    }
    
    const topicsKnown = [];
    const topicsNeedsPractice = [];
    const topicAttempts = {}; // Track attempts per topic
    
    // Get student's subjects and levels
    const subjectLevels = child?.subjectLevels || {};
    const childGrade = child?.grade;
    
    // First pass: Count attempts for all topics (completed and in-progress)
    completedTopics.forEach(topicKey => {
      const parts = topicKey.split('::');
      if (parts.length >= 2) {
        const subjectName = parts[0];
        const topicName = parts[1];
        const key = `${subjectName}::${topicName}`;
        
        topicAttempts[key] = (topicAttempts[key] || 0) + 1;
      }
    });
    
    // Process completed topics for "Topics Known"
    const processedTopics = new Set();
    completedTopics.forEach(topicKey => {
      const parts = topicKey.split('::');
      if (parts.length >= 2) {
        const subjectName = parts[0];
        const topicName = parts[1];
        const key = `${subjectName}::${topicName}`;
        
        // Skip if already processed
        if (processedTopics.has(key)) return;
        processedTopics.add(key);
        
        // Extract timestamp
        let timestamp = null;
        if (parts.length >= 3 && !isNaN(parts[2])) {
          timestamp = new Date(parseInt(parts[2]));
        }
        
        // Only count if completed in this period
        if (!timestamp || timestamp >= startDate) {
          // Calculate days ago
          const daysAgo = timestamp 
            ? Math.floor((now - timestamp) / (1000 * 60 * 60 * 24))
            : 0;
          
          // Calculate progress for completed topics (Topics Known)
          // Completed topics should show high mastery (90-100%)
          const attempts = topicAttempts[key] || 1;
          
          // Base progress for completed topics: 90%
          // Add 2% per additional attempt (max 100%)
          const progress = Math.min(100, 90 + ((attempts - 1) * 2));
          
          // Add to topics known
          topicsKnown.push({
            name: topicName,
            subject: subjectName,
            progress: progress,
            daysAgo: daysAgo,
            attempts: attempts,
          });
        }
      }
    });
    
    // Generate "Needs Practice" topics from API topics that haven't been completed
    // Get all topics for student's subjects
    Object.entries(subjectLevels).forEach(([subjectKey, level]) => {
      // Find subject name
      let subjectName = null;
      const isObjectId = (str) => /^[0-9a-fA-F]{24}$/.test(str);
      
      if (isObjectId(subjectKey)) {
        const apiSubject = apiSubjects.find(s => s._id === subjectKey);
        if (apiSubject) subjectName = apiSubject.name;
      } else {
        // Map subject ID to name
        subjectName = 
          subjectKey === 'mathematics' ? 'Math' :
          subjectKey === 'science' ? 'Science / EVS' :
          subjectKey === 'english' ? 'English' :
          subjectKey === 'social-studies' ? 'Social Studies' :
          subjectKey;
      }
      
      if (subjectName) {
        // Get topics for this subject
        const allTopicsForSubject = subjectTopicsMap[subjectName] || [];
        const filteredTopics = allTopicsForSubject.filter(t => {
          const gradeMatch = !t.grade || !childGrade || t.grade === childGrade;
          const levelMatch = !t.level || !level || t.level === level;
          return gradeMatch && levelMatch;
        });
        
        // Find topics not yet completed or partially completed
        filteredTopics.forEach(topic => {
          const topicKey = `${subjectName}::${topic.title}`;
          const attempts = topicAttempts[topicKey] || 0;
          
          // Check if fully completed (in processedTopics)
          const isFullyCompleted = processedTopics.has(topicKey);
          
          // Include if not fully completed and we have space
          if (!isFullyCompleted && topicsNeedsPractice.length < 5) {
            // Calculate progress based on attempts
            const progress = attempts > 0 ? Math.min(65, 20 + (attempts * 15)) : 0;
            
            topicsNeedsPractice.push({
              name: topic.title,
              subject: subjectName,
              progress: progress,
              attempts: attempts,
              priority: topicsNeedsPractice.length < 2 ? 'High' : '',
            });
          }
        });
      }
    });

    // Beyond School subjects — add their incomplete topics to Needs Practice
    beyondSchoolSubjects.forEach(bsSubject => {
      const subjectName = bsSubject.name;
      const allTopicsForSubject = beyondSchoolTopicsMap[subjectName] || [];

      allTopicsForSubject.forEach(topic => {
        const topicTitle = topic.topic || topic.title;
        if (!topicTitle) return;
        const topicKey = `${subjectName}::${topicTitle}`;
        const attempts = topicAttempts[topicKey] || 0;
        const isFullyCompleted = processedTopics.has(topicKey);

        if (!isFullyCompleted && topicsNeedsPractice.length < 10) {
          const progress = attempts > 0 ? Math.min(65, 20 + (attempts * 15)) : 0;
          topicsNeedsPractice.push({
            name: topicTitle,
            subject: subjectName,
            progress,
            attempts,
            priority: topicsNeedsPractice.length < 2 ? 'High' : '',
          });
        }
      });
    });
    
    return {
      knownTopicsDetailed: topicsKnown.slice(0, 6),
      needsPracticeTopicsDetailed: topicsNeedsPractice.slice(0, 5),
    };
  };
  
  // Calculate real monthly stats based on completed topics
  const calculateMonthlyStats = () => {
    const now = new Date();
    
    // Get the start of current month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    let monthlyTimeSpent = 0; // in minutes
    const monthlySubjects = new Set();
    const uniqueTopicsThisMonth = new Set(); // Track unique topics
    
    // Count UNIQUE topics completed this month
    completedTopics.forEach(topicKey => {
      const parts = topicKey.split('::');
      if (parts.length >= 2) {
        const subjectName = parts[0];
        const topicName = parts[1];
        const uniqueKey = `${subjectName}::${topicName}`; // Without timestamp
        
        // Extract timestamp if available
        let timestamp = null;
        if (parts.length >= 3 && !isNaN(parts[2])) {
          timestamp = new Date(parseInt(parts[2]));
        }
        
        // Only count if completed this month
        if (!timestamp || timestamp >= startOfMonth) {
          // Add to unique topics set (this prevents double counting)
          uniqueTopicsThisMonth.add(uniqueKey);
          monthlySubjects.add(subjectName);
          // Estimate 5 minutes per topic completion (only count once per unique topic)
          if (!uniqueTopicsThisMonth.has(uniqueKey + '_counted')) {
            monthlyTimeSpent += 5;
            uniqueTopicsThisMonth.add(uniqueKey + '_counted');
          }
        }
      }
    });
    
    const monthlyCompleted = uniqueTopicsThisMonth.size; // Use unique count
    
    // Calculate streak - days with activity this month
    let monthlyStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check each day of the current month
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysWithActivity = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const checkDate = new Date(now.getFullYear(), now.getMonth(), day);
      checkDate.setHours(0, 0, 0, 0);
      
      // Don't check future days
      if (checkDate > today) {
        break;
      }
      
      const nextDay = new Date(checkDate);
      nextDay.setDate(checkDate.getDate() + 1);
      nextDay.setHours(0, 0, 0, 0);
      
      // Check if any topic was completed on this day
      let hasActivity = false;
      completedTopics.forEach(topicKey => {
        const parts = topicKey.split('::');
        if (parts.length >= 3 && !isNaN(parts[2])) {
          const timestamp = new Date(parseInt(parts[2]));
          if (timestamp >= checkDate && timestamp < nextDay) {
            hasActivity = true;
          }
        }
      });
      
      if (hasActivity) {
        daysWithActivity.push(day);
      }
    }
    
    monthlyStreak = daysWithActivity.length;
    
    console.log(`[LearningProgress] Monthly: ${monthlyCompleted} unique topics, ${monthlyStreak} days active`);
    
    // Format time spent
    const hours = Math.floor(monthlyTimeSpent / 60);
    const minutes = monthlyTimeSpent % 60;
    const timeSpentFormatted = hours > 0 
      ? `${hours}.${Math.round(minutes / 6)} hours` 
      : `${minutes}min`;
    
    return {
      completed: monthlyCompleted,
      timeSpent: timeSpentFormatted,
      streak: `${monthlyStreak} day${monthlyStreak !== 1 ? 's' : ''}`,
      topics: monthlySubjects.size + beyondSchoolSubjects.filter(s =>
        !monthlySubjects.has(s.name)
      ).length,
    };
  };
  
  const monthlyStats = calculateMonthlyStats();

  // Get current month and year
  const getCurrentMonth = () => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    const now = new Date();
    return `${months[now.getMonth()]} ${now.getFullYear()}`;
  };

  // Get number of days in current month
  const getDaysInCurrentMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    
    const today = new Date();
    
    // Parse DD/MM/YYYY format
    let birthDate;
    if (dateOfBirth.includes('/')) {
      const parts = dateOfBirth.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
        const year = parseInt(parts[2], 10);
        birthDate = new Date(year, month, day);
      } else {
        birthDate = new Date(dateOfBirth);
      }
    } else {
      birthDate = new Date(dateOfBirth);
    }
    
    // Check if date is valid
    if (isNaN(birthDate.getTime())) return null;
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Adjust age if birthday hasn't occurred this year yet
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const childAge = child?.dateOfBirth ? calculateAge(child.dateOfBirth) : child?.age;

  // Generate dynamic subject breakdown based on student's actual performance
  const generateSubjectBreakdown = () => {
    console.log('[LearningProgress] generateSubjectBreakdown called');
    console.log('[LearningProgress] child.subjectLevels:', child?.subjectLevels);
    console.log('[LearningProgress] apiSubjects:', apiSubjects);
    console.log('[LearningProgress] subjectTopicsMap:', Object.keys(subjectTopicsMap));
    
    const subjectConfig = {
      'Math': { icon: 'calculator' },
      'Mathematics': { icon: 'calculator' },
      'English': { icon: 'book' },
      'Science / EVS': { icon: 'leaf' },
      'Science/EVS': { icon: 'leaf' },
      'EVS': { icon: 'leaf' },
      'Science': { icon: 'flask' },
      'Biology': { icon: 'leaf' },
      'Chemistry': { icon: 'flask' },
      'Physics': { icon: 'magnet' },
      'Social Studies': { icon: 'earth' },
      'History': { icon: 'time' },
      'Geography': { icon: 'map' },
      'Civics': { icon: 'people' },
      'Financial Literacy': { icon: 'cash' },
      'Economics': { icon: 'trending-up' },
      'Artificial Intelligence': { icon: 'hardware-chip' },
      'AI': { icon: 'hardware-chip' },
      'Machine Learning': { icon: 'analytics' },
      'Robotics': { icon: 'construct' },
      'Automation': { icon: 'settings' },
      'Computer Science': { icon: 'laptop' },
      'Coding': { icon: 'code-slash' },
      'Sex & Safety Education': { icon: 'shield-checkmark' },
      'Sex & Safety': { icon: 'shield-checkmark' },
      'Drawing': { icon: 'brush' },
      'Art': { icon: 'color-palette' },
      'Music': { icon: 'musical-notes' },
      'Dance': { icon: 'body' },
      'Sports': { icon: 'basketball' },
      'Physical Education': { icon: 'fitness' },
      'Yoga': { icon: 'body' },
      'Olympiad': { icon: 'trophy' },
      'Mental Math': { icon: 'calculator' },
      'Reasoning': { icon: 'bulb' },
      'General Knowledge': { icon: 'globe' },
      'Current Affairs': { icon: 'newspaper' },
      'Literature': { icon: 'book-outline' },
      'Grammar': { icon: 'text' },
      'Writing': { icon: 'create' },
      'Reading': { icon: 'reader' },
      'Vocabulary': { icon: 'chatbubbles' },
      'Moral Science': { icon: 'heart' },
      'Life Skills': { icon: 'hand-right' },
      'Environmental Science': { icon: 'earth' },
      'Health & Hygiene': { icon: 'medical' },
      'Nutrition': { icon: 'nutrition' },
    };
    
    // Available icons for random selection (colors assigned by position)
    const availableIcons = [
      'calculator',
      'book',
      'leaf',
      'earth',
      'cash',
      'hardware-chip',
      'shield-checkmark',
      'flask',
      'bulb',
      'trophy',
      'star',
      'rocket',
    ];
    
    // Color palette for row-based coloring (ensures variety in each row)
    const colorPalette = [
      '#6366F1', // Blue
      '#EC4899', // Pink
      '#10B981', // Green
      '#F59E0B', // Orange
      '#14B8A6', // Teal
      '#8B5CF6', // Purple
      '#EF4444', // Red
      '#FCD34D', // Yellow
      '#3B82F6', // Light Blue
      '#F472B6', // Light Pink
      '#059669', // Dark Green
      '#D97706', // Dark Orange
    ];
    
    // Function to get random icon for unknown subjects
    const getRandomIcon = (subjectName) => {
      // Use subject name to generate consistent random index (same subject = same icon)
      let hash = 0;
      for (let i = 0; i < subjectName.length; i++) {
        hash = ((hash << 5) - hash) + subjectName.charCodeAt(i);
        hash = hash & hash; // Convert to 32bit integer
      }
      const index = Math.abs(hash) % availableIcons.length;
      return availableIcons[index];
    };
    
    // Function to get color based on row position (2 subjects per row)
    const getColorByPosition = (index) => {
      return colorPalette[index % colorPalette.length];
    };

    const subjects = [];
    
    // Get student's subject levels (this is what they actually selected)
    const subjectLevels = child?.subjectLevels || {};
    const childGrade = child?.grade;
    
    // If subjectLevels contains ObjectIDs instead of subject IDs, we need to find the actual subjects
    // Check if the keys look like ObjectIDs (24 hex characters)
    const isObjectId = (str) => /^[0-9a-fA-F]{24}$/.test(str);
    
    // Create a map of subject _id to subject object with creation order
    const subjectByIdMap = {};
    apiSubjects.forEach((apiSubject, index) => {
      subjectByIdMap[apiSubject._id] = {
        ...apiSubject,
        orderIndex: index // Preserve the order from API (oldest first)
      };
    });
    
    console.log('[LearningProgress] subjectByIdMap:', subjectByIdMap);
    
    // Create an array to maintain order
    const subjectsWithOrder = [];
    
    // Only process subjects that the student actually selected (have a level)
    Object.entries(subjectLevels).forEach(([subjectKey, level]) => {
      console.log(`[LearningProgress] Processing subjectKey: ${subjectKey}, level: ${level}`);
      
      let subjectName = null;
      let apiSubject = null;
      let orderIndex = 999; // Default high number for subjects not found in API
      
      // Check if subjectKey is an ObjectID
      if (isObjectId(subjectKey)) {
        // It's an ObjectID, look it up directly
        apiSubject = subjectByIdMap[subjectKey];
        if (apiSubject) {
          subjectName = apiSubject.name;
          orderIndex = apiSubject.orderIndex;
          console.log(`[LearningProgress] Found subject by ObjectID: ${subjectName}, order: ${orderIndex}`);
        }
      } else {
        // It's a subject ID like 'mathematics', 'science', etc.
        // Try to find matching API subject
        apiSubject = apiSubjects.find((s, idx) => {
          const nameLower = s.name.toLowerCase();
          const match = (
            (subjectKey === 'mathematics' && nameLower.includes('math')) ||
            (subjectKey === 'science' && (nameLower.includes('science') || nameLower.includes('evs'))) ||
            (subjectKey === 'english' && nameLower.includes('english')) ||
            (subjectKey === 'social-studies' && nameLower.includes('social')) ||
            (subjectKey === 'artificial-intelligence' && (nameLower.includes('artificial') || nameLower.includes('intelligence'))) ||
            (subjectKey === 'financial' && nameLower.includes('financial')) ||
            (subjectKey === 'safety' && (nameLower.includes('sex') || nameLower.includes('safety')))
          );
          if (match) {
            orderIndex = idx;
          }
          return match;
        });
        
        if (apiSubject) {
          subjectName = apiSubject.name;
          console.log(`[LearningProgress] Found subject by ID mapping: ${subjectName}, order: ${orderIndex}`);
        } else {
          // Fallback to friendly names
          subjectName = 
            subjectKey === 'mathematics' ? 'Math' :
            subjectKey === 'science' ? 'Science / EVS' :
            subjectKey === 'english' ? 'English' :
            subjectKey === 'social-studies' ? 'Social Studies' :
            subjectKey === 'artificial-intelligence' ? 'Artificial Intelligence' :
            subjectKey === 'financial' ? 'Financial Literacy' :
            subjectKey === 'safety' ? 'Sex & Safety' :
            subjectKey;
          console.log(`[LearningProgress] Using fallback name: ${subjectName}`);
        }
      }
      
      if (!subjectName) {
        console.log(`[LearningProgress] Could not determine subject name for: ${subjectKey}`);
        return; // Skip this subject
      }
      
      console.log(`[LearningProgress] Final subject name: ${subjectName}, order: ${orderIndex}`);
      
      // Get icon for this subject, or use random icon if not found
      const subjectIcon = subjectConfig[subjectName]?.icon || getRandomIcon(subjectName);
      
      console.log(`[LearningProgress] Using icon for ${subjectName}:`, subjectIcon);
      
      // Get performance data for this subject
      const perfData = subjectPerformance[subjectName] || { 
        completed: 0, 
        completedThisWeek: 0,
        total: 0,
        weeklyTopics: new Set()
      };
      
      // Get actual topics from API filtered by grade and level
      const allTopicsForSubject = subjectTopicsMap[subjectName] || [];
      const filteredTopics = allTopicsForSubject.filter(t => {
        const gradeMatch = !t.grade || !childGrade || t.grade === childGrade;
        const levelMatch = !t.level || !level || t.level === level;
        return gradeMatch && levelMatch;
      });
      
      console.log(`[LearningProgress] ${subjectName}: ${filteredTopics.length} topics (filtered by ${childGrade}, ${level})`);
      
      // Use actual topic count from API
      const actualTotalTopics = topicsLoaded ? filteredTopics.length : 0;
      
      // For weekly view: use weekly completion data
      // For monthly view: use overall completion data
      const isWeekly = selectedPeriod === 'weekly';
      const completedCount = isWeekly ? perfData.completedThisWeek : perfData.completed;
      const topicsSet = isWeekly ? (perfData.weeklyTopics || new Set()) : (perfData.topics || new Set());
      
      // Fallback to estimation if API data not loaded yet
      const levelMultiplier = {
        'Basic': 8,
        'Intermediate': 12,
        'Advanced': 15
      };
      const estimatedTotal = levelMultiplier[level] || 10;
      
      // Use actual count if available, otherwise estimate
      let totalTopics = actualTotalTopics > 0 ? actualTotalTopics : estimatedTotal;
      
      // For weekly view, calculate weekly target (20% of total, minimum 3)
      if (isWeekly && actualTotalTopics > 0) {
        totalTopics = Math.max(Math.ceil(actualTotalTopics * 0.2), 3);
      } else if (isWeekly) {
        totalTopics = Math.max(Math.ceil(estimatedTotal * 0.2), 3);
      }
      
      // Don't force minimum if no topics completed
      if (completedCount === 0 && actualTotalTopics > 0) {
        totalTopics = actualTotalTopics;
      }
      
      const progress = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;
      
      // Calculate growth based on weekly vs previous week (placeholder logic)
      const growthPercentage = progress > 0 ? Math.min(Math.round(progress * 0.3), 30) : 0;
      const growth = growthPercentage > 0 ? `+${growthPercentage}%` : '+0%';
      
      subjectsWithOrder.push({
        name: subjectName, // Use actual name from API
        fullName: subjectName,
        icon: subjectIcon,
        progress: progress,
        completed: completedCount,
        total: totalTopics,
        actualTotal: actualTotalTopics,
        growth: growth,
        color: '#6B7280', // Placeholder, will be replaced by row-based color
        level: level,
        topicsCompleted: Array.from(topicsSet),
        orderIndex: orderIndex // Store order for sorting
      });
    });
    
    // Sort by orderIndex to maintain the order subjects were added (oldest first)
    subjectsWithOrder.sort((a, b) => a.orderIndex - b.orderIndex);
    
    // Apply row-based colors after sorting (so colors vary by position in grid)
    subjectsWithOrder.forEach((subject, index) => {
      subject.color = getColorByPosition(index);
    });
    
    console.log('[LearningProgress] Generated subjects (sorted by order with row-based colors):', subjectsWithOrder);

    // ── Beyond School subjects ──────────────────────────────────────────────
    beyondSchoolSubjects.forEach((bsSubject, bsIndex) => {
      const subjectName = bsSubject.name;
      const allTopicsForSubject = beyondSchoolTopicsMap[subjectName] || [];

      const perfData = subjectPerformance[subjectName] || {
        completed: 0,
        completedThisWeek: 0,
        total: 0,
        topics: new Set(),
        weeklyTopics: new Set(),
      };

      const isWeekly = selectedPeriod === 'weekly';
      const completedCount = isWeekly ? perfData.completedThisWeek : perfData.completed;
      const topicsSet = isWeekly ? (perfData.weeklyTopics || new Set()) : (perfData.topics || new Set());

      const actualTotalTopics = topicsLoaded ? allTopicsForSubject.length : 0;
      let totalTopics = actualTotalTopics > 0 ? actualTotalTopics : 10;

      if (isWeekly && actualTotalTopics > 0) {
        totalTopics = Math.max(Math.ceil(actualTotalTopics * 0.2), 3);
      } else if (isWeekly) {
        totalTopics = 3;
      }

      if (completedCount === 0 && actualTotalTopics > 0) {
        totalTopics = actualTotalTopics;
      }

      const progress = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;
      const growthPercentage = progress > 0 ? Math.min(Math.round(progress * 0.3), 30) : 0;
      const growth = growthPercentage > 0 ? `+${growthPercentage}%` : '+0%';
      const positionIndex = subjectsWithOrder.length + bsIndex;

      subjectsWithOrder.push({
        name: subjectName,
        fullName: subjectName,
        icon: bsSubject.rnIcon || bsSubject.icon || 'star-circle-outline',
        progress,
        completed: completedCount,
        total: totalTopics,
        actualTotal: actualTotalTopics,
        growth,
        color: getColorByPosition(positionIndex),
        level: null,
        topicsCompleted: Array.from(topicsSet),
        orderIndex: positionIndex,
        isBeyondSchool: true,
      });
    });

    // If no subjects found, return empty array
    if (subjectsWithOrder.length === 0) {
      return [];
    }
    
    return subjectsWithOrder;
  };

  // Weekly data (current week) - dynamically generated from real data
  const weeklyTopicsData = generateTopicsData(true); // true = weekly
  const weeklyData = {
    topicsKnown: 12,
    topicsNeedsPractice: 7,
    skillsMastered: 8,
    timeSpent: '45min',
    overview: {
      completed: weeklyStats.completed,
      timeSpent: weeklyStats.timeSpent,
      streak: weeklyStats.streak,
      topics: weeklyStats.topics,
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
    knownTopics: weeklyTopicsData.knownTopicsDetailed.map(t => t.name),
    knownTopicsDetailed: weeklyTopicsData.knownTopicsDetailed,
    needsPracticeTopics: weeklyTopicsData.needsPracticeTopicsDetailed.map(t => t.name),
    needsPracticeTopicsDetailed: weeklyTopicsData.needsPracticeTopicsDetailed,
    subjects: generateSubjectBreakdown(), // Dynamic based on student's subjects and weekly performance
  };

  // Monthly data (current month) - dynamically generated from real data
  const monthlyTopicsData = generateTopicsData(false); // false = monthly
  const monthlyData = {
    topicsKnown: 45,
    topicsNeedsPractice: 18,
    skillsMastered: 28,
    timeSpent: '6.5hrs',
    overview: {
      completed: monthlyStats.completed,
      timeSpent: monthlyStats.timeSpent,
      streak: monthlyStats.streak,
      topics: monthlyStats.topics,
      growth: '+42%',
    },
    activity: [
      { day: 'Week 1', activities: 22, hours: 2.5, activityHeight: 75, hoursHeight: 30 },
      { day: 'Week 2', activities: 26, hours: 3.2, activityHeight: 90, hoursHeight: 38 },
      { day: 'Week 3', activities: 24, hours: 2.8, activityHeight: 82, hoursHeight: 34 },
      { day: 'Week 4', activities: 24, hours: 2.7, activityHeight: 82, hoursHeight: 32 },
    ],
    knownTopics: monthlyTopicsData.knownTopicsDetailed.map(t => t.name),
    needsPracticeTopics: monthlyTopicsData.needsPracticeTopicsDetailed.map(t => t.name),
    knownTopicsDetailed: monthlyTopicsData.knownTopicsDetailed,
    needsPracticeTopicsDetailed: monthlyTopicsData.needsPracticeTopicsDetailed,
    subjects: generateSubjectBreakdown(),
  };

  const currentData = selectedPeriod === 'weekly' ? weeklyData : monthlyData;

  // Calculate real achievements based on student's progress
  const calculateAchievements = () => {
    const achievements = [];
    
    // Achievement 1: Streak Achievement
    const streakDays = parseInt(weeklyStats.streak.split(' ')[0]) || 0;
    if (streakDays >= 7) {
      achievements.push({
        icon: 'flame',
        iconColor: '#F97316',
        backgroundColor: '#FED7AA',
        title: '7-Day Streak',
        subtitle: 'Perfect week!'
      });
    } else if (streakDays >= 5) {
      achievements.push({
        icon: 'flame',
        iconColor: '#F97316',
        backgroundColor: '#FED7AA',
        title: `${streakDays}-Day Streak`,
        subtitle: 'Keep it going!'
      });
    } else if (streakDays >= 3) {
      achievements.push({
        icon: 'flame',
        iconColor: '#F97316',
        backgroundColor: '#FED7AA',
        title: `${streakDays}-Day Streak`,
        subtitle: 'Building momentum'
      });
    } else if (streakDays > 0) {
      achievements.push({
        icon: 'flame',
        iconColor: '#F97316',
        backgroundColor: '#FED7AA',
        title: `${streakDays}-Day Active`,
        subtitle: 'Great start!'
      });
    }
    
    // Achievement 2: Completed Topics
    const completedCount = weeklyStats.completed;
    if (completedCount >= 20) {
      achievements.push({
        icon: 'star',
        iconColor: '#F59E0B',
        backgroundColor: '#FDE68A',
        title: `${completedCount} Topics`,
        subtitle: 'Amazing progress!'
      });
    } else if (completedCount >= 10) {
      achievements.push({
        icon: 'star',
        iconColor: '#F59E0B',
        backgroundColor: '#FDE68A',
        title: `${completedCount} Topics`,
        subtitle: 'Excellent work!'
      });
    } else if (completedCount >= 5) {
      achievements.push({
        icon: 'star',
        iconColor: '#F59E0B',
        backgroundColor: '#FDE68A',
        title: `${completedCount} Topics`,
        subtitle: 'Completed this week'
      });
    } else if (completedCount > 0) {
      achievements.push({
        icon: 'star',
        iconColor: '#F59E0B',
        backgroundColor: '#FDE68A',
        title: `${completedCount} Topic${completedCount === 1 ? '' : 's'}`,
        subtitle: 'Keep learning!'
      });
    }
    
    // Achievement 3: Topics Mastered (from Topics Known)
    const topicsKnownCount = weeklyData.knownTopicsDetailed?.length || 0;
    if (topicsKnownCount >= 10) {
      achievements.push({
        icon: 'checkmark-circle',
        iconColor: '#10B981',
        backgroundColor: '#A7F3D0',
        title: `${topicsKnownCount} Topics`,
        subtitle: 'Mastered this week'
      });
    } else if (topicsKnownCount >= 5) {
      achievements.push({
        icon: 'checkmark-circle',
        iconColor: '#10B981',
        backgroundColor: '#A7F3D0',
        title: `${topicsKnownCount} Topics`,
        subtitle: 'Mastered recently'
      });
    } else if (topicsKnownCount > 0) {
      achievements.push({
        icon: 'checkmark-circle',
        iconColor: '#10B981',
        backgroundColor: '#A7F3D0',
        title: `${topicsKnownCount} Topic${topicsKnownCount === 1 ? '' : 's'}`,
        subtitle: 'Mastered'
      });
    }
    
    // If no achievements yet, show encouraging message
    if (achievements.length === 0) {
      achievements.push({
        icon: 'rocket',
        iconColor: '#8B5CF6',
        backgroundColor: '#DDD6FE',
        title: 'Start Learning',
        subtitle: 'Complete your first topic!'
      });
    }
    
    return achievements.slice(0, 3); // Return max 3 achievements
  };
  
  const recentAchievements = calculateAchievements();

  const getAvatarSource = (avatarId) => {
    if (!avatarId) return require('../assets/images/A1.jpeg');
    // Local preset IDs
    const localMap = { A1: require('../assets/images/A1.jpeg'), A2: require('../assets/images/A2.jpeg'), A3: require('../assets/images/A3.jpeg'), A4: require('../assets/images/A4.jpeg'), A5: require('../assets/images/A5.jpeg'), A6: require('../assets/images/A6.jpeg') };
    if (localMap[avatarId]) return localMap[avatarId];
    // URI / base64
    if (avatarId.startsWith('data:') || avatarId.startsWith('http') || avatarId.startsWith('file') || avatarId.startsWith('/')) return { uri: avatarId };
    // DB _id — look up in API avatars
    const found = apiAvatars.find(a => a.id === avatarId);
    if (found?.uri) return { uri: found.uri };
    return require('../assets/images/A1.jpeg');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Loading overlay while topics data is being fetched */}
      {!topicsLoaded && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.85)', zIndex: 99, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#45a578" />
          <Text style={{ marginTop: 12, fontSize: 14, color: '#6B7280', fontFamily: 'Montserrat-Regular' }}>Loading progress...</Text>
        </View>
      )}

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Icon name="arrow-back" size={isSmallDevice ? 22 : 24} color="#1A1A1A" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Learning Summary</Text>
          <Text style={styles.headerSubtitle}>Detailed insights & progress</Text>
        </View>
        {/* <TouchableOpacity style={styles.shareButton}>
          <Icon name="share-social-outline" size={isSmallDevice ? 20 : 22} color="#666666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.downloadButton}>
          <Icon name="download-outline" size={isSmallDevice ? 20 : 22} color="#666666" />
        </TouchableOpacity> */}
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
                Age {childAge || 8} · {child?.grade || 'Grade 3'} · {userStatus}
              </Text>
              <View style={styles.badgesContainer}>
                {userBadges.length > 0 ? (
                  userBadges.slice(0, 2).map((badge, index) => (
                    <View 
                      key={index} 
                      style={[
                        styles.badge, 
                        { backgroundColor: badge.color }
                      ]}
                    >
                      <Text style={styles.badgeEmoji}>{badge.emoji}</Text>
                      <Text style={styles.badgeText}>{badge.text}</Text>
                    </View>
                  ))
                ) : (
                  <View style={[styles.badge, { backgroundColor: '#E5E7EB' }]}>
                    <Text style={styles.badgeEmoji}>📚</Text>
                    <Text style={styles.badgeText}>Start Learning</Text>
                  </View>
                )}
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
                  <Icon name="checkmark-circle-outline" size={24} color="#BBBBBB" />
                </View>
                <Text style={styles.statNumber}>{currentData.overview.completed}</Text>
                <Text style={styles.statLabel}>Topics Completed</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Icon name="time-outline" size={24} color="#BBBBBB" />
                </View>
                <Text style={styles.statNumber} numberOfLines={1} adjustsFontSizeToFit>{currentData.overview.timeSpent}</Text>
                <Text style={styles.statLabel}>Time Spent</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Icon name="flame-outline" size={24} color="#BBBBBB" />
                </View>
                <Text style={styles.statNumber} numberOfLines={1} adjustsFontSizeToFit>{currentData.overview.streak}</Text>
                <Text style={styles.statLabel}>Streak</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Icon name="book-outline" size={24} color="#BBBBBB" />
                </View>
                <Text style={styles.statNumber}>{currentData.overview.topics}</Text>
                <Text style={styles.statLabel}>Subjects</Text>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.statsGrid} key="monthly-stats">
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Icon name="checkmark-circle-outline" size={24} color="#BBBBBB" />
              </View>
              <Text style={styles.statNumber}>{currentData.overview.completed}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Icon name="time-outline" size={24} color="#BBBBBB" />
              </View>
              <Text style={styles.statNumber} numberOfLines={1} adjustsFontSizeToFit>{currentData.overview.timeSpent}</Text>
              <Text style={styles.statLabel}>Time Spent</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Icon name="flame-outline" size={24} color="#BBBBBB" />
              </View>
              <Text style={styles.statNumber} numberOfLines={1} adjustsFontSizeToFit>{currentData.overview.streak}</Text>
              <Text style={styles.statLabel}>Streak</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Icon name="book-outline" size={24} color="#BBBBBB" />
              </View>
              <Text style={styles.statNumber}>{currentData.overview.topics}</Text>
              <Text style={styles.statLabel}>Topics</Text>
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

        {/* Streak Calendar - Monthly View Only */}
        {selectedPeriod === 'monthly' && (
          <View style={styles.streakCard}>
            <View style={styles.streakHeader}>
              <View style={styles.streakLeftContent}>
                <View style={styles.streakIconContainer}>
                  <Icon name="flame" size={isSmallDevice ? 24 : 28} color="#FDBA74" />
                </View>
                <View>
                  <Text style={styles.streakTitle}>Streak</Text>
                  <Text style={styles.streakSubtitle}>{monthlyStats.streak}</Text>
                </View>
              </View>
              <Text style={styles.streakMonthYear}>{getCurrentMonth()}</Text>
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
                {(() => {
                  const today = new Date();
                  const currentDay = today.getDate();
                  const currentMonth = today.getMonth();
                  const currentYear = today.getFullYear();
                  
                  // Get the first day of the month and its day of week
                  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
                  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.
                  
                  const daysInMonth = getDaysInCurrentMonth();
                  const totalCells = [];
                  
                  // Add empty cells for days before the month starts
                  for (let i = 0; i < startingDayOfWeek; i++) {
                    totalCells.push(
                      <View key={`empty-${i}`} style={styles.streakDotEmpty} />
                    );
                  }
                  
                  // Add cells for each day of the month
                  for (let dayNumber = 1; dayNumber <= daysInMonth; dayNumber++) {
                    // Create date for this day
                    const checkDate = new Date(currentYear, currentMonth, dayNumber);
                    checkDate.setHours(0, 0, 0, 0);
                    
                    const nextDay = new Date(checkDate);
                    nextDay.setDate(checkDate.getDate() + 1);
                    nextDay.setHours(0, 0, 0, 0);
                    
                    // Check if this day has any COMPLETED topics (not just uploaded)
                    // completedTopics format: "SubjectName::TopicName::completionTimestamp"
                    let hasActivity = false;
                    completedTopics.forEach(topicKey => {
                      const parts = topicKey.split('::');
                      // Must have timestamp (completion date)
                      if (parts.length >= 3 && !isNaN(parts[2])) {
                        const completionTimestamp = new Date(parseInt(parts[2]));
                        // Check if completed on this specific day
                        if (completionTimestamp >= checkDate && completionTimestamp < nextDay) {
                          hasActivity = true;
                          console.log(`[Streak] Activity on ${checkDate.toDateString()}: ${parts[0]}::${parts[1]}`);
                        }
                      }
                    });
                    
                    const isToday = dayNumber === currentDay;
                    const isFuture = dayNumber > currentDay;
                    
                    totalCells.push(
                      <View key={`day-${dayNumber}`} style={styles.streakDot}>
                        <View
                          style={[
                            styles.streakDotInner,
                            hasActivity && styles.streakDotActive, // Orange if has activity
                            isFuture && styles.streakDotFuture, // Gray for future days
                            isToday && styles.streakDotToday, // Highlight today
                          ]}
                        >
                          <Text style={[
                            styles.streakDayNumber,
                            hasActivity && styles.streakDayNumberActive,
                            isFuture && styles.streakDayNumberFuture,
                          ]}>
                            {dayNumber}
                          </Text>
                        </View>
                      </View>
                    );
                  }
                  
                  return totalCells;
                })()}
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
        {/* Subject Growth - Monthly View Only */}
        {selectedPeriod === 'monthly' && monthlyData.subjects.length > 0 && (
          <View style={styles.subjectGrowthCard}>
            <View style={styles.subjectGrowthHeader}>
              <View style={styles.subjectGrowthIconContainer}>
                <MaterialIcon name="chart-bar" size={isSmallDevice ? 18 : 20} color="#8B5CF6" />
              </View>
              <View>
                <Text style={styles.subjectGrowthTitle}>Subject Growth</Text>
                <Text style={styles.subjectGrowthSubtitle}>Progress this month</Text>
              </View>
            </View>

            <View style={styles.subjectGrowthList}>
              {monthlyData.subjects.map((subject, index) => {
                // Start of month is always 0%
                // End is current progress this month
                const startProgress = 0;
                const endProgress = subject.progress;
                const change = endProgress;
                
                return (
                  <View key={index} style={styles.subjectGrowthItem}>
                    <Text style={styles.subjectGrowthName}>{subject.name}</Text>
                    <View style={styles.subjectGrowthRight}>
                      <Text style={styles.subjectGrowthStart}>{startProgress}%</Text>
                      <Text style={styles.subjectGrowthArrow}>→</Text>
                      <Text style={styles.subjectGrowthEnd}>{endProgress}%</Text>
                      <Text style={styles.subjectGrowthChange}>+{change}%</Text>
                    </View>
                    <View style={styles.subjectGrowthBarContainer}>
                      <View style={styles.subjectGrowthBarBackground}>
                        <View style={[
                          styles.subjectGrowthBarFill, 
                          { 
                            width: `${endProgress}%`, 
                            backgroundColor: subject.color 
                          }
                        ]} />
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>

            <View style={styles.subjectGrowthLegend}>
              <View style={styles.subjectGrowthLegendItem}>
                <View style={[styles.subjectGrowthLegendDot, { backgroundColor: '#E5E7EB' }]} />
                <Text style={styles.subjectGrowthLegendText}>Start of month</Text>
              </View>
              <View style={styles.subjectGrowthLegendItem}>
                <View style={[styles.subjectGrowthLegendDot, { backgroundColor: '#6366F1' }]} />
                <Text style={styles.subjectGrowthLegendText}>Current progress</Text>
              </View>
            </View>
          </View>
        )}

       
       

        {/* February Snapshot - Monthly View Only */}
        {selectedPeriod === 'monthly' && (
          <View style={styles.februarySnapshotCard}>
            <View style={styles.februarySnapshotHeader}>
              <Icon name="trending-up" size={isSmallDevice ? 20 : 24} color="#10B981" />
              <View>
                <Text style={styles.februarySnapshotTitle}>February Snapshot</Text>
                <Text style={styles.februarySnapshotSubtitle}>Zues's best month yet!</Text>
              </View>
            </View>

            <View style={styles.snapshotStatsGrid}>
              <View style={[styles.snapshotStatItem, { backgroundColor: '#DBEAFE' }]}>
                <Text style={styles.snapshotStatLabel}>EVS</Text>
                <Text style={styles.snapshotStatTitle}>Best Subject</Text>
                <Text style={styles.snapshotStatValue}>+30% growth</Text>
              </View>

              <View style={[styles.snapshotStatItem, { backgroundColor: '#DBEAFE' }]}>
                <Text style={styles.snapshotStatLabel}>Fin</Text>
                <Text style={styles.snapshotStatTitle}>Most Active</Text>
                <Text style={styles.snapshotStatValue}>Avg 5 activities</Text>
              </View>

              <View style={[styles.snapshotStatItem, { backgroundColor: '#DBEAFE' }]}>
                <Text style={styles.snapshotStatLabel}>Fin. Lit.</Text>
                <Text style={styles.snapshotStatTitle}>Next Focus</Text>
                <Text style={styles.snapshotStatValue}>Needs attention</Text>
              </View>
            </View>
          </View>
        )}

        {/* Growth Badge - Weekly View Only */}
        {selectedPeriod === 'weekly' && (
          <View style={styles.growthBadge}>
            <View style={styles.growthIconContainer}>
              <MaterialIcon name="trending-up" size={isSmallDevice ? 20 : 24} color="#3B82F6" />
            </View>
            <View style={styles.growthTextContainer}>
              <Text style={styles.growthTitle}>+25% growth from last week</Text>
              <Text style={styles.growthMessage}>{child?.name || 'Zues'} is on an incredible learning streak! 🚀</Text>
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

          {/* Strong Progress - Green */}
          <View style={[styles.insightCard, styles.insightCardGreen]}>
            <View style={styles.insightIconContainer}>
              <MaterialIcon name="trending-up" size={isSmallDevice ? 20 : 24} color="#FFFFFF" />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Strong Progress in Math</Text>
              <Text style={styles.insightSubtitle}>25% improvement this week!</Text>
              <View style={styles.insightAction}>
                <Icon name="chevron-forward" size={isSmallDevice ? 12 : 14} color="#10B981" />
                <Text style={[styles.insightActionText, { color: '#10B981' }]}>Keep the momentum going</Text>
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

        {/* Subject Breakdown - Weekly and Monthly */}
        {(selectedPeriod === 'weekly' || selectedPeriod === 'monthly') && (
          <View style={styles.subjectBreakdownCard}>
          <View style={styles.subjectBreakdownHeader}>
            <Icon name="pie-chart" size={isSmallDevice ? 18 : 20} color="#8B5CF6" />
            <Text style={styles.subjectBreakdownTitle}>Subject Breakdown</Text>
          </View>
          <Text style={styles.subjectBreakdownSubtitle}>
            {selectedPeriod === 'weekly' 
              ? 'Weekly progress across all subjects' 
              : 'Monthly progress across all subjects'}
          </Text>
          
          {currentData.subjects.length === 0 ? (
            <View style={styles.emptySubjectsContainer}>
              <MaterialIcon name="book-open-variant" size={40} color="#9CA3AF" />
              <Text style={styles.emptySubjectsTitle}>No subjects selected</Text>
              <Text style={styles.emptySubjectsText}>
                Select subjects in Settings to track your progress
              </Text>
            </View>
          ) : (
            <View style={styles.subjectsGrid}>
              {currentData.subjects.map((subject, index) => (
                <View key={index} style={styles.subjectCard}>
                  <View style={styles.subjectHeader}>
                    {subject.isBeyondSchool ? (
                      <MaterialIcon name={subject.icon} size={isSmallDevice ? 18 : 20} color={subject.color} />
                    ) : (
                      <Icon name={subject.icon} size={isSmallDevice ? 18 : 20} color={subject.color} />
                    )}
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
                  <Text style={styles.subjectProgress}>
                    {subject.completed}/{subject.actualTotal > 0 ? subject.actualTotal : subject.total}
                  </Text>
                  {subject.level && (
                    <Text style={styles.subjectLevel}>{subject.level}</Text>
                  )}
                </View>
              ))}
            </View>
          )}
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
                    <Text style={styles.topicDaysAgo}>
                      {topic.daysAgo === 0 ? 'today' : topic.daysAgo === 1 ? '1 day ago' : `${topic.daysAgo} days ago`}
                    </Text>
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
            {recentAchievements.map((achievement, index) => (
              <View key={index} style={styles.achievementItem}>
                <View style={[styles.achievementIcon, { backgroundColor: achievement.backgroundColor }]}>
                  <Icon name={achievement.icon} size={isSmallDevice ? 20 : 22} color={achievement.iconColor} />
                </View>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementSubtitle}>{achievement.subtitle}</Text>
              </View>
            ))}
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
    borderWidth: 0,
    borderColor: 'transparent',
  },
  periodToggleButtonActive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#6B5DD3',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  periodToggleText: {
    fontSize: isTablet ? 16 : isSmallDevice ? 13 : 14,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'Montserrat-SemiBold',
  },
  periodToggleTextActive: {
    color: '#6B5DD3',
    fontWeight: '700',
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    marginHorizontal: isSmallDevice ? 12 : 16,
    marginBottom: isSmallDevice ? 8 : 12,
    gap: isSmallDevice ? 8 : 10,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: isSmallDevice ? 16 : 20,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    minHeight: isSmallDevice ? 95 : 110,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statIconContainer: {
    marginBottom: isSmallDevice ? 8 : 10,
  },
  statNumber: {
    fontSize: isTablet ? 20 : isSmallDevice ? 14 : 16,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 4,
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
    minWidth: 10,
  },
  statLabel: {
    fontSize: isTablet ? 10 : isSmallDevice ? 8 : 9,
    fontWeight: '500',
    color: '#999999',
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
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
    backgroundColor: '#f7faf7ff',
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
    backgroundColor: '#5B5FE8',
    marginHorizontal: isSmallDevice ? 12 : 16,
    marginBottom: isSmallDevice ? 8 : 10,
    padding: isSmallDevice ? 20 : 24,
    borderRadius: 22,
    shadowColor: '#5B5FE8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 8,
  },
  monthlyOverviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: isSmallDevice ? 20 : 24,
  },
  monthlyOverviewLabel: {
    fontSize: isTablet ? 13 : 12,
    fontWeight: '500',
    color: '#C7D2FE',
    marginBottom: 6,
    fontFamily: 'Montserrat-Regular',
  },
  monthlyOverviewMonth: {
    fontSize: isTablet ? 26 : isSmallDevice ? 22 : 24,
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
    width: '47%',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 16,
    paddingVertical: isSmallDevice ? 20 : 26,
    paddingHorizontal: isSmallDevice ? 10 : 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthlyStatNumber: {
    fontSize: isTablet ? 36 : isSmallDevice ? 28 : 34,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
  },
  monthlyStatLabel: {
    fontSize: isTablet ? 12 : isSmallDevice ? 10 : 11,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 3,
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
  },
  monthlyStatChange: {
    fontSize: isTablet ? 10 : isSmallDevice ? 9 : 10,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.45)',
    fontFamily: 'Montserrat-Regular',
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
    justifyContent: 'space-between',
    gap: isSmallDevice ? 4 : 6,
    marginBottom: isSmallDevice ? 14 : 16,
  },
  streakLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isSmallDevice ? 4 : 6,
  },
  streakIconContainer: {
    width: isSmallDevice ? 36 : 44,
    height: isSmallDevice ? 36 : 44,
    borderRadius: isSmallDevice ? 10 : 12,
    backgroundColor: '#FFEDD5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: isSmallDevice ? 2 : 4,
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
  streakMonthYear: {
    fontSize: isTablet ? 12 : isSmallDevice ? 10 : 11,
    fontWeight: '600',
    color: '#6B7280',
    fontFamily: 'Montserrat-SemiBold',
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
    fontWeight: '700',
    color: '#9CA3AF',
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Montserrat-Bold',
  },
  streakGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  streakDot: {
    width: `${100 / 7}%`, // Exactly 1/7th of the width
    paddingVertical: isSmallDevice ? 4 : 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakDotEmpty: {
    width: `${100 / 7}%`, // Exactly 1/7th of the width
    paddingVertical: isSmallDevice ? 4 : 6,
    // Empty space before month starts
  },
  streakDotInner: {
    width: isSmallDevice ? 32 : 36,
    height: isSmallDevice ? 32 : 36,
    borderRadius: isSmallDevice ? 16 : 18, // Half of width/height for perfect circle
    backgroundColor: '#E5E7EB', // Gray for days without activity
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakDotActive: {
    backgroundColor: '#FDBA74', // Orange for days with activity
  },
  streakDotFuture: {
    backgroundColor: '#F3F4F6', // Light gray for future days
  },
  streakDotToday: {
    borderWidth: 2,
    borderColor: '#FDBA74', // Orange border for today
  },
  streakDayNumber: {
    fontSize: isTablet ? 10 : isSmallDevice ? 8 : 9,
    fontWeight: '700',
    color: '#9CA3AF', // Gray text for inactive days
    fontFamily: 'Montserrat-Bold',
  },
  streakDayNumberActive: {
    color: '#FFFFFF', // White text for active days
  },
  streakDayNumberFuture: {
    color: '#D1D5DB', // Lighter gray for future days
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
    fontSize: isTablet ? 18 : isSmallDevice ? 15 : 16,
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
    backgroundColor: '#FFFFFF',
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
    color: '#1A1A1A',
    fontFamily: 'Montserrat-Bold',
  },
  februarySnapshotSubtitle: {
    fontSize: isTablet ? 12 : isSmallDevice ? 10 : 11,
    color: '#6B7280',
    marginTop: 2,
    fontFamily: 'Montserrat-Regular',
  },
  snapshotStatsGrid: {
    flexDirection: 'row',
    gap: isSmallDevice ? 8 : 10,
  },
  snapshotStatItem: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: isSmallDevice ? 10 : 12,
    padding: isSmallDevice ? 8 : 10,
  },
  snapshotStatLabel: {
    fontSize: isTablet ? 12 : isSmallDevice ? 10 : 11,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: isSmallDevice ? 3 : 4,
    fontFamily: 'Montserrat-Bold',
  },
  snapshotStatTitle: {
    fontSize: isTablet ? 11 : isSmallDevice ? 9 : 10,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: isSmallDevice ? 2 : 3,
    fontFamily: 'Montserrat-SemiBold',
  },
  snapshotStatValue: {
    fontSize: isTablet ? 10 : isSmallDevice ? 8 : 9,
    color: '#1E40AF',
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
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  growthTextContainer: {
    flex: 1,
  },
  growthTitle: {
    fontSize: isTablet ? 16 : isSmallDevice ? 13 : 14,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'Montserrat-Bold',
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
    minHeight: isSmallDevice ? 120 : 130,
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
    fontSize: isTablet ? 13 : isSmallDevice ? 9 : 10,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
    lineHeight: isSmallDevice ? 12 : 14,
  },
  subjectProgress: {
    fontSize: isTablet ? 11 : isSmallDevice ? 8 : 9,
    color: '#9CA3AF',
    fontFamily: 'Montserrat-Regular',
  },
  subjectLevel: {
    fontSize: isTablet ? 10 : isSmallDevice ? 7 : 8,
    color: '#6B7280',
    fontFamily: 'Montserrat-Medium',
    marginTop: 2,
    fontStyle: 'italic',
  },
  emptySubjectsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: isSmallDevice ? 30 : 40,
  },
  emptySubjectsTitle: {
    fontSize: isTablet ? 16 : isSmallDevice ? 13 : 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: isSmallDevice ? 10 : 12,
    fontFamily: 'Montserrat-Bold',
  },
  emptySubjectsText: {
    fontSize: isTablet ? 13 : isSmallDevice ? 11 : 12,
    color: '#9CA3AF',
    marginTop: 6,
    textAlign: 'center',
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
    fontSize: isTablet ? 13 : isSmallDevice ? 10 : 11,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    fontFamily: 'Montserrat-Bold',
  },
  insightSubtitle: {
    fontSize: isTablet ? 11 : isSmallDevice ? 9 : 10,
    color: '#D1D5DB',
    marginBottom: isSmallDevice ? 3 : 4,
    fontFamily: 'Montserrat-Regular',
  },
  insightAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  insightActionText: {
    fontSize: isTablet ? 10 : isSmallDevice ? 8 : 9,
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
    backgroundColor: '#FFFFFF',
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

  // AI-Powered Insights Section
  aiInsightsSection: {
    marginHorizontal: isSmallDevice ? 12 : 16,
    marginVertical: isSmallDevice ? 16 : 20,
    backgroundColor: '#1A2332',
    borderRadius: isSmallDevice ? 16 : 20,
    padding: isSmallDevice ? 16 : 20,
  },

  aiInsightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: isSmallDevice ? 14 : 16,
  },

  aiInsightsTitle: {
    fontSize: isTablet ? 20 : 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 10,
    fontFamily: 'Montserrat-Bold',
  },

  aiInsightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D3E52',
    borderRadius: isSmallDevice ? 12 : 14,
    padding: isSmallDevice ? 14 : 16,
    marginBottom: isSmallDevice ? 12 : 14,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },

  aiInsightCardGreen: {
    borderLeftColor: '#10B981',
    backgroundColor: '#1F3A2F',
  },

  aiInsightCardOrange: {
    borderLeftColor: '#F59E0B',
    backgroundColor: '#3A2F1F',
  },

  aiInsightIconContainer: {
    width: isSmallDevice ? 48 : 56,
    height: isSmallDevice ? 48 : 56,
    borderRadius: isSmallDevice ? 12 : 14,
    backgroundColor: 'rgba(74, 144, 226, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: isSmallDevice ? 12 : 14,
    flexShrink: 0,
  },

  aiInsightIconGreen: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },

  aiInsightIconOrange: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },

  aiInsightContent: {
    flex: 1,
  },

  aiInsightCardTitle: {
    fontSize: isTablet ? 15 : 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    fontFamily: 'Montserrat-Bold',
  },

  aiInsightCardSubtitle: {
    fontSize: isTablet ? 13 : 12,
    color: '#B0B8C1',
    marginBottom: 8,
    fontFamily: 'Montserrat-Regular',
  },

  aiInsightAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  aiInsightActionText: {
    fontSize: isTablet ? 12 : 11,
    color: '#4A90E2',
    fontWeight: '600',
    fontFamily: 'Montserrat-SemiBold',
  },
});

export default LearningProgressScreen;
