/**
 * Quiz Complete Screen - Success screen after quiz PDF generation
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;
const isSmallDevice = width < 375;

const QuizCompleteScreen = ({ selectedSubjects, selectedTopics, selectedTypes, onNavigate }) => {
  const handleBackToHome = () => {
    if (onNavigate) {
      onNavigate('assessmentHub');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Done!</Text>
        </View>

        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconBackground}>
            <Icon name="checkmark" size={40} color="#27AE60" />
          </View>
        </View>

        {/* Success Message */}
        <View style={styles.messageSection}>
          <Text style={styles.mainTitle}>Quiz is Ready!</Text>
          <Text style={styles.subtitle}>
            Your quiz and answer sheet PDFs have been sent to your registered email address.
          </Text>
        </View>

        {/* Quiz Details Card */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Icon name="document-outline" size={20} color="#6B7280" />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailTitle}>Mathematics Quiz</Text>
              <Text style={styles.detailSubtitle}>25 questions · MCQ + True/False</Text>
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
        <View style={styles.emailConfirmation}>
          <Icon name="checkmark-circle" size={18} color="#27AE60" />
          <Text style={styles.emailText}>Sent to your email ✓</Text>
        </View>

        {/* Print Instruction */}
        <View style={styles.printInstruction}>
          <Icon name="print-outline" size={16} color="#6B7280" />
          <Text style={styles.printText}>Print it out and hand it to your child!</Text>
        </View>
      </View>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.homeButton} onPress={handleBackToHome}>
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
  homeButtonText: {
    fontSize: isTablet ? 15 : 14,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
  },
  buttonIcon: {
    marginLeft: 8,
  },
});

export default QuizCompleteScreen;
