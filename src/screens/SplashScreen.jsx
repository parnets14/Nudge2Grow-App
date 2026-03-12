/**
 * Splash Screen – Nudge2Grow
 * Black background with N2G logo design
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Animated,
  Image,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;
const isSmallDevice = width < 375;

const SplashScreen = ({ onFinish }) => {
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  const logoAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;
  const taglineAnim = useRef(new Animated.Value(0)).current;
  const dotsAnim = useRef(new Animated.Value(0)).current;
  const dot1Anim = useRef(new Animated.Value(1)).current;
  const dot2Anim = useRef(new Animated.Value(0.3)).current;
  const dot3Anim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Main fade in
    Animated.timing(fade, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Logo animation
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 1000,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Brand text animation
    Animated.timing(textAnim, {
      toValue: 1,
      duration: 800,
      delay: 800,
      useNativeDriver: true,
    }).start();

    // Tagline animation
    Animated.timing(taglineAnim, {
      toValue: 1,
      duration: 800,
      delay: 1200,
      useNativeDriver: true,
    }).start();

    // Dots animation
    Animated.timing(dotsAnim, {
      toValue: 1,
      duration: 600,
      delay: 1600,
      useNativeDriver: true,
    }).start();

    // Animated dots sequence - moving from dot to dot
    Animated.loop(
      Animated.sequence([
        // Dot 1 active
        Animated.parallel([
          Animated.timing(dot1Anim, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dot2Anim, { toValue: 0.3, duration: 300, useNativeDriver: true }),
          Animated.timing(dot3Anim, { toValue: 0.3, duration: 300, useNativeDriver: true }),
        ]),
        Animated.delay(200),
        // Dot 2 active
        Animated.parallel([
          Animated.timing(dot1Anim, { toValue: 0.3, duration: 300, useNativeDriver: true }),
          Animated.timing(dot2Anim, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dot3Anim, { toValue: 0.3, duration: 300, useNativeDriver: true }),
        ]),
        Animated.delay(200),
        // Dot 3 active
        Animated.parallel([
          Animated.timing(dot1Anim, { toValue: 0.3, duration: 300, useNativeDriver: true }),
          Animated.timing(dot2Anim, { toValue: 0.3, duration: 300, useNativeDriver: true }),
          Animated.timing(dot3Anim, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]),
        Animated.delay(200),
      ])
    ).start();

    // Navigate after delay
    const timer = setTimeout(() => {
      Animated.timing(fade, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        if (onFinish) onFinish();
      });
    }, 4000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fade,
            transform: [{ scale }],
          },
        ]}
      >
        {/* Logo Image */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoAnim,
              transform: [
                {
                  translateY: logoAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Image
            source={require('../assets/images/logosplash.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>


        {/* Tagline */}
        <Animated.Text
          style={[
            styles.tagline,
            {
              opacity: taglineAnim,
              transform: [
                {
                  translateY: taglineAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [15, 0],
                  }),
                },
              ],
            },
          ]}
        >
          Small Nudges, Big Conversations
        </Animated.Text>

        {/* Loading Dots */}
        <Animated.View
          style={[
            styles.dotsContainer,
            {
              opacity: dotsAnim,
            },
          ]}
        >
          <Animated.View style={[styles.dot, styles.dotActive, { opacity: dot1Anim }]} />
          <Animated.View style={[styles.dot, styles.dotActive, { opacity: dot2Anim }]} />
          <Animated.View style={[styles.dot, styles.dotActive, { opacity: dot3Anim }]} />
        </Animated.View>
      </Animated.View>
    </View>
  );
};

export default SplashScreen;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoContainer: {
    marginBottom: 20,
  },

  logo: {
    width: isTablet ? width * 0.5 : width * 0.65,
    height: isTablet ? width * 0.4 : width * 0.5,
  },

  brandText: {
    fontSize: isTablet ? 32 : 28,
    fontWeight: '600',
    color: '#45a578',
    letterSpacing: 1,
    marginBottom: 12,
    marginTop: 8,
  },

  tagline: {
    fontSize: isTablet ? 24 : 20,
    color: '#CCCCCC',
    letterSpacing: 0.5,
    marginBottom: 100,
    marginTop: 20,
    fontFamily: 'Montserrat-Regular',
  },

  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: -120,
  },

  dot: {
    width: isTablet ? 12 : 10,
    height: isTablet ? 12 : 10,
    borderRadius: isTablet ? 6 : 5,
    marginHorizontal: isTablet ? 10 : 8,
  },

  dotActive: {
    backgroundColor: '#45a578',
  },

  dotInactive: {
    backgroundColor: '#666666',
  },
});
