/**
 * Select Question Types Screen - Step 3: Choose question types for the quiz
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
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchQuestionTypes } from '../api';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;
const isSmallDevice = width < 375;

const SelectQuestionTypesScreen = ({ 
  selectedSubjects, 
  selectedTopics, 
  previouslySelectedTypes,
  previouslySelectedDuration, // Add this
  onBack, 
  onNavigate, 
  knownTopics, 
  practiceTopics 
}) => {
  const [selectedTypes, setSelectedTypes] = useState(previouslySelectedTypes || []);
  const [questionTypes, setQuestionTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadQuestionTypes();
  }, []);

  const loadQuestionTypes = async () => {
    try {
      setLoading(true);
      const types = await fetchQuestionTypes();
      // Reverse the array so oldest items (added first) show first
      setQuestionTypes(types.reverse());
      setError('');
    } catch (err) {
      console.error('Error loading question types:', err);
      setError('Failed to load question types');
      // Fallback to empty array
      setQuestionTypes([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleType = (typeId) => {
    if (selectedTypes.includes(typeId)) {
      setSelectedTypes(selectedTypes.filter(t => t !== typeId));
    } else {
      setSelectedTypes([...selectedTypes, typeId]);
    }
  };

  const handleNext = () => {
    if (selectedTypes.length > 0 && onNavigate) {
      // Get the full question type objects for selected IDs
      const selectedQuestionTypes = questionTypes.filter(type => 
        selectedTypes.includes(type._id)
      );
      
      onNavigate('quizSettings', {
        selectedSubjects,
        selectedTopics,
        selectedTypes,
        questionTypes: selectedQuestionTypes, // Pass full objects
        previouslySelectedDuration, // Pass through the previous duration selection
        knownTopics,
        practiceTopics,
      });
    }
  };

  const handleBack = () => {
    // Pass current selections back when going back
    if (onBack) {
      onBack(selectedTopics.map(t => t._id));
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => onBack && onBack()}>
            <Icon name="chevron-back" size={28} color="#333333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Question Types</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00aa59" />
          <Text style={styles.loadingText}>Loading question types...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => onBack && onBack()}>
            <Icon name="chevron-back" size={28} color="#333333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Question Types</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={48} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadQuestionTypes}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Icon name="chevron-back" size={28} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Question Types</Text>
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
          <View style={[styles.stepNumber, styles.stepNumberCompleted]}>
            <Icon name="checkmark" size={16} color="#FFFFFF" />
          </View>
          <Text style={[styles.stepLabel, styles.stepLabelCompleted]}>Topics</Text>
        </View>
        <View style={styles.stepItem}>
          <View style={[styles.stepNumber, styles.stepNumberActive]}>
            <Text style={styles.stepNumberText}>3</Text>
          </View>
          <Text style={[styles.stepLabel, styles.stepLabelActive]}>Q. Types</Text>
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
            <Text style={styles.stepBadge}>● STEP 3 OF 4</Text>
          </View>
        </View>
        <View style={styles.instructionSection}>
          <Text style={styles.instructionTitle}>Question Format</Text>
          <Text style={styles.instructionText}>
            Mix different types to make the quiz more engaging!
          </Text>
        </View>

        <View style={styles.typesContainer}>
          {questionTypes.map((type) => {
            const isSelected = selectedTypes.includes(type._id);

            return (
              <TouchableOpacity
                key={type._id}
                style={[styles.typeCard, isSelected && styles.typeCardSelected]}
                onPress={() => toggleType(type._id)}
              >
                {isSelected && (
                  <View style={styles.checkmark}>
                    <Icon name="checkmark" size={16} color="#FFFFFF" />
                  </View>
                )}
                <View style={[styles.typeIcon, { backgroundColor: `${type.color}20` }]}>
                  <MaterialIcon name={type.icon} size={28} color={type.color} />
                </View>
                <Text style={styles.typeName}>{type.name}</Text>
                <Text style={styles.typeDescription}>{type.description}</Text>
                {type.tags && type.tags.length > 0 && (
                  <View style={styles.tagsContainer}>
                    {type.tags.map((tag, idx) => (
                      <View key={idx} style={[styles.tag, { backgroundColor: `${type.color}20` }]}>
                        <Text style={[styles.tagText, { color: type.color }]}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, selectedTypes.length === 0 && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={selectedTypes.length === 0}
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
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  typeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    width: (width - 52) / 2,
    minHeight: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  typeCardSelected: {
    borderColor: '#A7F3D0',
    backgroundColor: '#F0FDF4',
  },
  checkmark: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#27AE60',
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeName: {
    fontSize: isTablet ? 14 : 13,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 4,
    fontFamily: 'Montserrat-Bold',
  },
  typeDescription: {
    fontSize: isTablet ? 12 : 11,
    fontWeight: '500',
    color: '#9CA3AF',
    lineHeight: 16,
    fontFamily: 'Montserrat-Regular',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Montserrat-Bold',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
    fontFamily: 'Montserrat-SemiBold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 40,
  },
  errorText: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
    textAlign: 'center',
    fontFamily: 'Montserrat-SemiBold',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#00aa59',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
  },
});

export default SelectQuestionTypesScreen;
