/**
 * Settings Screen - Full Functionality
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Switch,
  Modal,
  TextInput,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;
const isSmallDevice = width < 375;

const SettingsScreen = ({ onBack, onNavigate }) => {
  // User Profile State
  const [userName, setUserName] = useState('John Doe');
  const [userEmail, setUserEmail] = useState('john.doe@example.com');
  const [userPhone, setUserPhone] = useState('+91 98765 43210');
  const [userAvatar, setUserAvatar] = useState(null); // null means use initials
  const [avatarType, setAvatarType] = useState('initial'); // 'initial', 'avatar', 'image'
  
  // Notification Settings
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [dailyReminders, setDailyReminders] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  
  // Modals
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showRateUs, setShowRateUs] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  
  // Edit Profile Fields
  const [editName, setEditName] = useState(userName);
  const [editEmail, setEditEmail] = useState(userEmail);
  const [editPhone, setEditPhone] = useState(userPhone);
  const [editAvatar, setEditAvatar] = useState(userAvatar);
  const [editAvatarType, setEditAvatarType] = useState(avatarType);
  
  // Rating
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  // Avatar options
  const avatarImages = [
    { id: 'A1', image: require('../assets/images/A1.jpeg') },
    { id: 'A2', image: require('../assets/images/A2.jpeg') },
    { id: 'A3', image: require('../assets/images/A3.jpeg') },
    { id: 'A4', image: require('../assets/images/A4.jpeg') },
    { id: 'A5', image: require('../assets/images/A5.jpeg') },
    { id: 'A6', image: require('../assets/images/A6.jpeg') },
  ];

  const handleSaveProfile = () => {
    setUserName(editName);
    setUserEmail(editEmail);
    setUserPhone(editPhone);
    setUserAvatar(editAvatar);
    setAvatarType(editAvatarType);
    setShowEditProfile(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleSelectAvatar = (avatar, type) => {
    setEditAvatar(avatar);
    setEditAvatarType(type);
    setShowAvatarPicker(false);
  };

  const handleUploadImage = () => {
    // This would integrate with react-native-image-picker in production
    Alert.alert('Upload Photo', 'Image upload feature will be available in the next update.');
  };

  const renderAvatar = (avatar, type, size = 60) => {
    if (type === 'image' && avatar) {
      return (
        <Image
          source={avatar}
          style={[styles.profileAvatar, { width: size, height: size, borderRadius: size / 2 }]}
          resizeMode="cover"
        />
      );
    } else {
      return (
        <View style={[styles.profileAvatar, { width: size, height: size, borderRadius: size / 2 }]}>
          <Text style={[styles.profileInitial, { fontSize: size * 0.4 }]}>{userName.charAt(0)}</Text>
        </View>
      );
    }
  };

  const handleSubmitRating = () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }
    Alert.alert('Thank You!', 'Thank you for your feedback! We appreciate your support.');
    setShowRateUs(false);
    setRating(0);
    setFeedback('');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Icon name="chevron-back" size={28} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          
          <View style={styles.profileCard}>
            {renderAvatar(userAvatar, avatarType, 60)}
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{userName}</Text>
              <Text style={styles.profileEmail}>{userEmail}</Text>
            </View>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => {
                setEditName(userName);
                setEditEmail(userEmail);
                setEditPhone(userPhone);
                setEditAvatar(userAvatar);
                setEditAvatarType(avatarType);
                setShowEditProfile(true);
              }}
            >
              <MaterialIcon name="pencil" size={20} color="#45a578" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => onNavigate && onNavigate('SubscriptionPlan')}
          >
            <MaterialIcon name="crown-outline" size={24} color="#666666" />
            <Text style={styles.settingText}>Manage Subscription</Text>
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumBadgeText}>Premium</Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#999999" />
          </TouchableOpacity>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingItem}>
            <MaterialIcon name="bell-outline" size={24} color="#666666" />
            <Text style={styles.settingText}>Push Notifications</Text>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: '#E0E0E0', true: '#90EE90' }}
              thumbColor={pushNotifications ? '#45a578' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <MaterialIcon name="email-outline" size={24} color="#666666" />
            <Text style={styles.settingText}>Email Notifications</Text>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              trackColor={{ false: '#E0E0E0', true: '#90EE90' }}
              thumbColor={emailNotifications ? '#45a578' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <MaterialIcon name="alarm" size={24} color="#666666" />
            <Text style={styles.settingText}>Daily Reminders</Text>
            <Switch
              value={dailyReminders}
              onValueChange={setDailyReminders}
              trackColor={{ false: '#E0E0E0', true: '#90EE90' }}
              thumbColor={dailyReminders ? '#45a578' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <MaterialIcon name="chart-line" size={24} color="#666666" />
            <Text style={styles.settingText}>Weekly Reports</Text>
            <Switch
              value={weeklyReports}
              onValueChange={setWeeklyReports}
              trackColor={{ false: '#E0E0E0', true: '#90EE90' }}
              thumbColor={weeklyReports ? '#45a578' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Privacy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => setShowPrivacyPolicy(true)}
          >
            <MaterialIcon name="shield-check-outline" size={24} color="#666666" />
            <Text style={styles.settingText}>Privacy Policy</Text>
            <Icon name="chevron-forward" size={20} color="#999999" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => setShowTerms(true)}
          >
            <MaterialIcon name="file-document-outline" size={24} color="#666666" />
            <Text style={styles.settingText}>Terms of Service</Text>
            <Icon name="chevron-forward" size={20} color="#999999" />
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => onNavigate && onNavigate('HelpSupport')}
          >
            <MaterialIcon name="help-circle-outline" size={24} color="#666666" />
            <Text style={styles.settingText}>Help & Support</Text>
            <Icon name="chevron-forward" size={20} color="#999999" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => setShowRateUs(true)}
          >
            <MaterialIcon name="star-outline" size={24} color="#666666" />
            <Text style={styles.settingText}>Rate Us</Text>
            <Icon name="chevron-forward" size={20} color="#999999" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => setShowAbout(true)}
          >
            <MaterialIcon name="information-outline" size={24} color="#666666" />
            <Text style={styles.settingText}>About</Text>
            <Text style={styles.settingValue}>v1.0.0</Text>
            <Icon name="chevron-forward" size={20} color="#999999" />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditProfile}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditProfile(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setShowEditProfile(false)}>
                <Icon name="close" size={28} color="#333333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Avatar Section */}
              <View style={styles.avatarSection}>
                <Text style={styles.inputLabel}>Profile Photo</Text>
                <View style={styles.avatarPreview}>
                  {renderAvatar(editAvatar, editAvatarType, 80)}
                  <TouchableOpacity 
                    style={styles.changeAvatarButton}
                    onPress={() => setShowAvatarPicker(true)}
                  >
                    <MaterialIcon name="camera" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Enter your name"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={editEmail}
                  onChangeText={setEditEmail}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  value={editPhone}
                  onChangeText={setEditPhone}
                  placeholder="Enter your phone"
                  keyboardType="phone-pad"
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowEditProfile(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveProfile}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Privacy Policy Modal */}
      <Modal
        visible={showPrivacyPolicy}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPrivacyPolicy(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Privacy Policy</Text>
              <TouchableOpacity onPress={() => setShowPrivacyPolicy(false)}>
                <Icon name="close" size={28} color="#333333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <Text style={styles.policyTitle}>Last Updated: February 26, 2026</Text>
              
              <Text style={styles.policySection}>1. Information We Collect</Text>
              <Text style={styles.policyText}>
                We collect information you provide directly to us, including your name, email address, phone number, and learning progress data. We also collect information about your device and how you use our app.
              </Text>

              <Text style={styles.policySection}>2. How We Use Your Information</Text>
              <Text style={styles.policyText}>
                We use the information we collect to provide, maintain, and improve our services, to personalize your learning experience, and to communicate with you about updates and new features.
              </Text>

              <Text style={styles.policySection}>3. Information Sharing</Text>
              <Text style={styles.policyText}>
                We do not sell your personal information. We may share your information with service providers who help us operate our app, and when required by law.
              </Text>

              <Text style={styles.policySection}>4. Data Security</Text>
              <Text style={styles.policyText}>
                We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.
              </Text>

              <Text style={styles.policySection}>5. Your Rights</Text>
              <Text style={styles.policyText}>
                You have the right to access, update, or delete your personal information. You can do this through your account settings or by contacting us.
              </Text>

              <Text style={styles.policySection}>6. Children's Privacy</Text>
              <Text style={styles.policyText}>
                Our service is designed for parents and guardians. We do not knowingly collect personal information from children under 13 without parental consent.
              </Text>

              <Text style={styles.policySection}>7. Contact Us</Text>
              <Text style={[styles.policyText, { marginBottom: 40 }]}>
                If you have any questions about this Privacy Policy, please contact us at support@nudge2grow.com
              </Text>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.fullButton}
                onPress={() => setShowPrivacyPolicy(false)}
              >
                <Text style={styles.fullButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Terms of Service Modal */}
      <Modal
        visible={showTerms}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTerms(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Terms of Service</Text>
              <TouchableOpacity onPress={() => setShowTerms(false)}>
                <Icon name="close" size={28} color="#333333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <Text style={styles.policyTitle}>Last Updated: February 26, 2026</Text>
              
              <Text style={styles.policySection}>1. Acceptance of Terms</Text>
              <Text style={styles.policyText}>
                By accessing and using Nudge2Grow, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our service.
              </Text>

              <Text style={styles.policySection}>2. Use of Service</Text>
              <Text style={styles.policyText}>
                You agree to use our service only for lawful purposes and in accordance with these Terms. You are responsible for maintaining the confidentiality of your account.
              </Text>

              <Text style={styles.policySection}>3. Subscription and Payment</Text>
              <Text style={styles.policyText}>
                Some features require a paid subscription. You agree to pay all fees associated with your subscription. Subscriptions automatically renew unless cancelled.
              </Text>

              <Text style={styles.policySection}>4. Content Ownership</Text>
              <Text style={styles.policyText}>
                All content provided through our service, including text, graphics, and educational materials, is owned by Nudge2Grow and protected by copyright laws.
              </Text>

              <Text style={styles.policySection}>5. User Conduct</Text>
              <Text style={styles.policyText}>
                You agree not to misuse our service, interfere with its operation, or attempt to access it through unauthorized means.
              </Text>

              <Text style={styles.policySection}>6. Termination</Text>
              <Text style={styles.policyText}>
                We reserve the right to suspend or terminate your account if you violate these Terms or engage in fraudulent activity.
              </Text>

              <Text style={styles.policySection}>7. Limitation of Liability</Text>
              <Text style={styles.policyText}>
                Nudge2Grow is provided "as is" without warranties. We are not liable for any indirect, incidental, or consequential damages.
              </Text>

              <Text style={styles.policySection}>8. Changes to Terms</Text>
              <Text style={[styles.policyText, { marginBottom: 40 }]}>
                We may modify these Terms at any time. Continued use of the service after changes constitutes acceptance of the new Terms.
              </Text>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.fullButton}
                onPress={() => setShowTerms(false)}
              >
                <Text style={styles.fullButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Rate Us Modal */}
      <Modal
        visible={showRateUs}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowRateUs(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Rate Nudge2Grow</Text>
              <TouchableOpacity onPress={() => setShowRateUs(false)}>
                <Icon name="close" size={28} color="#333333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.rateContainer}>
                <MaterialIcon name="star" size={60} color="#FFB84D" />
                <Text style={styles.rateTitle}>How would you rate us?</Text>
                <Text style={styles.rateSubtitle}>
                  Your feedback helps us improve and serve you better
                </Text>

                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => setRating(star)}
                      style={styles.starButton}
                    >
                      <Icon
                        name={star <= rating ? 'star' : 'star-outline'}
                        size={48}
                        color={star <= rating ? '#FFB84D' : '#E0E0E0'}
                      />
                    </TouchableOpacity>
                  ))}
                </View>

                {rating > 0 && (
                  <Text style={styles.ratingText}>
                    {rating === 1 && 'Poor'}
                    {rating === 2 && 'Fair'}
                    {rating === 3 && 'Good'}
                    {rating === 4 && 'Very Good'}
                    {rating === 5 && 'Excellent'}
                  </Text>
                )}

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Tell us more (Optional)</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={feedback}
                    onChangeText={setFeedback}
                    placeholder="Share your experience with us..."
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowRateUs(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton, rating === 0 && styles.disabledButton]}
                onPress={handleSubmitRating}
                disabled={rating === 0}
              >
                <Text style={styles.saveButtonText}>Submit Rating</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* About Modal */}
      <Modal
        visible={showAbout}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAbout(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>About Nudge2Grow</Text>
              <TouchableOpacity onPress={() => setShowAbout(false)}>
                <Icon name="close" size={28} color="#333333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.aboutContainer}>
                <View style={styles.appIconContainer}>
                  <Image 
                    source={require('../assets/images/logo.jpeg')}
                    style={styles.appLogo}
                    resizeMode="contain"
                  />
                </View>
                
                <Text style={styles.appName}>Nudge2Grow</Text>
                <Text style={styles.appVersion}>Version 1.0.0</Text>
                <Text style={styles.appTagline}>
                  Empowering Parents, Nurturing Children
                </Text>

                <View style={styles.aboutSection}>
                  <Text style={styles.aboutTitle}>Our Mission</Text>
                  <Text style={styles.aboutText}>
                    Nudge2Grow is dedicated to helping parents create meaningful learning moments with their children. We provide bite-sized educational activities that fit seamlessly into your daily routine.
                  </Text>
                </View>

                <View style={styles.aboutSection}>
                  <Text style={styles.aboutTitle}>What We Offer</Text>
                  <View style={styles.featureList}>
                    <View style={styles.featureItem}>
                      <Icon name="checkmark-circle" size={20} color="#45a578" />
                      <Text style={styles.featureText}>Daily learning nudges</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Icon name="checkmark-circle" size={20} color="#45a578" />
                      <Text style={styles.featureText}>Progress tracking</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Icon name="checkmark-circle" size={20} color="#45a578" />
                      <Text style={styles.featureText}>Expert-curated content</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Icon name="checkmark-circle" size={20} color="#45a578" />
                      <Text style={styles.featureText}>Personalized recommendations</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.aboutSection}>
                  <Text style={styles.aboutTitle}>Contact Us</Text>
                  <View style={styles.contactItem}>
                    <MaterialIcon name="email" size={20} color="#666666" />
                    <Text style={styles.contactText}>support@nudge2grow.com</Text>
                  </View>
                  <View style={styles.contactItem}>
                    <MaterialIcon name="phone" size={20} color="#666666" />
                    <Text style={styles.contactText}>+91 1800-123-4567</Text>
                  </View>
                  <View style={styles.contactItem}>
                    <MaterialIcon name="web" size={20} color="#666666" />
                    <Text style={styles.contactText}>www.nudge2grow.com</Text>
                  </View>
                </View>

                <Text style={styles.copyright}>
                  © 2026 Nudge2Grow. All rights reserved.
                </Text>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.fullButton}
                onPress={() => setShowAbout(false)}
              >
                <Text style={styles.fullButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Avatar Picker Modal */}
      <Modal
        visible={showAvatarPicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAvatarPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose Profile Photo</Text>
              <TouchableOpacity onPress={() => setShowAvatarPicker(false)}>
                <Icon name="close" size={28} color="#333333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Upload Photo Option */}
              <TouchableOpacity 
                style={styles.uploadOption}
                onPress={handleUploadImage}
              >
                <View style={styles.uploadIconContainer}>
                  <MaterialIcon name="camera" size={32} color="#45a578" />
                </View>
                <View style={styles.uploadTextContainer}>
                  <Text style={styles.uploadTitle}>Upload Photo</Text>
                  <Text style={styles.uploadSubtitle}>Take a photo or choose from gallery</Text>
                </View>
                <Icon name="chevron-forward" size={24} color="#999999" />
              </TouchableOpacity>

              {/* Use Initial Option */}
              <TouchableOpacity 
                style={styles.uploadOption}
                onPress={() => handleSelectAvatar(null, 'initial')}
              >
                <View style={[styles.uploadIconContainer, { backgroundColor: '#45a578' }]}>
                  <Text style={styles.initialText}>{editName.charAt(0)}</Text>
                </View>
                <View style={styles.uploadTextContainer}>
                  <Text style={styles.uploadTitle}>Use Initial</Text>
                  <Text style={styles.uploadSubtitle}>Default profile with your initial</Text>
                </View>
                {editAvatarType === 'initial' && (
                  <Icon name="checkmark-circle" size={24} color="#45a578" />
                )}
              </TouchableOpacity>

              {/* Avatar Emojis */}
              <Text style={styles.avatarSectionTitle}>Choose Avatar</Text>
              <View style={styles.avatarGrid}>
                {avatarImages.map((avatarItem) => (
                  <TouchableOpacity
                    key={avatarItem.id}
                    style={[
                      styles.avatarImageOption,
                      editAvatarType === 'image' && editAvatar === avatarItem.image && styles.avatarOptionSelected
                    ]}
                    onPress={() => handleSelectAvatar(avatarItem.image, 'image')}
                  >
                    <Image
                      source={avatarItem.image}
                      style={styles.avatarImage}
                      resizeMode="cover"
                    />
                    {editAvatarType === 'image' && editAvatar === avatarItem.image && (
                      <View style={styles.avatarCheckmark}>
                        <Icon name="checkmark" size={16} color="#FFFFFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.fullButton}
                onPress={() => setShowAvatarPicker(false)}
              >
                <Text style={styles.fullButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SettingsScreen;

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
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
  },

  content: {
    flex: 1,
  },

  section: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#999999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 20,
    marginBottom: 12,
  },

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#45a578',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  profileInitial: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  profileInfo: {
    flex: 1,
  },

  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 4,
  },

  profileEmail: {
    fontSize: 14,
    color: '#666666',
  },

  editButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    marginLeft: 16,
  },

  settingValue: {
    fontSize: 14,
    color: '#999999',
    marginRight: 8,
  },

  premiumBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },

  premiumBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  bottomPadding: {
    height: 40,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },

  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    marginHorizontal: 16,
    marginTop: 16,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
  },

  modalBody: {
    paddingHorizontal: 32,
    paddingVertical: 28,
  },

  inputGroup: {
    marginBottom: 20,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 8,
  },

  input: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#333333',
  },

  passwordHintText: {
    flex: 1,
    fontSize: 13,
    color: '#4A90E2',
  },

  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 12,
  },

  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },

  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },

  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#45a578',
    alignItems: 'center',
  },

  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  fullButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#45a578',
    alignItems: 'center',
  },

  fullButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  disabledButton: {
    backgroundColor: '#CCCCCC',
  },

  // Policy Styles
  policyTitle: {
    fontSize: 14,
    color: '#999999',
    marginBottom: 20,
  },

  policySection: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
    marginTop: 20,
    marginBottom: 8,
  },

  policyText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 22,
    marginBottom: 12,
  },

  // Rate Us Styles
  rateContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },

  rateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    marginTop: 16,
    marginBottom: 8,
  },

  rateSubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 32,
  },

  starsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },

  starButton: {
    padding: 4,
  },

  ratingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#45a578',
    marginBottom: 24,
  },

  textArea: {
    height: 100,
    paddingTop: 12,
  },

  // About Styles
  aboutContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingBottom: 40,
  },

  appIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },

  appLogo: {
    width: 150,
    height: 120,
  },

  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },

  appVersion: {
    fontSize: 16,
    color: '#999999',
    marginBottom: 8,
  },

  appTagline: {
    fontSize: 16,
    color: '#45a578',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 32,
  },

  aboutSection: {
    width: '100%',
    marginBottom: 24,
  },

  aboutTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 12,
  },

  aboutText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 22,
  },

  featureList: {
    gap: 12,
  },

  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  featureText: {
    fontSize: 14,
    color: '#666666',
  },

  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },

  contactText: {
    fontSize: 14,
    color: '#666666',
  },

  copyright: {
    fontSize: 12,
    color: '#999999',
    marginTop: 24,
    textAlign: 'center',
  },

  // Avatar Styles
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },

  avatarPreview: {
    position: 'relative',
    marginTop: 12,
  },

  changeAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#45a578',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },

  uploadOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    marginBottom: 12,
  },

  uploadIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  initialText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  uploadTextContainer: {
    flex: 1,
  },

  uploadTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },

  uploadSubtitle: {
    fontSize: 13,
    color: '#666666',
  },

  avatarSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
    marginTop: 12,
    marginBottom: 16,
  },

  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },

  avatarOption: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
    position: 'relative',
  },

  avatarImageOption: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#E0E0E0',
    position: 'relative',
    overflow: 'hidden',
  },

  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },

  avatarOptionSelected: {
    borderColor: '#45a578',
    backgroundColor: '#E8F5E9',
  },

  avatarEmoji: {
    fontSize: 30,
  },

  avatarCheckmark: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#45a578',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
