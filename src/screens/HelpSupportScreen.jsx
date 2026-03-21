/**
 * Help & Support Screen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;
const isSmallDevice = width < 375;

const HelpSupportScreen = ({ onBack, onNavigate }) => {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [message, setMessage] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);

  const faqs = [
    {
      id: 1,
      question: 'What is Nudge2grow and how does it work?',
      answer: 'Nudge2grow is an educational app that provides daily learning activities (nudges) for children aged 3-10. Each nudge includes engaging content across subjects like Environmental Studies, Mathematics, Science, Values & Character, and Arts & Creativity. Simply browse topics, select activities, and start learning with your child!',
    },
    {
      id: 2,
      question: 'How do I track my child\'s learning progress?',
      answer: 'Visit "Learning Summary" from the menu to see detailed insights including weekly/monthly overviews, completed topics, topics that need practice, skills mastered, time spent learning, and activity streaks. You can toggle between weekly and monthly views to track progress over time.',
    },
    {
      id: 3,
      question: 'What are Milestones and how do I use them?',
      answer: 'Milestones help you track your child\'s developmental progress across Academic, Emotional & Social, and Cognitive & Life Skills areas. Each milestone shows completed and pending skills. Click on any category to see recommended activities that support your child\'s development in that area.',
    },
    {
      id: 4,
      question: 'How do I create a quiz for my child?',
      answer: 'Go to "Learning Summary" and click "Create Assessment Online". Select the subjects and topics you want to test, choose question types (Multiple Choice, True/False, Fill in the Blanks, Short Answer), set the quiz duration (5, 8, or 17 minutes), and click "Create Quiz". The quiz and answer sheet PDFs will be sent to your registered email.',
    },
    {
      id: 5,
      question: 'Can I add multiple children to my account?',
      answer: 'Yes! During setup, you can add multiple children with their names, dates of birth, grades, and learning preferences. Each child gets their own profile with personalized content and progress tracking. The app automatically calculates their age from the date of birth you provide.',
    },
    {
      id: 6,
      question: 'What subjects and topics are covered?',
      answer: 'Nudge2grow covers five main subjects: Environmental Studies (water conservation, plants, recycling), Mathematics (addition, patterns, measurement), Science (animals, body, weather), Values & Character (kindness, honesty, empathy), and Arts & Creativity (drawing, music, crafts). Each subject has multiple age-appropriate topics.',
    },
    {
      id: 7,
      question: 'How are activities organized by age?',
      answer: 'All activities are tagged with appropriate age ranges (e.g., 3-6 years, 5-8 years). When you browse topics, you\'ll see the recommended age range, duration, and skills developed. Activities include detailed descriptions to help you choose the best fit for your child\'s developmental stage.',
    },
    {
      id: 8,
      question: 'What\'s included in each learning topic?',
      answer: 'Each topic includes: a calendar view to track daily activities, multiple learning units with Q&A, creative prompts, and vocabulary building, "Learn in Detail" section with video resources and additional materials, and assessment options to test understanding. Topics are designed for 15-30 minute sessions.',
    },
    {
      id: 9,
      question: 'How do I navigate between different sections?',
      answer: 'Use the menu (hamburger icon) to access: Home, Subscription Plan, Learning Summary, Milestones, Learning Subjects, Settings, and Help & Support. From Home, you can quickly access Today\'s Nudges, browse subjects, or use the "Browse All" button to see all available topics.',
    },
    {
      id: 10,
      question: 'Can I customize my child\'s learning experience?',
      answer: 'Yes! During setup, select your child\'s interests and learning preferences. The app uses this information along with their age and grade to recommend appropriate content. You can also manually browse all subjects and topics to choose activities that match your child\'s current interests and needs.',
    },
  ];

  const quickActions = [
    {
      id: 1,
      title: 'Nudge Library',
      icon: 'book-open-variant',
      color: '#4A90E2',
      bgColor: '#E3F2FD',
      action: 'subjects',
    },
    {
      id: 2,
      title: 'Progress',
      icon: 'chart-line',
      color: '#27AE60',
      bgColor: '#E8F5E9',
      action: 'progress',
    },
    {
      id: 3,
      title: 'Create Quiz',
      icon: 'file-document-edit',
      color: '#9C27B0',
      bgColor: '#F3E5F5',
      action: 'assessment',
    },
  ];

  const handleQuickAction = (action) => {
    if (onNavigate) {
      onNavigate(action);
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // Show thank you message
      setShowThankYou(true);
      setMessage('');
      
      // Hide thank you message after 3 seconds
      setTimeout(() => {
        setShowThankYou(false);
      }, 3000);
    }
  };

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Icon name="chevron-back" size={28} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Contact Card */}
        <View style={styles.contactCard}>
          <View style={styles.contactHeader}>
            <MaterialIcon name="headset" size={32} color="#45a578" />
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Need Help?</Text>
              <Text style={styles.contactSubtitle}>We're here to assist you</Text>
            </View>
          </View>

          <View style={styles.contactButtons}>
            <TouchableOpacity style={styles.contactButton}>
              <Icon name="mail" size={20} color="#45a578" />
              <Text style={styles.contactButtonText}>Email Us</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactButton}>
              <Icon name="call" size={20} color="#45a578" />
              <Text style={styles.contactButtonText}>Call Support</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity 
                key={action.id} 
                style={styles.quickActionCard}
                onPress={() => handleQuickAction(action.action)}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.bgColor }]}>
                  <MaterialIcon name={action.icon} size={28} color={action.color} />
                </View>
                <Text style={styles.quickActionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* FAQs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqContainer}>
            {faqs.map((faq) => (
              <View key={faq.id} style={styles.faqItem}>
                <TouchableOpacity
                  style={styles.faqQuestion}
                  onPress={() => toggleFaq(faq.id)}
                >
                  <Text style={styles.faqQuestionText}>{faq.question}</Text>
                  <Icon
                    name={expandedFaq === faq.id ? 'chevron-up' : 'chevron-down'}
                    size={24}
                    color="#666666"
                  />
                </TouchableOpacity>
                {expandedFaq === faq.id && (
                  <View style={styles.faqAnswer}>
                    <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Contact Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Send Us a Message</Text>
          
          {showThankYou && (
            <View style={styles.thankYouCard}>
              <MaterialIcon name="check-circle" size={24} color="#27AE60" />
              <Text style={styles.thankYouText}>
                Thank you for your message! We'll get back to you soon.
              </Text>
            </View>
          )}
          
          <View style={styles.formCard}>
            <Text style={styles.formLabel}>Your Message</Text>
            <TextInput
              style={styles.messageInput}
              placeholder="Describe your issue or question..."
              placeholderTextColor="#999999"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              value={message}
              onChangeText={setMessage}
            />

            <TouchableOpacity 
              style={[styles.submitButton, !message.trim() && styles.submitButtonDisabled]} 
              onPress={handleSendMessage}
              disabled={!message.trim()}
            >
              <Text style={styles.submitButtonText}>Send Message</Text>
              <Icon name="send" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Support Info */}
        <View style={styles.section}>
          <View style={styles.infoCard}>
            <MaterialIcon name="clock-outline" size={24} color="#45a578" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Support Hours</Text>
              <Text style={styles.infoText}>Monday - Friday: 9:00 AM - 6:00 PM</Text>
              <Text style={styles.infoText}>Saturday: 10:00 AM - 4:00 PM</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <MaterialIcon name="email-outline" size={24} color="#45a578" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Email</Text>
              <Text style={styles.infoText}>support@nudge2grow.com</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <MaterialIcon name="phone-outline" size={24} color="#45a578" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Phone</Text>
              <Text style={styles.infoText}>+91 1800-123-4567 (Toll Free)</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

export default HelpSupportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    flex: 1,
    textAlign: 'center',
  },

  placeholder: {
    width: 40,
  },

  content: {
    flex: 1,
  },

  contactCard: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  contactInfo: {
    marginLeft: 16,
    flex: 1,
  },

  contactTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 4,
  },

  contactSubtitle: {
    fontSize: 13,
    color: '#666666',
  },

  contactButtons: {
    flexDirection: 'row',
    gap: 12,
  },

  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E9',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },

  contactButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#45a578',
  },

  section: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
    paddingHorizontal: 20,
    marginBottom: 16,
  },

  quickActionsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
  },

  quickActionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },

  faqContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },

  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },

  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },

  faqQuestionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginRight: 12,
  },

  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  faqAnswerText: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 20,
  },

  formCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },

  messageInput: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 12,
    fontSize: 13,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 16,
    minHeight: 120,
  },

  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#45a578',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },

  submitButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },

  submitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  thankYouCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#27AE60',
    gap: 12,
  },

  thankYouText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#27AE60',
  },

  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  infoContent: {
    marginLeft: 16,
    flex: 1,
  },

  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },

  infoText: {
    fontSize: 13,
    color: '#666666',
    marginTop: 2,
  },

  bottomPadding: {
    height: 40,
  },
});
