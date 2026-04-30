
/**
 * Topic Detail Screen - Shows daily nudge with calendar, units, and flashcards
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Alert,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { getFlashcards, getQACards, getPrompts } from '../data/nudgesData';
import { fetchContentSetByTopic, fetchLearnDetailByTopic, fetchBeyondSchoolContentSetByTopic, fetchBeyondSchoolLearnDetailByTopic } from '../api';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const TopicDetailScreen = ({
  topicData,
  subjectName,
  allNudges,
  userData,
  onBack,
  onNavigate,
  initialTopicId,
  isBeyondSchool,
}) => {
  // Initialize selectedDate to most recent scheduled date
  const getInitialDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    console.log('=== [getInitialDate] Finding most recent past/today date ===');
    console.log('[getInitialDate] Today is:', today.toDateString());
    
    if (allNudges && allNudges.length > 0) {
      // Get all scheduled dates that are TODAY or in the PAST
      const pastOrTodayDates = allNudges
        .filter(nudge => {
          if (!nudge.apiTopic?.scheduledDate) return false;
          
          const scheduledDate = new Date(nudge.apiTopic.scheduledDate);
          scheduledDate.setHours(0, 0, 0, 0);
          
          // CRITICAL: Only include dates that are today or in the past
          const isPastOrToday = scheduledDate <= today;
          
          console.log('[getInitialDate] Checking:', scheduledDate.toDateString(), 
            '| Is past/today?', isPastOrToday);
          
          return isPastOrToday;
        })
        .map(nudge => new Date(nudge.apiTopic.scheduledDate))
        .sort((a, b) => b - a); // Sort descending (most recent first)
      
      if (pastOrTodayDates.length > 0) {
        const mostRecentDate = pastOrTodayDates[0];
        console.log('[getInitialDate] ✓ Selected most recent past/today date:', 
          mostRecentDate.toDateString());
        return mostRecentDate.getDate();
      } else {
        console.log('[getInitialDate] No past/today dates found, using today');
      }
    }
    
    console.log('[getInitialDate] Defaulting to today:', today.getDate());
    return today.getDate();
  };

  const [selectedDate, setSelectedDate] = useState(getInitialDate());
  const [expandedUnit, setExpandedUnit] = useState(null);
  const [currentFlashcard, setCurrentFlashcard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerMonth, setPickerMonth] = useState(new Date().getMonth());
  const [pickerYear, setPickerYear] = useState(new Date().getFullYear());
  const [learningStatus, setLearningStatus] = useState(null);
  const [topicRelevance, setTopicRelevance] = useState(null);
  const [currentNudgeIndex, setCurrentNudgeIndex] = useState(0);

  // API content set (flashcards, Q&A, prompts from admin panel)
  const [apiContentSet, setApiContentSet] = useState(null);
  const [apiLearnDetail, setApiLearnDetail] = useState(null);
  const [selectedApiTopic, setSelectedApiTopic] = useState(null);

  // Set initial topic — prefer the one passed from HomeScreen card tap
  useEffect(() => {
    if (allNudges && allNudges.length > 0 && !selectedApiTopic) {
      // If a specific topic was tapped, open directly on it
      if (initialTopicId) {
        const targeted = allNudges.find(n => String(n.apiTopic?._id) === String(initialTopicId));
        if (targeted?.apiTopic) {
          setSelectedApiTopic(targeted.apiTopic);
          const d = new Date(targeted.apiTopic.scheduledDate);
          setSelectedDate(d.getDate());
          return;
        }
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Fall back to most recent past/today topic
      const pastOrTodayNudges = allNudges
        .filter(nudge => {
          if (!nudge.apiTopic?.scheduledDate) return false;
          const scheduledDate = new Date(nudge.apiTopic.scheduledDate);
          scheduledDate.setHours(0, 0, 0, 0);
          return scheduledDate <= today;
        })
        .sort((a, b) => new Date(b.apiTopic.scheduledDate) - new Date(a.apiTopic.scheduledDate));

      if (pastOrTodayNudges.length > 0) {
        setSelectedApiTopic(pastOrTodayNudges[0].apiTopic);
      } else if (topicData?.apiTopics?.[0]) {
        setSelectedApiTopic(topicData.apiTopics[0]);
      }
    }
  }, [allNudges, topicData, initialTopicId]);

  // Update selected topic when date changes
  useEffect(() => {
    if (allNudges && allNudges.length > 0) {
      // Find the topic that matches the selected date
      const matchingNudge = allNudges.find(nudge => {
        if (nudge.apiTopic?.scheduledDate) {
          const scheduledDate = new Date(nudge.apiTopic.scheduledDate);
          return (
            scheduledDate.getDate() === selectedDate &&
            scheduledDate.getMonth() === currentDate.getMonth() &&
            scheduledDate.getFullYear() === currentYear
          );
        }
        return false;
      });
      
      if (matchingNudge?.apiTopic) {
        setSelectedApiTopic(matchingNudge.apiTopic);
      }
    }
  }, [selectedDate, allNudges]);

  // Fetch content set and learn detail when an API topic is selected
  useEffect(() => {
    if (selectedApiTopic?._id) {
      // Use beyond-school endpoints if this is a beyond school topic
      const contentSetFetch = isBeyondSchool
        ? fetchBeyondSchoolContentSetByTopic(selectedApiTopic._id)
        : fetchContentSetByTopic(selectedApiTopic._id);
      const learnDetailFetch = isBeyondSchool
        ? fetchBeyondSchoolLearnDetailByTopic(selectedApiTopic._id)
        : fetchLearnDetailByTopic(selectedApiTopic._id);

      contentSetFetch
        .then(set => setApiContentSet(set))
        .catch(() => setApiContentSet(null));
      learnDetailFetch
        .then(detail => setApiLearnDetail(detail))
        .catch(() => setApiLearnDetail(null));
    }
  }, [selectedApiTopic?._id, isBeyondSchool]);

  // Fix localhost URLs in content
  const fixUrl = url =>
    url
      ? url.replace(
          'https://nudgebackend.onrender.com',
          'https://nudgebackend.onrender.com',
        )
      : url;

  // Use allNudges if available, otherwise use topicData
  const nudgesToDisplay =
    allNudges && allNudges.length > 0 ? allNudges : [topicData];
  const currentNudge = nudgesToDisplay[currentNudgeIndex] || topicData;

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('en-US', { month: 'long' });
  const currentYear = currentDate.getFullYear();
  const currentDayName = currentDate.toLocaleString('en-US', {
    weekday: 'long',
  });
  const currentDay = currentDate.getDate();

  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const generateWeekDates = () => {
    const dates = [];
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date.getDate());
    }
    return dates;
  };

  const dates = generateWeekDates();

  const getAvailableDates = () => {
    const available = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time for accurate comparison
    
    console.log('=== [TopicDetail] getAvailableDates START ===');
    console.log('[TopicDetail] Today is:', today.toDateString(), '| Timestamp:', today.getTime());
    
    // Get all topics with scheduled dates from allNudges
    if (allNudges && allNudges.length > 0) {
      console.log('[TopicDetail] Processing', allNudges.length, 'nudges');
      
      allNudges.forEach((nudge, idx) => {
        if (nudge.apiTopic?.scheduledDate) {
          const scheduledDate = new Date(nudge.apiTopic.scheduledDate);
          scheduledDate.setHours(0, 0, 0, 0); // Reset time for accurate comparison
          
          // CRITICAL: Only include dates that are today or in the past
          // Future dates should NEVER be accessible even if topics are uploaded
          const isPastOrToday = scheduledDate <= today;
          
          console.log(`[TopicDetail] Nudge ${idx + 1}:`, {
            scheduledDate: scheduledDate.toDateString(),
            timestamp: scheduledDate.getTime(),
            isPastOrToday: isPastOrToday,
            comparison: scheduledDate.getTime() <= today.getTime(),
          });
          
          if (isPastOrToday) {
            available.push({
              date: scheduledDate.getDate(),
              month: scheduledDate.getMonth(),
              year: scheduledDate.getFullYear(),
            });
            console.log('[TopicDetail] ✓ Added to available dates');
          } else {
            console.log('[TopicDetail] ✗ Skipping future date:', scheduledDate.toDateString());
          }
        }
      });
    }
    
    console.log('[TopicDetail] Total available dates (past/today only):', available.length);
    console.log('[TopicDetail] Available dates:', available);
    console.log('=== [TopicDetail] getAvailableDates END ===');
    
    // If no scheduled dates found, show today only
    if (available.length === 0) {
      available.push({
        date: today.getDate(),
        month: today.getMonth(),
        year: today.getFullYear(),
      });
    }
    
    return available;
  };

  const availableDates = getAvailableDates();

  const hasDataForDate = (day, month, year) => {
    // Double-check: even if date is in availableDates, verify it's not in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const checkDate = new Date(year, month, day);
    checkDate.setHours(0, 0, 0, 0);
    
    // If the date is in the future, return false regardless of availableDates
    if (checkDate > today) {
      console.log('[hasDataForDate] ✗ REJECTING FUTURE DATE:', checkDate.toDateString(), 
        '| Today:', today.toDateString());
      return false;
    }
    
    // Check if date exists in availableDates
    const hasData = availableDates.some(
      d => d.date === day && d.month === month && d.year === year,
    );
    
    if (hasData) {
      console.log('[hasDataForDate] ✓ Date has data:', checkDate.toDateString());
    }
    
    return hasData;
  };

  const getWeeklyTopics = () => {
    const subject = currentNudge?.subject || subjectName;

    if (subject === 'Math') {
      return [
        {
          day: 'Sunday',
          topic: 'Counting Money',
          icon: 'cash-multiple',
          color: '#3B82F6',
        },
        {
          day: 'Monday',
          topic: 'Simple Addition',
          icon: 'plus-circle',
          color: '#3B82F6',
        },
        {
          day: 'Tuesday',
          topic: 'Basic Shapes',
          icon: 'shape',
          color: '#3B82F6',
        },
        {
          day: 'Wednesday',
          topic: 'Patterns',
          icon: 'dots-horizontal',
          color: '#3B82F6',
        },
        {
          day: 'Thursday',
          topic: 'Measurement',
          icon: 'ruler',
          color: '#3B82F6',
        },
        {
          day: 'Friday',
          topic: 'Number Games',
          icon: 'numeric',
          color: '#3B82F6',
        },
        {
          day: 'Saturday',
          topic: 'Spatial Shapes',
          icon: 'cube-outline',
          color: '#3B82F6',
        },
      ];
    }

    if (subject === 'Science / EVS') {
      return [
        {
          day: 'Sunday',
          topic: 'Water Conservation',
          icon: 'water',
          color: '#10B981',
        },
        {
          day: 'Monday',
          topic: 'Water Cycle',
          icon: 'water-outline',
          color: '#10B981',
        },
        {
          day: 'Tuesday',
          topic: 'Saving Water',
          icon: 'water-pump',
          color: '#10B981',
        },
        {
          day: 'Wednesday',
          topic: 'Parts of a Plant',
          icon: 'flower',
          color: '#10B981',
        },
        {
          day: 'Thursday',
          topic: 'Growing Plants',
          icon: 'sprout',
          color: '#10B981',
        },
        {
          day: 'Friday',
          topic: 'Trees & Nature',
          icon: 'leaf',
          color: '#10B981',
        },
        {
          day: 'Saturday',
          topic: 'Recycling',
          icon: 'recycle',
          color: '#10B981',
        },
      ];
    }

    if (subject === 'English') {
      return [
        {
          day: 'Sunday',
          topic: 'Story Time',
          icon: 'book-open-variant',
          color: '#F59E0B',
        },
        {
          day: 'Monday',
          topic: 'Reading Skills',
          icon: 'book-alphabet',
          color: '#F59E0B',
        },
        {
          day: 'Tuesday',
          topic: 'Writing Letters',
          icon: 'pencil',
          color: '#F59E0B',
        },
        {
          day: 'Wednesday',
          topic: 'Rhyming Words',
          icon: 'music-note',
          color: '#F59E0B',
        },
        {
          day: 'Thursday',
          topic: 'Story Elements',
          icon: 'book-open-page-variant',
          color: '#F59E0B',
        },
        {
          day: 'Friday',
          topic: 'Vocabulary',
          icon: 'alphabetical',
          color: '#F59E0B',
        },
        {
          day: 'Saturday',
          topic: 'Creative Writing',
          icon: 'fountain-pen-tip',
          color: '#F59E0B',
        },
      ];
    }

    if (subject === 'Social Studies') {
      return [
        {
          day: 'Sunday',
          topic: 'Acts of Kindness',
          icon: 'heart-multiple',
          color: '#EC4899',
        },
        {
          day: 'Monday',
          topic: 'Sharing & Caring',
          icon: 'hand-heart',
          color: '#EC4899',
        },
        {
          day: 'Tuesday',
          topic: 'Honesty',
          icon: 'shield-check',
          color: '#EC4899',
        },
        {
          day: 'Wednesday',
          topic: 'Respect',
          icon: 'account-group',
          color: '#EC4899',
        },
        {
          day: 'Thursday',
          topic: 'Empathy',
          icon: 'emoticon-happy',
          color: '#EC4899',
        },
        { day: 'Friday', topic: 'Gratitude', icon: 'gift', color: '#EC4899' },
        {
          day: 'Saturday',
          topic: 'Helping Others',
          icon: 'hand-heart-outline',
          color: '#EC4899',
        },
      ];
    }

    if (subject === 'Artificial Intelligence') {
      return [
        {
          day: 'Sunday',
          topic: 'What is AI?',
          icon: 'brain',
          color: '#8B5CF6',
        },
        {
          day: 'Monday',
          topic: 'AI in Your Phone',
          icon: 'smartphone',
          color: '#8B5CF6',
        },
        {
          day: 'Tuesday',
          topic: 'AI in Games',
          icon: 'gamepad-variant',
          color: '#8B5CF6',
        },
        {
          day: 'Wednesday',
          topic: 'AI Helps Us',
          icon: 'robot',
          color: '#8B5CF6',
        },
        {
          day: 'Thursday',
          topic: 'Machine Learning',
          icon: 'brain-outline',
          color: '#8B5CF6',
        },
        {
          day: 'Friday',
          topic: 'AI in Future',
          icon: 'rocket',
          color: '#8B5CF6',
        },
        {
          day: 'Saturday',
          topic: 'AI Ethics',
          icon: 'scale-balance',
          color: '#8B5CF6',
        },
      ];
    }

    if (subject === 'Financial Literacy') {
      return [
        {
          day: 'Sunday',
          topic: 'Where Money Comes From',
          icon: 'cash-multiple',
          color: '#10B981',
        },
        {
          day: 'Monday',
          topic: 'Saving Money',
          icon: 'piggy-bank',
          color: '#10B981',
        },
        {
          day: 'Tuesday',
          topic: 'Spending Wisely',
          icon: 'shopping-cart',
          color: '#10B981',
        },
        {
          day: 'Wednesday',
          topic: 'Earning Money',
          icon: 'briefcase',
          color: '#10B981',
        },
        {
          day: 'Thursday',
          topic: 'Money Goals',
          icon: 'target',
          color: '#10B981',
        },
        {
          day: 'Friday',
          topic: 'Banking Basics',
          icon: 'bank',
          color: '#10B981',
        },
        {
          day: 'Saturday',
          topic: 'Financial Planning',
          icon: 'chart-line',
          color: '#10B981',
        },
      ];
    }

    if (subject === 'Sex & Safety') {
      return [
        {
          day: 'Sunday',
          topic: 'My Body, My Rules',
          icon: 'heart-check',
          color: '#EF4444',
        },
        {
          day: 'Monday',
          topic: 'Safe & Unsafe Touches',
          icon: 'shield-alert',
          color: '#EF4444',
        },
        {
          day: 'Tuesday',
          topic: 'Private Parts',
          icon: 'information',
          color: '#EF4444',
        },
        {
          day: 'Wednesday',
          topic: 'Saying No',
          icon: 'hand-raised',
          color: '#EF4444',
        },
        {
          day: 'Thursday',
          topic: 'Asking for Help',
          icon: 'phone',
          color: '#EF4444',
        },
        {
          day: 'Friday',
          topic: 'Trusted Adults',
          icon: 'account-multiple',
          color: '#EF4444',
        },
        {
          day: 'Saturday',
          topic: 'Safety Tips',
          icon: 'shield-check',
          color: '#EF4444',
        },
      ];
    }

    // Default topics
    return [
      {
        day: 'Sunday',
        topic: 'Learning Fun',
        icon: 'school',
        color: '#2196F3',
      },
      {
        day: 'Monday',
        topic: 'Discovery Time',
        icon: 'magnify',
        color: '#FF9800',
      },
      {
        day: 'Tuesday',
        topic: 'Exploration',
        icon: 'compass',
        color: '#4CAF50',
      },
      {
        day: 'Wednesday',
        topic: 'Creative Play',
        icon: 'puzzle',
        color: '#9C27B0',
      },
      {
        day: 'Thursday',
        topic: 'Learning Journey',
        icon: 'map',
        color: '#27AE60',
      },
      {
        day: 'Friday',
        topic: 'Fun Activities',
        icon: 'star',
        color: '#FFB84D',
      },
      {
        day: 'Saturday',
        topic: 'Weekend Learning',
        icon: 'calendar-star',
        color: '#00BCD4',
      },
    ];
  };

  // If we have API topics, use them as the topic list instead of hardcoded weekly topics
  const apiTopics = topicData?.apiTopics || [];
  const hasApiTopics = apiTopics.length > 0;

  const weeklyTopics = getWeeklyTopics();
  const todayIndex = currentDate.getDay();
  const todayTopic = weeklyTopics[todayIndex];

  const getSelectedDayIndex = () => {
    for (let i = 0; i < dates.length; i++) {
      if (dates[i] === selectedDate) {
        return i;
      }
    }
    return todayIndex;
  };

  const selectedDayIndex = getSelectedDayIndex();
  const selectedDayTopic = weeklyTopics[selectedDayIndex];

  const displayTopic =
    hasApiTopics && selectedApiTopic
      ? {
          ...topicData,
          topic: selectedApiTopic.topic || selectedApiTopic.title,
          title: selectedApiTopic.title,
          subject: subjectName || topicData?.subject,
          description: selectedApiTopic.description,
          imageUrl: fixUrl(selectedApiTopic.imageUrl),
        }
      : topicData?.id
      ? {
          ...topicData,
        }
      : {
          ...topicData,
          topic: selectedDayTopic.topic,
          title: selectedDayTopic.topic,
          icon: selectedDayTopic.icon,
          iconColor: selectedDayTopic.color,
        };

  const generateFullCalendar = () => {
    const firstDay = new Date(pickerYear, pickerMonth, 1);
    const lastDay = new Date(pickerYear, pickerMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const calendar = [];
    let week = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      week.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      week.push(day);
      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }
    }
    if (week.length > 0) {
      while (week.length < 7) {
        week.push(null);
      }
      calendar.push(week);
    }
    return calendar;
  };

  const calendarGrid = generateFullCalendar();
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const goToPreviousMonth = () => {
    if (pickerMonth === 0) {
      setPickerMonth(11);
      setPickerYear(pickerYear - 1);
    } else {
      setPickerMonth(pickerMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (pickerMonth === 11) {
      setPickerMonth(0);
      setPickerYear(pickerYear + 1);
    } else {
      setPickerMonth(pickerMonth + 1);
    }
  };

  const handleDateSelect = day => {
    if (day) {
      setSelectedDate(day);
      setShowDatePicker(false);
    }
  };

  const subjectColors = {
    'Environmental Studies': '#27AE60',
    Mathematics: '#27AE60',
    Science: '#27AE60',
    'Language Arts': '#27AE60',
    'Values & Character': '#27AE60',
    'Arts & Creativity': '#27AE60',
  };

  const subjectColor =
    subjectColors[subjectName || topicData?.subject] || '#45a578';

  const units = [
    {
      id: 1,
      name: `Unit 1 — All About the Topic`,
      concept:
        displayTopic?.whatYouWillLearn ||
        topicData?.whatYouWillLearn ||
        'Key concepts and learning objectives for this topic.',
      parentOutcome:
        'Practical applications in daily life and real-world connections.',
    },
    {
      id: 2,
      name: 'Unit 2 — Questions & Answers',
      description:
        'Interactive Q&A session to test your understanding, spark, curiosity and clarify doubts.',
    },
    {
      id: 3,
      name: 'Unit 3 — Conversation Prompts',
      description:
        'Thought-provoking prompts to encourage deeper thinking and meaningful parent-child conversation.',
    },
  ];

  const createPrompts = () => {
    if (apiContentSet?.prompts?.length > 0) {
      return apiContentSet.prompts.map((p, i) => ({
        id: p._id || i,
        prompt: p.prompt,
        hint: p.hint,
      }));
    }
    return []; // No admin data
  };

  const prompts = createPrompts();

  const createVocabulary = () => {
    const subject = displayTopic?.subject;
    if (subject === 'Mathematics') {
      return [
        {
          id: 1,
          word: 'Dormant',
          type: 'Adjective',
          definition:
            'Word-Stressed Definition: A seed in a resting stage, not growing until conditions are right.',
          example:
            "\"The seed is like it's sleeping — it waits for the right water and warmth to 'wake up' and grow.\"",
          synonym: 'Inactive, asleep',
        },
        {
          id: 2,
          word: 'Germination',
          type: 'Noun',
          definition:
            'Word-Stressed Definition: The first time a baby root (the radicle) pokes out of a seed — like the seed is "waking up."',
          example:
            '"When you see that tiny white root coming out of the seed, that\'s germination!"',
          synonym: 'Sprouting',
        },
        {
          id: 3,
          word: 'Radicle',
          type: 'Noun',
          definition:
            'Word-Stressed Definition: The first tiny root that comes out of a seed during germination.',
          example:
            '"The radicle is like the baby root — it\'s the first part to grow out of the seed."',
          synonym: 'Baby root, first root',
        },
      ];
    }
    if (subject === 'Environmental Studies') {
      return [
        {
          id: 1,
          word: 'Conservation',
          type: 'Noun',
          definition:
            'Word-Stressed Definition: Protecting and saving natural resources like water, plants, and animals.',
          example:
            '"Water conservation means using water wisely so we don\'t waste it."',
          synonym: 'Protection, preservation',
        },
        {
          id: 2,
          word: 'Photosynthesis',
          type: 'Noun',
          definition:
            'Word-Stressed Definition: The process plants use to make food from sunlight, water, and air.',
          example:
            '"Plants use photosynthesis to turn sunlight into energy, just like we eat food for energy."',
          synonym: 'Plant food-making',
        },
        {
          id: 3,
          word: 'Ecosystem',
          type: 'Noun',
          definition:
            'Word-Stressed Definition: A community of living things (plants, animals) and their environment working together.',
          example:
            '"A pond ecosystem includes fish, plants, water, and all the tiny creatures living together."',
          synonym: 'Habitat, environment',
        },
      ];
    }
    if (subject === 'Science') {
      return [
        {
          id: 1,
          word: 'Adaptation',
          type: 'Noun',
          definition:
            'Word-Stressed Definition: Special features that help animals survive in their environment.',
          example:
            '"A polar bear\'s thick fur is an adaptation that keeps it warm in the cold Arctic."',
          synonym: 'Adjustment, special feature',
        },
        {
          id: 2,
          word: 'Habitat',
          type: 'Noun',
          definition:
            'Word-Stressed Definition: The natural home where an animal or plant lives.',
          example:
            '"A fish\'s habitat is water, while a bird\'s habitat might be a tree or nest."',
          synonym: 'Home, environment',
        },
        {
          id: 3,
          word: 'Nutrients',
          type: 'Noun',
          definition:
            'Word-Stressed Definition: Substances in food that help our body grow, stay healthy, and have energy.',
          example:
            '"Fruits and vegetables have lots of nutrients that make us strong and healthy."',
          synonym: 'Vitamins, goodness',
        },
      ];
    }
    if (subject === 'Language Arts') {
      return [
        {
          id: 1,
          word: 'Character',
          type: 'Noun',
          definition:
            'Word-Stressed Definition: A person, animal, or creature in a story.',
          example:
            '"Harry Potter is the main character in his story — the story is mostly about him."',
          synonym: 'Person in story',
        },
        {
          id: 2,
          word: 'Setting',
          type: 'Noun',
          definition:
            'Word-Stressed Definition: Where and when a story takes place.',
          example:
            '"The setting of Cinderella is a kingdom long ago, with a castle and village."',
          synonym: 'Place, location',
        },
        {
          id: 3,
          word: 'Plot',
          type: 'Noun',
          definition:
            'Word-Stressed Definition: The sequence of events that happen in a story.',
          example:
            '"The plot is what happens in the story — the beginning, middle, and end."',
          synonym: 'Story events, what happens',
        },
      ];
    }
    if (subject === 'Values & Character') {
      return [
        {
          id: 1,
          word: 'Empathy',
          type: 'Noun',
          definition:
            'Word-Stressed Definition: Understanding and sharing the feelings of another person.',
          example:
            '"When your friend is sad and you feel sad too, that\'s empathy — you understand their feelings."',
          synonym: 'Understanding, compassion',
        },
        {
          id: 2,
          word: 'Kindness',
          type: 'Noun',
          definition:
            'Word-Stressed Definition: Being friendly, caring, and helpful to others.',
          example:
            '"Sharing your toys or helping someone who fell shows kindness."',
          synonym: 'Caring, niceness',
        },
        {
          id: 3,
          word: 'Respect',
          type: 'Noun',
          definition:
            'Word-Stressed Definition: Treating others the way you want to be treated, with care and politeness.',
          example:
            "\"Listening when someone talks and saying 'please' and 'thank you' shows respect.\"",
          synonym: 'Politeness, consideration',
        },
      ];
    }
    if (subject === 'Arts & Creativity') {
      return [
        {
          id: 1,
          word: 'Primary Colors',
          type: 'Noun',
          definition:
            "Word-Stressed Definition: The three basic colors (red, blue, yellow) that can't be made by mixing other colors.",
          example:
            '"Red, blue, and yellow are primary colors — all other colors come from mixing these!"',
          synonym: 'Basic colors',
        },
        {
          id: 2,
          word: 'Texture',
          type: 'Noun',
          definition:
            'Word-Stressed Definition: How something feels when you touch it — smooth, rough, soft, or bumpy.',
          example:
            '"Sandpaper has a rough texture, while silk has a smooth texture."',
          synonym: 'Feel, surface',
        },
        {
          id: 3,
          word: 'Creativity',
          type: 'Noun',
          definition:
            'Word-Stressed Definition: Using imagination to make something new and original.',
          example:
            '"When you draw a picture from your imagination, you\'re using creativity!"',
          synonym: 'Imagination, originality',
        },
      ];
    }
    return [
      {
        id: 1,
        word: 'Learning',
        type: 'Noun',
        definition:
          'Word-Stressed Definition: Gaining knowledge or skills through study and experience.',
        example: '"Every day we do learning when we discover new things!"',
        synonym: 'Education, discovery',
      },
      {
        id: 2,
        word: 'Explore',
        type: 'Verb',
        definition:
          'Word-Stressed Definition: To investigate and discover new things.',
        example: '"Let\'s explore the garden and see what we can find!"',
        synonym: 'Discover, investigate',
      },
      {
        id: 3,
        word: 'Curious',
        type: 'Adjective',
        definition:
          'Word-Stressed Definition: Wanting to learn and know more about things.',
        example: '"Being curious means asking questions and wanting to learn!"',
        synonym: 'Interested, inquisitive',
      },
    ];
  };

  const vocabulary = createVocabulary();

  const createArticleContent = () => {
    if (apiLearnDetail) {
      // Support both new structured sections and legacy flat fields
      let sections = [];
      if (apiLearnDetail.sections && apiLearnDetail.sections.length > 0) {
        sections = apiLearnDetail.sections
          .filter(s => s.title || s.subtitle || s.description || (s.points && s.points.some(p => p)))
          .map(s => ({
            heading: s.title || '',
            content: [
              s.subtitle,
              s.description,
              ...(s.points || []).filter(Boolean).map(p => `• ${p}`),
            ]
              .filter(Boolean)
              .join('\n'),
          }));
      } else {
        sections = [
          apiLearnDetail.overview && {
            heading: 'Overview',
            content: apiLearnDetail.overview,
          },
          apiLearnDetail.keyConcepts && {
            heading: 'Key Concepts',
            content: apiLearnDetail.keyConcepts,
          },
          apiLearnDetail.practicalApplication && {
            heading: 'Practical Application',
            content: apiLearnDetail.practicalApplication,
          },
          apiLearnDetail.supportingLearning && {
            heading: 'Supporting Learning',
            content: apiLearnDetail.supportingLearning,
          },
        ].filter(Boolean);
      }
      return {
        title: selectedApiTopic?.topic || selectedApiTopic?.title || displayTopic?.topic || 'Topic',
        subtitle: selectedApiTopic?.description || '',
        sections,
        videoUrl: apiLearnDetail.videoUrl || null,
        // Support multiple YouTube URLs — fall back to single videoUrl for old records
        videoUrls: apiLearnDetail.videoUrls?.length
          ? apiLearnDetail.videoUrls
          : apiLearnDetail.videoUrl
          ? [apiLearnDetail.videoUrl]
          : [],
      };
    }
    return null;
  };

  const articleContent = createArticleContent();

  const createFlashcards = () => {
    if (apiContentSet?.flashcards?.length > 0) {
      return apiContentSet.flashcards.map((fc, i) => ({
        id: fc._id || i,
        title: fc.title,
        description: fc.description,
        subtitle: fc.subtitle,
        subdescription: fc.subdescription,
        concept: fc.description,
        parentOutcome: fc.subtitle,
        section2: fc.subdescription,
      }));
    }
    return []; // No admin data — show nothing
  };

  const flashcards = createFlashcards();

  const createQAFlashcards = () => {
    if (apiContentSet?.qaCards?.length > 0) {
      return apiContentSet.qaCards.map((qa, i) => ({
        id: qa._id || i,
        question: qa.question,
        answer: qa.answer,
      }));
    }
    return []; // No admin data
  };

  const qaFlashcards = createQAFlashcards();

  const toggleUnit = unitId => {
    setExpandedUnit(expandedUnit === unitId ? null : unitId);
  };

  const childGrade = userData?.children?.[0]?.grade;
  const topicGrade = topicData?.grades?.[0];
  const gradeMismatch = childGrade && topicGrade && childGrade !== topicGrade;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ── HEADER: back arrow + centered title + subject subtitle ── */}
      <View style={styles.screenHeader}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Icon name="chevron-back" size={28} color="#333333" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {subjectName || topicData?.subject || 'Learning Topic'}
          </Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      {gradeMismatch ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 32,
          }}
        >
          <Icon name="book-outline" size={48} color="#9CA3AF" />
          <Text
            style={{
              fontSize: 18,
              fontWeight: '700',
              color: '#374151',
              marginTop: 16,
              textAlign: 'center',
            }}
          >
            Content coming soon
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: '#9CA3AF',
              marginTop: 8,
              textAlign: 'center',
              lineHeight: 22,
            }}
          >
            We're preparing topics for {childGrade}.{'\n'}Check back soon!
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* ── CALENDAR ── */}
          <View style={styles.calendarSection}>
            <View style={styles.calendarHeader}>
              <View>
                <Text style={styles.calendarMonth}>
                  {currentMonth} {currentYear}
                </Text>
                <Text style={styles.calendarSubtext}>
                  Select a date to view content
                </Text>
              </View>
              <View style={styles.calendarActions}>
                <TouchableOpacity
                  style={[
                    styles.calendarIconButton,
                    {
                      borderColor: subjectColor,
                      backgroundColor: `${subjectColor}10`,
                    },
                  ]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Icon
                    name="calendar-outline"
                    size={18}
                    color={subjectColor}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.todayButton,
                    {
                      borderColor: hasDataForDate(currentDay, currentDate.getMonth(), currentYear) ? subjectColor : '#CCCCCC',
                      backgroundColor: hasDataForDate(currentDay, currentDate.getMonth(), currentYear) ? `${subjectColor}10` : '#F5F5F5',
                    },
                  ]}
                  onPress={() => {
                    if (hasDataForDate(currentDay, currentDate.getMonth(), currentYear)) {
                      setSelectedDate(currentDay);
                    }
                  }}
                  disabled={!hasDataForDate(currentDay, currentDate.getMonth(), currentYear)}
                >
                  <Icon
                    name="time-outline"
                    size={16}
                    color={hasDataForDate(currentDay, currentDate.getMonth(), currentYear) ? subjectColor : '#CCCCCC'}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={[
                      styles.todayButtonText, 
                      { color: hasDataForDate(currentDay, currentDate.getMonth(), currentYear) ? subjectColor : '#CCCCCC' }
                    ]}
                  >
                    TODAY
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.calendarGrid}>
              {weekDays.map((day, index) => {
                const dateValue = dates[index];
                
                const hasData = hasDataForDate(
                  dateValue,
                  currentDate.getMonth(),
                  currentYear,
                );
                
                console.log('[Calendar] Day:', day, '| Date:', dateValue, '| Has Data:', hasData);
                
                // Only disable if there's NO data (no uploaded topic for today or past)
                const isDisabled = !hasData;
                const isSelected = selectedDate === dateValue;
                const isToday = dateValue === currentDay;

                return (
                  <View key={index} style={styles.calendarDayColumn}>
                    <TouchableOpacity
                      style={[
                        styles.calendarDate,
                        isSelected && [
                          styles.calendarDateSelected,
                          { backgroundColor: subjectColor },
                        ],
                        !isSelected &&
                          isToday && [
                            styles.calendarDateToday,
                            {
                              borderColor: subjectColor,
                              backgroundColor: `${subjectColor}10`,
                            },
                          ],
                        isDisabled &&
                          !isSelected &&
                          styles.calendarDateDisabled,
                      ]}
                      onPress={() => {
                        if (!isDisabled) setSelectedDate(dateValue);
                      }}
                      disabled={isDisabled}
                    >
                      <Text
                        style={[
                          styles.calendarDayLabel,
                          isSelected && styles.calendarLabelSelected,
                          !isSelected && isToday && { color: subjectColor },
                          isDisabled &&
                            !isSelected &&
                            styles.calendarLabelDisabled,
                        ]}
                      >
                        {day}
                      </Text>
                      <Text
                        style={[
                          styles.calendarDateText,
                          isSelected && styles.calendarDateTextSelected,
                          !isSelected &&
                            isToday && {
                              color: subjectColor,
                              fontWeight: '700',
                            },
                          isDisabled &&
                            !isSelected &&
                            styles.calendarDateTextDisabled,
                        ]}
                      >
                        {dateValue}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>

          {/* ── TOPIC CARD ── */}
          <View style={styles.topicCard}>
            <View style={styles.topicImageContainer}>
              {displayTopic?.imageUrl ? (
                <View style={styles.topicImagePlaceholder}>
                  <Image
                    source={{ uri: displayTopic.imageUrl }}
                    style={styles.subjectImage}
                    resizeMode="stretch"
                  />
                </View>
              ) : displayTopic?.subject === 'Science / EVS' ? (
                <View style={styles.topicImagePlaceholder}>
                  <Image
                    source={require('../assets/images/Science.png')}
                    style={styles.subjectImage}
                    resizeMode="cover"
                  />
                </View>
              ) : displayTopic?.subject === 'Math' ? (
                <View style={styles.topicImagePlaceholder}>
                  <Image
                    source={require('../assets/images/Maths.png')}
                    style={styles.subjectImage}
                    resizeMode="cover"
                  />
                </View>
              ) : displayTopic?.subject === 'Science / EVS' ? (
                <View style={styles.topicImagePlaceholder}>
                  <Image
                    source={require('../assets/images/Science.png')}
                    style={styles.subjectImage}
                    resizeMode="cover"
                  />
                </View>
              ) : displayTopic?.subject === 'English' ? (
                <View style={styles.topicImagePlaceholder}>
                  <Image
                    source={require('../assets/images/English.jpg')}
                    style={styles.subjectImage}
                    resizeMode="cover"
                  />
                </View>
              ) : displayTopic?.subject === 'Social Studies' ? (
                <View style={styles.topicImagePlaceholder}>
                  <Image
                    source={require('../assets/images/social.png')}
                    style={styles.subjectImage}
                    resizeMode="cover"
                  />
                </View>
              ) : displayTopic?.subject === 'Artificial Intelligence' ? (
                <View style={styles.topicImagePlaceholder}>
                  <Image
                    source={require('../assets/images/AI.jpg')}
                    style={styles.subjectImage}
                    resizeMode="cover"
                  />
                </View>
              ) : displayTopic?.subject === 'Arts & Creativity' ? (
                <View style={styles.topicImagePlaceholder}>
                  <Image
                    source={require('../assets/images/art.png')}
                    style={styles.subjectImage}
                    resizeMode="cover"
                  />
                </View>
              ) : (
                <LinearGradient
                  colors={[`${subjectColor}40`, `${subjectColor}20`]}
                  style={styles.topicImagePlaceholder}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View
                    style={[
                      styles.iconCircle,
                      { backgroundColor: 'rgba(255,255,255,0.9)' },
                    ]}
                  >
                    <MaterialIcon
                      name={displayTopic?.icon || 'book-open-variant'}
                      size={70}
                      color={subjectColor}
                    />
                  </View>
                </LinearGradient>
              )}
            </View>

            {/* Topic Info Section - Subject, Title, Description */}
            <View style={styles.topicInfoSection}>
              <View style={styles.subjectBadgeContainer}>
                <Text style={styles.subjectLabel}>
                  {displayTopic?.subject || 'Learning'}
                </Text>
              </View>

              <Text style={styles.topicTitle}>
                {displayTopic?.topic || displayTopic?.title || 'Learning Topic'}
              </Text>

              {displayTopic?.title && (
                <Text style={styles.topicSubtitle}>
                  {displayTopic.title}
                </Text>
              )}

              {(displayTopic?.description || topicData?.shortDescription) && (
                <Text style={styles.topicDescription}>
                  {displayTopic?.description || topicData.shortDescription}
                </Text>
              )}
            </View>
          </View>

          {/* ── UNITS ── */}
          <View style={styles.unitsSection}>
            {units.map(unit => {
              const getUnitIcon = unitId => {
                switch (unitId) {
                  case 1:
                    return 'book-open-page-variant';
                  case 2:
                    return 'help-circle-outline';
                  case 3:
                    return 'message-text-outline';
                  default:
                    return 'book-outline';
                }
              };
              const getCardCount = unitId => {
                switch (unitId) {
                  case 1:
                    return flashcards.length;
                  case 2:
                    return qaFlashcards.length;
                  case 3:
                    return prompts.length;
                  default:
                    return 0;
                }
              };
              const getUnitDescription = unitId => {
                switch (unitId) {
                  case 1:
                    return 'Build your own understanding first - Quick, clear explanations with real-life connections so you can guide your child with confidence.';
                  case 2:
                    return 'Check understanding through conversation - Thoughtfully designed questions that go beyond right or wrong answers to build thinking skills.';
                  case 3:
                    return 'Bring learning into everyday life - Simple prompts that turn daily moments into meaningful learning and bonding experiences. the app should have this content ';
                  default:
                    return '';
                }
              };
              return (
                <View key={unit.id} style={styles.unitCard}>
                  <View style={styles.unitIconContainer}>
                    <MaterialIcon
                      name={getUnitIcon(unit.id)}
                      size={22}
                      color="#6B7280"
                    />
                  </View>
                  <View style={styles.unitTextContainer}>
                    <Text style={styles.unitName}>
                      {unit.name.split(' — ')[1] || unit.name}
                    </Text>
                    <Text style={styles.unitBodyText}>
                      {getUnitDescription(unit.id)}
                    </Text>
                  </View>
                  <Text style={styles.cardCountText}>
                    {getCardCount(unit.id)} cards
                  </Text>
                </View>
              );
            })}
          </View>

          {/* ── START FLASHCARDS BUTTON ── */}
          <View style={styles.startFlashcardsSection}>
            <TouchableOpacity
              style={[
                styles.startFlashcardsButton,
                (flashcards.length + qaFlashcards.length + prompts.length === 0) && styles.startFlashcardsButtonDisabled
              ]}
              onPress={() => {
                const totalCards = flashcards.length + qaFlashcards.length + prompts.length;
                if (totalCards === 0) {
                  return; // Don't navigate if no cards
                }
                const allCards = [
                  ...flashcards.map(c => ({ ...c, type: 'about' })),
                  ...qaFlashcards.map(c => ({ ...c, type: 'qa' })),
                  ...prompts.map(p => ({
                    id: `p-${p.id}`,
                    type: 'prompt',
                    question: p.prompt,
                    answer: p.hint,
                  })),
                ];
                onNavigate &&
                  onNavigate('flashcards', {
                    flashcards: allCards,
                    topic: displayTopic?.topic,
                    subject: displayTopic?.subject,
                  });
              }}
              activeOpacity={(flashcards.length + qaFlashcards.length + prompts.length === 0) ? 1 : 0.85}
              disabled={flashcards.length + qaFlashcards.length + prompts.length === 0}
            >
              <Text style={[
                styles.startFlashcardsText,
                (flashcards.length + qaFlashcards.length + prompts.length === 0) && styles.startFlashcardsTextDisabled
              ]}>
                Start Flashcards
              </Text>
              <Icon 
                name="chevron-forward" 
                size={20} 
                color={(flashcards.length + qaFlashcards.length + prompts.length === 0) ? "#9CA3AF" : "#FFFFFF"} 
              />
            </TouchableOpacity>
            <Text style={styles.startFlashcardsHint}>
              {(flashcards.length + qaFlashcards.length + prompts.length === 0) 
                ? "No cards available yet" 
                : "Swipe through cards at your own pace"}
            </Text>
            <Text style={styles.startFlashcardsCount}>
              {flashcards.length + qaFlashcards.length + prompts.length} cards
              total{' '}
            </Text>
          </View>

          {/* ── LEARNING STATUS ── */}
          <View style={styles.learningStatusSection}>
            <View style={styles.learningStatusContainer}>
              <TouchableOpacity
                style={[
                  styles.needsPracticeButton,
                  learningStatus === 'needs_practice' &&
                    styles.needsPracticeButtonActive,
                ]}
                onPress={() =>
                  setLearningStatus(
                    learningStatus === 'needs_practice'
                      ? null
                      : 'needs_practice',
                  )
                }
              >
                <Text
                  style={[
                    styles.needsPracticeText,
                    learningStatus === 'needs_practice' &&
                      styles.needsPracticeTextActive,
                  ]}
                >
                  Needs Practice
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.knewItButton,
                  learningStatus === 'knew_it' && styles.knewItButtonActive,
                ]}
                onPress={() =>
                  setLearningStatus(
                    learningStatus === 'knew_it' ? null : 'knew_it',
                  )
                }
              >
                <Text
                  style={[
                    styles.knewItText,
                    learningStatus === 'knew_it' && styles.knewItTextActive,
                  ]}
                >
                  Knew It ✓
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── RELEVANCE ── */}
          <View style={styles.relevanceSection}>
            <TouchableOpacity
              style={styles.learnInDetailButton}
              onPress={() => {
                if (articleContent) {
                  setShowArticleModal(true);
                } else {
                  Alert.alert(
                    'No Details Available',
                    'Learn details have not been added for this topic yet.',
                    [{ text: 'OK' }],
                  );
                }
              }}
            >
              <MaterialIcon
                name="book-open-page-variant"
                size={20}
                color="#666666"
              />
              <Text style={styles.learnInDetailText}>Learn in Detail</Text>
            </TouchableOpacity>

            <Text style={styles.relevanceQuestion}>Is the topic relevant?</Text>
            <View style={styles.relevanceButtons}>
              <TouchableOpacity
                style={[
                  styles.noButton,
                  topicRelevance === 'no' && styles.noButtonActive,
                ]}
                onPress={() => {
                  const v = topicRelevance === 'no' ? null : 'no';
                  setTopicRelevance(v);
                  if (v === 'no')
                    Alert.alert(
                      'Feedback Received',
                      "Thank you! We'll work on more relevant topics.",
                      [{ text: 'OK' }],
                    );
                }}
              >
                {topicRelevance === 'no' && (
                  <Icon
                    name="checkmark-circle"
                    size={16}
                    color="#FF6B6B"
                    style={{ marginRight: 6 }}
                  />
                )}
                <Text style={styles.noButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.yesButton,
                  topicRelevance === 'yes' && styles.yesButtonActive,
                ]}
                onPress={() => {
                  const v = topicRelevance === 'yes' ? null : 'yes';
                  setTopicRelevance(v);
                  if (v === 'yes')
                    Alert.alert(
                      'Great!',
                      "We're glad this topic is relevant to you. Keep learning!",
                      [{ text: 'OK' }],
                    );
                }}
              >
                {topicRelevance === 'yes' && (
                  <Icon
                    name="checkmark-circle"
                    size={16}
                    color="#45a578"
                    style={{ marginRight: 6 }}
                  />
                )}
                <Text style={styles.yesButtonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      )}

      {/* ── ARTICLE MODAL ── */}
      {showArticleModal && articleContent && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowArticleModal(false)}
              >
                <Icon name="close" size={28} color="#333333" />
              </TouchableOpacity>
            </View>
            <ScrollView
              style={styles.modalContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.modalTitle}>{articleContent.title}</Text>
              <Text style={styles.modalSubtitle}>
                {articleContent.subtitle}
              </Text>
              {articleContent.sections.map((section, index) => (
                <View key={index}>
                  <Text style={styles.modalHeading}>{section.heading}</Text>
                  <Text style={styles.modalText}>{section.content}</Text>
                </View>
              ))}
              <View style={styles.modalVideosSection}>
                <View style={styles.modalVideosSectionHeader}>
                  <MaterialIcon name="youtube" size={24} color="#FF0000" />
                  <Text style={styles.modalVideosSectionTitle}>
                    Videos on this topic
                  </Text>
                </View>

                {articleContent.videoUrls && articleContent.videoUrls.length > 0 ? (
                  articleContent.videoUrls.map((url, idx) => {
                    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
                    const thumbnail = videoId
                      ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
                      : null;
                    return (
                      <TouchableOpacity
                        key={idx}
                        style={styles.modalVideoCard}
                        onPress={() => Linking.openURL(url)}
                        activeOpacity={0.8}
                      >
                        <View style={styles.modalVideoThumbnail}>
                          {thumbnail ? (
                            <Image
                              source={{ uri: thumbnail }}
                              style={{ width: '100%', height: '100%', borderRadius: 12 }}
                              resizeMode="cover"
                            />
                          ) : null}
                          <View style={styles.modalVideoPlayOverlay}>
                            <MaterialIcon name="play-circle" size={48} color="#FFFFFF" />
                          </View>
                        </View>
                        <Text style={styles.modalVideosSectionSubtitle} numberOfLines={1}>
                          {url}
                        </Text>
                      </TouchableOpacity>
                    );
                  })
                ) : (
                  <Text style={styles.modalVideosSectionSubtitle}>
                    No videos available for this topic yet.
                  </Text>
                )}
              </View>
              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </View>
      )}

      {/* ── DATE PICKER MODAL ── */}
      {showDatePicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.datePickerModal}>
            <View style={styles.datePickerTopBar}>
              <TouchableOpacity
                style={styles.datePickerCloseButton}
                onPress={() => setShowDatePicker(false)}
              >
                <Icon name="close" size={24} color="#333333" />
              </TouchableOpacity>
            </View>
            <View style={styles.datePickerHeader}>
              <TouchableOpacity
                style={styles.datePickerNavButton}
                onPress={goToPreviousMonth}
              >
                <Icon name="chevron-back" size={24} color="#333333" />
              </TouchableOpacity>
              <Text style={styles.datePickerTitle}>
                {monthNames[pickerMonth]} {pickerYear}
              </Text>
              <TouchableOpacity
                style={styles.datePickerNavButton}
                onPress={goToNextMonth}
              >
                <Icon name="chevron-forward" size={24} color="#333333" />
              </TouchableOpacity>
            </View>
            <View style={styles.fullCalendarContent}>
              <View style={styles.calendarDayLabelsRow}>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <Text key={i} style={styles.calendarDayLabelSmall}>
                    {d}
                  </Text>
                ))}
              </View>
              {calendarGrid.map((week, wi) => (
                <View key={wi} style={styles.calendarWeekRow}>
                  {week.map((day, di) => {
                    const isToday =
                      day === currentDay &&
                      pickerMonth === currentDate.getMonth() &&
                      pickerYear === currentYear;
                    const isSelected =
                      day === selectedDate &&
                      pickerMonth === currentDate.getMonth() &&
                      pickerYear === currentYear;
                    // Check if date is in the future
                    const isFuture =
                      pickerYear > currentYear ||
                      (pickerYear === currentYear &&
                        pickerMonth > currentDate.getMonth()) ||
                      (pickerYear === currentYear &&
                        pickerMonth === currentDate.getMonth() &&
                        day > currentDay);
                    // Check if this date has uploaded topics
                    const hasData = day
                      ? hasDataForDate(day, pickerMonth, pickerYear)
                      : false;
                    // Disable if: no day, OR is future date, OR no data
                    const isDisabled = !day || isFuture || !hasData;
                    return (
                      <TouchableOpacity
                        key={di}
                        style={[
                          styles.fullCalendarDay,
                          !day && styles.fullCalendarDayEmpty,
                          isToday && styles.fullCalendarDayToday,
                          isSelected && [
                            styles.fullCalendarDaySelected,
                            { backgroundColor: subjectColor },
                          ],
                          isDisabled &&
                            !isSelected &&
                            styles.fullCalendarDayDisabled,
                        ]}
                        onPress={() => !isDisabled && handleDateSelect(day)}
                        disabled={isDisabled}
                      >
                        {day && (
                          <Text
                            style={[
                              styles.fullCalendarDayText,
                              isToday && styles.fullCalendarDayTextToday,
                              isSelected && styles.fullCalendarDayTextSelected,
                              isDisabled && styles.fullCalendarDayTextDisabled,
                            ]}
                          >
                            {day}
                          </Text>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
              <TouchableOpacity
                style={styles.goTodayButton}
                onPress={() => {
                  setPickerMonth(currentDate.getMonth());
                  setPickerYear(currentYear);
                  setSelectedDate(currentDay);
                  setShowDatePicker(false);
                }}
              >
                <Text style={[styles.goTodayText, { color: subjectColor }]}>
                  Go to Today
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default TopicDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // ─── HEADER ───────────────────────────────────────────────────────────────
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: isTablet ? 22 : 18,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
  },
  headerSubject: {
    fontSize: isTablet ? 15 : 13,
    fontWeight: '600',
    fontFamily: 'Montserrat-SemiBold',
    marginTop: 2,
    textAlign: 'center',
  },
  headerRight: {
    width: 40, // mirrors backButton width to keep title centred
  },

  // ─── SCROLL CONTENT ───────────────────────────────────────────────────────
  content: {
    flex: 1,
  },

  // ─── CALENDAR ─────────────────────────────────────────────────────────────
  calendarSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 4,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  calendarMonth: {
    fontSize: isTablet ? 22 : 18,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 4,
    fontFamily: 'Montserrat-Bold',
  },
  calendarSubtext: {
    fontSize: 13,
    color: '#95A5A6',
    fontFamily: 'Montserrat-Regular',
  },
  calendarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  calendarIconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 1.5,
    // backgroundColor: '#FFFFFF',
  },
  todayButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1.5,
  },
  todayButtonText: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Montserrat-Bold',
    letterSpacing: 0.5,
  },
  calendarGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  calendarDayColumn: {
    alignItems: 'center',
    flex: 1,
  },
  calendarDate: {
    width: isTablet ? 52 : 43,
    height: isTablet ? 60 : 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 4,
  },
  calendarDateToday: {
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
  },
  calendarDateSelected: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  calendarDateDisabled: {
    opacity: 0.35,
  },
  calendarDayLabel: {
    fontSize: 9,
    color: '#7F8C8D',
    marginBottom: 3,
    fontWeight: '600',
    fontFamily: 'Montserrat-SemiBold',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  calendarLabelSelected: {
    color: '#FFFFFF',
  },
  calendarLabelDisabled: {
    color: '#BDC3C7',
  },
  calendarDateText: {
    fontSize: isTablet ? 16 : 15,
    color: '#2C3E50',
    fontWeight: '600',
    fontFamily: 'Montserrat-SemiBold',
  },
  calendarDateTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  calendarDateTextDisabled: {
    color: '#BDC3C7',
  },

  // ─── TOPIC CARD ───────────────────────────────────────────────────────────
  topicCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 10,
  },
  subjectBadge: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    flexShrink: 1,
  },
  subjectBadgeText: {
    fontSize: isTablet ? 22 : 18,
    fontWeight: '700',
    fontFamily: 'Montserrat-Bold',
    color: '#000000',
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    flexShrink: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  durationText: {
    fontSize: isTablet ? 15 : 13,
    fontWeight: '700',
    fontFamily: 'Montserrat-Bold',
  },
  topicImageContainer: {
    marginBottom: 0,
    paddingHorizontal: 0,
    marginTop: 0,
  },
  topicImagePlaceholder: {
    width: '100%',
    height: 280,
    borderRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F9FAFB',
  },
  imageOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subjectImage: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
  },
  topicInfoSection: {
    paddingTop: 20,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  subjectBadgeContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 12,
  },
  subjectLabel: {
    fontSize: isTablet ? 15 : 13,
    fontWeight: '600',
    color: '#27AE60',
    fontFamily: 'Montserrat-SemiBold',
  },
  topicTitle: {
    fontSize: isTablet ? 26 : 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    lineHeight: isTablet ? 36 : 30,
    fontFamily: 'Montserrat-Bold',
  },
  topicSubtitle: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 8,
    lineHeight: isTablet ? 26 : 22,
    fontFamily: 'Montserrat-Medium',
  },
  topicDescription: {
    fontSize: isTablet ? 15 : 14,
    color: '#666666',
    lineHeight: isTablet ? 24 : 22,
    fontFamily: 'Montserrat-Regular',
  },

  // ─── UNITS ────────────────────────────────────────────────────────────────
  unitsSection: {
    backgroundColor: 'transparent',
    padding: 0,
    marginBottom: 4,
    paddingHorizontal: 16,
  },
  unitCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  unitIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    flexShrink: 0,
  },
  unitTextContainer: {
    flex: 1,
    paddingRight: 8,
  },
  unitName: {
    fontSize: isTablet ? 16 : 15,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'Montserrat-Bold',
    marginBottom: 4,
  },
  unitNumberText: {
    fontWeight: '700',
    fontFamily: 'Montserrat-Bold',
    color: '#1A1A1A',
  },
  unitDescriptionText: {
    fontWeight: '400',
    fontFamily: 'Montserrat-Regular',
    color: '#1A1A1A',
  },
  cardCountText: {
    fontSize: isTablet ? 13 : 12,
    color: '#9CA3AF',
    fontFamily: 'Montserrat-Regular',
    flexShrink: 0,
    marginTop: 2,
  },
  unitContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 0,
  },
  unitIntroText: {
    fontSize: isTablet ? 15 : 14,
    color: '#7D8A96',
    lineHeight: isTablet ? 24 : 22,
    fontFamily: 'Montserrat-Regular',
    marginBottom: 16,
  },
  unitBodyText: {
    fontSize: isTablet ? 14 : 12,
    color: '#6B7280',
    lineHeight: isTablet ? 22 : 18,
    fontFamily: 'Montserrat-Regular',
  },
  startFlashcardsSection: {
    marginHorizontal: isTablet ? 20 : 16,
    marginTop: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  startFlashcardsButton: {
    backgroundColor: '#27AE60',
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: 8,
  },
  startFlashcardsButtonDisabled: {
    backgroundColor: '#E5E7EB',
    opacity: 0.6,
  },
  startFlashcardsText: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
  },
  startFlashcardsTextDisabled: {
    color: '#9CA3AF',
  },
  startFlashcardsHint: {
    fontSize: isTablet ? 13 : 12,
    color: '#9CA3AF',
    fontFamily: 'Montserrat-Regular',
    marginTop: 10,
  },
  startFlashcardsCount: {
    fontSize: isTablet ? 13 : 12,
    color: '#9CA3AF',
    fontFamily: 'Montserrat-Regular',
    marginTop: 2,
  },
  conceptBox: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  conceptBoxLabel: {
    fontSize: isTablet ? 13 : 12,
    fontWeight: '700',
    color: '#5A6C7D',
    marginBottom: 8,
    fontFamily: 'Montserrat-Bold',
    letterSpacing: 0.5,
  },
  conceptBoxText: {
    fontSize: isTablet ? 15 : 14,
    color: '#4A5568',
    lineHeight: isTablet ? 24 : 22,
    fontFamily: 'Montserrat-Regular',
  },
  conceptSection: {
    marginBottom: 14,
  },
  conceptLabel: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 4,
    fontFamily: 'Montserrat-Bold',
  },
  conceptText: {
    fontSize: isTablet ? 15 : 13,
    color: '#666666',
    lineHeight: isTablet ? 24 : 20,
    fontFamily: 'Montserrat-Regular',
  },
  parentTipsBox: {
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  parentTipsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D97706',
    letterSpacing: 0.5,
    marginBottom: 12,
    fontFamily: 'Montserrat-Bold',
  },
  parentTipItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  parentTipBullet: {
    fontSize: 16,
    color: '#D97706',
    marginRight: 8,
    marginTop: -2,
    fontFamily: 'Montserrat-Regular',
  },
  parentTipText: {
    flex: 1,
    fontSize: isTablet ? 14 : 13,
    color: '#92400E',
    lineHeight: isTablet ? 22 : 20,
    fontFamily: 'Montserrat-Regular',
  },
  openButton: {
    backgroundColor: '#27AE60',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 12,
    marginBottom: 16,
    gap: 8,
  },
  openButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Montserrat-SemiBold',
  },
  learningStatusSection: {
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  learningStatusContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  needsPracticeButton: {
    flex: 1,
    backgroundColor: '#FFE5E5',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  needsPracticeButtonActive: {
    backgroundColor: '#FF6B6B',
  },
  needsPracticeText: {
    color: '#E74C3C',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Montserrat-SemiBold',
  },
  needsPracticeTextActive: {
    color: '#FFFFFF',
  },
  knewItButton: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  knewItButtonActive: {
    backgroundColor: '#27AE60',
  },
  knewItText: {
    color: '#27AE60',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Montserrat-SemiBold',
  },
  knewItTextActive: {
    color: '#FFFFFF',
  },
  promptTips: {
    marginTop: 12,
    backgroundColor: '#FFFBF0',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FFE8B3',
  },
  promptTipBullet: {
    fontSize: isTablet ? 15 : 13,
    color: '#666666',
    lineHeight: isTablet ? 24 : 20,
    marginBottom: 4,
    fontFamily: 'Montserrat-Regular',
  },

  // ─── RELEVANCE ────────────────────────────────────────────────────────────
  relevanceSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 4,
  },
  learnInDetailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  learnInDetailText: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: '600',
    color: '#666666',
    fontFamily: 'Montserrat-SemiBold',
  },
  relevanceQuestion: {
    fontSize: isTablet ? 15 : 13,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 10,
    fontFamily: 'Montserrat-SemiBold',
    textAlign: 'center',
  },
  relevanceButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  noButton: {
    flex: 1,
    backgroundColor: '#FFE5E5',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  noButtonActive: {
    borderColor: '#FF6B6B',
    backgroundColor: '#FFD0D0',
  },
  noButtonText: {
    fontSize: isTablet ? 14 : 13,
    fontWeight: '700',
    color: '#FF6B6B',
    fontFamily: 'Montserrat-Bold',
  },
  yesButton: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  yesButtonActive: {
    borderColor: '#45a578',
    backgroundColor: '#D0F0D8',
  },
  yesButtonText: {
    fontSize: isTablet ? 14 : 13,
    fontWeight: '700',
    color: '#45a578',
    fontFamily: 'Montserrat-Bold',
  },

  // ─── MODALS ───────────────────────────────────────────────────────────────
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: { padding: 20 },
  modalTitle: {
    fontSize: isTablet ? 20 : 17,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 6,
    fontFamily: 'Montserrat-Bold',
  },
  modalSubtitle: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 14,
    fontFamily: 'Montserrat-SemiBold',
  },
  modalHeading: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: '700',
    color: '#333333',
    marginTop: 14,
    marginBottom: 6,
    fontFamily: 'Montserrat-Bold',
  },
  modalText: {
    fontSize: isTablet ? 15 : 13,
    color: '#444444',
    lineHeight: isTablet ? 23 : 20,
    fontFamily: 'Montserrat-Regular',
    textAlign: 'justify',
  },
  modalVideosSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  modalVideosSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  modalVideosSectionTitle: {
    fontSize: isTablet ? 20 : 17,
    fontWeight: '700',
    color: '#333333',
    fontFamily: 'Montserrat-Bold',
  },
  modalVideosSectionSubtitle: {
    fontSize: isTablet ? 15 : 13,
    color: '#666666',
    marginBottom: 16,
    fontFamily: 'Montserrat-Regular',
  },
  modalVideoCard: {
    marginBottom: 14,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  modalVideoThumbnail: {
    width: '100%',
    height: 160,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalVideoPlayOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalVideoThumbnailText: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
  },
  modalVideoTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
    padding: 10,
    paddingBottom: 4,
    fontFamily: 'Montserrat-SemiBold',
  },
  modalVideoChannel: {
    fontSize: 13,
    color: '#666666',
    paddingHorizontal: 10,
    paddingBottom: 10,
    fontFamily: 'Montserrat-Regular',
  },

  // ─── DATE PICKER MODAL ────────────────────────────────────────────────────
  datePickerModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '90%',
    maxWidth: 400,
    overflow: 'hidden',
  },
  datePickerTopBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 4,
  },
  datePickerCloseButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  datePickerNavButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  datePickerTitle: {
    fontSize: isTablet ? 20 : 17,
    fontWeight: '700',
    color: '#333333',
    fontFamily: 'Montserrat-Bold',
    flex: 1,
    textAlign: 'center',
  },
  fullCalendarContent: { padding: 16 },
  calendarDayLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  calendarDayLabelSmall: {
    width: 38,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: '#999999',
    fontFamily: 'Montserrat-SemiBold',
  },
  calendarWeekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 6,
  },
  fullCalendarDay: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  fullCalendarDayEmpty: { backgroundColor: 'transparent' },
  fullCalendarDayToday: { borderWidth: 2, borderColor: '#45a578' },
  fullCalendarDaySelected: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  fullCalendarDayDisabled: { backgroundColor: '#E8E8E8', opacity: 0.7 },
  fullCalendarDayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    fontFamily: 'Montserrat-SemiBold',
  },
  fullCalendarDayTextToday: { color: '#45a578', fontWeight: '700' },
  fullCalendarDayTextSelected: { color: '#FFFFFF', fontWeight: '700' },
  fullCalendarDayTextDisabled: { color: '#999999' },
  goTodayButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 4,
  },
  goTodayText: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Montserrat-SemiBold',
  },
});
