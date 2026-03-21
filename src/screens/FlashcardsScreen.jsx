/**
 * Flashcards Screen - Glassmorphism Swiper Edition
 * Fixed swipe logic with stable PanResponder refs
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  PanResponder,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;
const isSmallDevice = width < 375;

const CARD_WIDTH = width - 48;
const CARD_HEIGHT = height * 0.62;
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
const GlassCard = ({ item, index, total, onSwipeComplete, onSwipeBack, isNext, triggerSwipeRef }) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const swipeLockedRef = useRef(false);
  const [showAnswer, setShowAnswer] = useState(false);

  // Reset position when card mounts
  useEffect(() => {
    pan.setValue({ x: 0, y: 0 });
    swipeLockedRef.current = false;
    setShowAnswer(false);
  }, [pan]);

  const onSwipeCompleteRef = useRef(onSwipeComplete);
  const onSwipeBackRef = useRef(onSwipeBack);
  useEffect(() => {
    onSwipeCompleteRef.current = onSwipeComplete;
    onSwipeBackRef.current = onSwipeBack;
  }, [onSwipeComplete, onSwipeBack]);

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
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (_, { dx, dy }) =>
        Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.5,
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

  // Peek card behind active
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
            <Text style={[styles.contentText, { opacity: 0.4 }]}>
              {item.question ?? item.answer ?? item.content}
            </Text>
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
        
        <View style={styles.cardBody}>
          {item.title ? (
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} bounces={false}>
              <View style={styles.aboutBadge}>
                <Text style={styles.aboutBadgeText}>ABOUT</Text>
              </View>
              
              <Text style={styles.cardTitle}>{item.title}</Text>
              
              {item.concept && (
                <>
                  <Text style={styles.sectionLabel}>CONCEPT</Text>
                  <Text style={styles.sectionText}>{item.concept}</Text>
                </>
              )}
              
              {item.section2Title && (
                <>
                  <Text style={styles.sectionLabel}>{item.section2Title.toUpperCase()}</Text>
                  <Text style={styles.sectionText}>{item.section2}</Text>
                </>
              )}
              
              {item.parentOutcome && (
                <>
                  <Text style={styles.sectionLabel}>PARENT OUTCOME</Text>
                  <Text style={styles.sectionText}>{item.parentOutcome}</Text>
                </>
              )}
              <View style={{ height: 20 }} />
            </ScrollView>
          ) : item.type === 'qa' ? (
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} bounces={false}>
              <View style={styles.qaBadge}>
                <Text style={styles.qaBadgeText}>QUESTION</Text>
              </View>
              <Text style={styles.qaQuestion}>{item.question}</Text>
              {showAnswer && (
                <View style={styles.answerBox}>
                  <Text style={styles.answerBoxLabel}>ANSWER</Text>
                  <Text style={styles.answerBoxText}>{item.answer}</Text>
                </View>
              )}
              <View style={{ height: 60 }} />
            </ScrollView>
          ) : item.type === 'prompt' ? (
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} bounces={false}>
              <View style={[styles.qaBadge, { backgroundColor: '#FEF3C7' }]}>
                <Text style={[styles.qaBadgeText, { color: '#D97706' }]}>PROMPT</Text>
              </View>
              <Text style={styles.qaQuestion}>{item.question}</Text>
              {showAnswer && (
                <View style={[styles.answerBox, { backgroundColor: '#FEF9EC' }]}>
                  <Text style={[styles.answerBoxLabel, { color: '#D97706' }]}>HINT</Text>
                  <Text style={[styles.answerBoxText, { color: '#92400E' }]}>{item.answer}</Text>
                </View>
              )}
              <View style={{ height: 60 }} />
            </ScrollView>
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.contentText}>{item.question ?? item.answer ?? item.content}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Reveal button rendered OUTSIDE pan handlers so touches work */}
      {(item.type === 'qa' || item.type === 'prompt') && !showAnswer && (
        <TouchableOpacity
          style={styles.revealBtnOverlay}
          onPress={() => setShowAnswer(true)}
          activeOpacity={0.7}
        >
          <Icon
            name={item.type === 'qa' ? 'eye-outline' : 'bulb-outline'}
            size={18}
            color="#1A1A1A"
            style={{ marginRight: 8 }}
          />
          <Text style={[styles.revealBtnText, { color: '#1A1A1A' }]}>
            {item.type === 'qa' ? 'Reveal Answer' : 'Need a Hint?'}
          </Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const FlashcardsScreen = ({
  onBack,
  flashcards = [],
  topic = '',
  subject = '',
  startIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showTransition, setShowTransition] = useState(false); // false | 'qa' | 'prompt'
  const [cardKey, setCardKey] = useState(0);
  const [visitedCards, setVisitedCards] = useState(new Set([startIndex]));
  const completionScale = useRef(new Animated.Value(0.75)).current;
  const completionOpacity = useRef(new Animated.Value(0)).current;
  const transitionScale = useRef(new Animated.Value(0.75)).current;
  const transitionOpacity = useRef(new Animated.Value(0)).current;
  const triggerSwipeRef = useRef(null);

  // Find index where Q&A cards start and where prompt cards start
  const qaStartIndex = flashcards.findIndex(c => c.type === 'qa');
  const promptStartIndex = flashcards.findIndex(c => c.type === 'prompt');

  const showTransitionCard = useCallback((type) => {
    setShowTransition(type); // 'qa' or 'prompt'
    Animated.parallel([
      Animated.spring(transitionScale, { toValue: 1, friction: 6, useNativeDriver: true }),
      Animated.timing(transitionOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
    ]).start();
  }, [transitionScale, transitionOpacity]);

  const handleSwipeComplete = useCallback(() => {
    const next = currentIndex + 1;
    // Transition from About → Q&A
    if (
      qaStartIndex > 0 &&
      currentIndex === qaStartIndex - 1 &&
      flashcards[currentIndex]?.type === 'about'
    ) {
      showTransitionCard('qa');
      return;
    }
    // Transition from Q&A → Prompts
    if (
      promptStartIndex > 0 &&
      currentIndex === promptStartIndex - 1 &&
      flashcards[currentIndex]?.type === 'qa'
    ) {
      showTransitionCard('prompt');
      return;
    }
    if (next >= flashcards.length) {
      setShowCompletion(true);
      Animated.parallel([
        Animated.spring(completionScale, { toValue: 1, friction: 6, useNativeDriver: true }),
        Animated.timing(completionOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
      ]).start();
    } else {
      setCurrentIndex(next);
      setCardKey(prev => prev + 1);
    }
  }, [currentIndex, flashcards, qaStartIndex, promptStartIndex, showTransitionCard, completionScale, completionOpacity]);

  const handleProceedToQA = useCallback(() => {
    transitionScale.setValue(0.75);
    transitionOpacity.setValue(0);
    setShowTransition(false);
    setCurrentIndex(qaStartIndex);
    setCardKey(prev => prev + 1);
  }, [qaStartIndex, transitionScale, transitionOpacity]);

  const handleProceedToPrompts = useCallback(() => {
    transitionScale.setValue(0.75);
    transitionOpacity.setValue(0);
    setShowTransition(false);
    setCurrentIndex(promptStartIndex);
    setCardKey(prev => prev + 1);
  }, [promptStartIndex, transitionScale, transitionOpacity]);

  const handleDoItAgain = useCallback(() => {
    transitionScale.setValue(0.75);
    transitionOpacity.setValue(0);
    setShowTransition(false);
    setCurrentIndex(0);
    setCardKey(prev => prev + 1);
  }, [transitionScale, transitionOpacity]);

  const handleGoBack = useCallback(() => {
    transitionScale.setValue(0.75);
    transitionOpacity.setValue(0);
    setShowTransition(false);
    // Go back to start of Q&A
    setCurrentIndex(qaStartIndex > 0 ? qaStartIndex : 0);
    setCardKey(prev => prev + 1);
  }, [qaStartIndex, transitionScale, transitionOpacity]);

  const handleSwipeBack = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCardKey(prev => prev + 1);
    }
  }, [currentIndex]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0 && triggerSwipeRef.current) {
      const prevIndex = currentIndex - 1;
      setVisitedCards(prev => new Set([...prev, prevIndex]));
      triggerSwipeRef.current('right');
    }
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (triggerSwipeRef.current) {
      const nextIndex = currentIndex + 1;
      if (nextIndex < flashcards.length) {
        setVisitedCards(prev => new Set([...prev, nextIndex]));
      }
      triggerSwipeRef.current('left');
    }
  }, [currentIndex, flashcards.length]);

  const handleRestart = () => {
    completionScale.setValue(0.75);
    completionOpacity.setValue(0);
    setShowCompletion(false);
    setCurrentIndex(0);
    setVisitedCards(new Set([0])); // Reset visited cards
    setCardKey(prev => prev + 1);
  };

  const currentCard = flashcards[currentIndex];
  const nextCard = flashcards[currentIndex + 1];

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
          <Text style={styles.headerSubject} numberOfLines={1}>{subject} · About</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* ── Progress Bar ── */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View 
            style={[
              styles.progressBarFill, 
              { width: `${((currentIndex + 1) / flashcards.length) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressCounter}>
          {currentIndex + 1} / {flashcards.length}
        </Text>
      </View>

      {/* ── Deck ── */}
      <View style={styles.deckArea}>
        <View style={styles.deckContainer}>
          {nextCard && !showCompletion && !showTransition && (
            <GlassCard
              key={`next-${currentIndex + 1}-${cardKey}`}
              item={nextCard}
              index={currentIndex + 1}
              total={flashcards.length}
              isNext={true}
            />
          )}

          {currentCard && !showCompletion && !showTransition && (
            <GlassCard
              key={`card-${currentIndex}-${cardKey}`}
              item={currentCard}
              index={currentIndex}
              total={flashcards.length}
              onSwipeComplete={handleSwipeComplete}
              onSwipeBack={handleSwipeBack}
              triggerSwipeRef={triggerSwipeRef}
              isNext={false}
            />
          )}
        </View>

        {showTransition && (
          <Animated.View
            style={[
              styles.completionOverlay,
              { opacity: transitionOpacity, transform: [{ scale: transitionScale }] },
            ]}
          >
            <View style={styles.completionCard}>
              <View style={[styles.checkCircle, { backgroundColor: '#EFF6FF', borderWidth: 0 }]}>
                <Icon name="bulb-outline" size={32} color="#4A90E2" />
              </View>
              {showTransition === 'qa' ? (
                <>
                  <Text style={styles.completionTitle}>Ready to go to next section of Q&A?</Text>
                  <Text style={styles.transitionSubtitle}>Now that the logic is understood</Text>
                  <TouchableOpacity style={styles.transitionBtn} onPress={handleProceedToQA} activeOpacity={0.85}>
                    <Icon name="arrow-forward-circle" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                    <Text style={styles.transitionBtnText}>Go to Q&A Section</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.transitionBtnOutline} onPress={handleDoItAgain} activeOpacity={0.85}>
                    <Icon name="refresh" size={16} color="#4A90E2" style={{ marginRight: 8 }} />
                    <Text style={styles.transitionBtnOutlineText}>Read the Nudges again</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.transitionBtnGhost} onPress={() => { transitionScale.setValue(0.75); transitionOpacity.setValue(0); setShowTransition(false); onBack && onBack(); }} activeOpacity={0.85}>
                    <Icon name="chevron-back" size={16} color="#9CA3AF" style={{ marginRight: 6 }} />
                    <Text style={styles.transitionBtnGhostText}>Go back</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.completionTitle}>Great progress!</Text>
                  <TouchableOpacity style={styles.transitionBtn} onPress={handleProceedToPrompts} activeOpacity={0.85}>
                    <Icon name="arrow-forward-circle" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                    <Text style={styles.transitionBtnText}>Go to prompts section</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.transitionBtnOutline} onPress={handleDoItAgain} activeOpacity={0.85}>
                    <Icon name="refresh" size={16} color="#4A90E2" style={{ marginRight: 8 }} />
                    <Text style={styles.transitionBtnOutlineText}>Start the Nudges again</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.transitionBtnGhost} onPress={() => { transitionScale.setValue(0.75); transitionOpacity.setValue(0); setShowTransition(false); onBack && onBack(); }} activeOpacity={0.85}>
                    <Icon name="chevron-back" size={16} color="#9CA3AF" style={{ marginRight: 6 }} />
                    <Text style={styles.transitionBtnGhostText}>Go back</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </Animated.View>
        )}

        {showCompletion && (
          <Animated.View
            style={[
              styles.completionOverlay,
              { opacity: completionOpacity, transform: [{ scale: completionScale }] },
            ]}
          >
            <View style={styles.completionCard}>
              <View style={styles.checkCircle}>
                <Icon name="checkmark" size={36} color="#27AE60" />
              </View>
              <Text style={styles.completionTitle}>Great job!</Text>
              <Text style={styles.completionMessage}>
                You've completed all cards for <Text style={styles.completionTopicName}>{topic}</Text>.
              </Text>
              <TouchableOpacity style={styles.restartBtn} onPress={handleRestart} activeOpacity={0.85}>
                <Icon name="refresh" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.restartBtnText}>Redo again</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.backToNudgeBtn} onPress={onBack} activeOpacity={0.85}>
                <Icon name="home-outline" size={16} color="#6B7280" style={{ marginRight: 6 }} />
                <Text style={styles.backToNudgeBtnText}>Back to Nudge</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </View>

      {/* ── Bottom Nav ── */}
      {!showCompletion && !showTransition && (
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

          <TouchableOpacity
            style={styles.nextBtn}
            onPress={handleNext}
            activeOpacity={0.75}
          >
            <Text style={styles.nextBtnText}>
              {currentIndex === flashcards.length - 1 ? 'Done' : 'Next'}
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
    fontSize: isTablet ? 20 : 17,
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
    minHeight: CARD_HEIGHT,
    position: 'relative',
  },

  cardPositioned: {
    position: 'absolute',
    width: CARD_WIDTH,
    minHeight: CARD_HEIGHT,
  },

  glassCard: {
    width: CARD_WIDTH,
    minHeight: CARD_HEIGHT,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.08)',
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

  cardBody: {
    flex: 1,
    padding: isSmallDevice ? 20 : 24,
    justifyContent: 'flex-start',
  },
  
  aboutBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8E5FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 16,
  },
  aboutBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B5DD3',
    letterSpacing: 0.8,
  },

  qaBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#CCEFEF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  qaBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2A9D9D',
    letterSpacing: 0.8,
    fontFamily: 'Montserrat-Bold',
  },
  answerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  answerBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16A34A',
    letterSpacing: 0.8,
    fontFamily: 'Montserrat-Bold',
  },
  qaQuestion: {
    fontSize: isTablet ? 22 : 20,
    fontWeight: '700',
    color: '#1A1A1A',
    lineHeight: isTablet ? 32 : 28,
    fontFamily: 'Montserrat-Bold',
    flex: 1,
  },
  qaAnswer: {
    fontSize: isTablet ? 16 : 15,
    color: '#374151',
    lineHeight: isTablet ? 26 : 24,
    fontFamily: 'Montserrat-Regular',
  },
  answerBox: {
    backgroundColor: '#E6F7F7',
    borderRadius: 14,
    padding: 16,
    marginTop: 16,
  },
  answerBoxLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2A9D9D',
    letterSpacing: 0.8,
    fontFamily: 'Montserrat-Bold',
    marginBottom: 8,
  },
  answerBoxText: {
    fontSize: isTablet ? 16 : 15,
    color: '#2A7A7A',
    lineHeight: isTablet ? 26 : 24,
    fontFamily: 'Montserrat-Regular',
  },
  revealBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
  },
  revealBtnOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    zIndex: 20,
  },
  revealBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#5BBFBF',
    fontFamily: 'Montserrat-SemiBold',
  },
  
  cardTitle: {
    fontSize: isTablet ? 22 : 19,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 20,
    lineHeight: isTablet ? 30 : 26,
  },
  
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 4,
  },
  
  sectionText: {
    fontSize: isTablet ? 15 : 14,
    fontWeight: '400',
    color: '#4B5563',
    lineHeight: isTablet ? 24 : 22,
    marginBottom: 16,
  },

  contentText: {
    fontSize: isTablet ? 20 : 17,
    fontWeight: '500',
    color: '#000000',
    textAlign: 'center',
    lineHeight: isTablet ? 32 : 27,
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
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    paddingVertical: 48,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 6,
  },
  checkCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#27AE60',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },
  completionTitle: {
    fontSize: isTablet ? 26 : 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: isTablet ? 36 : 32,
    fontFamily: 'Montserrat-Bold',
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
    backgroundColor: '#27AE60',
    paddingVertical: 16,
    borderRadius: 14,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  restartBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
  },
  backToNudgeBtn: {
    paddingVertical: 10,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backToNudgeBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
    fontFamily: 'Montserrat-SemiBold',
  },

  // Break card transition buttons
  transitionSubtitle: {
    fontSize: isTablet ? 14 : 13,
    color: '#6B7280',
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
    marginTop: -8,
    marginBottom: 20,
  },
  transitionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 10,
    width: '100%',
  },
  transitionBtnText: {
    fontSize: isTablet ? 16 : 15,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
  },
  transitionBtnOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#4A90E2',
    paddingVertical: 13,
    borderRadius: 14,
    marginBottom: 10,
    width: '100%',
  },
  transitionBtnOutlineText: {
    fontSize: isTablet ? 15 : 14,
    fontWeight: '600',
    color: '#4A90E2',
    fontFamily: 'Montserrat-SemiBold',
  },
  transitionBtnGhost: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    width: '100%',
  },
  transitionBtnGhostText: {
    fontSize: isTablet ? 14 : 13,
    fontWeight: '500',
    color: '#9CA3AF',
    fontFamily: 'Montserrat-Medium',
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

export default FlashcardsScreen;