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
    icon: 'handshake-outline',
    title: '1. Acceptance of Terms',
    body: 'By accessing and using Nudge2Grow, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our service.',
  },
  {
    icon: 'check-circle-outline',
    title: '2. Use of Service',
    body: 'You agree to use our service only for lawful purposes and in accordance with these Terms. You are responsible for maintaining the confidentiality of your account.',
  },
  {
    icon: 'credit-card-outline',
    title: '3. Subscription and Payment',
    body: 'Some features require a paid subscription. You agree to pay all fees associated with your subscription. Subscriptions automatically renew unless cancelled.',
  },
  {
    icon: 'copyright',
    title: '4. Content Ownership',
    body: 'All content provided through our service, including text, graphics, and educational materials, is owned by Nudge2Grow and protected by copyright laws.',
  },
  {
    icon: 'account-outline',
    title: '5. User Conduct',
    body: 'You agree not to misuse our service, interfere with its operation, or attempt to access it through unauthorised means.',
  },
  {
    icon: 'cancel',
    title: '6. Termination',
    body: 'We reserve the right to suspend or terminate your account if you violate these Terms or engage in fraudulent activity.',
  },
  {
    icon: 'alert-circle-outline',
    title: '7. Limitation of Liability',
    body: 'Nudge2Grow is provided "as is" without warranties. We are not liable for any indirect, incidental, or consequential damages.',
  },
  {
    icon: 'refresh',
    title: '8. Changes to Terms',
    body: 'We may modify these Terms at any time. Continued use of the service after changes constitutes acceptance of the new Terms.',
  },
];

const TermsOfServiceScreen = ({ onBack }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Icon name="chevron-back" size={26} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroIconWrap}>
            <MaterialIcon name="file-document-outline" size={40} color="#45a578" />
          </View>
          <Text style={styles.heroTitle}>Our Terms</Text>
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

export default TermsOfServiceScreen;

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
