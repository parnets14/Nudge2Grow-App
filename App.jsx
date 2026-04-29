/**
 * Main App Component
 * @format
 */

import React, { useState, useEffect } from 'react';
import { Storage } from './src/utils/storage';
import { initializeFCM, subscribeToUserTopics, registerFCMOnLogin, requestNotificationPermission } from './src/services/firebaseNotificationService';
import { sendTopicCompletionNotification, addNotificationToStorage } from './src/services/notificationService';
import SplashScreen from './src/screens/SplashScreen';
import IntroScreen from './src/screens/IntroScreen';
import LoginScreen from './src/screens/LoginScreen';
import PersonalSetupScreen from './src/screens/PersonalSetupScreen';
import { fetchProfile } from './src/api';
import HomeScreen from './src/screens/HomeScreen';
// import SubscriptionPlanScreen from './src/screens/SubscriptionPlanScreen';
import MyChildrenScreen from './src/screens/MyChildrenScreen';
import ProgressReportsScreen from './src/screens/ProgressReportsScreen';
import LearningProgressScreen from './src/screens/LearningProgressScreen';
// import MilestonesScreen from './src/screens/MilestonesScreen';
import AssessmentScreen from './src/screens/AssessmentScreen';
import AssessmentHubScreen from './src/screens/AssessmentHubScreen';
import SelectTopicsScreen from './src/screens/SelectTopicsScreen';
import SelectQuestionTypesScreen from './src/screens/SelectQuestionTypesScreen';
import QuizSettingsScreen from './src/screens/QuizSettingsScreen';
import QuizCompleteScreen from './src/screens/QuizCompleteScreen';
import PrivacyPolicyScreen from './src/screens/PrivacyPolicyScreen';
import TermsOfServiceScreen from './src/screens/TermsOfServiceScreen';
import RateUsScreen from './src/screens/RateUsScreen';
import AboutUsScreen from './src/screens/AboutUsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import HelpSupportScreen from './src/screens/HelpSupportScreen';
import NotificationsScreen from './src/screens/NotificationScreen';
import SubjectsListScreen from './src/screens/SubjectsListScreen';
import TopicDetailScreen from './src/screens/TopicDetailScreen';
import FlashcardsScreen from './src/screens/FlashcardsScreen';
import QACardsScreen from './src/screens/QACardsScreen';
import PromptCardsScreen from './src/screens/PromptCardsScreen';
import VocabCardsScreen from './src/screens/VocabCardsScreen';
import RiddlesScreen from './src/screens/RiddlesScreen';
import FeaturedContentDetailScreen from './src/screens/FeaturedContentDetailScreen';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [userData, setUserData] = useState(null);
  const [setupToken, setSetupToken] = useState(null);
  const [navigationParams, setNavigationParams] = useState({});
  const [navigationHistory, setNavigationHistory] = useState([]);
  const [completedTopics, setCompletedTopics] = useState(new Set());
  const [fcmUnsubscribe, setFcmUnsubscribe] = useState(null);

  // Holds the screen to navigate to once splash finishes
  const pendingScreenRef = React.useRef(null);

  // Initialize Firebase Cloud Messaging when user data is available
  useEffect(() => {
    let unsubscribeFn = null;

    const initializeFirebaseNotifications = async () => {
      if (!userData?.token) {
        console.log('[App] No user token, skipping FCM initialization');
        return;
      }

      try {
        console.log('[App] Initializing Firebase Cloud Messaging...');

        unsubscribeFn = await initializeFCM((notification) => {
          console.log('[App] Notification received:', notification);
          if (notification.type === 'new_nudge' && notification.topicId) {
            console.log('[App] New nudge notification:', notification.title);
          }
        });

        setFcmUnsubscribe(() => unsubscribeFn);

        if (userData.children?.[0]) {
          await subscribeToUserTopics(userData);
          console.log('[App] Subscribed to user topics');
        }

        console.log('[App] Firebase Cloud Messaging initialized successfully');
      } catch (error) {
        console.error('[App] Error initializing Firebase notifications:', error);
      }
    };

    initializeFirebaseNotifications();
    return () => {
      if (unsubscribeFn) {
        console.log('[App] Cleaning up FCM listeners');
        unsubscribeFn();
        unsubscribeFn = null;
      }
    };
  }, [userData?.token]); // ← removed userData?.children — children changes must NOT re-register listeners

  // Load persisted progress on mount
  useEffect(() => {
    const loadPersistedData = async () => {
      try {
        // Request notification permission early — while splash is still visible
        // so the system dialog appears over the splash, not a black screen
        requestNotificationPermission().catch(() => {});

        // Load completed topics
        const saved = await Storage.getItem('completedTopics');
        if (saved) {
          setCompletedTopics(new Set(saved));
        }

        // Load user data and token for auto-login
        const storedUserData = await Storage.getItem('userData');
        const storedToken = await Storage.getItem('authToken');

        if (storedUserData && storedToken) {
          console.log('[App] Found stored user data, attempting auto-login...');

          try {
            const profile = await fetchProfile(storedToken);

            let children = profile.children || [];
            const activeIdx = profile.activeChildIndex || 0;
            if (activeIdx > 0 && children.length > activeIdx) {
              children = [children[activeIdx], ...children.filter((_, i) => i !== activeIdx)];
            }

            const resolvedUserData = {
              ...storedUserData,
              _id: profile._id || profile.id || storedUserData._id,
              children,
              email: profile.email,
              token: storedToken,
            };

            setUserData(resolvedUserData);
            // Don't skip splash — store destination and let splash finish naturally
            pendingScreenRef.current = 'home';
            console.log('[App] Auto-login successful, will navigate to home after splash');

            // Re-register FCM token on every app start so it's always fresh in DB
            registerFCMOnLogin(storedToken).catch(err =>
              console.error('[App] FCM re-registration failed:', err.message)
            );
          } catch (err) {
            console.error('[App] Auto-login failed, token may be expired:', err.message);
            await Storage.removeItem('userData');
            await Storage.removeItem('authToken');
            pendingScreenRef.current = 'intro';
          }
        } else {
          pendingScreenRef.current = 'intro';
        }
      } catch (error) {
        console.error('[App] Error loading persisted data:', error);
        pendingScreenRef.current = 'intro';
      }
    };

    loadPersistedData();
  }, []);

  const markTopicComplete = async (key) => {
    const timestamp = Date.now();
    const keyWithTimestamp = `${key}::${timestamp}`;
    console.log('[App] Marking topic complete:', keyWithTimestamp);

    setCompletedTopics(prev => {
      const next = new Set([...prev, keyWithTimestamp]);
      Storage.setItem('completedTopics', [...next]);
      return next;
    });

    // Send completion notification
    try {
      const parts = key.split('::');
      if (parts.length < 2) {
        console.log('[App] Invalid key format:', key);
        return;
      }

      const subjectName = parts[0];
      const topicName = parts[1];
      console.log('[App] Completing topic - Subject:', subjectName, '| Topic:', topicName);

      // Check if we already sent a completion notification for this topic (prevent duplicates)
      const completionKey = `completion_${subjectName}_${topicName}`;
      const existingCompletions = (await Storage.getItem('completedNotifications')) || [];
      console.log('[App] Existing completions:', existingCompletions);

      if (existingCompletions.includes(completionKey)) {
        console.log('[App] Already completed this topic, skipping notification');
        return;
      }

      // Get auth token — use Storage (same key used at login)
      const token = await Storage.getItem('authToken');
      console.log('[App] Auth token found:', !!token);

      if (!token) {
        console.log('[App] No auth token, creating local-only notification');
        const notification = {
          _id: `completion_${Date.now()}`,
          title: '🎉 Topic Completed!',
          message: `Great job! You've completed "${topicName}" in ${subjectName}. Keep up the excellent work!`,
          type: 'completed',
          isRead: false,
          createdAt: new Date().toISOString(),
          subject: subjectName,
        };
        await addNotificationToStorage(notification);
        const updatedCompletions = [...existingCompletions, completionKey];
        await Storage.setItem('completedNotifications', updatedCompletions);
        return;
      }

      // Get user info
      const child = userData?.children?.[0];
      const userName = child?.name || 'Student';
      const grade = child?.grade || '';

      // Build updated completions list BEFORE using it
      const updatedCompletions = [...existingCompletions, completionKey];

      const completionData = {
        topicName,
        subjectName,
        userName,
        grade,
        level: 'Basic',
        topicId: `${subjectName}_${topicName}`,
        completionCount: updatedCompletions.length,
      };

      console.log('[App] Sending completion notification:', completionData);
      const result = await sendTopicCompletionNotification(completionData, token);

      if (result) {
        // Save that we've sent a notification for this topic
        await Storage.setItem('completedNotifications', updatedCompletions);
        console.log('[App] ✅ Completion notification sent and saved');
      } else {
        console.log('[App] ❌ Completion notification failed');
      }
    } catch (error) {
      console.error('[App] Error in markTopicComplete:', error.message);
    }
  };

  const handleSplashFinish = async () => {
    // Navigate to wherever loadPersistedData resolved (home or intro)
    setCurrentScreen(pendingScreenRef.current || 'intro');
  };

  const handleIntroBack = () => {
    setCurrentScreen('splash');
  };

  const handleIntroFinish = () => {
    setCurrentScreen('login');
  };

  const handleLoginBack = () => {
    setCurrentScreen('intro');
  };

  const handleLoginSuccess = async (data) => {
    console.log('[App] handleLoginSuccess called with data:', data);
    console.log('[App] Token from login:', data.token);
    console.log('[App] Phone:', data.phoneNumber, data.countryCode);

    // Clear previous user's cached notifications before loading new user's data
    try {
      const { clearNotificationData } = require('./src/services/notificationService');
      const prevUserId = userData?._id || userData?.id || null;
      await clearNotificationData(prevUserId);
    } catch (_) {}

    const merged = { ...userData, ...data };
    setUserData(merged);

    // Save token for persistent login
    if (data.token) {
      await Storage.setItem('authToken', data.token);
      console.log('[App] Token saved to storage');

      // Register FCM token immediately so push notifications work right away
      registerFCMOnLogin(data.token).catch(err =>
        console.error('[App] FCM registration failed:', err.message)
      );
    } else {
      console.log('[App] WARNING: No token in login data!');
    }

    // If returning user with children, fetch full profile and go to home
    if (!data.isNewUser && data.parent?.childrenCount > 0 && data.token) {
      try {
        const profile = await fetchProfile(data.token);
        // Reorder children so activeChildIndex is first
        let children = profile.children || [];
        const activeIdx = profile.activeChildIndex || 0;
        if (activeIdx > 0 && children.length > activeIdx) {
          children = [children[activeIdx], ...children.filter((_, i) => i !== activeIdx)];
        }
        const fullUserData = { ...merged, _id: profile._id || profile.id, children, email: profile.email, token: data.token };
        setUserData(fullUserData);
        await Storage.setItem('userData', fullUserData);
        
        setCurrentScreen('home');
        return;
      } catch (err) {
        console.error('[App] fetchProfile failed:', err.message);
      }
    }
    // New user or no children — go to setup, pass token and phone
    console.log('[App] Setting setupToken to:', data.token);
    setSetupToken(data.token || null);
    setUserData({ ...merged, phoneNumber: data.phoneNumber, countryCode: data.countryCode, token: data.token });
    setCurrentScreen('setup');
  };

  const handleLoginRegister = () => {
    // For now, just go to setup screen
    setCurrentScreen('setup');
  };

  const handleSetupBack = () => {
    setCurrentScreen('login');
  };

  const handleSetupFinish = async (data) => {
    console.log('[App] handleSetupFinish called with data:', data);
    console.log('[App] Token in setup finish:', data.token);
    
    const fullUserData = { ...(userData || {}), ...data };
    setUserData(fullUserData);
    
    // Save user data for persistent login
    await Storage.setItem('userData', fullUserData);
    
    // IMPORTANT: Also save the token if present
    if (data.token) {
      await Storage.setItem('authToken', data.token);
      console.log('[App] Token saved from setup');

      // Register FCM token for new users completing setup
      registerFCMOnLogin(data.token).catch(err =>
        console.error('[App] FCM registration failed on setup:', err.message)
      );
    } else {
      console.log('[App] WARNING: No token in setup data!');
    }
    setCurrentScreen('home');
  };
  const handleHomeBack = () => {
    setCurrentScreen('setup');
  };

  const handleHomeNavigate = (screen, params) => {
    if (screen === 'subjectsList') {
      setNavigationHistory([...navigationHistory, 'home']);
      setCurrentScreen('subjectsList');
    } else if (screen === 'topicDetail') {
      setNavigationHistory([...navigationHistory, 'home']);
      setNavigationParams(params);
      setCurrentScreen('topicDetail');
    } else if (screen === 'featuredContentDetail') {
      setNavigationHistory([...navigationHistory, 'home']);
      setNavigationParams(params);
      setCurrentScreen('featuredContentDetail');
    } else if (screen === 'subscription') {
      setCurrentScreen('subscription');
    } else if (screen === 'myChildren') {
      setCurrentScreen('myChildren');
    } else if (screen === 'progressReports') {
      setCurrentScreen('progressReports');
    } else if (screen === 'learningProgress') {
      setCurrentScreen('learningProgress');
    } else if (screen === 'assessmentHub') {
      setNavigationHistory([...navigationHistory, 'home']);
      setCurrentScreen('assessmentHub');
    } else if (screen === 'milestones') {
      setCurrentScreen('milestones');
    } else if (screen === 'settings') {
      setCurrentScreen('settings');
    } else if (screen === 'helpSupport') {
      setCurrentScreen('helpSupport');
    } else if (screen === 'riddles') {
      setNavigationHistory([...navigationHistory, 'home']);
      if (params) setNavigationParams(params);
      setCurrentScreen('riddles');
    } else if (screen === 'notifications') {
      setCurrentScreen('notifications');
    } else if (screen === 'logout') {
      handleLogout();
    }
  };

  const handleSubjectsListNavigate = (screen, params) => {
    if (screen === 'topicDetail') {
      setNavigationHistory([...navigationHistory, 'subjectsList']);
      setNavigationParams(params);
      setCurrentScreen('topicDetail');
    }
  };

  const handleSubjectsListBack = () => {
    if (navigationHistory.length > 0) {
      const previousScreen = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(navigationHistory.slice(0, -1));
      setCurrentScreen(previousScreen);
    } else {
      setCurrentScreen('home');
    }
  };

  const handleTopicDetailBack = () => {
    if (navigationHistory.length > 0) {
      const previousScreen = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(navigationHistory.slice(0, -1));
      setCurrentScreen(previousScreen);
    } else {
      setCurrentScreen('topics');
    }
  };

  const handleTopicDetailNavigate = (screen, params) => {
    if (screen === 'flashcards') {
      setNavigationHistory([...navigationHistory, { screen: 'topicDetail', params: navigationParams }]);
      setNavigationParams(params);
      setCurrentScreen('flashcards');
    } else if (screen === 'qaCards') {
      setNavigationHistory([...navigationHistory, { screen: 'topicDetail', params: navigationParams }]);
      setNavigationParams(params);
      setCurrentScreen('qaCards');
    } else if (screen === 'promptCards') {
      setNavigationHistory([...navigationHistory, { screen: 'topicDetail', params: navigationParams }]);
      setNavigationParams(params);
      setCurrentScreen('promptCards');
    } else if (screen === 'vocabCards') {
      setNavigationHistory([...navigationHistory, { screen: 'topicDetail', params: navigationParams }]);
      setNavigationParams(params);
      setCurrentScreen('vocabCards');
    }
  };

  const handleFlashcardsBack = () => {
    if (navigationHistory.length > 0) {
      const previous = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(navigationHistory.slice(0, -1));
      
      // Restore the previous screen's params
      if (previous.params) {
        setNavigationParams(previous.params);
      }
      setCurrentScreen(previous.screen || previous);
    } else {
      setCurrentScreen('topicDetail');
    }
  };

  const handleFlashcardsComplete = () => {
    const key = `${navigationParams.subject}::${navigationParams.topic}`;
    markTopicComplete(key);
  };

  const handleQACardsBack = () => {
    if (navigationHistory.length > 0) {
      const previous = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(navigationHistory.slice(0, -1));
      if (previous.params) {
        setNavigationParams(previous.params);
      }
      setCurrentScreen(previous.screen || previous);
    } else {
      setCurrentScreen('topicDetail');
    }
  };

  const handlePromptCardsBack = () => {
    if (navigationHistory.length > 0) {
      const previous = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(navigationHistory.slice(0, -1));
      if (previous.params) {
        setNavigationParams(previous.params);
      }
      setCurrentScreen(previous.screen || previous);
    } else {
      setCurrentScreen('topicDetail');
    }
  };

  const handleVocabCardsBack = () => {
    if (navigationHistory.length > 0) {
      const previous = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(navigationHistory.slice(0, -1));
      if (previous.params) {
        setNavigationParams(previous.params);
      }
      setCurrentScreen(previous.screen || previous);
    } else {
      setCurrentScreen('topicDetail');
    }
  };

  const handleSubscriptionBack = () => {
    setCurrentScreen('home');
  };

  const handleMyChildrenBack = () => {
    setCurrentScreen('home');
  };

  const handleProgressReportsBack = () => {
    setCurrentScreen('home');
  };

  const handleLearningProgressBack = () => {
    if (navigationHistory.length > 0) {
      const previousScreen = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(navigationHistory.slice(0, -1));
      setCurrentScreen(previousScreen);
    } else {
      setCurrentScreen('home');
    }
  };

  const handleLearningProgressNavigate = (screen, params) => {
    if (screen === 'assessmentHub') {
      setNavigationHistory([...navigationHistory, 'learningProgress']);
      setCurrentScreen('assessmentHub');
    } else if (screen === 'assessment') {
      setNavigationHistory([...navigationHistory, 'learningProgress']);
      setNavigationParams(params);
      setCurrentScreen('assessment');
    }
  };

  const handleMilestonesBack = () => {
    if (navigationHistory.length > 0) {
      const previousScreen = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(navigationHistory.slice(0, -1));
      setCurrentScreen(previousScreen);
    } else {
      setCurrentScreen('home');
    }
  };

  const handleAssessmentBack = () => {
    if (navigationHistory.length > 0) {
      const previousScreen = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(navigationHistory.slice(0, -1));
      setCurrentScreen(previousScreen);
    } else {
      setCurrentScreen('home');
    }
  };

  const handleAssessmentNavigate = (screen, params) => {
    if (screen === 'assessment') {
      setNavigationHistory([...navigationHistory, 'assessmentHub']);
      setNavigationParams(params);
      setCurrentScreen('assessment');
    } else if (screen === 'selectTopics') {
      setNavigationHistory([...navigationHistory, 'assessment']);
      setNavigationParams(params);
      setCurrentScreen('selectTopics');
    } else if (screen === 'selectQuestionTypes') {
      setNavigationHistory([...navigationHistory, 'selectTopics']);
      setNavigationParams(params);
      setCurrentScreen('selectQuestionTypes');
    } else if (screen === 'quizSettings') {
      setNavigationHistory([...navigationHistory, 'selectQuestionTypes']);
      setNavigationParams(params);
      setCurrentScreen('quizSettings');
    } else if (screen === 'complete') {
      setNavigationHistory([...navigationHistory, 'quizSettings']);
      setNavigationParams(params);
      setCurrentScreen('complete');
    } else if (screen === 'assessmentHub') {
      // Go back to assessment hub (from QuizCompleteScreen)
      // Keep only 'home' in history so back button goes to home
      setNavigationHistory(['home']);
      setCurrentScreen('assessmentHub');
    } else if (screen === 'home') {
      // Clear navigation history and go back to home
      setNavigationHistory([]);
      setCurrentScreen('home');
    } else if (screen === 'backToAssessment') {
      // Clear navigation history and go back to assessment
      setNavigationHistory([]);
      setCurrentScreen('assessment');
    }
  };

  const handleSelectTopicsBack = (selectedTopicIds) => {
    if (navigationHistory.length > 0) {
      const previousScreen = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(navigationHistory.slice(0, -1));
      // Pass selected subjects back to AssessmentScreen
      setNavigationParams({
        ...navigationParams,
        previouslySelectedSubjects: navigationParams.selectedSubjects,
      });
      setCurrentScreen(previousScreen);
    } else {
      setCurrentScreen('assessment');
    }
  };

  const handleSelectQuestionTypesBack = (selectedTopicIds) => {
    if (navigationHistory.length > 0) {
      const previousScreen = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(navigationHistory.slice(0, -1));
      // Pass selected topics back to SelectTopicsScreen
      setNavigationParams({
        ...navigationParams,
        previouslySelectedTopics: selectedTopicIds || navigationParams.selectedTopicIds,
      });
      setCurrentScreen(previousScreen);
    } else {
      setCurrentScreen('selectTopics');
    }
  };

  const handleQuizSettingsBack = (selectedTypes) => {
    if (navigationHistory.length > 0) {
      const previousScreen = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(navigationHistory.slice(0, -1));
      // Pass selected types back to SelectQuestionTypesScreen
      setNavigationParams({
        ...navigationParams,
        previouslySelectedTypes: selectedTypes || navigationParams.selectedTypes,
      });
      setCurrentScreen(previousScreen);
    } else {
      setCurrentScreen('selectQuestionTypes');
    }
  };

  const handleSettingsBack = () => {
    setCurrentScreen('home');
  };

  const handleSettingsNavigate = (screen) => {
    if (screen === 'HelpSupport') {
      setNavigationHistory([...navigationHistory, 'settings']);
      setCurrentScreen('helpSupport');
    } else if (screen === 'SubscriptionPlan') {
      setNavigationHistory([...navigationHistory, 'settings']);
      setCurrentScreen('subscription');
    } else if (screen === 'PrivacyPolicy') {
      setNavigationHistory([...navigationHistory, 'settings']);
      setCurrentScreen('privacyPolicy');
    } else if (screen === 'TermsOfService') {
      setNavigationHistory([...navigationHistory, 'settings']);
      setCurrentScreen('termsOfService');
    } else if (screen === 'RateUs') {
      setNavigationHistory([...navigationHistory, 'settings']);
      setCurrentScreen('rateUs');
    } else if (screen === 'AboutUs') {
      setNavigationHistory([...navigationHistory, 'settings']);
      setCurrentScreen('aboutUs');
    }
  };

  const handleNotificationsBack = () => {
    setCurrentScreen('home');
  };

  const handleLogout = async () => {
    // Clear notification cache for this user before logging out
    try {
      const { clearNotificationData } = require('./src/services/notificationService');
      const userId = userData?._id || userData?.id || null;
      await clearNotificationData(userId);
    } catch (_) {}

    setUserData(null);
    await Storage.removeItem('userData');
    await Storage.removeItem('authToken');
    await Storage.removeItem('completedNotifications');
    setCurrentScreen('login');
  };

  const handleHelpSupportBack = () => {
    if (navigationHistory.length > 0) {
      const previousScreen = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(navigationHistory.slice(0, -1));
      setCurrentScreen(previousScreen);
    } else {
      setCurrentScreen('home');
    }
  };

  const handleHelpSupportNavigate = (action) => {
    // Save current screen to history
    setNavigationHistory([...navigationHistory, 'helpSupport']);
    
    switch (action) {
      case 'subjects':
        setCurrentScreen('subjectsList');
        break;
      case 'progress':
        setCurrentScreen('learningProgress');
        break;
      case 'assessment':
        setCurrentScreen('assessmentHub');
        break;
      case 'milestones':
        setCurrentScreen('milestones');
        break;
      default:
        break;
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onFinish={handleSplashFinish} />;
      case 'intro':
        return <IntroScreen onFinish={handleIntroFinish} onBack={handleIntroBack} />;
      case 'login':
        return (
          <LoginScreen 
            onBack={handleLoginBack}
            onSendOTP={handleLoginSuccess}
            onRegister={handleLoginRegister}
          />
        );
      case 'setup':
        return <PersonalSetupScreen token={setupToken} onFinish={handleSetupFinish} onBack={handleSetupBack} />;
      case 'home':
        return <HomeScreen userData={userData} completedTopics={completedTopics} onBack={handleHomeBack} onNavigate={handleHomeNavigate} onMarkTopicComplete={markTopicComplete} />;
      case 'featuredContentDetail':
        return (
          <FeaturedContentDetailScreen
            route={{ params: navigationParams }}
            navigation={{
              goBack: () => {
                if (navigationHistory.length > 0) {
                  const previousScreen = navigationHistory[navigationHistory.length - 1];
                  setNavigationHistory(navigationHistory.slice(0, -1));
                  setCurrentScreen(previousScreen);
                } else {
                  setCurrentScreen('home');
                }
              }
            }}
          />
        );
      case 'subjectsList':
        return <SubjectsListScreen userData={userData} completedTopics={completedTopics} onNavigate={handleSubjectsListNavigate} onBack={handleSubjectsListBack} />;
      case 'topicDetail':
        return (
          <TopicDetailScreen 
            topicData={navigationParams.topicData}
            subjectName={navigationParams.subjectName}
            allNudges={navigationParams.allNudges}
            initialTopicId={navigationParams.initialTopicId}
            userData={userData}
            onBack={handleTopicDetailBack}
            onNavigate={handleTopicDetailNavigate}
          />
        );
      case 'flashcards':
        return (
          <FlashcardsScreen
            flashcards={navigationParams.flashcards}
            topic={navigationParams.topic}
            subject={navigationParams.subject}
            startIndex={navigationParams.startIndex || 0}
            onBack={handleFlashcardsBack}
            onComplete={handleFlashcardsComplete}
          />
        );
      case 'qaCards':
        return (
          <QACardsScreen
            qaCards={navigationParams.qaCards}
            topic={navigationParams.topic}
            subject={navigationParams.subject}
            onBack={handleQACardsBack}
          />
        );
      case 'promptCards':
        return (
          <PromptCardsScreen
            prompts={navigationParams.prompts}
            topic={navigationParams.topic}
            subject={navigationParams.subject}
            onBack={handlePromptCardsBack}
          />
        );
  
      case 'subscription':
        return <SubscriptionPlanScreen onBack={() => {
          if (navigationHistory.length > 0) {
            const previousScreen = navigationHistory[navigationHistory.length - 1];
            setNavigationHistory(navigationHistory.slice(0, -1));
            setCurrentScreen(previousScreen);
          } else {
            handleSubscriptionBack();
          }
        }} />;
      case 'myChildren':
        return <MyChildrenScreen onBack={handleMyChildrenBack} />;
      case 'progressReports':
        return <ProgressReportsScreen onBack={handleProgressReportsBack} />;
      case 'learningProgress':
        return <LearningProgressScreen userData={userData} completedTopics={completedTopics} onBack={handleLearningProgressBack} onNavigate={handleLearningProgressNavigate} />;
      case 'milestones':
        return <MilestonesScreen userData={userData} onBack={handleMilestonesBack} />;
      case 'assessmentHub':
        return (
          <AssessmentHubScreen 
            onBack={handleAssessmentBack}
            onNavigate={handleAssessmentNavigate}
            userData={userData}
          />
        );
      case 'assessment':
        return (
          <AssessmentScreen 
            knownTopics={navigationParams.knownTopics} 
            practiceTopics={navigationParams.practiceTopics}
            childSubjects={navigationParams.childSubjects}
            previouslySelectedSubjects={navigationParams.previouslySelectedSubjects}
            onBack={handleAssessmentBack}
            onNavigate={handleAssessmentNavigate}
          />
        );
      case 'selectTopics':
        return (
          <SelectTopicsScreen
            selectedSubjects={navigationParams.selectedSubjects}
            knownTopics={navigationParams.knownTopics}
            practiceTopics={navigationParams.practiceTopics}
            childSubjects={navigationParams.childSubjects}
            previouslySelectedTopics={navigationParams.previouslySelectedTopics || navigationParams.selectedTopicIds}
            previouslySelectedTypes={navigationParams.previouslySelectedTypes}
            previouslySelectedDuration={navigationParams.previouslySelectedDuration}
            onBack={handleSelectTopicsBack}
            onNavigate={handleAssessmentNavigate}
          />
        );
      case 'selectQuestionTypes':
        return (
          <SelectQuestionTypesScreen
            selectedSubjects={navigationParams.selectedSubjects}
            selectedTopics={navigationParams.selectedTopics}
            selectedTopicIds={navigationParams.selectedTopicIds}
            knownTopics={navigationParams.knownTopics}
            practiceTopics={navigationParams.practiceTopics}
            childSubjects={navigationParams.childSubjects}
            previouslySelectedTypes={navigationParams.previouslySelectedTypes || navigationParams.selectedTypes}
            previouslySelectedDuration={navigationParams.previouslySelectedDuration}
            onBack={handleSelectQuestionTypesBack}
            onNavigate={handleAssessmentNavigate}
          />
        );
      case 'quizSettings':
        return (
          <QuizSettingsScreen
            selectedSubjects={navigationParams.selectedSubjects}
            selectedTopics={navigationParams.selectedTopics}
            selectedTypes={navigationParams.selectedTypes}
            questionTypes={navigationParams.questionTypes}
            knownTopics={navigationParams.knownTopics}
            practiceTopics={navigationParams.practiceTopics}
            previouslySelectedDuration={navigationParams.previouslySelectedDuration || navigationParams.selectedDuration}
            userData={userData}
            onBack={handleQuizSettingsBack}
            onNavigate={handleAssessmentNavigate}
          />
        );
      case 'complete':
        return (
          <QuizCompleteScreen
            selectedSubjects={navigationParams.selectedSubjects}
            selectedTopics={navigationParams.selectedTopics}
            selectedTypes={navigationParams.selectedTypes}
            selectedSetting={navigationParams.selectedSetting}
            selectedDuration={navigationParams.selectedDuration}
            durationOptions={navigationParams.durationOptions}
            questionTypes={navigationParams.questionTypes}
            userData={userData}
            onNavigate={handleAssessmentNavigate}
          />
        );
      case 'settings':
        return <SettingsScreen 
          userData={userData} 
          onUpdateUserData={(updated) => setUserData({ ...userData, ...updated })}
          onBack={handleSettingsBack} 
          onNavigate={handleSettingsNavigate} 
        />;
      case 'notifications':
        return <NotificationsScreen onBack={handleNotificationsBack} userData={userData} />;
      case 'riddles':
        return <RiddlesScreen riddles={navigationParams?.riddles} onBack={() => { setNavigationHistory(navigationHistory.slice(0, -1)); setCurrentScreen('home'); }} />;
      case 'helpSupport':
        return <HelpSupportScreen onBack={handleHelpSupportBack} onNavigate={handleHelpSupportNavigate} />;
      case 'privacyPolicy':
        return <PrivacyPolicyScreen onBack={() => setCurrentScreen('settings')} />;
      case 'termsOfService':
        return <TermsOfServiceScreen onBack={() => setCurrentScreen('settings')} />;
      case 'rateUs':
        return <RateUsScreen onBack={() => setCurrentScreen('settings')} userData={userData} />;
      case 'aboutUs':
        return <AboutUsScreen onBack={() => setCurrentScreen('settings')} />;
      default:
        return <SplashScreen onFinish={handleSplashFinish} />;
    }
  };

  return renderScreen();
};

export default App;