/**
 * Vocabulary Cards Screen - Swipeable vocabulary viewer with glassmorphism design
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Animated,
  PanResponder,
  Platform,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;
const isSmallDevice = width < 375;

const CARD_WIDTH = width - 48;
const CARD_HEIGHT = height * 0.54;
const SWIPE_THRESHOLD = width * 0.25;
const ROTATION_FACTOR = 15;

const GLASS = {
  surface: 'rgba(255, 255, 255, 0.75)',
  border: 'rgba(0, 0, 0, 0.1)',
  accent: '#333333',
  text: '#1a1a1a',
  textMuted: 'rgba(26, 26, 26, 0.5)',
  textDim: 'rgba(26, 26, 26, 0.25)',
};

// ─── Single Card Component ────────────────────────────────────────────────────
const VocabCard = ({ item, index, total, onSwipeComplete, onSwipeBack, isNext, triggerSwipeRef }) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const swipeLockedRef = useRef(false);

  const onSwipeCompleteRef = useRef(onSwipeComplete);
  const onSwipeBackRef = useRef(onSwipeBack);
  useEffect(() => {
    onSwipeCompleteRef.current = onSwipeComplete;
    onSwipeBackRef.current = onSwipeBack;
  }, [onSwipeComplete, onSwipeBack]);

  const resetCard = useCallback(() => {
    pan.setValue({ x: 0, y: 0 });
    swipeLockedRef.current = false;
  }, [pan]);

  const swipeOut = useCallback((direction) => {
    if (swipeLockedRef.current) return;
    swipeLockedRef.current = true;
    
    const toX = direction === 'left' ? -width * 1.6 : width * 1.6;
    Animated.timing(pan, {
      toValue: { x: toX, y: 0 },
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (direction === 'right') {
        onSwipeBackRef.current?.();
      } else {
        onSwipeCompleteRef.current?.();
      }
    });
  }, [pan]);

  useEffect(() => {
    if (triggerSwipeRef) {
      triggerSwipeRef.current = swipeOut;
    }
  }, [swipeOut, triggerSwipeRef]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, { dx, dy }) =>
        Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy) * 1.5,
      onPanResponderGrant: () => {
        pan.setOffset({ x: pan.x._value, y: 0 });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (_, gestureState) => {
        if (index === 0 && gestureState.dx > 0) {
          return;
        }
        Animated.event(
          [null, { dx: pan.x }],
          { useNativeDriver: false }
        )(_, gestureState);
      },
      onPanResponderRelease: (_, { vx }) => {
        if (swipeLockedRef.current) return;
        
        pan.flattenOffset();
        const finalDx = pan.x._value;
        
        if (index === 0 && (finalDx > 0 || vx > 0)) {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            friction: 7,
            tension: 50,
            useNativeDriver: true,
          }).start();
          return;
        }
        
        if (finalDx < -SWIPE_THRESHOLD || vx < -0.6) {
          swipeOut('left');
        } else if (finalDx > SWIPE_THRESHOLD || vx > 0.6) {
          swipeOut('right');
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            friction: 7,
            tension: 50,
            useNativeDriver: true,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        pan.flattenOffset();
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          friction: 7,
          tension: 50,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  const rotate = pan.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: [`-${ROTATION_FACTOR}deg`, '0deg', `${ROTATION_FACTOR}deg`],
    extrapolate: 'clamp',
  });

  if (isNext) {
    return (
      <Animated.View
        style={[
          styles.cardPositioned,
          { transform: [{ scale: 0.96 }, { translateY: 8 }], opacity: 1, zIndex: 0 },
        ]}
        pointerEvents="none"
      >
        <View style={[styles.glassCard, styles.glassCardBehind]}>
          <View style={styles.cornerAccent} />
          <View style={styles.cardBody}>
            <Text style={[styles.vocabWord, { opacity: 0.4 }]}>{item.word}</Text>
          </View>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.cardPositioned,
        { transform: [{ translateX: pan.x }, { rotate }], zIndex: 10 },
      ]}
      {...panResponder.panHandlers}
    >
      <View style={styles.glassCard}>
        <View style={styles.cornerAccent} />
        <ScrollView 
          style={styles.cardScroll}
          contentContainerStyle={styles.cardBody}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.vocabHeader}>
            <Text style={styles.vocabWord}>{item.word}</Text>
            <View style={styles.vocabTypeBadge}>
              <Text style={styles.vocabType}>{item.type}</Text>
            </View>
          </View>
          
          <View style={styles.dividerLine} />

          <View style={styles.vocabSection}>
            <Text style={styles.vocabLabel}>DEFINITION</Text>
            <Text style={styles.vocabDefinition}>{item.definition}</Text>
          </View>

          <View style={styles.vocabSection}>
            <Text style={styles.vocabLabel}>EXAMPLE</Text>
            <Text style={styles.vocabExample}>{item.example}</Text>
          </View>

          {item.synonym && (
            <View style={styles.vocabSection}>
              <Text style={styles.vocabLabel}>SYNONYM</Text>
              <Text style={styles.vocabSynonym}>{item.synonym}</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </Animated.View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const VocabCardsScreen = ({
  onBack,
  vocabulary = [],
  topic = '',
  subject = '',
  startIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [showCompletion, setShowCompletion] = useState(false);
  const [cardKey, setCardKey] = useState(0);
  const completionScale = useRef(new Animated.Value(0.75)).current;
  const completionOpacity = useRef(new Animated.Value(0)).current;
  const triggerSwipeRef = useRef(null);

  const handleSwipeComplete = useCallback(() => {
    const next = currentIndex + 1;
    if (next >= vocabulary.length) {
      setShowCompletion(true);
      Animated.parallel([
        Animated.spring(completionScale, { toValue: 1, friction: 6, useNativeDriver: true }),
        Animated.timing(completionOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
      ]).start();
    } else {
      setCurrentIndex(next);
      setCardKey(prev => prev + 1);
    }
  }, [currentIndex, vocabulary.length, completionScale, completionOpacity]);

  const handleSwipeBack = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCardKey(prev => prev + 1);
    }
  }, [currentIndex]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0 && triggerSwipeRef.current) {
      triggerSwipeRef.current('right');
    }
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (triggerSwipeRef.current) {
      triggerSwipeRef.current('left');
    }
  }, []);

  const handleRestart = () => {
    completionScale.setValue(0.75);
    completionOpacity.setValue(0);
    setShowCompletion(false);
    setCurrentIndex(0);
    setCardKey(prev => prev + 1);
  };

  const currentCard = vocabulary[currentIndex];
  const nextCard = vocabulary[currentIndex + 1];

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.75}>
          <Icon name="chevron-back" size={22} color={GLASS.text} />
        </TouchableOpacity>
        <View style={styles.headerMid}>
          <Text style={styles.headerTopic} numberOfLines={1}>{topic}</Text>
          <Text style={styles.headerSubject} numberOfLines={1}>{subject} · Vocabulary</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* ── Progress Bar ── */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View 
            style={[
              styles.progressBarFill, 
              { width: `${((currentIndex + 1) / vocabulary.length) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressCounter}>
          {currentIndex + 1} / {vocabulary.length}
        </Text>
      </View>

      {/* ── Deck ── */}
      <View style={styles.deckArea}>
        <View style={styles.deckContainer}>
          {nextCard && !showCompletion && (
            <VocabCard
              key={`next-${currentIndex + 1}-${cardKey}`}
              item={nextCard}
              index={currentIndex + 1}
              total={vocabulary.length}
              isNext={true}
            />
          )}

          {currentCard && !showCompletion && (
            <VocabCard
              key={`card-${currentIndex}-${cardKey}`}
              item={currentCard}
              index={currentIndex}
              total={vocabulary.length}
              onSwipeComplete={handleSwipeComplete}
              onSwipeBack={handleSwipeBack}
              triggerSwipeRef={triggerSwipeRef}
              isNext={false}
            />
          )}
        </View>

        {showCompletion && (
          <Animated.View
            style={[
              styles.completionOverlay,
              { opacity: completionOpacity, transform: [{ scale: completionScale }] },
            ]}
          >
            <View style={styles.completionCard}>
              <View style={styles.checkCircle}>
                <Icon name="checkmark" size={40} color="#27AE60" />
              </View>
              
              <Text style={styles.completionTitle}>Great job!</Text>
              <Text style={styles.completionMessage}>
                You've completed all Vocabulary cards for <Text style={styles.completionTopicName}>{topic}</Text>.
              </Text>
              
              <TouchableOpacity style={styles.restartBtn} onPress={handleRestart} activeOpacity={0.85}>
                <Icon name="refresh" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.restartBtnText}>Restart</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.backToNudgeBtn} onPress={onBack} activeOpacity={0.85}>
                <Text style={styles.backToNudgeBtnText}>Back to Nudge</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </View>

      {/* ── Bottom Nav ── */}
      {!showCompletion && (
        <View style={styles.navRow}>
          <TouchableOpacity
            style={[styles.prevBtn, currentIndex === 0 && styles.prevBtnDisabled]}
            onPress={handlePrev}
            activeOpacity={0.75}
            disabled={currentIndex === 0}
          >
            <Icon
              name="chevron-back"
              size={20}
              color={currentIndex === 0 ? '#D1D5DB' : '#6B7280'}
            />
            <Text style={[styles.prevBtnText, currentIndex === 0 && styles.prevBtnTextDisabled]}>
              Prev
            </Text>
          </TouchableOpacity>

          {/* Progress Dots */}
          <View style={styles.dotsContainer}>
            {vocabulary.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index <= currentIndex && styles.dotActive,
                ]}
              />
            ))}
          </View>

          <TouchableOpacity
            style={styles.nextBtn}
            onPress={handleNext}
            activeOpacity={0.75}
          >
            <Text style={styles.nextBtnText}>
              {currentIndex === vocabulary.length - 1 ? 'Done' : 'Next'}
            </Text>
            <Icon name="chevron-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? (isSmallDevice ? 48 : 56) : (isSmallDevice ? 32 : 40),
    paddingBottom: isSmallDevice ? 12 : 16,
    paddingHorizontal: isSmallDevice ? 16 : 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  backBtn: {
    width: isSmallDevice ? 36 : 40,
    height: isSmallDevice ? 36 : 40,
    borderRadius: isSmallDevice ? 10 : 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerMid: { flex: 1, alignItems: 'center', paddingHorizontal: 12 },
  headerTopic: {
    fontSize: isTablet ? 18 : 15,
    fontWeight: '700',
    color: GLASS.text,
    letterSpacing: 0.2,
  },
  headerSubject: {
    fontSize: isTablet ? 14 : 13,
    color: '#6B5DD3',
    marginTop: 4,
    fontWeight: '500',
  },
  headerSpacer: { width: 40 },

  progressBarContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: isSmallDevice ? 16 : 20,
    paddingBottom: isSmallDevice ? 12 : 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#27AE60',
    borderRadius: 3,
  },
  progressCounter: {
    fontSize: isTablet ? 15 : 13,
    fontWeight: '500',
    color: '#9CA3AF',
    textAlign: 'right',
  },

  deckArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
  },

  deckContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    position: 'relative',
  },

  cardPositioned: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },

  glassCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.08)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.07,
    shadowRadius: 28,
    elevation: 10,
  },
  glassCardBehind: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(0,0,0,0.06)',
  },

  cornerAccent: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },

  cardScroll: {
    flex: 1,
  },
  cardBody: {
    padding: isSmallDevice ? 20 : 24,
    paddingBottom: isSmallDevice ? 24 : 28,
  },

  vocabHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dividerLine: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 16,
  },
  vocabWord: {
    fontSize: isTablet ? 24 : 21,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
  },
  vocabTypeBadge: {
    backgroundColor: '#E8E5FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 12,
  },
  vocabType: {
    fontSize: isTablet ? 13 : 12,
    fontWeight: '700',
    color: '#6B5DD3',
  },

  vocabSection: {
    marginBottom: 24,
  },
  vocabLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginTop: 8,
  },
  vocabDefinition: {
    fontSize: isTablet ? 15 : 14,
    color: '#4B5563',
    lineHeight: isTablet ? 23 : 21,
  },
  vocabExample: {
    fontSize: isTablet ? 14 : 13,
    color: '#6B7280',
    lineHeight: isTablet ? 21 : 19,
    fontStyle: 'italic',
  },
  vocabSynonym: {
    fontSize: isTablet ? 14 : 13,
    color: '#4B5563',
    lineHeight: isTablet ? 21 : 19,
  },

  completionOverlay: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completionCard: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.08)',
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 28,
    elevation: 10,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#27AE60',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  completionTitle: {
    fontSize: isTablet ? 28 : 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  completionMessage: {
    fontSize: isTablet ? 15 : 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: isTablet ? 24 : 22,
  },
  completionTopicName: {
    fontWeight: '600',
    color: '#1A1A1A',
  },
  restartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27AE60',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 24,
    marginBottom: 12,
    width: '100%',
    justifyContent: 'center',
    shadowColor: '#27AE60',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  restartBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  backToNudgeBtn: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 24,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backToNudgeBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },

  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: isSmallDevice ? 16 : 20,
    paddingVertical: isSmallDevice ? 16 : 20,
    paddingBottom: Platform.OS === 'ios' ? (isSmallDevice ? 28 : 36) : (isSmallDevice ? 16 : 20),
    backgroundColor: '#FFFFFF',
  },
  prevBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    gap: 6,
  },
  prevBtnDisabled: {
    opacity: 0.4,
  },
  prevBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  prevBtnTextDisabled: {
    color: '#D1D5DB',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  dotActive: {
    backgroundColor: '#27AE60',
    width: 24,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: '#27AE60',
    gap: 6,
    shadowColor: '#27AE60',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default VocabCardsScreen;
