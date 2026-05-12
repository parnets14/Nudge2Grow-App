/**
 * Subjects List Screen - Shows all learning subjects with progress
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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Svg, { Circle } from 'react-native-svg';
import {
  getAllSubjects,
  getNudgesBySubject,
  getNudgesByGradeAndLevel,
} from '../data/nudgesData';
import {
  BASE_URL,
  getImageUri,
  fetchSubjects,
  fetchTopicsBySubject,
  fetchBeyondSchool,
  fetchBeyondSchoolTopicsBySubject,
} from '../api';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;
const isSmallDevice = width < 375;

// Circular Progress Component
const CircularProgress = ({ percentage, color, size = 40 }) => {
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="none"
        />
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
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            fontSize: isSmallDevice ? 10 : 12,
            fontWeight: '700',
            color: color,
            fontFamily: 'Montserrat-Bold',
          }}
        >
          {percentage}%
        </Text>
      </View>
    </View>
  );
};

const SubjectsListScreen = ({
  onBack,
  onNavigate,
  userData,
  completedTopics = new Set(),
}) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [apiSubjects, setApiSubjects] = useState([]);
  const [subjectTopicsMap, setSubjectTopicsMap] = useState({});
  const [topicsLoaded, setTopicsLoaded] = useState(false);
  const child = userData?.children?.[0];

  // Beyond School state
  const [beyondSchoolSubjects, setBeyondSchoolSubjects] = useState([]);
  const [beyondSchoolTopicsMap, setBeyondSchoolTopicsMap] = useState({});
  const [beyondSchoolLoaded, setBeyondSchoolLoaded] = useState(false);

  // completedTopics stores keys as "SubjectName::TopicName::timestamp"
  // This helper checks if a topic has been completed regardless of timestamp
  const isTopicCompleted = (subjectName, topicName) => {
    const prefix = `${subjectName}::${topicName}::`;
    const exact = `${subjectName}::${topicName}`;
    for (const key of completedTopics) {
      if (key === exact || key.startsWith(prefix)) return true;
    }
    return false;
  };

  // Fetch subjects from backend
  useEffect(() => {
    fetchSubjects()
      .then(data => {
        // Fix any localhost URLs to use the actual server IP for physical device
        const fixed = data.map(s => ({
          ...s,
          imageUrl: s.imageUrl
            ? s.imageUrl.replace(
                'https://nudge2grow.com',
                'https://nudge2grow.com',
              )
            : s.imageUrl,
        }));
        setApiSubjects(fixed);
        // Pre-fetch topics for all subjects
        const promises = fixed.map(s =>
          fetchTopicsBySubject(s._id)
            .then(topics => ({
              id: s._id,
              topics: topics.map(t => ({
                ...t,
                imageUrl: t.imageUrl
                  ? t.imageUrl.replace(
                      'https://nudge2grow.com',
                      'https://nudge2grow.com',
                    )
                  : t.imageUrl,
              })),
            }))
            .catch(() => ({ id: s._id, topics: [] })),
        );
        Promise.all(promises).then(results => {
          const map = {};
          results.forEach(r => {
            map[r.id] = r.topics;
          });
          setSubjectTopicsMap(map);
          setTopicsLoaded(true);
        });
      })
      .catch(() => {});
  }, []);

  // Fetch Beyond School subjects the child selected
  useEffect(() => {
    const childTopics = child?.topics || []; // array of CustomizeLearning IDs
    if (childTopics.length === 0) {
      setBeyondSchoolLoaded(true);
      return;
    }
    fetchBeyondSchool()
      .then(allBeyondSubjects => {
        // Only show subjects the child selected
        const enrolled = allBeyondSubjects.filter(s =>
          childTopics.includes(String(s._id)),
        );
        setBeyondSchoolSubjects(enrolled);
        // Fetch topics for each enrolled beyond school subject
        const promises = enrolled.map(s =>
          fetchBeyondSchoolTopicsBySubject(s._id)
            .then(topics => ({ id: s._id, topics }))
            .catch(() => ({ id: s._id, topics: [] })),
        );
        Promise.all(promises).then(results => {
          const map = {};
          results.forEach(r => {
            map[r.id] = r.topics;
          });
          setBeyondSchoolTopicsMap(map);
          setBeyondSchoolLoaded(true);
        });
      })
      .catch(() => setBeyondSchoolLoaded(true));
  }, [child?.topics]);

  // Only show subjects that have at least 1 nudge for this child's grade/level
  const filteredNudges = getNudgesByGradeAndLevel(
    child?.grade,
    child?.subjectLevels,
  );
  const availableSubjectNames = [
    ...new Set(filteredNudges.map(n => n.subject)),
  ];
  const localSubjects = getAllSubjects().filter(s =>
    availableSubjectNames.includes(s.name),
  );

  // Filter API subjects based on student's enrolled subjects and levels
  const studentSubjectLevels = child?.subjectLevels || {};
  const enrolledSubjectIds = Object.keys(studentSubjectLevels);

  console.log(
    '[SubjectsListScreen] Student subject levels:',
    studentSubjectLevels,
  );
  console.log('[SubjectsListScreen] Enrolled subject IDs:', enrolledSubjectIds);
  console.log(
    '[SubjectsListScreen] All API subjects:',
    apiSubjects.map(s => ({ id: s._id, name: s.name })),
  );

  // If API returned subjects, filter to show ONLY subjects the student enrolled in
  const allSubjects =
    apiSubjects.length > 0
      ? apiSubjects.filter(subject => {
          const isEnrolled = enrolledSubjectIds.includes(subject._id);
          console.log(
            `[SubjectsListScreen] Subject ${subject.name} (${subject._id}): enrolled=${isEnrolled}`,
          );
          return isEnrolled;
        })
      : localSubjects.map(s => ({ name: s.name, isFromApi: false }));

  console.log(
    '[SubjectsListScreen] Filtered subjects to show:',
    allSubjects.map(s => s.name),
  );

  const subjectConfig = {
    Math: {
      image: require('../assets/images/math.png'),
      color: '#3B82F6',
      bgColor: '#EFF6FF',
      iconBg: '#DBEAFE',
    },
    'Science / EVS': {
      image: require('../assets/images/sci.png'),
      color: '#10B981',
      bgColor: '#ECFDF5',
      iconBg: '#D1FAE5',
    },
    English: {
      image: require('../assets/images/eng.png'),
      color: '#F59E0B',
      bgColor: '#FFFBEB',
      iconBg: '#FEF3C7',
    },
    'Social Studies': {
      image: require('../assets/images/social s.png'),
      color: '#EC4899',
      bgColor: '#FDF2F8',
      iconBg: '#FCE7F3',
    },
    'Artificial Intelligence': {
      image: require('../assets/images/Ai s.png'),
      color: '#8B5CF6',
      bgColor: '#F5F3FF',
      iconBg: '#EDE9FE',
    },
    'Financial Literacy': {
      image: require('../assets/images/Fl.png'),
      color: '#10B981',
      bgColor: '#ECFDF5',
      iconBg: '#D1FAE5',
    },
    'Sex & Safety Education': {
      image: require('../assets/images/ss.png'),
      color: '#EC4899',
      bgColor: '#FDF2F8',
      iconBg: '#FCE7F3',
    },
  };

  // Calculate overall progress including Beyond School topics
  const regularTopicsTotal =
    apiSubjects.length > 0
      ? apiSubjects.reduce(
          (sum, s) => sum + (subjectTopicsMap[s._id]?.length || 0),
          0,
        )
      : allSubjects.length * 12;
  const beyondTopicsTotal = beyondSchoolLoaded
    ? beyondSchoolSubjects.reduce(
        (sum, s) => sum + (beyondSchoolTopicsMap[s._id]?.length || 0),
        0,
      )
    : 0;
  const totalTopics = regularTopicsTotal + beyondTopicsTotal;
  // Count unique completed topics (strip timestamp suffix for deduplication)
  const uniqueCompletedKeys = new Set(
    [...completedTopics].map(k => k.split('::').slice(0, 2).join('::')),
  );
  const completedNudges = uniqueCompletedKeys.size;
  const overallProgress =
    totalTopics > 0 ? Math.round((completedNudges / totalTopics) * 100) : 0;
  const activeSubjects =
    (apiSubjects.filter(s => s.type !== 'premium').length ||
      allSubjects.length) + beyondSchoolSubjects.length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Icon
            name="arrow-back"
            size={isSmallDevice ? 22 : 24}
            color="#1A1A1A"
          />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Learning Subjects</Text>
          <Text style={styles.headerSubtitle}>
            {child?.name || 'Child'} · {child?.grade || 'Grade 1'} ·{' '}
            {allSubjects.length + beyondSchoolSubjects.length} subjects
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Overall Progress Card */}
        <View style={styles.overallProgressCard}>
          <View style={styles.progressLeft}>
            <CircularProgress
              percentage={overallProgress}
              color="#10B981"
              size={isSmallDevice ? 50 : 55}
            />
          </View>
          <View style={styles.progressRight}>
            <Text style={styles.progressTitle}>Overall Progress</Text>
            <Text style={styles.progressSubtitle}>
              {completedNudges} of {totalTopics} topics done
            </Text>
            <View style={styles.progressGrowth}>
              <Icon
                name="trending-up"
                size={isSmallDevice ? 14 : 16}
                color="#10B981"
              />
              <Text style={styles.progressGrowthText}>+12% from last week</Text>
            </View>
          </View>
          <View style={styles.activeCount}>
            <Text style={styles.activeNumber}>{activeSubjects}</Text>
            <Text style={styles.activeLabel}>Active</Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          <TouchableOpacity
            style={[
              styles.filterTab,
              selectedFilter === 'all' && styles.filterTabActive,
            ]}
            onPress={() => setSelectedFilter('all')}
          >
            <Text
              style={[
                styles.filterTabText,
                selectedFilter === 'all' && styles.filterTabTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterTab,
              selectedFilter === 'progress' && styles.filterTabActive,
            ]}
            onPress={() => setSelectedFilter('progress')}
          >
            <Text
              style={[
                styles.filterTabText,
                selectedFilter === 'progress' && styles.filterTabTextActive,
              ]}
            >
              In Progress
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterTab,
              selectedFilter === 'beyondSchool' && styles.filterTabActive,
            ]}
            onPress={() => setSelectedFilter('beyondSchool')}
          >
            <Text
              style={[
                styles.filterTabText,
                selectedFilter === 'beyondSchool' && styles.filterTabTextActive,
              ]}
            >
              Beyond School
            </Text>
          </TouchableOpacity>
        </View>

        {/* Subjects List */}
        <View style={styles.subjectsContainer}>
          {allSubjects.length === 0 ? (
            <View style={styles.emptyStateCard}>
              <MaterialIcon
                name="book-clock-outline"
                size={40}
                color="#9CA3AF"
              />
              <Text style={styles.emptyStateTitle}>No subjects available</Text>
              <Text style={styles.emptyStateText}>
                {apiSubjects.length > 0
                  ? `No subjects found for ${
                      child?.name || 'this student'
                    }'s selected level. Please check your subject preferences in Settings.`
                  : `We're preparing topics for ${
                      child?.grade || 'this grade'
                    }. Check back soon!`}
              </Text>
            </View>
          ) : null}
          {(selectedFilter === 'all' || selectedFilter === 'progress') &&
            allSubjects
              .filter(s => s.type !== 'premium')
              .map((subject, index) => {
                const config = subjectConfig[subject.name] || {
                  icon: 'book-outline',
                  color: '#6B7280',
                  bgColor: '#F9FAFB',
                  iconBg: '#E5E7EB',
                };
                const nudgesCount =
                  filteredNudges.filter(n => n.subject === subject.name)
                    .length || getNudgesBySubject(subject.name).length;

                // Use actual topic count from API — only fall back to 12 if topics haven't loaded yet
                const allTopicsForSubject = subjectTopicsMap[subject._id] || [];
                const childGrade = child?.grade;
                // Map subject name to subjectLevels key used during registration
                const subjectLevelKeyMap = {
                  Math: 'mathematics',
                  Mathematics: 'mathematics',
                  'Science / EVS': 'science',
                  'Science/EVS': 'science',
                  English: 'english',
                  'Social Studies': 'social-studies',
                  'Artificial Intelligence': 'artificial-intelligence',
                  'Financial Literacy': 'financial',
                  'Sex & Safety': 'safety',
                };
                const levelKey =
                  subjectLevelKeyMap[subject.name] ||
                  subject.name?.toLowerCase().replace(/ /g, '-');

                // Get the student's selected level for this subject from subjectLevels
                // subjectLevels is an object like: { "subjectId1": "Beginner", "subjectId2": "Intermediate" }
                const childLevel = child?.subjectLevels?.[subject._id] || null;

                // Filter topics by BOTH grade AND level to show only what matches the student's enrollment
                const gradeFilteredTopics = topicsLoaded
                  ? allTopicsForSubject.filter(t => {
                      const gradeMatch =
                        !t.grade || !childGrade || t.grade === childGrade;
                      const levelMatch =
                        !t.level || !childLevel || t.level === childLevel;
                      return gradeMatch && levelMatch;
                    })
                  : null;
                const topicCount = topicsLoaded
                  ? gradeFilteredTopics?.length || 0
                  : 12;
                const completedCount = gradeFilteredTopics
                  ? gradeFilteredTopics.filter(t =>
                      isTopicCompleted(subject.name, t.topic || t.title),
                    ).length
                  : 0;
                const progress =
                  topicCount > 0
                    ? Math.floor((completedCount / topicCount) * 100)
                    : 0;
                const streak = index === 0 ? 5 : 0;
                const isActive = index === 0;
                const status =
                  progress >= 80
                    ? 'On Track'
                    : progress >= 50
                    ? 'In Progress'
                    : 'Started';

                return (
                  <TouchableOpacity
                    key={subject.name}
                    style={styles.subjectCard}
                    onPress={() => {
                      const allApiTopics = subjectTopicsMap[subject._id] || [];
                      const childGradeNav = child?.grade;

                      // Get the student's selected level for this subject
                      const childLevelNav =
                        child?.subjectLevels?.[subject._id] || null;

                      // Filter topics by BOTH grade AND level
                      let apiTopics = allApiTopics.filter(t => {
                        const gradeMatch =
                          !t.grade ||
                          !childGradeNav ||
                          t.grade === childGradeNav;
                        const levelMatch =
                          !t.level ||
                          !childLevelNav ||
                          t.level === childLevelNav;
                        return gradeMatch && levelMatch;
                      });

                      // Only navigate if there are matching topics for the student's grade and level
                      if (apiTopics.length > 0) {
                        onNavigate &&
                          onNavigate('topicDetail', {
                            subjectName: subject.name,
                            topicData: {
                              subject: subject.name,
                              topic: apiTopics[0].topic || apiTopics[0].title,
                              apiTopics,
                            },
                            allNudges: apiTopics.map(t => ({
                              subject: subject.name,
                              topic: t.topic || t.title,
                              apiTopic: t,
                            })),
                            apiSubject: subject,
                          });
                      }
                      // No matching topics — don't navigate
                    }}
                  >
                    <View style={styles.subjectHeader}>
                      <View style={styles.subjectLeft}>
                        <View
                          style={[
                            styles.subjectIconContainer,
                            { backgroundColor: 'transparent' },
                          ]}
                        >
                          {subject.imageUrl ? (
                            <Image
                              source={{ uri: getImageUri(subject.imageUrl) }}
                              style={styles.subjectIconImage}
                              resizeMode="contain"
                            />
                          ) : config.image ? (
                            <Image
                              source={config.image}
                              style={styles.subjectIconImage}
                              resizeMode="contain"
                            />
                          ) : (
                            <MaterialIcon
                              name={config.icon || 'book-outline'}
                              size={isSmallDevice ? 22 : 24}
                              color={config.color || '#6B7280'}
                            />
                          )}
                        </View>
                        <View style={styles.subjectInfo}>
                          <View style={styles.subjectTitleRow}>
                            <Text style={styles.subjectName}>
                              {subject.name}
                            </Text>
                            {isActive && (
                              <View style={styles.mostActiveBadge}>
                                <Text style={styles.mostActiveText}>
                                  Most Active
                                </Text>
                              </View>
                            )}
                          </View>
                          <Text style={styles.subjectDescription}>
                            {subject.description ||
                              (subject.name === 'Math'
                                ? 'Numbers, logic & problem solving'
                                : subject.name === 'Science / EVS'
                                ? 'Nature, environment & exploration'
                                : subject.name === 'English'
                                ? 'Reading, writing & communication'
                                : subject.name === 'Social Studies'
                                ? 'History, culture & society'
                                : subject.name === 'Artificial Intelligence'
                                ? 'AI, machine learning & technology'
                                : subject.name === 'Financial Literacy'
                                ? 'Money management & financial skills'
                                : subject.name === 'Sex & Safety'
                                ? 'Health, safety & well-being'
                                : 'Learning & growth')}
                          </Text>
                        </View>
                      </View>
                      <CircularProgress
                        percentage={progress}
                        color="#10B981"
                        size={isSmallDevice ? 32 : 36}
                      />
                    </View>

                    {/* Progress Bar */}
                    <View style={styles.progressBarContainer}>
                      <View style={styles.progressBarBackground}>
                        <View
                          style={[
                            styles.progressBarFill,
                            {
                              width: `${progress}%`,
                              backgroundColor: '#10B981',
                            },
                          ]}
                        />
                      </View>
                      <View style={styles.progressTextContainer}>
                        <Text style={styles.progressText}>
                          {completedCount}/{topicCount}
                        </Text>
                        <TouchableOpacity style={styles.progressArrowButton}>
                          <Icon
                            name="chevron-forward"
                            size={isSmallDevice ? 14 : 16}
                            color="#9CA3AF"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Footer */}
                    <View style={styles.subjectFooter}>
                      <View style={styles.subjectStats}>
                        <View style={styles.statItem}>
                          <Icon
                            name="book-outline"
                            size={isSmallDevice ? 14 : 16}
                            color="#9CA3AF"
                          />
                          <Text style={styles.statText}>
                            {topicCount} {topicCount === 1 ? 'topic' : 'topics'}
                          </Text>
                        </View>
                        {streak > 0 && (
                          <View style={styles.statItem}>
                            <Icon
                              name="flame"
                              size={isSmallDevice ? 14 : 16}
                              color="#F59E0B"
                            />
                            <Text style={styles.statText}>
                              {streak}-day streak
                            </Text>
                          </View>
                        )}
                      </View>
                      <View
                        style={[
                          styles.statusBadge,
                          progress >= 80 && styles.statusBadgeSuccess,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            progress >= 80 && styles.statusTextSuccess,
                          ]}
                        >
                          {status} ✓
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}

          {/* Beyond School Section */}
          {(selectedFilter === 'all' || selectedFilter === 'beyondSchool') && (
            <>
              {/* Section header — only show in "All" tab */}
              {selectedFilter === 'all' && beyondSchoolSubjects.length > 0 && (
                <View style={styles.sectionHeader}>
                  <MaterialIcon
                    name="star-circle-outline"
                    size={18}
                    color="#8B5CF6"
                  />
                  <Text style={styles.sectionHeaderText}>Beyond School</Text>
                </View>
              )}

              {beyondSchoolLoaded && beyondSchoolSubjects.length === 0 ? (
                selectedFilter === 'beyondSchool' ? (
                  <View style={styles.emptyStateCard}>
                    <MaterialIcon
                      name="star-circle-outline"
                      size={40}
                      color="#9CA3AF"
                    />
                    <Text style={styles.emptyStateTitle}>
                      No Beyond School subjects
                    </Text>
                    <Text style={styles.emptyStateText}>
                      Go to Settings to select your child's interests.
                    </Text>
                  </View>
                ) : null
              ) : (
                beyondSchoolSubjects.map((subject, index) => {
                  const topics = beyondSchoolTopicsMap[subject._id] || [];
                  const topicCount = beyondSchoolLoaded ? topics.length : 0;
                  const completedCount = topics.filter(t =>
                    isTopicCompleted(subject.name, t.topic || t.title),
                  ).length;
                  const progress =
                    topicCount > 0
                      ? Math.floor((completedCount / topicCount) * 100)
                      : 0;

                  return (
                    <TouchableOpacity
                      key={subject._id || index}
                      style={styles.subjectCard}
                      onPress={() => {
                        if (topics.length > 0) {
                          onNavigate &&
                            onNavigate('topicDetail', {
                              subjectName: subject.name,
                              isBeyondSchool: true,
                              topicData: {
                                subject: subject.name,
                                topic: topics[0].topic || topics[0].title,
                                apiTopics: topics,
                              },
                              allNudges: topics.map(t => ({
                                subject: subject.name,
                                topic: t.topic || t.title,
                                apiTopic: t,
                              })),
                              apiSubject: subject,
                            });
                        }
                      }}
                    >
                      <View style={styles.subjectHeader}>
                        <View style={styles.subjectLeft}>
                          <View
                            style={[
                              styles.subjectIconContainer,
                              { backgroundColor: '#F5F3FF' },
                            ]}
                          >
                            {subject.imageUrl ? (
                              <Image
                                source={{ uri: getImageUri(subject.imageUrl) }}
                                style={styles.subjectIconImage}
                                resizeMode="contain"
                              />
                            ) : (
                              <MaterialIcon
                                name={
                                  subject.rnIcon ||
                                  subject.icon ||
                                  'star-circle-outline'
                                }
                                size={isSmallDevice ? 22 : 24}
                                color="#8B5CF6"
                              />
                            )}
                          </View>
                          <View style={styles.subjectInfo}>
                            <View style={styles.subjectTitleRow}>
                              <Text style={styles.subjectName}>
                                {subject.name}
                              </Text>
                            </View>
                            <Text style={styles.subjectDescription}>
                              {subject.description ||
                                'Exploratory learning beyond the classroom'}
                            </Text>
                          </View>
                        </View>
                        <CircularProgress
                          percentage={progress}
                          color="#8B5CF6"
                          size={isSmallDevice ? 32 : 36}
                        />
                      </View>

                      {/* Progress Bar */}
                      <View style={styles.progressBarContainer}>
                        <View style={styles.progressBarBackground}>
                          <View
                            style={[
                              styles.progressBarFill,
                              {
                                width: `${progress}%`,
                                backgroundColor: '#8B5CF6',
                              },
                            ]}
                          />
                        </View>
                        <View style={styles.progressTextContainer}>
                          <Text style={styles.progressText}>
                            {completedCount}/{topicCount}
                          </Text>
                          <TouchableOpacity style={styles.progressArrowButton}>
                            <Icon
                              name="chevron-forward"
                              size={isSmallDevice ? 14 : 16}
                              color="#9CA3AF"
                            />
                          </TouchableOpacity>
                        </View>
                      </View>

                      {/* Footer */}
                      <View style={styles.subjectFooter}>
                        <View style={styles.subjectStats}>
                          <View style={styles.statItem}>
                            <Icon
                              name="book-outline"
                              size={isSmallDevice ? 14 : 16}
                              color="#9CA3AF"
                            />
                            <Text style={styles.statText}>
                              {topicCount}{' '}
                              {topicCount === 1 ? 'topic' : 'topics'}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={[
                            styles.statusBadge,
                            progress >= 80 && { backgroundColor: '#EDE9FE' },
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusText,
                              progress >= 80 && { color: '#8B5CF6' },
                            ]}
                          >
                            {progress >= 80
                              ? 'On Track ✓'
                              : progress >= 50
                              ? 'In Progress ✓'
                              : 'Started ✓'}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}
            </>
          )}

          {/* Beyond School section ends above */}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#F8F9FA',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: isSmallDevice ? 42 : 50,
    paddingBottom: isSmallDevice ? 12 : 16,
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
    fontSize: isTablet ? 20 : isSmallDevice ? 17 : 18,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'Montserrat-Bold',
  },
  headerSubtitle: {
    fontSize: isTablet ? 13 : isSmallDevice ? 11 : 12,
    color: '#9CA3AF',
    marginTop: 2,
    fontFamily: 'Montserrat-Regular',
  },
  content: {
    flex: 1,
  },

  // Overall Progress Card
  overallProgressCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: isSmallDevice ? 16 : 20,
    marginTop: isSmallDevice ? 12 : 16,
    marginBottom: isSmallDevice ? 12 : 16,
    padding: isSmallDevice ? 12 : 14,
    borderRadius: isSmallDevice ? 14 : 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  progressLeft: {
    marginRight: isSmallDevice ? 12 : 14,
  },
  progressRight: {
    flex: 1,
  },
  progressTitle: {
    fontSize: isTablet ? 18 : isSmallDevice ? 15 : 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
    fontFamily: 'Montserrat-Bold',
  },
  progressSubtitle: {
    fontSize: isTablet ? 13 : isSmallDevice ? 11 : 12,
    color: '#9CA3AF',
    marginBottom: 6,
    fontFamily: 'Montserrat-Regular',
  },
  progressGrowth: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  progressGrowthText: {
    fontSize: isTablet ? 12 : isSmallDevice ? 10 : 11,
    fontWeight: '600',
    color: '#10B981',
    fontFamily: 'Montserrat-SemiBold',
  },
  activeCount: {
    alignItems: 'center',
  },
  activeNumber: {
    fontSize: isTablet ? 28 : isSmallDevice ? 24 : 26,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'Montserrat-Bold',
  },
  activeLabel: {
    fontSize: isTablet ? 12 : isSmallDevice ? 10 : 11,
    color: '#9CA3AF',
    fontFamily: 'Montserrat-Medium',
  },

  // Filter Tabs
  filterTabs: {
    flexDirection: 'row',
    marginHorizontal: isSmallDevice ? 16 : 20,
    marginBottom: isSmallDevice ? 16 : 20,
    gap: isSmallDevice ? 8 : 10,
  },
  filterTab: {
    flex: 1,
    paddingVertical: isSmallDevice ? 10 : 12,
    borderRadius: isSmallDevice ? 10 : 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  filterTabActive: {
    backgroundColor: '#2C3E50',
  },
  filterTabText: {
    fontSize: isTablet ? 14 : isSmallDevice ? 12 : 13,
    fontWeight: '600',
    color: '#6B7280',
    fontFamily: 'Montserrat-SemiBold',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },

  // Subjects Container
  subjectsContainer: {
    paddingHorizontal: isSmallDevice ? 16 : 20,
    gap: isSmallDevice ? 12 : 16,
  },
  emptyStateCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
    gap: 10,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
  emptyStateText: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  subjectCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: isSmallDevice ? 14 : 16,
    padding: isSmallDevice ? 12 : 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  subjectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: isSmallDevice ? 8 : 10,
  },
  subjectLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  subjectRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isSmallDevice ? 8 : 10,
  },
  arrowButton: {
    width: isSmallDevice ? 28 : 32,
    height: isSmallDevice ? 28 : 32,
    borderRadius: isSmallDevice ? 14 : 16,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subjectIconContainer: {
    width: isSmallDevice ? 40 : 44,
    height: isSmallDevice ? 40 : 44,
    borderRadius: isSmallDevice ? 10 : 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: isSmallDevice ? 8 : 10,
  },
  subjectIconImage: {
    width: '80%',
    height: '80%',
  },
  subjectInfo: {
    flex: 1,
  },
  subjectTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  subjectName: {
    fontSize: isTablet ? 16 : isSmallDevice ? 14 : 15,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'Montserrat-Bold',
  },
  mostActiveBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  mostActiveText: {
    fontSize: isSmallDevice ? 9 : 10,
    fontWeight: '600',
    color: '#3B82F6',
    fontFamily: 'Montserrat-SemiBold',
  },
  subjectDescription: {
    fontSize: isTablet ? 12 : isSmallDevice ? 10 : 11,
    color: '#9CA3AF',
    fontFamily: 'Montserrat-Regular',
  },

  // Progress Bar
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: isSmallDevice ? 8 : 10,
    gap: isSmallDevice ? 8 : 10,
  },
  progressBarBackground: {
    flex: 1,
    height: isSmallDevice ? 5 : 6,
    backgroundColor: '#E5E7EB',
    borderRadius: isSmallDevice ? 3 : 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: isSmallDevice ? 3 : 4,
  },
  progressTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  progressText: {
    fontSize: isTablet ? 13 : isSmallDevice ? 11 : 12,
    fontWeight: '600',
    color: '#6B7280',
    fontFamily: 'Montserrat-SemiBold',
  },
  progressArrowButton: {
    width: isSmallDevice ? 20 : 22,
    height: isSmallDevice ? 20 : 22,
    borderRadius: isSmallDevice ? 10 : 11,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Footer
  subjectFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectStats: {
    flexDirection: 'row',
    gap: isSmallDevice ? 10 : 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: isTablet ? 12 : isSmallDevice ? 10 : 11,
    color: '#6B7280',
    fontFamily: 'Montserrat-Regular',
  },
  statusBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: isSmallDevice ? 8 : 10,
    paddingVertical: isSmallDevice ? 4 : 5,
    borderRadius: isSmallDevice ? 8 : 10,
  },
  statusBadgeSuccess: {
    backgroundColor: '#D1FAE5',
  },
  statusText: {
    fontSize: isTablet ? 11 : isSmallDevice ? 9 : 10,
    fontWeight: '600',
    color: '#6B7280',
    fontFamily: 'Montserrat-SemiBold',
  },
  statusTextSuccess: {
    color: '#10B981',
  },

  bottomSpacing: {
    height: 30,
  },

  // Beyond School Badge
  beyondBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 3,
  },
  beyondBadgeText: {
    fontSize: isSmallDevice ? 9 : 10,
    fontWeight: '600',
    color: '#8B5CF6',
    fontFamily: 'Montserrat-SemiBold',
  },

  // Section Header (divider between All Subjects and Beyond School)
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  sectionHeaderText: {
    fontSize: isTablet ? 14 : isSmallDevice ? 12 : 13,
    fontWeight: '700',
    color: '#8B5CF6',
    fontFamily: 'Montserrat-Bold',
  },
});

export default SubjectsListScreen;
