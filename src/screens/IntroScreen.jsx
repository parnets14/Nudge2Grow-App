/**
 * Intro Screen – Pledge Style Layout with Green Buttons
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Animated,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { fetchIntroSlides } from '../api';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;
const isSmallDevice = width < 375;

const IntroScreen = ({ onFinish, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [yesSelected, setYesSelected] = useState(false);
  const [introData, setIntroData] = useState([]);
  const [loading, setLoading] = useState(true);

  const scrollX = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Fallback slides if API is unavailable
  const fallbackData = [
    { _id: '1', title: 'NUDGE2GROW',  titleColor: '#45a578', description: "Our Motto - Making everyday conversations with your child more meaningful." },
    { _id: '2', title: 'CURIOSITY',   titleColor: '#FF8C42', description: 'Curated prompts across Math, Science, AI, Financial Literacy, and more — designed to spark meaningful conversations with your child.' },
    { _id: '3', title: 'CONSISTENCY', titleColor: '#2B7FD9', description: '5-10 minutes of daily nudges, a lifetime of world-class growth.' },
    { _id: '4', title: 'CONFIDENCE',  titleColor: '#FF8C42', description: 'Daily nudges that prepare your child to think clearly, speak confidently, and grow steadily.' },
    { _id: '5', title: 'COMMIT',      titleColor: '#FF69B4', description: 'I pledge to spend 5-10 minutes each day in meaningful conversations with my child, nurturing both knowledge and essential life skills.' },
  ];

  useEffect(() => {
    fetchIntroSlides()
      .then(data => setIntroData(data.length > 0 ? data : fallbackData))
      .catch(() => setIntroData(fallbackData))
      .finally(() => setLoading(false));
  }, []);

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

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#45a578" />
        </View>
      ) : (
        <>
          {/* Back Button */}
          {currentIndex > 0 && (
            <TouchableOpacity style={styles.backButton} onPress={handlePrevious} activeOpacity={0.7}>
              <Icon name="chevron-back" size={24} color="#333333" />
            </TouchableOpacity>
          )}

          {/* Skip Button */}
          <TouchableOpacity style={styles.skipButton} onPress={handleGetStarted} activeOpacity={0.7}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>

          {/* Slides */}
          <Animated.ScrollView
            horizontal pagingEnabled showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16} scrollEnabled={false}
            contentOffset={{ x: currentIndex * width, y: 0 }}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true })}
          >
            {introData.map((item, index) => (
              <View key={item._id || index} style={[styles.slide, styles.firstPageSlide]}>
                <Text style={[styles.firstPageTitle, { color: item.titleColor || '#45a578' }]}>
                  {item.title}
                </Text>
                <View style={styles.subtitleContainer}>
                  <Text style={styles.firstPageSubtitle}>{item.description}</Text>
                </View>
                {item.image ? (
                  <View style={styles.imageSection}>
                    <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
                  </View>
                ) : null}
              </View>
            ))}
          </Animated.ScrollView>

          {/* Bottom Section */}
          <View style={styles.bottomSection}>
            <View style={styles.dotsContainer}>
              {introData.map((_, i) => (
                <View key={i} style={[styles.dot, {
                  backgroundColor: i === currentIndex ? '#333333' : '#CCCCCC',
                  width: i === currentIndex ? 24 : 8,
                }]} />
              ))}
            </View>

            <View style={styles.bottomNavigationContainer}>
              {currentIndex === introData.length - 1 ? (
                // Last slide — Yes/No
                <View style={styles.yesNoContainer}>
                  <TouchableOpacity style={[styles.yesButton, !yesSelected && styles.yesButtonBlack]} onPress={handleYesClick} activeOpacity={0.8}>
                    {yesSelected ? (
                      <LinearGradient colors={['#4CAF50', '#45a578', '#2E7D5E']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradientButton}>
                        <Text style={styles.yesNoText}>Yes</Text>
                      </LinearGradient>
                    ) : (
                      <Text style={styles.yesNoText}>Yes</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.noButton} onPress={handleNoClick} activeOpacity={0.8}>
                    <Text style={styles.yesNoText}>No</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                // All other slides — Next button
                <TouchableOpacity style={[styles.fullGetStartedButton, styles.firstPageGetStartedButton]} onPress={handleNext} activeOpacity={0.8}>
                  <Text style={styles.fullGetStartedButtonText}>Next</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </>
      )}
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

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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