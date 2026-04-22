/**
 * Quiz Complete Screen - Success screen after quiz PDF generation
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { sendQuizEmail } from '../api';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;
const isSmallDevice = width < 375;

const QuizCompleteScreen = ({ 
  selectedSubjects, 
  selectedTopics, 
  selectedTypes, 
  selectedSetting,
  selectedDuration,
  durationOptions,
  questionTypes,
  onNavigate,
  userData // Add userData to get user email
}) => {
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Send email when component mounts
  useEffect(() => {
    sendEmail();
  }, []);

  const sendEmail = async () => {
    try {
      setEmailSending(true);
      setEmailError('');

      // Get user email from userData
      const userEmail = userData?.email;
      
      if (!userEmail) {
        setEmailError('No email address found. Please update your profile with an email address.');
        setEmailSending(false);
        return;
      }

      // Try to get the selected setting, with fallback
      let setting = selectedSetting;
      if (!setting && selectedDuration && Array.isArray(durationOptions)) {
        setting = durationOptions.find(opt => opt._id === selectedDuration);
      }

      // Prepare quiz data for email
      const quizData = {
        selectedSubjects: Array.isArray(selectedSubjects) ? selectedSubjects : [selectedSubjects],
        selectedTopics: selectedTopics || [],
        selectedTypes: selectedTypes || [],
        selectedSetting: setting || {},
        userEmail: userEmail,
      };

      console.log('[QuizComplete] Sending email with data:', quizData);

      // Call API to send email
      const response = await sendQuizEmail(quizData);
      
      console.log('[QuizComplete] Email sent successfully:', response);
      setEmailSent(true);
    } catch (error) {
      console.error('[QuizComplete] Error sending email:', error);
      setEmailError(error.message || 'Failed to send email. Please try again.');
      
      // Show alert to user
      Alert.alert(
        'Email Error',
        error.message || 'Failed to send quiz to your email. Please check your internet connection and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setEmailSending(false);
    }
  };

  const handleBackToHome = () => {
    if (onNavigate) {
      onNavigate('assessmentHub');
    }
  };

  // Get subject names
  const subjectNames = Array.isArray(selectedSubjects) ? selectedSubjects.join(', ') : 'Subject';
  
  // Debug: Log all incoming props
  console.log('[QuizComplete] === ALL PROPS ===');
  console.log('[QuizComplete] selectedSetting:', JSON.stringify(selectedSetting, null, 2));
  console.log('[QuizComplete] selectedDuration:', selectedDuration);
  console.log('[QuizComplete] durationOptions:', JSON.stringify(durationOptions, null, 2));
  console.log('[QuizComplete] questionTypes:', JSON.stringify(questionTypes, null, 2));
  
  // Try to get the selected setting, with fallback
  let setting = selectedSetting;
  if (!setting && selectedDuration && Array.isArray(durationOptions)) {
    setting = durationOptions.find(opt => opt._id === selectedDuration);
    console.log('[QuizComplete] Found setting from durationOptions:', setting);
  }
  
  // Get quiz setting details - try multiple field names
  let questions = 0;
  if (setting) {
    questions = setting.questions || setting.Questions || setting.questionCount || 0;
    console.log('[QuizComplete] Extracted questions from setting:', questions);
    console.log('[QuizComplete] Setting object keys:', Object.keys(setting));
  }
  
  // Get question type names
  let questionTypeNames = '';
  if (Array.isArray(questionTypes) && questionTypes.length > 0) {
    questionTypeNames = questionTypes.map(type => type.name).join(' + ');
  } else if (Array.isArray(selectedTypes) && selectedTypes.length > 0) {
    questionTypeNames = `${selectedTypes.length} question ${selectedTypes.length === 1 ? 'type' : 'types'}`;
  } else {
    questionTypeNames = 'Mixed types';
  }

  console.log('[QuizComplete] === FINAL VALUES ===');
  console.log('[QuizComplete] Subject:', subjectNames);
  console.log('[QuizComplete] Questions:', questions);
  console.log('[QuizComplete] Question Types:', questionTypeNames);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {emailSending ? 'Sending...' : emailSent ? 'Done!' : 'Processing...'}
          </Text>
        </View>

        {/* Success/Loading Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconBackground}>
            {emailSending ? (
              <ActivityIndicator size="large" color="#27AE60" />
            ) : emailSent ? (
              <Icon name="checkmark" size={40} color="#27AE60" />
            ) : emailError ? (
              <Icon name="alert-circle" size={40} color="#EF4444" />
            ) : (
              <ActivityIndicator size="large" color="#27AE60" />
            )}
          </View>
        </View>

        {/* Success/Error Message */}
        <View style={styles.messageSection}>
          {emailSending ? (
            <>
              <Text style={styles.mainTitle}>Generating Your Quiz...</Text>
              <Text style={styles.subtitle}>
                Please wait while we prepare and send your quiz PDFs to your email.
              </Text>
            </>
          ) : emailSent ? (
            <>
              <Text style={styles.mainTitle}>Quiz is Ready!</Text>
              <Text style={styles.subtitle}>
                Your quiz and answer sheet PDFs have been sent to your registered email address.
              </Text>
              
            </>
          ) : emailError ? (
            <>
              <Text style={[styles.mainTitle, { color: '#EF4444' }]}>Email Failed</Text>
              <Text style={styles.subtitle}>
                {emailError}
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.mainTitle}>Processing...</Text>
              <Text style={styles.subtitle}>
                Setting up your quiz...
              </Text>
            </>
          )}
        </View>

        {/* Quiz Details Card */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Icon name="document-outline" size={20} color="#6B7280" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailTitle}>{subjectNames}</Text>
              <Text style={styles.detailSubtitle}>
                {questions} Questions · {questionTypeNames}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Icon name="key-outline" size={20} color="#6B7280" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailTitle}>Answer Sheet</Text>
              <Text style={styles.detailSubtitle}>Parent's copy — keep it safe!</Text>
            </View>
          </View>
        </View>

        {/* Email Confirmation */}
        {emailSent && (
          <>
            <View style={styles.emailConfirmation}>
              <Icon name="checkmark-circle" size={18} color="#27AE60" />
              <Text style={styles.emailText}>Sent to {userData?.email || 'your email'} ✓</Text>
            </View>
            
           
          </>
        )}

        {/* Retry Button for Error */}
        {emailError && (
          <TouchableOpacity style={styles.retryButton} onPress={sendEmail}>
            <Icon name="refresh" size={16} color="#FFFFFF" />
            <Text style={styles.retryButtonText}>Retry Sending Email</Text>
          </TouchableOpacity>
        )}

        {/* Print Instruction */}
        {emailSent && (
          <View style={styles.printInstruction}>
            <Icon name="print-outline" size={16} color="#6B7280" />
            <Text style={styles.printText}>Print it out and hand it to your child!</Text>
          </View>
        )}
      </View>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.homeButton, emailSending && styles.homeButtonDisabled]} 
          onPress={handleBackToHome}
          disabled={emailSending}
        >
          <Text style={styles.homeButtonText}>Back to Home</Text>
          <Icon name="home" size={18} color="#FFFFFF" style={styles.buttonIcon} />
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 16,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: isTablet ? 32 : 28,
    fontWeight: '800',
    color: '#1A1F3A',
    fontFamily: 'Montserrat-Bold',
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  iconBackground: {
    width: isSmallDevice ? 70 : 85,
    height: isSmallDevice ? 70 : 85,
    borderRadius: isSmallDevice ? 35 : 42,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  mainTitle: {
    fontSize: isTablet ? 24 : 22,
    fontWeight: '800',
    color: '#1A1F3A',
    marginBottom: 8,
    fontFamily: 'Montserrat-Bold',
  },
  subtitle: {
    fontSize: isTablet ? 13 : 12,
    fontWeight: '500',
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: 'Montserrat-Regular',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  detailContent: {
    flex: 1,
  },
  detailTitle: {
    fontSize: isTablet ? 14 : 13,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 2,
    fontFamily: 'Montserrat-Bold',
  },
  detailSubtitle: {
    fontSize: isTablet ? 11 : 10,
    fontWeight: '500',
    color: '#9CA3AF',
    fontFamily: 'Montserrat-Regular',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 6,
  },
  emailConfirmation: {
    backgroundColor: '#E8F5E9',
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#27AE60',
  },
  emailText: {
    fontSize: isTablet ? 12 : 11,
    fontWeight: '700',
    color: '#27AE60',
    fontFamily: 'Montserrat-Bold',
  },
  spamNotice: {
    backgroundColor: '#FEF3C7',
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  spamNoticeText: {
    flex: 1,
    fontSize: isTablet ? 11 : 10,
    fontWeight: '600',
    color: '#92400E',
    lineHeight: 16,
    fontFamily: 'Montserrat-SemiBold',
  },
  printInstruction: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  printText: {
    fontSize: isTablet ? 11 : 10,
    fontWeight: '600',
    color: '#6B7280',
    fontFamily: 'Montserrat-SemiBold',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  homeButton: {
    backgroundColor: '#1A1F3A',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  homeButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  homeButtonText: {
    fontSize: isTablet ? 15 : 14,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
  },
  buttonIcon: {
    marginLeft: 8,
  },
  retryButton: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'center',
    marginBottom: 10,
  },
  retryButtonText: {
    fontSize: isTablet ? 12 : 11,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
  },
});

export default QuizCompleteScreen;
