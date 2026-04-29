import React from 'react';
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
const isTablet = width >= 768;

const SECTIONS = [
  {
    icon: 'database-outline',
    title: '1. Information We Collect',
    body: 'We collect information you provide directly to us, including your name, email address, phone number, and learning progress data. We also collect information about your device and how you use our app.',
  },
  {
    icon: 'cog-outline',
    title: '2. How We Use Your Information',
    body: 'We use the information we collect to provide, maintain, and improve our services, to personalise your learning experience, and to communicate with you about updates and new features.',
  },
  {
    icon: 'share-variant-outline',
    title: '3. Information Sharing',
    body: 'We do not sell your personal information. We may share your information with service providers who help us operate our app, and when required by law.',
  },
  {
    icon: 'lock-outline',
    title: '4. Data Security',
    body: 'We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.',
  },
  {
    icon: 'account-check-outline',
    title: '5. Your Rights',
    body: 'You have the right to access, update, or delete your personal information. You can do this through your account settings or by contacting us.',
  },
  {
    icon: 'baby-face-outline',
    title: "6. Children's Privacy",
    body: "Our service is designed for parents and guardians. We do not knowingly collect personal information from children under 13 without parental consent.",
  },
  {
    icon: 'email-outline',
    title: '7. Contact Us',
    body: 'If you have any questions about this Privacy Policy, please contact us at support@nudge2grow.com',
  },
];

const PrivacyPolicyScreen = ({ onBack }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Icon name="chevron-back" size={26} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroIconWrap}>
            <MaterialIcon name="shield-check" size={40} color="#45a578" />
          </View>
          <Text style={styles.heroTitle}>Your Privacy Matters</Text>
          <Text style={styles.heroSub}>Last updated: February 26, 2026</Text>
        </View>

        {/* Sections */}
        {SECTIONS.map((s, i) => (
          <View key={i} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconCircle}>
                <MaterialIcon name={s.icon} size={20} color="#45a578" />
              </View>
              <Text style={styles.cardTitle}>{s.title}</Text>
            </View>
            <Text style={styles.cardBody}>{s.body}</Text>
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

export default PrivacyPolicyScreen;

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

  heroIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F5EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },

  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'Montserrat-Bold',
    marginBottom: 6,
  },

  heroSub: {
    fontSize: 13,
    color: '#999999',
    fontFamily: 'Montserrat-Regular',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
    flex: 1,
    fontSize: 15,
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
});
