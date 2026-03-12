/**
 * Quiz Settings Screen - Step 4: Configure quiz duration
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;
const isSmallDevice = width < 375;

const QuizSettingsScreen = ({ 
  selectedSubjects, 
  selectedTopics, 
  selectedTypes, 
  onBack, 
  onNavigate,
  knownTopics,
  practiceTopics 
}) => {
  const [selectedDuration, setSelectedDuration] = useState(null);

  const durationOptions = [
    { id: 'short', questions: 10, minutes: 20, label: 'Quick Quiz', description: '10 questions ~20 minutes', icon: 'flash', color: '#F59E0B' },
    { id: 'medium', questions: 25, minutes: 35, label: 'Standard Quiz', description: '25 questions ~35 minutes', icon: 'clipboard-text', color: '#8B5CF6' },
    { id: 'long', questions: 50, minutes: 50, label: 'Full Assessment', description: '50 questions ~45 minutes', icon: 'trophy', color: '#F59E0B' },
  ];

  const handleStartQuiz = () => {
    if (selectedDuration) {
      // Navigate directly to quiz complete screen
      if (onNavigate) {
        onNavigate('complete', {
          selectedSubjects,
          selectedTopics,
          selectedTypes,
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Icon name="chevron-back" size={28} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quiz Settings</Text>
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
          <View style={[styles.stepNumber, styles.stepNumberCompleted]}>
            <Icon name="checkmark" size={16} color="#FFFFFF" />
          </View>
          <Text style={[styles.stepLabel, styles.stepLabelCompleted]}>Q. Types</Text>
        </View>
        <View style={styles.stepItem}>
          <View style={[styles.stepNumber, styles.stepNumberActive]}>
            <Text style={styles.stepNumberText}>4</Text>
          </View>
          <Text style={[styles.stepLabel, styles.stepLabelActive]}>Settings</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.stepBadgeWrapper}>
          <View style={styles.stepBadgeContainer}>
            <Text style={styles.stepBadge}>● FINAL STEP</Text>
          </View>
        </View>
        <View style={styles.instructionSection}>
          <Text style={styles.instructionTitle}>Quiz Length</Text>
          <Text style={styles.instructionText}>
            Choose how long you want the printed quiz to be.
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          {durationOptions.map((option) => {
            const isSelected = selectedDuration === option.id;

            return (
              <TouchableOpacity
                key={option.id}
                style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                onPress={() => setSelectedDuration(option.id)}
              >
                <View style={styles.optionContent}>
                  <Icon 
                    name={option.icon} 
                    size={28} 
                    color={option.color} 
                  />
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionLabel}>
                      {option.label}
                    </Text>
                    <Text style={styles.optionDescription}>
                      {option.description}
                    </Text>
                  </View>
                </View>
                {isSelected && (
                  <View style={styles.radioButton}>
                    <View style={styles.radioButtonInner} />
                  </View>
                )}
                {!isSelected && (
                  <View style={styles.radioButtonEmpty} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Icon name="book-outline" size={24} color="#27AE60" />
            <Text style={styles.summaryTitle}>Quiz Summary</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subject</Text>
            <Text style={styles.summaryValue}>{selectedSubjects.join(', ')}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Topics</Text>
            <Text style={styles.summaryValue}>{selectedTopics.length} selected</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Question Types</Text>
            <Text style={styles.summaryValue}>{selectedTypes.length} selected</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Output</Text>
            <View style={styles.outputBadge}>
              <Icon name="document-outline" size={14} color="#27AE60" />
              <Text style={styles.outputText}>PDF to Email</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.startButton, !selectedDuration && styles.startButtonDisabled]}
          onPress={handleStartQuiz}
          disabled={!selectedDuration}
        >
          <Text style={styles.startButtonText}>Generate Quiz PDF</Text>
          <Icon name="document-outline" size={18} color="#FFFFFF" style={styles.buttonIcon} />
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
  optionsContainer: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 16,
  },
  optionCard: {
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
    gap: 12,
  },
  optionCardSelected: {
    borderColor: '#A7F3D0',
    backgroundColor: '#F0FDF4',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#27AE60',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    borderWidth: 3,
    borderColor: '#27AE60',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  radioButtonEmpty: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    flexShrink: 0,
  },
  optionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    fontSize: isTablet ? 15 : 14,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 2,
    fontFamily: 'Montserrat-Bold',
  },
  optionDescription: {
    fontSize: isTablet ? 12 : 11,
    fontWeight: '500',
    color: '#9CA3AF',
    fontFamily: 'Montserrat-Regular',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 14,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: isTablet ? 16 : 15,
    fontWeight: '800',
    color: '#1A1A1A',
    fontFamily: 'Montserrat-Bold',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: isTablet ? 13 : 12,
    fontWeight: '600',
    color: '#9CA3AF',
    fontFamily: 'Montserrat-SemiBold',
  },
  summaryValue: {
    fontSize: isTablet ? 14 : 13,
    fontWeight: '700',
    color: '#27AE60',
    fontFamily: 'Montserrat-Bold',
  },
  outputBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0F9F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  outputText: {
    fontSize: isTablet ? 12 : 11,
    fontWeight: '700',
    color: '#27AE60',
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
  startButton: {
    backgroundColor: '#27AE60',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  startButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  startButtonText: {
    fontSize: isTablet ? 16 : 15,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
  },
  buttonIcon: {
    marginLeft: 10,
  },
});

export default QuizSettingsScreen;
