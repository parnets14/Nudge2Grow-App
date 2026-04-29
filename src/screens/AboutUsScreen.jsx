import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const FEATURES = [
  { icon: 'flash-outline',        text: 'Daily learning nudges' },
  { icon: 'bar-chart-outline',    text: 'Progress tracking' },
  { icon: 'ribbon-outline',       text: 'Expert-curated content' },
  { icon: 'color-wand-outline',   text: 'Personalised recommendations' },
  { icon: 'school-outline',       text: 'Flashcards & quizzes' },
  { icon: 'notifications-outline',text: 'Smart push reminders' },
];

const CONTACT = [
  { icon: 'email-outline',  label: 'support@nudge2grow.com', action: () => Linking.openURL('mailto:support@nudge2grow.com') },
  { icon: 'phone-outline',  label: '+91 1800-123-4567',       action: () => Linking.openURL('tel:+911800123456') },
  { icon: 'web',            label: 'www.nudge2grow.com',      action: () => Linking.openURL('https://www.nudge2grow.com') },
];

const AboutUsScreen = ({ onBack }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Icon name="chevron-back" size={26} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Us</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.hero}>
          <Image
            source={require('../assets/images/logo.jpeg')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>Nudge2Grow</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
          <Text style={styles.tagline}>Empowering Parents, Nurturing Children</Text>
        </View>

        {/* Mission */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconCircle}>
              <MaterialIcon name="bullseye-arrow" size={20} color="#45a578" />
            </View>
            <Text style={styles.cardTitle}>Our Mission</Text>
          </View>
          <Text style={styles.cardBody}>
            Nudge2Grow is dedicated to helping parents create meaningful learning moments with their children. We provide bite-sized educational activities that fit seamlessly into your daily routine.
          </Text>
        </View>

        {/* What We Offer */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconCircle}>
              <MaterialIcon name="gift-outline" size={20} color="#45a578" />
            </View>
            <Text style={styles.cardTitle}>What We Offer</Text>
          </View>
          <View style={styles.featureGrid}>
            {FEATURES.map((f, i) => (
              <View key={i} style={styles.featureItem}>
                <View style={styles.featureIconWrap}>
                  <Icon name={f.icon} size={18} color="#45a578" />
                </View>
                <Text style={styles.featureText}>{f.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Contact */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconCircle}>
              <MaterialIcon name="contacts-outline" size={20} color="#45a578" />
            </View>
            <Text style={styles.cardTitle}>Contact Us</Text>
          </View>
          {CONTACT.map((c, i) => (
            <TouchableOpacity key={i} style={styles.contactRow} onPress={c.action} activeOpacity={0.7}>
              <MaterialIcon name={c.icon} size={20} color="#45a578" />
              <Text style={styles.contactText}>{c.label}</Text>
              <Icon name="chevron-forward" size={16} color="#CCCCCC" />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.copyright}>© 2026 Nudge2Grow. All rights reserved.</Text>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

export default AboutUsScreen;

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
    marginBottom: 28,
  },

  logo: {
    width: 90,
    height: 90,
    borderRadius: 20,
    marginBottom: 14,
  },

  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'Montserrat-Bold',
    marginBottom: 4,
  },

  version: {
    fontSize: 13,
    color: '#999999',
    fontFamily: 'Montserrat-Regular',
    marginBottom: 8,
  },

  tagline: {
    fontSize: 14,
    color: '#45a578',
    fontFamily: 'Montserrat-Medium',
    fontWeight: '600',
    textAlign: 'center',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8F5EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'Montserrat-Bold',
  },

  cardBody: {
    fontSize: 14,
    color: '#555555',
    lineHeight: 22,
    fontFamily: 'Montserrat-Regular',
  },

  featureGrid: {
    gap: 10,
  },

  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  featureIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8F5EE',
    justifyContent: 'center',
    alignItems: 'center',
  },

  featureText: {
    fontSize: 14,
    color: '#333333',
    fontFamily: 'Montserrat-Regular',
  },

  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },

  contactText: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
    fontFamily: 'Montserrat-Regular',
  },

  copyright: {
    textAlign: 'center',
    fontSize: 12,
    color: '#AAAAAA',
    fontFamily: 'Montserrat-Regular',
    marginTop: 8,
  },
});
