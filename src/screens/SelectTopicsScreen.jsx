/**
 * Select Topics Screen - Step 2: Select Topics from chosen subjects
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
import { fetchTopicsBySubject, fetchSubjects } from '../api';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;
const isSmallDevice = width < 375;

const SelectTopicsScreen = ({ 
  selectedSubjects, 
  onBack, 
  onNavigate, 
  knownTopics, 
  practiceTopics, 
  childSubjects, 
  previouslySelectedTopics,
  previouslySelectedTypes,
  previouslySelectedDuration,
}) => {
  const [selectedTopics, setSelectedTopics] = useState(previouslySelectedTopics || []);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subjectDetails, setSubjectDetails] = useState({});

  useEffect(() => {
    loadTopics();
  }, [selectedSubjects]);

  // Update selected topics if previouslySelectedTopics changes
  useEffect(() => {
    if (previouslySelectedTopics && previouslySelectedTopics.length > 0) {
      setSelectedTopics(previouslySelectedTopics);
    }
  }, [previouslySelectedTopics]);

  const loadTopics = async () => {
    try {
      setLoading(true);
      
      // Fetch all subjects to get subject details
      const allSubjects = await fetchSubjects();
      
      // Find the selected subject
      const selectedSubject = allSubjects.find(s => 
        selectedSubjects.includes(s.name || s.title)
      );
      
      if (selectedSubject) {
        // Get the student's level for this subject
        const studentLevel = childSubjects ? childSubjects[selectedSubject._id] : null;
        
        console.log('[SelectTopics] Selected subject:', selectedSubject.name);
        console.log('[SelectTopics] Student level:', studentLevel);
        
        // Store subject details for display
        setSubjectDetails({
          name: selectedSubject.name || selectedSubject.title,
          grade: selectedSubject.grade || 'N/A',
          level: studentLevel || 'Intermediate',
          imageUrl: selectedSubject.imageUrl,
        });
        
        // Fetch topics for this subject
        const fetchedTopics = await fetchTopicsBySubject(selectedSubject._id);
        
        console.log('[SelectTopics] Fetched topics:', fetchedTopics.length);
        
        // Get today's date (start of day for comparison)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Filter topics by the student's exact level AND scheduled date
        let filteredTopics = fetchedTopics;
        
        if (studentLevel) {
          const studentLevelLower = studentLevel.toLowerCase();
          
          console.log('[SelectTopics] Filtering for exact level:', studentLevel);
          
          // Filter topics that match ONLY the student's exact level AND are scheduled for today or earlier
          filteredTopics = fetchedTopics.filter(topic => {
            // Check if topic has a level field
            if (topic.level) {
              const topicLevel = topic.level.toLowerCase();
              const isLevelMatch = topicLevel === studentLevelLower;
              
              // Check scheduled date - only show if today or earlier
              let isDateValid = true;
              if (topic.scheduledDate) {
                const scheduledDate = new Date(topic.scheduledDate);
                scheduledDate.setHours(0, 0, 0, 0);
                isDateValid = scheduledDate <= today;
                
                console.log('[SelectTopics] Topic:', topic.topic || topic.name, 
                  '| Level:', topicLevel, 
                  '| Scheduled:', scheduledDate.toDateString(),
                  '| Today:', today.toDateString(),
                  '| Date Valid:', isDateValid);
              }
              
              const isMatch = isLevelMatch && isDateValid;
              
              console.log('[SelectTopics] Topic:', topic.topic || topic.name, '| Level Match:', isLevelMatch, '| Date Valid:', isDateValid, '| Final Match:', isMatch);
              
              return isMatch;
            }
            // If topic doesn't have a level, exclude it for strict matching
            console.log('[SelectTopics] Topic:', topic.topic || topic.name, '| No level - excluding');
            return false;
          });
        } else {
          // If no student level, still filter by date
          filteredTopics = fetchedTopics.filter(topic => {
            if (topic.scheduledDate) {
              const scheduledDate = new Date(topic.scheduledDate);
              scheduledDate.setHours(0, 0, 0, 0);
              return scheduledDate <= today;
            }
            return true; // Show topics without scheduled date
          });
        }
        
        console.log('[SelectTopics] Filtered topics:', filteredTopics.length);
        setTopics(filteredTopics);
      } else {
        console.log('[SelectTopics] No subject found matching:', selectedSubjects);
        setTopics([]);
      }
    } catch (err) {
      console.error('[SelectTopics] Failed to load topics:', err);
      setTopics([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleTopic = (topicId) => {
    if (selectedTopics.includes(topicId)) {
      setSelectedTopics(selectedTopics.filter(t => t !== topicId));
    } else {
      setSelectedTopics([...selectedTopics, topicId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedTopics.length === topics.length) {
      setSelectedTopics([]);
    } else {
      setSelectedTopics(topics.map(t => t._id));
    }
  };

  const handleNext = () => {
    if (selectedTopics.length > 0 && onNavigate) {
      // Get the actual topic objects for the selected IDs
      const selectedTopicObjects = topics.filter(t => selectedTopics.includes(t._id));
      
      onNavigate('selectQuestionTypes', { 
        selectedSubjects, 
        selectedTopics: selectedTopicObjects,
        selectedTopicIds: selectedTopics,
        previouslySelectedTypes,
        previouslySelectedDuration,
        knownTopics,
        practiceTopics,
        childSubjects
      });
    }
  };

  const handleBack = () => {
    // Pass current selections back when going back
    if (onBack) {
      onBack(selectedTopics);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Icon name="chevron-back" size={28} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Topics</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Step Indicator */}
      <View style={styles.stepIndicator}>
        <View style={styles.stepItem}>
          <View style={[styles.stepNumber, styles.stepNumberCompleted]}>
            <Icon name="checkmark" size={16} color="#FFFFFF" />
          </View>
          <Text style={[styles.stepLabel, styles.stepLabelCompleted]}>Subject</Text>
        </View>
        <View style={styles.stepItem}>
          <View style={[styles.stepNumber, styles.stepNumberActive]}>
            <Text style={styles.stepNumberText}>2</Text>
          </View>
          <Text style={[styles.stepLabel, styles.stepLabelActive]}>Topics</Text>
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
            <Text style={styles.stepBadge}>● STEP 2 OF 4</Text>
          </View>
        </View>

        <View style={styles.instructionSection}>
          <Text style={styles.instructionTitle}>Pick Topics</Text>
          <Text style={styles.instructionText}>
            Select one or more topics to include in your quiz.
          </Text>
          <View style={styles.selectedCountContainer}>
            <Text style={styles.selectedCount}>{selectedTopics.length} selected</Text>
            <TouchableOpacity onPress={handleSelectAll}>
              <Text style={styles.selectAllText}>
                {selectedTopics.length === topics.length ? 'Deselect All' : 'Select All'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tipsCard}>
          <Text style={styles.tipsText}>Quizzes with 2-3 topics keep children focused and build confidence faster.</Text>
        </View>

        <View style={styles.topicsContainer}>
          {loading ? (
            <Text style={styles.loadingText}>Loading topics...</Text>
          ) : topics.length === 0 ? (
            <Text style={styles.emptyText}>No topics available for this subject</Text>
          ) : (
            topics.map((topic) => {
              const isSelected = selectedTopics.includes(topic._id);
              const topicName = topic.topic || topic.title || topic.name;

              return (
                <TouchableOpacity
                  key={topic._id}
                  style={[styles.topicCard, isSelected && styles.topicCardSelected]}
                  onPress={() => toggleTopic(topic._id)}
                >
                  <View style={styles.topicCardLeft}>
                    <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                      {isSelected && (
                        <Icon name="checkmark" size={14} color="#FFFFFF" />
                      )}
                    </View>
                    <View style={styles.topicInfo}>
                      <Text style={styles.topicName}>{topicName}</Text>
                      <Text style={styles.topicMeta}>
                        {subjectDetails.name} · {topic.level || subjectDetails.level}
                      </Text>
                    </View>
                  </View>
                  {topic.imageUrl && (
                    <Image 
                      source={{ uri: topic.imageUrl }}
                      style={styles.topicImage}
                      resizeMode="contain"
                    />
                  )}
                </TouchableOpacity>
              );
            })
          )}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, selectedTopics.length === 0 && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={selectedTopics.length === 0}
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
  stepNumberCompleted: {
    backgroundColor: '#27AE60',
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
  stepLabelCompleted: {
    color: '#27AE60',
    fontWeight: '800',
  },
  content: {
    flex: 1,
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
  stepBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8B5CF6',
    fontFamily: 'Montserrat-Bold',
    letterSpacing: 0.5,
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
  selectedCountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  selectedCount: {
    fontSize: isTablet ? 14 : 13,
    fontWeight: '700',
    color: '#27AE60',
    fontFamily: 'Montserrat-Bold',
  },
  selectAllText: {
    fontSize: isTablet ? 13 : 12,
    fontWeight: '700',
    color: '#27AE60',
    fontFamily: 'Montserrat-Bold',
  },
  tipsCard: {
    backgroundColor: '#E8F5E9',
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#27AE60',
  },
  tipsText: {
    fontSize: isTablet ? 13 : 12,
    fontWeight: '500',
    color: '#27AE60',
    lineHeight: 18,
    fontFamily: 'Montserrat-Regular',
  },
  topicsContainer: {
    paddingHorizontal: 20,
    gap: 12,
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
  topicCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topicCardSelected: {
    borderColor: '#A7F3D0',
    backgroundColor: '#F0FDF4',
  },
  topicCardLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  checkboxSelected: {
    backgroundColor: '#27AE60',
    borderColor: '#27AE60',
  },
  topicInfo: {
    flex: 1,
  },
  topicName: {
    fontSize: isTablet ? 15 : 14,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 4,
    fontFamily: 'Montserrat-Bold',
  },
  topicMeta: {
    fontSize: isTablet ? 12 : 11,
    fontWeight: '500',
    color: '#9CA3AF',
    fontFamily: 'Montserrat-Regular',
  },
  topicDate: {
    fontSize: isTablet ? 11 : 10,
    fontWeight: '600',
    color: '#27AE60',
    fontFamily: 'Montserrat-SemiBold',
    marginTop: 4,
  },
  topicImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    flexShrink: 0,
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
});

export default SelectTopicsScreen;
