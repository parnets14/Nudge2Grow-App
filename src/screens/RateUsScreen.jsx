import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { BASE_URL } from '../api';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
const COLORS = ['', '#EF4444', '#F97316', '#EAB308', '#84CC16', '#22C55E'];

const RateUsScreen = ({ onBack, userData }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const child = userData?.children?.[0] || null;

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Oops', 'Please select a star rating first.');
      return;
    }
    try {
      await fetch(`${BASE_URL}/customer-ratings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          feedback,
          childName: child?.name || '',
          phone: userData?.phone ? `${userData.countryCode || ''}${userData.phone}` : '',
        }),
      });
    } catch (e) {
      console.error('[RateUs] submit failed:', e.message);
    }
    setSubmitted(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Icon name="chevron-back" size={26} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rate Us</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {submitted ? (
          /* ── Thank You State ── */
          <View style={styles.thankYouWrap}>
            <View style={styles.thankYouIconWrap}>
              <MaterialIcon name="heart" size={52} color="#45a578" />
            </View>
            <Text style={styles.thankYouTitle}>Thank You! 🎉</Text>
            <Text style={styles.thankYouSub}>
              Your feedback means a lot to us. We'll keep improving Nudge2Grow for you and your child.
            </Text>
            <TouchableOpacity style={styles.doneBtn} onPress={onBack}>
              <Text style={styles.doneBtnText}>Back to Settings</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Hero */}
            <View style={styles.hero}>
              <View style={styles.heroIconWrap}>
                <MaterialIcon name="star-circle" size={48} color="#FFB84D" />
              </View>
              <Text style={styles.heroTitle}>How are we doing?</Text>
              <Text style={styles.heroSub}>
                Your feedback helps us improve and serve you better
              </Text>
            </View>

            {/* Stars Card */}
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Tap to rate</Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setRating(star)}
                    activeOpacity={0.7}
                    style={styles.starBtn}
                  >
                    <Icon
                      name={star <= rating ? 'star' : 'star-outline'}
                      size={isTablet ? 56 : 46}
                      color={star <= rating ? '#FFB84D' : '#D1D5DB'}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              {rating > 0 && (
                <View style={[styles.labelPill, { backgroundColor: COLORS[rating] + '22' }]}>
                  <Text style={[styles.labelPillText, { color: COLORS[rating] }]}>
                    {LABELS[rating]}
                  </Text>
                </View>
              )}
            </View>

            {/* Feedback Card */}
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Tell us more <Text style={styles.optional}>(optional)</Text></Text>
              <TextInput
                style={styles.textArea}
                value={feedback}
                onChangeText={setFeedback}
                placeholder="Share your experience with us..."
                placeholderTextColor="#BBBBBB"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Submit */}
            <TouchableOpacity
              activeOpacity={rating === 0 ? 1 : 0.85}
              onPress={handleSubmit}
              disabled={rating === 0}
            >
              <LinearGradient
                colors={rating === 0 ? ['#E0E0E0', '#E0E0E0'] : ['#00CED1', '#45a578', '#90EE90']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitBtn}
              >
                <MaterialIcon name="send" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.submitBtnText}>Submit Rating</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

export default RateUsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: isTablet ? 22 : 18,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'Montserrat-Bold',
  },

  content: {
    paddingHorizontal: isTablet ? 40 : 16,
    paddingTop: 24,
  },

  hero: {
    alignItems: 'center',
    marginBottom: 24,
  },

  heroIconWrap: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFF8E7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'Montserrat-Bold',
    marginBottom: 8,
  },

  heroSub: {
    fontSize: 14,
    color: '#777777',
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  cardLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    fontFamily: 'Montserrat-Bold',
    marginBottom: 16,
  },

  optional: {
    fontWeight: '400',
    color: '#999999',
    fontFamily: 'Montserrat-Regular',
  },

  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },

  starBtn: {
    padding: 4,
  },

  labelPill: {
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 20,
  },

  labelPillText: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Montserrat-Bold',
  },

  textArea: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 14,
    fontSize: 14,
    color: '#333333',
    fontFamily: 'Montserrat-Regular',
    minHeight: 110,
  },

  submitBtn: {
    flexDirection: 'row',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },

  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Montserrat-Bold',
  },

  // Thank you state
  thankYouWrap: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  thankYouIconWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8F5EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },

  thankYouTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'Montserrat-Bold',
    marginBottom: 12,
  },

  thankYouSub: {
    fontSize: 15,
    color: '#666666',
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 36,
  },

  doneBtn: {
    backgroundColor: '#45a578',
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 40,
  },

  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Montserrat-Bold',
  },
});
