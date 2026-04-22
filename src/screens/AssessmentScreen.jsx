/**
 * Assessment Screen - Step 1: Select Subjects
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
import { fetchSubjects } from '../api';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;
const isSmallDevice = width < 375;

const AssessmentScreen = ({ 
  onBack, 
  onNavigate, 
  knownTopics, 
  practiceTopics, 
  childSubjects,
  previouslySelectedSubjects // Add this prop
}) => {
  const [selectedSubjects, setSelectedSubjects] = useState(previouslySelectedSubjects || []);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      const data = await fetchSubjects();
      // Filter to show only subjects the child has selected
      if (childSubjects) {
        const childSubjectIds = Object.keys(childSubjects);
        const filteredSubjects = data.filter(s => childSubjectIds.includes(s._id));
        setSubjects(filteredSubjects);
      } else {
        setSubjects(data);
      }
    } catch (err) {
      console.error('[Assessment] Failed to load subjects:', err);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Subject configuration
  const subjectConfig = {
    'Math': { image: require('../assets/images/math.png'), color: '#3B82F6' },
    'Science / EVS': { image: require('../assets/images/sci.png'), color: '#10B981' },
    'English': { image: require('../assets/images/eng.png'), color: '#F59E0B' },
    'Social Studies': { image: require('../assets/images/social s.png'), color: '#EC4899' },
    'Artificial Intelligence': { image: require('../assets/images/Ai s.png'), color: '#8B5CF6' },
    'Financial Literacy': { image: require('../assets/images/Fl.png'), color: '#14B8A6' },
    'Sex & Safety': { image: require('../assets/images/ss.png'), color: '#EF4444' },
  };

  const toggleSubject = (subjectName) => {
    if (selectedSubjects.includes(subjectName)) {
      setSelectedSubjects([]);
    } else {
      setSelectedSubjects([subjectName]);
    }
  };

  const handleNext = () => {
    if (selectedSubjects.length > 0 && onNavigate) {
      onNavigate('selectTopics', { selectedSubjects, knownTopics, practiceTopics, childSubjects });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Icon name="chevron-back" size={28} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Quiz</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Step Indicator */}
      <View style={styles.stepIndicator}>
        <View style={styles.stepItem}>
          <View style={[styles.stepNumber, styles.stepNumberActive]}>
            <Text style={styles.stepNumberText}>1</Text>
          </View>
          <Text style={[styles.stepLabel, styles.stepLabelActive]}>Subject</Text>
        </View>
        <View style={styles.stepItem}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>2</Text>
          </View>
          <Text style={styles.stepLabel}>Topics</Text>
        </View>
        <View style={styles.stepItem}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>3</Text>
          </View>
          <Text style={styles.stepLabel}>Q. Types</Text>
        </View>
        <View style={styles.stepItem}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>4</Text>
          </View>
          <Text style={styles.stepLabel}>Settings</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.stepBadgeWrapper}>
          <View style={styles.stepBadgeContainer}>
            <Text style={styles.stepBadge}>● STEP 1 OF 4</Text>
          </View>
        </View>
        <View style={styles.instructionSection}>
          <Text style={styles.instructionTitle}>Choose a Subject</Text>
          <Text style={styles.instructionText}>
            Pick the subject you want to quiz your child on.
          </Text>
        </View>

        <View style={styles.subjectsGrid}>
          {loading ? (
            <Text style={styles.loadingText}>Loading subjects...</Text>
          ) : subjects.length === 0 ? (
            <Text style={styles.emptyText}>No subjects available</Text>
          ) : (
            subjects.map((subject) => {
              const subjectName = subject.name || subject.title;
              const config = subjectConfig[subjectName] || { icon: 'book-outline', color: '#666666' };
              const isSelected = selectedSubjects.includes(subjectName);
              const level = childSubjects ? childSubjects[subject._id] : null;

              return (
                <TouchableOpacity
                  key={subject._id}
                  style={[styles.subjectCard, isSelected && styles.subjectCardSelected]}
                  onPress={() => toggleSubject(subjectName)}
                >
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Icon name="checkmark" size={16} color="#FFFFFF" />
                    </View>
                  )}
                  <View style={[styles.subjectIcon, { backgroundColor: 'transparent' }]}>
                    {subject.imageUrl ? (
                      <Image 
                        source={{ uri: subject.imageUrl }}
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
                      <MaterialIcon name={config.icon} size={28} color={config.color} />
                    )}
                  </View>
                  <Text style={styles.subjectName}>{subjectName}</Text>
                  {level && <Text style={styles.subjectLevel}>{level}</Text>}
                </TouchableOpacity>
              );
            })
          )}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, selectedSubjects.length === 0 && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={selectedSubjects.length === 0}
        >
          <Text style={styles.nextButtonText}>Continue</Text>
          <Icon name="arrow-forward" size={18} color="#FFFFFF" style={styles.buttonIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
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
    fontSize: isTablet ? 22 : 20,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Montserrat-Bold',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  instructionCard: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  instructionSection: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 12,
  },
  instructionTitle: {
    fontSize: isTablet ? 20 : 18,
    fontWeight: '800',
    color: '#1A1F3A',
    marginBottom: 6,
    fontFamily: 'Montserrat-Bold',
  },
  instructionText: {
    fontSize: isTablet ? 13 : 12,
    fontWeight: '500',
    color: '#9CA3AF',
    lineHeight: 18,
    fontFamily: 'Montserrat-Regular',
  },
  subjectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  subjectCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    width: (width - 52) / 2,
    minHeight: 110,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
    justifyContent: 'center',
  },
  subjectCardSelected: {
    borderColor: '#A7F3D0',
    backgroundColor: '#F0FDF4',
  },
  checkmark: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#27AE60',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subjectIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  subjectIconImage: {
    width: '75%',
    height: '75%',
  },
  subjectName: {
    fontSize: isTablet ? 14 : 13,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
    fontFamily: 'Montserrat-Bold',
    marginBottom: 3,
  },
  subjectLevel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#10B981',
    textAlign: 'center',
    fontFamily: 'Montserrat-SemiBold',
    marginTop: 2,
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Montserrat-Regular',
    padding: 20,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Montserrat-Regular',
    padding: 20,
    textAlign: 'center',
  },
  topicCount: {
    fontSize: isTablet ? 11 : 10,
    fontWeight: '600',
    color: '#9CA3AF',
    fontFamily: 'Montserrat-SemiBold',
  },
  bottomSpacing: {
    height: 100,
  },
  footer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  nextButton: {
    backgroundColor: '#1A1F3A',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  nextButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  nextButtonText: {
    fontSize: isTablet ? 16 : 15,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
  },
  buttonIcon: {
    marginLeft: 10,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: isSmallDevice ? 10 : 16,
    paddingVertical: 10,
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  stepIndicatorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: isSmallDevice ? 12 : 16,
    paddingVertical: 10,
    gap: isSmallDevice ? 16 : 24,
  },
  stepItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: isSmallDevice ? 4 : 6,
    flex: 1,
  },
  stepNumber: {
    width: isSmallDevice ? 28 : 32,
    height: isSmallDevice ? 28 : 32,
    borderRadius: isSmallDevice ? 14 : 16,
    backgroundColor: '#E8EAED',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  stepNumberActive: {
    backgroundColor: '#1A1F3A',
  },
  stepNumberText: {
    fontSize: isSmallDevice ? 11 : 12,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
  },
  stepLabel: {
    fontSize: isSmallDevice ? 9 : 10,
    fontWeight: '600',
    color: '#B0B0B0',
    fontFamily: 'Montserrat-SemiBold',
  },
  stepLabelActive: {
    color: '#1A1F3A',
    fontWeight: '800',
  },
  stepBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8B5CF6',
    fontFamily: 'Montserrat-Bold',
    letterSpacing: 0.5,
  },
  stepBadgeWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  stepBadgeContainer: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  buttonIcon: {
    marginLeft: 8,
  },
});

export default AssessmentScreen;
