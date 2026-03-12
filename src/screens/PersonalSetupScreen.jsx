/**
 * Personal Setup Screen - Add Your Child
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import DatePicker from 'react-native-date-picker';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;
const isSmallDevice = width < 375;


const PersonalSetupScreen = ({ onFinish, onBack }) => {
  const [email, setEmail] = useState('');
  const [children, setChildren] = useState([]);
  const [isValid, setIsValid] = useState(false);
  const [showChildForm, setShowChildForm] = useState(false);
  const [showAvatarSelection, setShowAvatarSelection] = useState(false);
  const [showTopicPreferences, setShowTopicPreferences] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [emailMessage, setEmailMessage] = useState('');
  const [emailStatus, setEmailStatus] = useState(''); // 'registered' or 'new'
  const [addChildClicked, setAddChildClicked] = useState(false);
  
  // Child form fields
  const [childName, setChildName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date(2010, 0, 1)); // Default to Jan 1, 2010
  const [grade, setGrade] = useState('');
  const [educationBoard, setEducationBoard] = useState('');
  const [faithBackground, setFaithBackground] = useState('');
  const [childEmail, setChildEmail] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [selectedTopics, setSelectedTopics] = useState([]);
  
  // Refs
  const scrollViewRef = useRef(null);
  
  // Dropdown states
  const [showGradeDropdown, setShowGradeDropdown] = useState(false);
  const [showBoardDropdown, setShowBoardDropdown] = useState(false);
  const [showFaithDropdown, setShowFaithDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const grades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4'];
  const boards = ['CBSE', 'ICSE', 'State Board', 'IB', 'Cambridge', 'Other'];
  const faithOptions = ['Christian', 'Hindu', 'Muslim', 'Buddhist', 'Jewish', 'Sikh', 'Other', 'Prefer not to say'];

  const avatars = [
    { id: 'A1', image: require('../assets/images/A1.jpeg') },
    { id: 'A2', image: require('../assets/images/A2.jpeg') },
    { id: 'A3', image: require('../assets/images/A3.jpeg') },
    { id: 'A4', image: require('../assets/images/A4.jpeg') },
    { id: 'A5', image: require('../assets/images/A5.jpeg') },
    { id: 'A6', image: require('../assets/images/A6.jpeg') },
  ];

  const coreAreas = [
    { id: 'mathematics', name: 'Mathematics', icon: 'calculator', recommended: true },
    { id: 'science', name: 'Science', icon: 'flask', recommended: true },
    { id: 'english', name: 'English', icon: 'book-open-page-variant', recommended: true },
    { id: 'social-studies', name: 'Social Studies', icon: 'earth', recommended: true },
  ];

  const exploratoryAreas = [
    { id: 'ai', name: 'Artificial Intelligence', icon: 'brain' },
    { id: 'financial', name: 'Financial Literacy', icon: 'currency-usd-circle' },
    { id: 'humor', name: 'Britannica/ Did you know', icon: 'palette' },
    { id: 'safety', name: 'Sex & Safety Education', icon: 'shield-check' },
  ];

  const handleEmailChange = (text) => {
    setEmail(text);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valid = emailRegex.test(text);
    setIsValid(valid);
    
    // Reset states when email changes
    if (emailMessage || emailStatus) {
      setEmailMessage('');
      setEmailStatus('');
      setAddChildClicked(false);
    }
  };

  const handleEmailBlur = () => {
    // Check email when user finishes typing (on blur)
    if (isValid && !emailStatus) {
      setCheckingEmail(true);
      setEmailMessage('');
      setEmailStatus('');
      
      // Simulate API call to check if email is registered
      setTimeout(() => {
        // Check if email is registered (for demo, emails ending with @test.com are considered registered)
        if (email.endsWith('@test.com')) {
          // Email is registered - redirect to home
          setEmailStatus('registered');
          setEmailMessage('Welcome back! Your account has been found. Redirecting to home...');
          setCheckingEmail(false);
          
          // Redirect to home after showing message
          setTimeout(() => {
            if (onFinish) {
              onFinish({ email, children: [], isReturningUser: true });
            }
          }, 1500);
        } else {
          // Email is not registered - show message and Next button
          setEmailStatus('new');
          setEmailMessage('Email not registered. Please continue to add your child details.');
          setCheckingEmail(false);
        }
      }, 1000); // Simulate network delay
    }
  };

  const handleNext = () => {
    // Open child form when Next is clicked
    if (isValid) {
      // First check if email is registered
      if (!emailStatus) {
        handleEmailBlur();
      } else if (emailStatus === 'new') {
        setShowChildForm(true);
        setEmailMessage('');
        setEmailStatus('');
      }
    }
  };

  const handleDateConfirm = (date) => {
    setSelectedDate(new Date(date)); // Create a new Date object to ensure state updates
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    setDateOfBirth(`${day}/${month}/${year}`);
    setShowDatePicker(false);
  };

  const isChildFormValid = () => {
    return childName.trim() !== '' && 
           dateOfBirth.trim() !== '' && 
           grade !== '';
  };

  const handleContinue = () => {
    if (isChildFormValid()) {
      // Move to avatar selection
      setShowChildForm(false);
      setShowAvatarSelection(true);
    }
  };

  const handleAvatarContinue = () => {
    if (selectedAvatar) {
      // Move to topic preferences
      setShowAvatarSelection(false);
      setShowTopicPreferences(true);
    }
  };

  const toggleTopic = (topicId) => {
    if (selectedTopics.includes(topicId)) {
      setSelectedTopics(selectedTopics.filter(id => id !== topicId));
    } else {
      setSelectedTopics([...selectedTopics, topicId]);
    }
  };

  const handleTopicsComplete = () => {
    if (selectedTopics.length > 0) {
      const newChild = {
        name: childName,
        dateOfBirth,
        grade,
        educationBoard,
        faithBackground,
        email: childEmail,
        avatar: selectedAvatar,
        topics: selectedTopics,
      };
      setChildren([...children, newChild]);
      
      // Reset form
      setChildName('');
      setDateOfBirth('');
      setGrade('');
      setEducationBoard('');
      setFaithBackground('');
      setChildEmail('');
      setSelectedAvatar('');
      setSelectedTopics([]);
      setShowTopicPreferences(false);
      setShowSuccessScreen(true);
    }
  };

  const handleStartNudge = () => {
    if (onFinish) {
      onFinish({ email, children });
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Back Button - Show on all screens except initial */}
      {(showChildForm || showAvatarSelection || showTopicPreferences) && (
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => {
            if (showTopicPreferences) {
              setShowTopicPreferences(false);
              setShowAvatarSelection(true);
            } else if (showAvatarSelection) {
              setShowAvatarSelection(false);
              setShowChildForm(true);
            } else if (showChildForm) {
              setShowChildForm(false);
            }
          }}
        >
          <Icon name="chevron-back" size={28} color="#333333" />
        </TouchableOpacity>
      )}
      
      {/* Back Button for initial screen - goes to previous screen */}
      {!showChildForm && !showAvatarSelection && !showTopicPreferences && !showSuccessScreen && onBack && (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Icon name="chevron-back" size={28} color="#333333" />
        </TouchableOpacity>
      )}
      
      {!showChildForm && !showAvatarSelection && !showTopicPreferences && !showSuccessScreen ? (
        // Initial Screen - Email and Add Child Button
        <>
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>Add Child Details</Text>
              <Text style={styles.headerSubtitle}>
                Tell us a little bit about your child, and we will send you content that best works for the age you are parenting.
              </Text>
            </View>

            {/* Email Input */}
            <View style={styles.inputSection}>
              <TextInput
                style={styles.emailInput}
                placeholder="Add Your Email ID"
                placeholderTextColor="#CCCCCC"
                value={email}
                onChangeText={handleEmailChange}
                onBlur={handleEmailBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!checkingEmail}
              />
              <View style={styles.emailUnderline} />
              <Text style={styles.emailHint}>
                For adoption level progress, olympiad test papers and weekly
newsletters.
              </Text>
              
              {/* Email Status Messages */}
              {checkingEmail && (
                <View style={styles.messageContainer}>
                  <MaterialIcon name="loading" size={20} color="#45a578" />
                  <Text style={styles.checkingText}>Checking email...</Text>
                </View>
              )}
              
              {emailMessage && emailStatus === 'registered' && (
                <View style={[styles.messageContainer, styles.successMessage]}>
                  <Icon name="checkmark-circle" size={20} color="#45a578" />
                  <Text style={styles.successText}>{emailMessage}</Text>
                </View>
              )}
              
              {emailMessage && emailStatus === 'new' && (
                <View style={[styles.messageContainer, styles.warningMessage]}>
                  <Icon name="alert-circle" size={20} color="#FF9800" />
                  <Text style={styles.warningText}>{emailMessage}</Text>
                </View>
              )}
            </View>

            {/* Add Child Button - REMOVED */}

            {/* List of Added Children */}
            {children.length > 0 && (
              <View style={styles.childrenList}>
                <Text style={styles.childrenListTitle}>Added Children:</Text>
                {children.map((child, index) => (
                  <View key={index} style={styles.childItem}>
                    <Text style={styles.childItemText}>
                      {child.name} - {child.grade}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>

          {/* Bottom Section */}
          <View style={styles.bottomSection}>
            {/* Next button - always visible, changes color when email is valid */}
            <TouchableOpacity 
              onPress={handleNext}
              activeOpacity={0.8}
              disabled={!isValid}
            >
              {isValid ? (
                <LinearGradient
                  colors={['#00CED1', '#45a578', '#90EE90']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.nextButton}
                >
                  <Text style={styles.nextButtonTextActive}>Next</Text>
                </LinearGradient>
              ) : (
                <View style={styles.nextButton}>
                  <Text style={styles.nextButtonText}>Next</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.privacyContainer}>
              <Text style={styles.privacyText}>
                We're committed to keeping your information safe. View our{' '}
                <Text style={styles.privacyLink}>Privacy Policy</Text>.
              </Text>
            </View>
          </View>
        </>
      ) : showAvatarSelection ? (
        // Avatar Selection Screen
        <>
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>Select Avatar</Text>
              <Text style={styles.headerSubtitle}>
                Choose an avatar that best suits your child.
              </Text>
            </View>

            {/* Avatar Grid */}
            <View style={styles.avatarGrid}>
              {avatars.map((avatar) => (
                <TouchableOpacity
                  key={avatar.id}
                  style={[
                    styles.avatarOption,
                    selectedAvatar === avatar.id && styles.avatarOptionSelected
                  ]}
                  onPress={() => setSelectedAvatar(avatar.id)}
                  activeOpacity={0.7}
                >
                  <Image 
                    source={avatar.image} 
                    style={styles.avatarImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Or Text */}
            <Text style={styles.orText}>Or</Text>

            {/* Upload Photo Button */}
            <TouchableOpacity 
              style={styles.uploadPhotoButton}
              activeOpacity={0.7}
            >
              <Text style={styles.uploadPhotoText}>Upload Photo</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Bottom Section */}
          <View style={styles.bottomSection}>
            <TouchableOpacity 
              onPress={handleAvatarContinue}
              activeOpacity={0.8}
              disabled={!selectedAvatar}
            >
              {selectedAvatar ? (
                <LinearGradient
                  colors={['#00CED1', '#45a578', '#90EE90']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.nextButton}
                >
                  <Text style={styles.nextButtonTextActive}>Continue</Text>
                </LinearGradient>
              ) : (
                <View style={styles.nextButton}>
                  <Text style={styles.nextButtonText}>Continue</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.privacyContainer}>
              <Text style={styles.privacyText}>
                We're committed to keeping your information safe. View our{' '}
                <Text style={styles.privacyLink}>Privacy Policy</Text>.
              </Text>
            </View>
          </View>
        </>
      ) : showTopicPreferences ? (
        // Topic Preferences Screen
        <>
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={true}
            scrollEnabled={true}
            nestedScrollEnabled={true}
          >
            {/* Header */}
            <View style={styles.headerContainer}>
              <Text style={styles.topicHeaderTitle}>Topic Preferences</Text>
            </View>

            {/* Core Area Section */}
            <View style={styles.topicSection}>
              <Text style={styles.topicSectionTitle}>Core Area</Text>
              
              <View style={styles.coreGrid}>
                {coreAreas.map((area) => (
                  <TouchableOpacity
                    key={area.id}
                    style={[
                      styles.coreCard,
                      selectedTopics.includes(area.id) && styles.coreCardSelected
                    ]}
                    onPress={() => toggleTopic(area.id)}
                    activeOpacity={0.7}
                  >
                    <MaterialIcon 
                      name={area.icon} 
                      size={48} 
                      color="#666666" 
                      style={styles.coreIcon}
                    />
                    <Text style={styles.coreCardTitle}>{area.name}</Text>
                    {area.recommended && (
                      <Text style={styles.recommendedText}>Recommended</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Exploratory Area Section */}
            <View style={styles.topicSection}>
              <Text style={styles.topicSectionTitle}>Life Skills</Text>
              
              <View style={styles.exploratoryList}>
                {exploratoryAreas.map((area) => (
                  <TouchableOpacity
                    key={area.id}
                    style={[
                      styles.exploratoryCard,
                      selectedTopics.includes(area.id) && styles.exploratoryCardSelected,
                      area.disabled && styles.exploratoryCardDisabled
                    ]}
                    onPress={() => !area.disabled && toggleTopic(area.id)}
                    activeOpacity={area.disabled ? 1 : 0.7}
                    disabled={area.disabled}
                  >
                    <Text style={[
                      styles.exploratoryCardText,
                      area.disabled && styles.exploratoryCardTextDisabled
                    ]}>{area.name}</Text>
                    <MaterialIcon 
                      name={area.icon} 
                      size={22} 
                      color={area.disabled ? "#CCCCCC" : "#666666"}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Bottom Section */}
          <View style={styles.bottomSection}>
            <TouchableOpacity 
              onPress={handleTopicsComplete}
              activeOpacity={0.8}
              disabled={selectedTopics.length === 0}
            >
              {selectedTopics.length > 0 ? (
                <LinearGradient
                  colors={['#00CED1', '#45a578', '#90EE90']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.nextButton}
                >
                  <Text style={styles.nextButtonTextActive}>Complete Setup</Text>
                </LinearGradient>
              ) : (
                <View style={styles.nextButton}>
                  <Text style={styles.nextButtonText}>Complete Setup</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.privacyContainer}>
              <Text style={styles.privacyText}>
                We're committed to keeping your information safe. View our{' '}
                <Text style={styles.privacyLink}>Privacy Policy</Text>.
              </Text>
            </View>
          </View>
        </>
      ) : showSuccessScreen ? (
        // Success Screen - You're Set to Begin
        <>
          {isTablet ? (
            // Large screens - No scroll
            <View style={styles.successContent}>
              {/* Success Icon */}
              <View style={styles.successIconContainer}>
                <View style={styles.successIcon}>
                  <Icon name="checkmark" size={isTablet ? 40 : 35} color="#FFFFFF" />
                </View>
              </View>

              {/* Title */}
              <Text style={styles.successTitle}>You're Set to Begin 🌱</Text>

              {/* Description */}
              <Text style={styles.successDescription}>
                Your parenting journey with intention starts here. You'll receive a few thoughtfully designed nudges each day — just enough to spark curiosity, reflection, and meaningful conversations with your child.
              </Text>

              {/* Divider */}
              <View style={styles.successDivider} />

              {/* What to Expect Section */}
              <View style={styles.expectSection}>
                <View style={styles.expectHeader}>
                  <View style={styles.expectIconCircle}>
                    <Icon name="bulb" size={isTablet ? 24 : 20} color="#FF6B6B" />
                  </View>
                  <Text style={styles.expectTitle}>What to Expect</Text>
                </View>

                {/* Bullet Points */}
                <View style={styles.bulletList}>
                  <View style={styles.bulletItem}>
                    <Text style={styles.bulletTitle}>• 2-3 gentle nudges a day</Text>
                    <Text style={styles.bulletText}>
                      Short moments that fit naturally into everyday routines — no planning required.
                    </Text>
                  </View>

                  <View style={styles.bulletItem}>
                    <Text style={styles.bulletTitle}>• Conversations, not lessons</Text>
                    <Text style={styles.bulletText}>
                      Designed to help you talk, think, and explore together — without pressure or performance.
                    </Text>
                  </View>

                  <View style={styles.bulletItem}>
                    <Text style={styles.bulletTitle}>• Screen-light, parent-led learning</Text>
                    <Text style={styles.bulletText}>
                      No videos. No overload. Just you, your child, and shared moments that matter.
                    </Text>
                  </View>

                  <View style={styles.bulletItem}>
                    <Text style={styles.bulletTitle}>• A balanced focus on growth</Text>
                    <Text style={styles.bulletText}>
                      Academics, values, and life skills — because learning is more than marks.
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            // Small screens - Scrollable
            <ScrollView 
              style={{ flex: 1 }}
              contentContainerStyle={styles.successScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Success Icon */}
              <View style={styles.successIconContainer}>
                <View style={styles.successIcon}>
                  <Icon name="checkmark" size={isTablet ? 40 : 35} color="#FFFFFF" />
                </View>
              </View>

              {/* Title */}
              <Text style={styles.successTitle}>You're Set to Begin 🌱</Text>

              {/* Description */}
              <Text style={styles.successDescription}>
                Your parenting journey with intention starts here. You'll receive a few thoughtfully designed nudges each day — just enough to spark curiosity, reflection, and meaningful conversations with your child.
              </Text>

              {/* Divider */}
              <View style={styles.successDivider} />

              {/* What to Expect Section */}
              <View style={styles.expectSection}>
                <View style={styles.expectHeader}>
                  <View style={styles.expectIconCircle}>
                    <Icon name="bulb" size={isTablet ? 24 : 20} color="#FF6B6B" />
                  </View>
                  <Text style={styles.expectTitle}>What to Expect</Text>
                </View>

                {/* Bullet Points */}
                <View style={styles.bulletList}>
                  <View style={styles.bulletItem}>
                    <Text style={styles.bulletTitle}>• 2-3 gentle nudges a day</Text>
                    <Text style={styles.bulletText}>
                      Short moments that fit naturally into everyday routines — no planning required.
                    </Text>
                  </View>

                  <View style={styles.bulletItem}>
                    <Text style={styles.bulletTitle}>• Conversations, not lessons</Text>
                    <Text style={styles.bulletText}>
                      Designed to help you talk, think, and explore together — without pressure or performance.
                    </Text>
                  </View>

                  <View style={styles.bulletItem}>
                    <Text style={styles.bulletTitle}>• Screen-light, parent-led learning</Text>
                    <Text style={styles.bulletText}>
                      No videos. No overload. Just you, your child, and shared moments that matter.
                    </Text>
                  </View>

                  <View style={styles.bulletItem}>
                    <Text style={styles.bulletTitle}>• A balanced focus on growth</Text>
                    <Text style={styles.bulletText}>
                      Academics, values, and life skills — because learning is more than marks.
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          )}

          {/* Bottom Section */}
          <View style={styles.bottomSection}>
            <TouchableOpacity 
              onPress={handleStartNudge}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#00CED1', '#45a578', '#90EE90']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.startNudgeButton}
              >
                <Text style={styles.startNudgeButtonText}>
                  Start Today's Nudge
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <Text style={styles.successFooter}>
              Five minutes today can shape a lifetime.
            </Text>
          </View>
        </>
      ) : (
        // Child Form Screen
        <>
          <ScrollView 
            ref={scrollViewRef}
            style={styles.scrollContainer}
            contentContainerStyle={styles.formScrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            scrollEnabled={!showDatePicker}
          >
            {/* Header */}
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>Add Child Details</Text>
              <Text style={styles.headerSubtitle}>
                Tell us a little bit about your child, and we will send you content that best works for the age you're parenting.
              </Text>
            </View>

            {/* Child's Name */}
            <View style={[styles.formField, styles.formFieldFirst]}>
              <TextInput
                style={styles.formInput}
                placeholder="Child's Name"
                placeholderTextColor="#CCCCCC"
                value={childName}
                onChangeText={setChildName}
              />
              <View style={styles.formUnderline} />
            </View>

            {/* Date of Birth */}
            <View style={styles.formField}>
              <View style={styles.dateInputContainer}>
                <TextInput
                  style={styles.formInput}
                  placeholder="Date of Birth"
                  placeholderTextColor="#CCCCCC"
                  value={dateOfBirth}
                  onChangeText={setDateOfBirth}
                  keyboardType="numeric"
                />
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                  <Icon name="calendar-outline" size={20} color="#999999" style={styles.calendarIcon} />
                </TouchableOpacity>
              </View>
              <View style={styles.formUnderline} />
            </View>

            {/* Grade */}
            <View style={styles.formField}>
              <TouchableOpacity 
                style={styles.dropdownTrigger}
                onPress={() => {
                  setShowGradeDropdown(!showGradeDropdown);
                  setShowBoardDropdown(false);
                  setShowFaithDropdown(false);
                }}
              >
                <Text style={[styles.dropdownText, grade && styles.dropdownTextFilled]}>
                  {grade || 'Grade'}
                </Text>
                <Icon name="chevron-down" size={20} color="#999999" />
              </TouchableOpacity>
              <View style={styles.formUnderline} />
            </View>
            {showGradeDropdown && (
              <View style={styles.dropdownMenuExpanded}>
                <ScrollView 
                  nestedScrollEnabled={true}
                  style={styles.dropdownScrollView}
                >
                  {grades.map((g) => (
                    <TouchableOpacity
                      key={g}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setGrade(g);
                        setShowGradeDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{g}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Educational Board */}
            <View style={styles.formField}>
              <TouchableOpacity 
                style={styles.dropdownTrigger}
                onPress={() => {
                  setShowBoardDropdown(!showBoardDropdown);
                  setShowGradeDropdown(false);
                  setShowFaithDropdown(false);
                }}
              >
                <Text style={[styles.dropdownText, educationBoard && styles.dropdownTextFilled]}>
                  {educationBoard || 'Educational Board (Optional)'}
                </Text>
                <Icon name="chevron-down" size={20} color="#999999" />
              </TouchableOpacity>
              <View style={styles.formUnderline} />
            </View>
            {showBoardDropdown && (
              <View style={styles.dropdownMenuExpanded}>
                <ScrollView 
                  nestedScrollEnabled={true}
                  style={styles.dropdownScrollView}
                >
                  {boards.map((b) => (
                    <TouchableOpacity
                      key={b}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setEducationBoard(b);
                        setShowBoardDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{b}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Bottom Section - Inside ScrollView */}
            <View style={styles.bottomSectionInline}>
              <TouchableOpacity 
                onPress={handleContinue}
                activeOpacity={0.8}
                disabled={!isChildFormValid()}
              >
                {isChildFormValid() ? (
                  <LinearGradient
                    colors={['#00CED1', '#45a578', '#90EE90']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.nextButton}
                  >
                    <Text style={styles.nextButtonTextActive}>Continue</Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.nextButton}>
                    <Text style={styles.nextButtonText}>Continue</Text>
                  </View>
                )}
              </TouchableOpacity>

              <View style={styles.privacyContainer}>
                <Text style={styles.privacyText}>
                  We're committed to keeping your information safe. View our{' '}
                  <Text style={styles.privacyLink}>Privacy Policy</Text>.
                </Text>
              </View>
            </View>
          </ScrollView>
        </>
      )}

      {/* Date Picker Modal */}
      <DatePicker
        modal
        open={showDatePicker}
        date={selectedDate}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={() => setShowDatePicker(false)}
        maximumDate={new Date()}
        title="Select Date of Birth"
      />
    </KeyboardAvoidingView>
  );
};

export default PersonalSetupScreen;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: isTablet ? width * 0.15 : 30,
    paddingTop: isTablet ? 80 : 90,
    paddingBottom: 180,
  },

  scrollContainer: {
    flex: 1,
  },

  formContainer: {
    flex: 1,
  },

  formScrollContent: {
    paddingHorizontal: isTablet ? width * 0.15 : 30,
    paddingTop: isTablet ? 80 : 90,
    paddingBottom: 40,
  },

  headerContainer: {
    marginBottom: 8,
  },

  headerTitle: {
    fontSize: isTablet ? 36 : 30,
    color: '#45a578',
    fontWeight: '700',
    marginBottom: 14,
    fontFamily: 'Montserrat-Bold',
  },

  headerSubtitle: {
    fontSize: isTablet ? 22 : 20,
    color: '#333333',
    lineHeight: isTablet ? 32 : 30,
    fontWeight: '500',
    fontFamily: 'Montserrat-Medium',
  },

  inputSection: {
    marginTop: 40,
    marginBottom: 40,
  },

  emailInput: {
    fontSize: 16,
    color: '#333333',
    paddingVertical: 12,
    paddingHorizontal: 0,
    fontFamily: 'Montserrat-Regular',
  },

  emailUnderline: {
    height: 1,
    backgroundColor: '#CCCCCC',
    marginBottom: 8,
  },

  emailHint: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 18,
    marginTop: 8,
    fontFamily: 'Montserrat-Regular',
  },

  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },

  checkingText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
    fontFamily: 'Montserrat-Medium',
  },

  successMessage: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },

  successText: {
    flex: 1,
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '500',
    lineHeight: 20,
    fontFamily: 'Montserrat-Medium',
  },

  infoMessage: {
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },

  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1565C0',
    fontWeight: '500',
    lineHeight: 20,
    fontFamily: 'Montserrat-Medium',
  },

  warningMessage: {
    backgroundColor: '#FFF3E0',
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },

  warningText: {
    flex: 1,
    fontSize: 14,
    color: '#E65100',
    fontWeight: '500',
    lineHeight: 20,
    fontFamily: 'Montserrat-Medium',
  },

  addChildButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    opacity: 0.5,
  },

  addChildButtonEnabled: {
    opacity: 1,
  },

  addChildIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  addChildIconEnabled: {
    borderColor: '#45a578',
  },

  addChildText: {
    fontSize: 16,
    color: '#999999',
    fontWeight: '500',
    fontFamily: 'Montserrat-Medium',
  },

  addChildTextEnabled: {
    color: '#45a578',
    fontWeight: '600',
    fontFamily: 'Montserrat-SemiBold',
  },

  formField: {
    marginBottom: 24,
    position: 'relative',
  },

  formFieldFirst: {
    marginTop: 32,
    marginBottom: 24,
  },

  formInput: {
    fontSize: 16,
    color: '#333333',
    paddingVertical: 8,
    paddingHorizontal: 0,
    fontFamily: 'Montserrat-Regular',
  },

  formUnderline: {
    height: 1,
    backgroundColor: '#CCCCCC',
    marginTop: 4,
  },

  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  calendarIcon: {
    marginLeft: 8,
  },

  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },

  dropdownText: {
    fontSize: 16,
    color: '#CCCCCC',
    fontFamily: 'Montserrat-Regular',
  },

  dropdownTextFilled: {
    color: '#333333',
    fontFamily: 'Montserrat-Regular',
  },

  dropdownDisabled: {
    opacity: 0.5,
  },

  dropdownTextDisabled: {
    color: '#CCCCCC',
  },

  dropdownMenu: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    maxHeight: 200,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

  dropdownMenuExpanded: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },

  dropdownScrollView: {
    maxHeight: 200,
  },

  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  dropdownItemText: {
    fontSize: 16,
    color: '#333333',
    fontFamily: 'Montserrat-Regular',
  },

  childrenList: {
    marginTop: 30,
  },

  childrenListTitle: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '600',
    marginBottom: 12,
    fontFamily: 'Montserrat-SemiBold',
  },

  childItem: {
    backgroundColor: '#F0F0F0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },

  childItemText: {
    fontSize: 14,
    color: '#333333',
    fontFamily: 'Montserrat-Regular',
  },

  bottomSection: {
    paddingHorizontal: isTablet ? width * 0.15 : 30,
    paddingVertical: 16,
    paddingBottom: 20,
    paddingTop: 16,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },

  bottomSectionInline: {
    marginTop: 40,
    paddingBottom: 0,
  },

  nextButton: {
    backgroundColor: '#E8E8E8',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },

  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999999',
    fontFamily: 'Montserrat-SemiBold',
  },

  nextButtonTextActive: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat-SemiBold',
  },

  privacyContainer: {
    marginTop: 4,
  },

  privacyText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 18,
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
  },

  privacyLink: {
    color: '#333333',
    fontWeight: '600',
    textDecorationLine: 'underline',
    fontFamily: 'Montserrat-SemiBold',
  },

  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: isTablet ? 20 : 16,
    marginTop: 32,
    marginBottom: 30,
  },

  avatarOption: {
    width: isTablet ? 100 : 80,
    height: isTablet ? 100 : 80,
    borderRadius: isTablet ? 50 : 40,
    borderWidth: 3,
    borderColor: 'transparent',
    overflow: 'hidden',
  },

  avatarOptionSelected: {
    borderColor: '#45a578',
  },

  avatarCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: isTablet ? 50 : 40,
  },

  orText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
    fontFamily: 'Montserrat-Medium',
  },

  uploadPhotoButton: {
    borderWidth: 2,
    borderColor: '#CCCCCC',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignSelf: 'center',
    marginBottom: 40,
  },

  uploadPhotoText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
    fontFamily: 'Montserrat-Medium',
  },

  // Topic Preferences Styles
  topicHeaderTitle: {
    fontSize: isTablet ? 32 : 28,
    color: '#45a578',
    fontWeight: '700',
    marginBottom: 8,
    fontFamily: 'Montserrat-Bold',
  },

  topicSection: {
    marginBottom: 16,
  },

  topicSectionTitle: {
    fontSize: 20,
    color: '#333333',
    fontWeight: '700',
    marginBottom: 8,
    fontFamily: 'Montserrat-Bold',
  },

  coreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },

  coreCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#CCCCCC',
    borderRadius: 16,
    padding: isTablet ? 24 : 18,
    alignItems: 'center',
    minHeight: isTablet ? 180 : 140,
  },

  coreCardSelected: {
    borderColor: '#FFB84D',
    backgroundColor: '#FFF9F0',
  },

  coreIcon: {
    marginBottom: 12,
  },

  coreCardTitle: {
    fontSize: isTablet ? 20 : 17,
    color: '#333333',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 6,
    fontFamily: 'Montserrat-SemiBold',
  },

  recommendedText: {
    fontSize: isTablet ? 14 : 12,
    color: '#4A90E2',
    fontWeight: '500',
    fontFamily: 'Montserrat-Medium',
  },

  exploratoryList: {
    gap: 10,
  },

  exploratoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#CCCCCC',
    borderRadius: 12,
    padding: isTablet ? 14 : 10,
  },

  exploratoryCardSelected: {
    borderColor: '#FFB84D',
    backgroundColor: '#FFF9F0',
  },

  exploratoryCardText: {
    fontSize: isTablet ? 17 : 15,
    color: '#333333',
    fontWeight: '500',
    fontFamily: 'Montserrat-Medium',
  },

  exploratoryCardDisabled: {
    opacity: 0.5,
    backgroundColor: '#F5F5F5',
  },

  exploratoryCardTextDisabled: {
    color: '#CCCCCC',
  },

  // Success Screen Styles
  successContent: {
    flex: 1,
    paddingHorizontal: isTablet ? width * 0.15 : 30,
    paddingTop: isTablet ? 40 : 30,
    paddingBottom: 180,
  },

  successScrollContent: {
    flexGrow: 1,
    paddingHorizontal: isTablet ? width * 0.15 : 30,
    paddingTop: isTablet ? 40 : 30,
    paddingBottom: 180,
  },

  successIconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },

  successIcon: {
    width: isTablet ? 100 : 80,
    height: isTablet ? 100 : 80,
    borderRadius: isTablet ? 50 : 40,
    backgroundColor: '#45a578',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    marginBottom: 24,
  },

  successTitle: {
    fontSize: isTablet ? 32 : 28,
    color: '#333333',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'Montserrat-Bold',
  },

  successDescription: {
    fontSize: isTablet ? 17 : 16,
    color: '#666666',
    lineHeight: isTablet ? 26 : 24,
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Montserrat-Medium',
    fontWeight: '500',
  },

  successDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
  },

  expectSection: {
    marginBottom: 10,
  },

  expectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  expectIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFE5E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  expectTitle: {
    fontSize: isTablet ? 20 : 18,
    color: '#333333',
    fontWeight: '700',
    fontFamily: 'Montserrat-Bold',
  },

  bulletList: {
    gap: 10,
  },

  bulletItem: {
    marginBottom: 4,
  },

  bulletTitle: {
    fontSize: isTablet ? 16 : 15,
    color: '#333333',
    fontWeight: '700',
    marginBottom: 2,
    fontFamily: 'Montserrat-Bold',
  },

  bulletText: {
    fontSize: isTablet ? 15 : 14,
    color: '#666666',
    lineHeight: isTablet ? 20 : 18,
    paddingLeft: 12,
    fontFamily: 'Montserrat-Regular',
  },

  startNudgeButton: {
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  startNudgeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Montserrat-SemiBold',
  },

  successFooter: {
    fontSize: 13,
    color: '#999999',
    textAlign: 'center',
    fontStyle: 'italic',
    fontFamily: 'Montserrat-Regular',
  },
});
