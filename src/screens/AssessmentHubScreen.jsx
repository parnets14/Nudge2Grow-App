/**
 * Assessment Hub Screen - Shows quiz creation overview
 */

import React from 'react';
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
import { getAllSubjects, getNudgesBySubject } from '../data/nudgesData';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;
const isSmallDevice = width < 375;

const AssessmentHubScreen = ({ onBack, onNavigate }) => {
  const allSubjects = getAllSubjects();

  // Subject configuration with images
  const subjectConfig = {
    'Math': { image: require('../assets/images/math.png'), color: '#3B82F6' },
    'Science / EVS': { image: require('../assets/images/sci.png'), color: '#10B981' },
    'English': { image: require('../assets/images/eng.png'), color: '#F59E0B' },
    'Social Studies': { image: require('../assets/images/social s.png'), color: '#EC4899' },
    'Artificial Intelligence': { image: require('../assets/images/Ai s.png'), color: '#8B5CF6' },
    'Financial Literacy': { image: require('../assets/images/Fl.png'), color: '#14B8A6' },
    'Sex & Safety': { image: require('../assets/images/ss.png'), color: '#EF4444' },
  };

  // Get recent quizzes (mock data)
  const recentQuizzes = [
    {
      id: 1,
      subject: 'Math',
      title: 'Mathematics — Numbers',
      questions: 25,
      types: 'True/False, MCQ',
      status: 'Sent',
      image: require('../assets/images/math.png'),
      color: '#3B82F6',
    },
    {
      id: 2,
      subject: 'Science / EVS',
      title: 'Science / EVS — Plants',
      questions: 10,
      types: 'Fill in Blanks',
      status: 'Sent',
      image: require('../assets/images/sci.png'),
      color: '#10B981',
    },
  ];

  const handleCreateQuiz = () => {
    const subjectNames = allSubjects.map(s => s.name);
    onNavigate && onNavigate('assessment', {
      selectedSubjects: subjectNames,
      knownTopics: [],
      practiceTopics: [],
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Icon name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerGreeting}>Good evening 👋</Text>
          <Text style={styles.headerTitle}>Parent's Hub</Text>
        </View>
        <View style={styles.profileBadge}>
          <Text style={styles.profileBadgeText}>P</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroContent}>
            <Text style={styles.heroLabel}>SCREEN-FREE LEARNING</Text>
            <Text style={styles.heroTitle}>Build quizzes your{'\n'}child will love 🎓</Text>
            <Text style={styles.heroSubtitle}>Printed quiz sheets — no screen{'\n'}time needed.</Text>
          </View>
          <View style={styles.heroStats}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{allSubjects.length}</Text>
              <Text style={styles.statLabel}>Subjects</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>18</Text>
              <Text style={styles.statLabel}>Topics</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>4</Text>
              <Text style={styles.statLabel}>Q Types</Text>
            </View>
          </View>
        </View>

        {/* Subjects Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subjects</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            style={styles.subjectsScrollView}
          >
            {allSubjects.map((subject) => {
              const config = subjectConfig[subject.name] || { icon: 'book-outline', color: '#6B7280' };
              return (
                <TouchableOpacity
                  key={subject.name}
                  style={styles.subjectCard}
                  onPress={handleCreateQuiz}
                >
                  <View style={[styles.subjectIcon, { backgroundColor: 'transparent' }]}>
                    {config.image ? (
                      <Image 
                        source={config.image}
                        style={styles.subjectIconImage}
                        resizeMode="contain"
                      />
                    ) : (
                      <MaterialIcon name={config.icon} size={32} color={config.color} />
                    )}
                  </View>
                  <Text style={styles.subjectName}>{subject.name}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Recent Quizzes Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Quizzes</Text>
          {recentQuizzes.map((quiz) => (
            <TouchableOpacity key={quiz.id} style={styles.quizCard}>
              <View style={styles.quizLeft}>
                <View style={[styles.quizIcon, { backgroundColor: 'transparent' }]}>
                  {quiz.image ? (
                    <Image 
                      source={quiz.image}
                      style={styles.quizIconImage}
                      resizeMode="contain"
                    />
                  ) : (
                    <MaterialIcon name={quiz.icon} size={24} color={quiz.color} />
                  )}
                </View>
                <View style={styles.quizInfo}>
                  <Text style={styles.quizTitle}>{quiz.title}</Text>
                  <Text style={styles.quizMeta}>
                    {quiz.questions} questions · {quiz.types}
                  </Text>
                </View>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: '#D1FAE5' }]}>
                <Text style={[styles.statusText, { color: '#10B981' }]}>{quiz.status}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleCreateQuiz}>
        <Icon name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  header: {
    backgroundColor: '#F5F5F7',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: isSmallDevice ? 42 : 50,
    paddingBottom: isSmallDevice ? 12 : 16,
    paddingHorizontal: isSmallDevice ? 16 : 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    paddingLeft: isSmallDevice ? 8 : 12,
  },
  headerGreeting: {
    fontSize: isSmallDevice ? 12 : 13,
    color: '#9CA3AF',
    fontFamily: 'Montserrat-Regular',
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: isTablet ? 24 : isSmallDevice ? 20 : 22,
    fontWeight: '800',
    color: '#1A1A1A',
    fontFamily: 'Montserrat-Bold',
  },
  profileBadge: {
    width: isSmallDevice ? 40 : 44,
    height: isSmallDevice ? 40 : 44,
    borderRadius: isSmallDevice ? 20 : 22,
    backgroundColor: '#1A1F3A',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: isSmallDevice ? 12 : 16,
  },
  profileBadgeText: {
    fontSize: isSmallDevice ? 18 : 20,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
  },
  content: {
    flex: 1,
  },
  heroCard: {
    backgroundColor: '#1A1F3A',
    marginHorizontal: isSmallDevice ? 16 : 20,
    marginTop: isSmallDevice ? 12 : 16,
    marginBottom: isSmallDevice ? 16 : 20,
    padding: isSmallDevice ? 20 : 24,
    borderRadius: isSmallDevice ? 16 : 20,
    overflow: 'hidden',
  },
  heroContent: {
    marginBottom: isSmallDevice ? 20 : 24,
  },
  heroLabel: {
    fontSize: isSmallDevice ? 11 : 12,
    fontWeight: '700',
    color: '#4ECDC4',
    letterSpacing: 2,
    marginBottom: 12,
    fontFamily: 'Montserrat-Bold',
  },
  heroTitle: {
    fontSize: isTablet ? 32 : isSmallDevice ? 26 : 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 16,
    lineHeight: isSmallDevice ? 32 : 36,
    fontFamily: 'Montserrat-Bold',
  },
  heroSubtitle: {
    fontSize: isSmallDevice ? 13 : 14,
    color: '#9CA3AF',
    lineHeight: 20,
    fontFamily: 'Montserrat-Regular',
  },
  heroStats: {
    flexDirection: 'row',
    gap: isSmallDevice ? 12 : 14,
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: isSmallDevice ? 16 : 18,
    paddingHorizontal: isSmallDevice ? 12 : 14,
    borderRadius: isSmallDevice ? 12 : 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statNumber: {
    fontSize: isTablet ? 28 : isSmallDevice ? 22 : 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
    fontFamily: 'Montserrat-Bold',
  },
  statLabel: {
    fontSize: isSmallDevice ? 11 : 12,
    color: '#9CA3AF',
    fontFamily: 'Montserrat-Regular',
  },
  section: {
    paddingHorizontal: isSmallDevice ? 16 : 20,
    marginBottom: isSmallDevice ? 20 : 24,
  },
  sectionTitle: {
    fontSize: isTablet ? 18 : isSmallDevice ? 15 : 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: isSmallDevice ? 12 : 14,
    fontFamily: 'Montserrat-Bold',
  },
  subjectsScrollView: {
    marginHorizontal: isSmallDevice ? -16 : -20,
    paddingHorizontal: isSmallDevice ? 16 : 20,
  },
  subjectCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: isSmallDevice ? 14 : 16,
    padding: isSmallDevice ? 10 : 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: isSmallDevice ? 12 : 14,
    width: isSmallDevice ? 90 : 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  subjectIcon: {
    width: isSmallDevice ? 44 : 50,
    height: isSmallDevice ? 44 : 50,
    borderRadius: isSmallDevice ? 22 : 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: isSmallDevice ? 8 : 10,
  },
  subjectIconImage: {
    width: '75%',
    height: '75%',
  },
  subjectName: {
    fontSize: isSmallDevice ? 12 : 13,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    fontFamily: 'Montserrat-Bold',
    lineHeight: isSmallDevice ? 16 : 18,
  },
  quizCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: isSmallDevice ? 16 : 18,
    padding: isSmallDevice ? 16 : 18,
    marginBottom: isSmallDevice ? 14 : 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  quizLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: isSmallDevice ? 14 : 16,
  },
  quizIcon: {
    width: isSmallDevice ? 52 : 56,
    height: isSmallDevice ? 52 : 56,
    borderRadius: isSmallDevice ? 14 : 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quizIconImage: {
    width: '75%',
    height: '75%',
  },
  quizInfo: {
    flex: 1,
  },
  quizTitle: {
    fontSize: isSmallDevice ? 14 : 15,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 6,
    fontFamily: 'Montserrat-Bold',
  },
  quizMeta: {
    fontSize: isSmallDevice ? 12 : 13,
    color: '#6B7280',
    fontFamily: 'Montserrat-Regular',
  },
  statusBadge: {
    paddingHorizontal: isSmallDevice ? 12 : 14,
    paddingVertical: isSmallDevice ? 8 : 10,
    borderRadius: isSmallDevice ? 12 : 14,
  },
  statusText: {
    fontSize: isSmallDevice ? 12 : 13,
    fontWeight: '700',
    fontFamily: 'Montserrat-Bold',
  },
  fab: {
    position: 'absolute',
    bottom: isSmallDevice ? 20 : 24,
    right: isSmallDevice ? 20 : 24,
    width: isSmallDevice ? 52 : 56,
    height: isSmallDevice ? 52 : 56,
    borderRadius: isSmallDevice ? 26 : 28,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  bottomSpacing: {
    height: 100,
  },
});

export default AssessmentHubScreen;
