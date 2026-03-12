/**
 * Intro Screen – Pledge Style Layout with Green Buttons
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Animated,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;
const isSmallDevice = width < 375;

const IntroScreen = ({ onFinish, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [yesSelected, setYesSelected] = useState(false);

  const scrollX = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const introData = [
    {
      image: null,
      title: 'NUDGE2GROW',
      subtitle: "Our Motto - Making everyday conversations with your child more meaningful.",
      highlightText: '',
      subtitleEnd: '',
      description: '',
      showYesNo: false,
      isFirstPage: true,
      buttonText: 'Get Started',
    },
    {
      image: null,
      title: 'CURIOSITY',
      subtitle: 'Curated prompts across Math, Science, AI, Financial Literarcy, and more — designed to spark meaningful conversations with your child.',
      highlightText: '',
      subtitleEnd: '',
      description: '',
      showYesNo: false,
      isSecondPage: true,
      buttonText: 'Ignite Their Wonder',
    },
    {
      image: null,
      title: 'CONSISTENCY',
      subtitle: '5-10 minutes of daily nudges, a lifetime of worldclass growth.',
      highlightText: '',
      subtitleEnd: '',
      description: '',
      showYesNo: false,
      isFourthPage: true,
      buttonText: 'Start a Healthy Habit',
    },
    {
      image: null,
      title: 'CONFIDENCE',
      subtitle: 'Daily nudges that prepare your child to think clearly, speak confidently, and grow steadily.',
      highlightText: '',
      subtitleEnd: '',
      description: '',
      showYesNo: false,
      isThirdPage: true,
      buttonText: 'Give Them the Edge',
    },
    
    {
      image: null,
      title: 'COMMIT',
      subtitle: 'I pledge to spend 5-10 minutes each day in meaningful conversations with my child, nurturing both knowledge and essential life skills',
      highlightText: '',
      subtitleEnd: '',
      description: '',
      showYesNo: false,
      isFifthPage: true,
      buttonText: "Let's Grow Together",
    },
  ];

  const handleGetStarted = () => {
    // Skip button - go directly to finish
    if (onFinish) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => onFinish());
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < introData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setYesSelected(false); // Reset yes selection when moving to next page
    } else {
      // On last screen (5th page), proceed to next screen
      if (onFinish) {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(() => onFinish());
      }
    }
  };

  const handleYesClick = () => {
    setYesSelected(true);
    // Add a small delay to show the green color before navigating
    setTimeout(() => {
      if (onFinish) {
        onFinish();
      }
    }, 600);
  };

  const handleNoClick = () => {
    // Immediately go to next screen
    if (onFinish) {
      onFinish();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      // On first slide, go back to splash screen
      if (onBack) {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(() => onBack());
      }
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F0EE" />

      {/* Back Button - Top Left (only show after first page) */}
      {currentIndex > 0 && (
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handlePrevious}
          activeOpacity={0.7}
        >
          <Icon name="chevron-back" size={24} color="#333333" />
        </TouchableOpacity>
      )}

      {/* Skip Button - Top Right */}
      <TouchableOpacity 
        style={styles.skipButton}
        onPress={handleGetStarted}
        activeOpacity={0.7}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Slides */}
      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        scrollEnabled={false}
        contentOffset={{ x: currentIndex * width, y: 0 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
      >
        {introData.map((item, index) => (
          <View key={index} style={[styles.slide, (item.isFirstPage || item.isSecondPage || item.isThirdPage || item.isFourthPage || item.isFifthPage) && styles.firstPageSlide]}>
            {/* Title */}
            <Text style={[
              styles.title, 
              (item.isFirstPage || item.isSecondPage || item.isThirdPage || item.isFourthPage || item.isFifthPage) && styles.firstPageTitle, 
              item.isSecondPage && styles.secondPageTitle,
              item.isThirdPage && styles.thirdPageTitle,
              item.isFourthPage && styles.fourthPageTitle,
              item.isFifthPage && styles.fifthPageTitle
            ]}>{item.title}</Text>

            {/* Subtitle with highlighted text */}
            <View style={styles.subtitleContainer}>
              <Text style={[styles.subtitle, (item.isFirstPage || item.isSecondPage || item.isThirdPage || item.isFourthPage || item.isFifthPage) && styles.firstPageSubtitle]}>
                {item.subtitle}
                {item.highlightText ? (
                  <>
                    {' '}<Text style={styles.highlightText}>{item.highlightText}</Text>
                    {' '}{item.subtitleEnd}
                  </>
                ) : null}
              </Text>
            </View>

            {/* Description (only show if exists) */}
            {item.description ? (
              <Text style={styles.description}>{item.description}</Text>
            ) : null}

            {/* Image */}
            {item.image && (
              <View style={styles.imageSection}>
                <Image source={item.image} style={styles.image} resizeMode="contain" />
              </View>
            )}
          </View>
        ))}
      </Animated.ScrollView>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {/* Dots Indicator */}
        <View style={styles.dotsContainer}>
          {introData.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: i === currentIndex ? (currentIndex <= 4 ? '#333333' : '#45a578') : (currentIndex <= 4 ? '#CCCCCC' : '#F6F0EE'),
                  width: i === currentIndex ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        {/* Navigation Buttons After Dots */}
        <View style={styles.bottomNavigationContainer}>
          {/* Only show back button if not on first 5 slides */}
          {currentIndex < introData.length - 1 && currentIndex > 4 && (
            <TouchableOpacity 
              style={styles.bottomBackButton}
              onPress={handleBack}
              activeOpacity={0.8}
            >
              <Icon name="chevron-back" size={20} color="#45a578" />
            </TouchableOpacity>
          )}

          {currentIndex === 0 ? (
            // Full width Get Started button on first slide
            <TouchableOpacity 
              style={[styles.fullGetStartedButton, styles.firstPageGetStartedButton]}
              onPress={handleNext}
              activeOpacity={0.8}
            >
              <Text style={styles.fullGetStartedButtonText}>Get Started</Text>
            </TouchableOpacity>
          ) : currentIndex === 1 ? (
            // Full width button on second slide
            <TouchableOpacity 
              style={[styles.fullGetStartedButton, styles.firstPageGetStartedButton]}
              onPress={handleNext}
              activeOpacity={0.8}
            >
              <Text style={styles.fullGetStartedButtonText}>Ignite Their Wonder</Text>
            </TouchableOpacity>
          ) : currentIndex === 2 ? (
            // Full width button on third slide
            <TouchableOpacity 
              style={[styles.fullGetStartedButton, styles.firstPageGetStartedButton]}
              onPress={handleNext}
              activeOpacity={0.8}
            >
              <Text style={styles.fullGetStartedButtonText}>Start a Healthy Habit</Text>
            </TouchableOpacity>
          ) : currentIndex === 3 ? (
            // Full width button on fourth slide
            <TouchableOpacity 
              style={[styles.fullGetStartedButton, styles.firstPageGetStartedButton]}
              onPress={handleNext}
              activeOpacity={0.8}
            >
              <Text style={styles.fullGetStartedButtonText}>Give Them the Edge</Text>
            </TouchableOpacity>
          ) : currentIndex === 4 ? (
            // Yes/No buttons on fifth slide (COMMIT page)
            <View style={styles.yesNoContainer}>
              <TouchableOpacity 
                style={[styles.yesButton, !yesSelected && styles.yesButtonBlack]}
                onPress={handleYesClick}
                activeOpacity={0.8}
              >
                {yesSelected ? (
                  <LinearGradient
                    colors={['#4CAF50', '#45a578', '#2E7D5E']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientButton}
                  >
                    <Text style={styles.yesNoText}>Yes</Text>
                  </LinearGradient>
                ) : (
                  <Text style={styles.yesNoText}>Yes</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.noButton}
                onPress={handleNoClick}
                activeOpacity={0.8}
              >
                <Text style={styles.yesNoText}>No</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </View>
    </Animated.View>
  );
};

export default IntroScreen;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF',
  },

  skipButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 100,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  backButton: {
    position: 'absolute',
    top: 48,
    left: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },

  skipText: {
    fontSize: isTablet ? 18 : 16,
    color: '#333333',
    fontWeight: '600',
    fontFamily: 'Montserrat-Medium',
  },

  slide: { 
    width, 
    flex: 1,
    paddingHorizontal: isTablet ? width * 0.15 : 25,
    paddingTop: isTablet ? 120 : 130,
    alignItems: 'center',
    backgroundColor: '#F6F0EE',
  },

  firstPageSlide: {
    backgroundColor: '#FFFFFF',
    paddingTop: isTablet ? 90 : 100,
    justifyContent: 'flex-start',
  },

  title: {
    fontSize: isTablet ? 32 : 28,
    fontWeight: '700',
    color: '#45a578',
    textAlign: 'center',
    lineHeight: isTablet ? 42 : 36,
    marginBottom: 20,
    fontFamily: 'Poppins',
  },

  firstPageTitle: {
    fontSize: isTablet ? 32 : 28,
    fontWeight: '700',
    color: '#45a578',
    letterSpacing: 1,
    marginBottom: 16,
    textAlign: 'left',
    alignSelf: 'flex-start',
    fontFamily: 'Montserrat-Bold',
  },

  secondPageTitle: {
    color: '#FF8C42',
  },

  thirdPageTitle: {
    color: '#FF8C42',
  },

  fourthPageTitle: {
    color: '#2B7FD9',
  },

  fifthPageTitle: {
    color: '#FF69B4',
  },

  subtitleContainer: {
    marginBottom: 15,
    paddingHorizontal: 0,
    width: '100%',
  },

  subtitle: {
    fontSize: isTablet ? 18 : 15,
    color: '#666666',
    textAlign: 'center',
    lineHeight: isTablet ? 26 : 22,
    fontWeight: '400',
    fontFamily: 'Poppins',
  },

  firstPageSubtitle: {
    fontSize: isTablet ? 26 : 22,
    color: '#1A1A1A',
    textAlign: 'left',
    lineHeight: isTablet ? 36 : 30,
    fontWeight: '500',
    paddingHorizontal: 0,
    alignSelf: 'flex-start',
    fontFamily: 'Montserrat-Medium',
  },

  highlightText: {
    fontWeight: '700',
    color: '#333333',
    fontFamily: 'Poppins',
  },

  description: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '400',
    marginBottom: 25,
    paddingHorizontal: 15,
    fontStyle: 'italic',
    fontFamily: 'Poppins',
  },

  imageSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },

  image: { 
    width: '90%', 
    height: '100%',
  },

  yesNoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 0,
    paddingHorizontal: 0,
    width: '100%',
  },

  yesButton: {
    flex: 1,
    maxWidth: 150,
    borderRadius: isTablet ? 30 : 25,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

  yesButtonBlack: {
    backgroundColor: '#000000',
    paddingVertical: isTablet ? 18 : 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  yesButtonSelected: {
    backgroundColor: 'transparent',
  },

  gradientButton: {
    paddingVertical: isTablet ? 18 : 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: isTablet ? 30 : 25,
  },

  noButton: {
    flex: 1,
    maxWidth: 150,
    paddingVertical: isTablet ? 18 : 16,
    borderRadius: isTablet ? 30 : 25,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

  noButtonSelected: {
    backgroundColor: '#45a578',
  },

  yesNoText: {
    fontSize: isTablet ? 20 : 18,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Medium',
  },

  yesNoTextSelected: {
    color: '#FFFFFF',
  },

  bottomSection: { 
    paddingBottom: isTablet ? 80 : 60,
    paddingHorizontal: isTablet ? width * 0.15 : 25,
    alignItems: 'center',
  },

  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: isTablet ? 30 : 25,
  },

  dot: { 
    height: isTablet ? 10 : 8, 
    borderRadius: isTablet ? 5 : 4, 
    marginHorizontal: isTablet ? 5 : 4,
  },

  bottomNavigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 0, // Remove padding to allow buttons at very ends
  },

  bottomBackButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#45a578',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#45a578',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },

  bottomNextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: '#45a578', // Use welcome page green color
    elevation: 3,
    shadowColor: '#45a578',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    gap: 8,
  },

  bottomNextButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Poppins',
  },

  fullGetStartedButton: {
    width: '100%',
    paddingVertical: isTablet ? 20 : 16,
    borderRadius: isTablet ? 30 : 25,
    backgroundColor: '#45a578',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#45a578',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },

  firstPageGetStartedButton: {
    backgroundColor: '#000000',
    borderRadius: isTablet ? 35 : 30,
    paddingVertical: isTablet ? 22 : 18,
  },

  fullGetStartedButtonText: {
    fontSize: isTablet ? 20 : 18,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
  },

  getStartedText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'Poppins',
  },
});