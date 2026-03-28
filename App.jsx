/**
 * Main App Component
 * @format
 */

import React, { useState, useEffect } from 'react';
import { Storage } from './src/utils/storage';
import SplashScreen from './src/screens/SplashScreen';
import IntroScreen from './src/screens/IntroScreen';
import LoginScreen from './src/screens/LoginScreen';
import PersonalSetupScreen from './src/screens/PersonalSetupScreen';
import { fetchProfile } from './src/api';
import HomeScreen from './src/screens/HomeScreen';
import SubscriptionPlanScreen from './src/screens/SubscriptionPlanScreen';
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

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [userData, setUserData] = useState(null);
  const [setupToken, setSetupToken] = useState(null);
  const [navigationParams, setNavigationParams] = useState({});
  const [navigationHistory, setNavigationHistory] = useState([]);
  const [completedTopics, setCompletedTopics] = useState(new Set());

  // Load persisted progress on mount
  useEffect(() => {
    const saved = Storage.getItem('completedTopics');
    if (saved) {
      try { setCompletedTopics(new Set(JSON.parse(saved))); } catch (_) {}
    }
  }, []);

  const markTopicComplete = (key) => {
    setCompletedTopics(prev => {
      const next = new Set([...prev, key]);
      Storage.setItem('completedTopics', JSON.stringify([...next]));
      return next;
    });
  };

  const handleSplashFinish = () => {
    setCurrentScreen('intro');
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
    const merged = { ...userData, ...data };
    setUserData(merged);

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
        setUserData({ ...merged, children, email: profile.email });
        setCurrentScreen('home');
        return;
      } catch (err) {
        console.error('[App] fetchProfile failed:', err.message);
      }
    }
    // New user or no children — go to setup, pass token directly
    setSetupToken(data.token || null);
    setCurrentScreen('setup');
  };

  const handleLoginRegister = () => {
    // For now, just go to setup screen
    setCurrentScreen('setup');
  };

  const handleSetupBack = () => {
    setCurrentScreen('login');
  };

  const handleSetupFinish = (data) => {
    setUserData({ ...(userData || {}), ...data });
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

  const handleSelectTopicsBack = () => {
    if (navigationHistory.length > 0) {
      const previousScreen = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(navigationHistory.slice(0, -1));
      setCurrentScreen(previousScreen);
    } else {
      setCurrentScreen('assessment');
    }
  };

  const handleSelectQuestionTypesBack = () => {
    if (navigationHistory.length > 0) {
      const previousScreen = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(navigationHistory.slice(0, -1));
      setCurrentScreen(previousScreen);
    } else {
      setCurrentScreen('selectTopics');
    }
  };

  const handleQuizSettingsBack = () => {
    if (navigationHistory.length > 0) {
      const previousScreen = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(navigationHistory.slice(0, -1));
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
    }
  };

  const handleNotificationsBack = () => {
    setCurrentScreen('home');
  };

  const handleLogout = () => {
    // Clear user data and go to login screen
    setUserData(null);
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
        return <HomeScreen userData={userData} onBack={handleHomeBack} onNavigate={handleHomeNavigate} />;
      case 'subjectsList':
        return <SubjectsListScreen userData={userData} completedTopics={completedTopics} onNavigate={handleSubjectsListNavigate} onBack={handleSubjectsListBack} />;
      case 'topicDetail':
        return (
          <TopicDetailScreen 
            topicData={navigationParams.topicData}
            subjectName={navigationParams.subjectName}
            allNudges={navigationParams.allNudges}
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
      case 'vocabCards':
        return (
          <VocabCardsScreen
            vocabulary={navigationParams.vocabulary}
            topic={navigationParams.topic}
            subject={navigationParams.subject}
            onBack={handleVocabCardsBack}
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
        return <LearningProgressScreen userData={userData} onBack={handleLearningProgressBack} onNavigate={handleLearningProgressNavigate} />;
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
            onBack={handleSelectTopicsBack}
            onNavigate={handleAssessmentNavigate}
          />
        );
      case 'selectQuestionTypes':
        return (
          <SelectQuestionTypesScreen
            selectedSubjects={navigationParams.selectedSubjects}
            selectedTopics={navigationParams.selectedTopics}
            knownTopics={navigationParams.knownTopics}
            practiceTopics={navigationParams.practiceTopics}
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
            knownTopics={navigationParams.knownTopics}
            practiceTopics={navigationParams.practiceTopics}
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
        return <NotificationsScreen onBack={handleNotificationsBack} />;
      case 'riddles':
        return <RiddlesScreen riddles={navigationParams?.riddles} onBack={() => { setNavigationHistory(navigationHistory.slice(0, -1)); setCurrentScreen('home'); }} />;
      case 'helpSupport':
        return <HelpSupportScreen onBack={handleHelpSupportBack} onNavigate={handleHelpSupportNavigate} />;
      default:
        return <SplashScreen onFinish={handleSplashFinish} />;
    }
  };

  return renderScreen();
};

export default App;