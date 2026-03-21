/**
 * Riddles Screen - All riddles one after another
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const allRiddles = [
  {
    id: 1,
    question: 'I have cities, but no houses live there. I have mountains, but no trees grow there. I have water, but no fish swim there. What am I?',
    hint: 'You might find me folded up in a car or hanging on a classroom wall.',
    answer: 'A map',
  },
  {
    id: 2,
    question: 'The more you take, the more you leave behind. What am I?',
    hint: 'Think about what you create when you walk.',
    answer: 'Footsteps',
  },
  {
    id: 3,
    question: 'I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?',
    hint: 'You might hear me in a canyon or between mountains.',
    answer: 'An echo',
  },
  {
    id: 4,
    question: 'I have keys but no locks. I have space but no room. You can enter but you can\'t go inside. What am I?',
    hint: 'You use me to make music or type messages.',
    answer: 'A keyboard',
  },
  {
    id: 5,
    question: 'What has hands but can\'t clap?',
    hint: 'You check it many times a day.',
    answer: 'A clock',
  },
  {
    id: 6,
    question: 'I\'m light as a feather, but even the strongest person can\'t hold me for more than a few minutes. What am I?',
    hint: 'You need me to stay alive.',
    answer: 'Breath',
  },
  {
    id: 7,
    question: 'What gets wetter the more it dries?',
    hint: 'You use it after a bath.',
    answer: 'A towel',
  },
  {
    id: 8,
    question: 'I have a head and a tail but no body. What am I?',
    hint: 'You might flip me to make a decision.',
    answer: 'A coin',
  },
];

const RiddlesScreen = ({ onBack }) => {
  const [revealed, setRevealed] = useState({});
  const [hints, setHints] = useState({});

  const toggleReveal = (id) => {
    setRevealed(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleHint = (id) => {
    setHints(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Icon name="chevron-back" size={28} color="#333333" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <MaterialIcon name="head-question" size={22} color="#333333" />
          <Text style={styles.headerTitle}>Today's Riddles</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.countBadge}>{allRiddles.length} riddles</Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {allRiddles.map((riddle, index) => (
          <View key={riddle.id} style={styles.riddleCard}>
            {/* Number */}
            <View style={styles.riddleNumberRow}>
              <View style={styles.riddleNumber}>
                <Text style={styles.riddleNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.riddleLabel}>Riddle</Text>
            </View>

            {/* Question */}
            <Text style={styles.riddleQuestion}>{riddle.question}</Text>

            {/* Hint */}
            {hints[riddle.id] && !revealed[riddle.id] && (
              <TouchableOpacity onPress={() => toggleHint(riddle.id)}>
                <Text style={styles.hintText}>{riddle.hint}</Text>
              </TouchableOpacity>
            )}

            {/* Answer or buttons */}
            {revealed[riddle.id] ? (
              <TouchableOpacity onPress={() => toggleReveal(riddle.id)}>
                <View style={styles.answerLabelRow}>
                  <MaterialIcon name="eye-off" size={18} color="#10B981" />
                  <Text style={styles.answerLabel}>ANSWER</Text>
                </View>
                <Text style={styles.answerText}>{riddle.answer}</Text>
              </TouchableOpacity>
            ) : (
              <>
                {!hints[riddle.id] && (
                  <TouchableOpacity style={styles.hintButton} onPress={() => toggleHint(riddle.id)}>
                    <Text style={styles.hintButtonText}>Need a hint?</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.revealButton} onPress={() => toggleReveal(riddle.id)}>
                  <Icon name="eye-outline" size={16} color="#999999" />
                  <Text style={styles.revealText}>Tap to reveal answer</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

export default RiddlesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 40,
    paddingBottom: 16,
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
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
  },
  headerRight: {
    width: 80,
    alignItems: 'flex-end',
  },
  countBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#45a578',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
  },
  riddleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  riddleNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  riddleNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1A1F3A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  riddleNumberText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  riddleLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  riddleQuestion: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    lineHeight: 22,
    marginBottom: 16,
  },
  hintBox: {
    backgroundColor: 'transparent',
    padding: 0,
    marginBottom: 12,
  },
  hintText: {
    fontSize: 13,
    color: '#999999',
    lineHeight: 18,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  answerBox: {
    backgroundColor: 'transparent',
    padding: 0,
    marginBottom: 12,
  },
  answerLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  answerLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10B981',
    letterSpacing: 2,
  },
  answerText: {
    fontSize: 18,
    color: '#1A1A1A',
    fontWeight: '600',
  },
  actionRow: {
    gap: 4,
  },
  hintButton: {
    alignSelf: 'flex-start',
    marginTop: 12,
    marginBottom: 12,
  },
  hintButtonText: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: '600',
  },
  revealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  revealText: {
    fontSize: 12,
    color: '#888888',
    fontWeight: '500',
  },
});
