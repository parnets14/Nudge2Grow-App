/**
 * Login Screen - Phone Number with Send OTP
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  FlatList,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { sendOTP as apiSendOTP, verifyOTP as apiVerifyOTP } from '../api';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;
const isSmallDevice = width < 375;

const LoginScreen = ({ onSendOTP, onBack, onRegister }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [countryCode, setCountryCode] = useState('+91');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [devOtp, setDevOtp] = useState(''); // shows OTP on screen (dev only)

  const countryCodes = [
    { code: '+93', country: 'Afghanistan', flag: '🇦🇫' },
    { code: '+355', country: 'Albania', flag: '🇦🇱' },
    { code: '+213', country: 'Algeria', flag: '🇩🇿' },
    { code: '+376', country: 'Andorra', flag: '🇦🇩' },
    { code: '+244', country: 'Angola', flag: '🇦🇴' },
    { code: '+54', country: 'Argentina', flag: '🇦🇷' },
    { code: '+374', country: 'Armenia', flag: '🇦🇲' },
    { code: '+61', country: 'Australia', flag: '🇦🇺' },
    { code: '+43', country: 'Austria', flag: '🇦🇹' },
    { code: '+994', country: 'Azerbaijan', flag: '🇦🇿' },
    { code: '+973', country: 'Bahrain', flag: '🇧🇭' },
    { code: '+880', country: 'Bangladesh', flag: '🇧🇩' },
    { code: '+375', country: 'Belarus', flag: '🇧🇾' },
    { code: '+32', country: 'Belgium', flag: '🇧🇪' },
    { code: '+501', country: 'Belize', flag: '🇧🇿' },
    { code: '+229', country: 'Benin', flag: '🇧🇯' },
    { code: '+975', country: 'Bhutan', flag: '🇧🇹' },
    { code: '+591', country: 'Bolivia', flag: '🇧🇴' },
    { code: '+387', country: 'Bosnia', flag: '🇧🇦' },
    { code: '+267', country: 'Botswana', flag: '🇧🇼' },
    { code: '+55', country: 'Brazil', flag: '🇧🇷' },
    { code: '+673', country: 'Brunei', flag: '🇧🇳' },
    { code: '+359', country: 'Bulgaria', flag: '🇧🇬' },
    { code: '+226', country: 'Burkina Faso', flag: '🇧🇫' },
    { code: '+257', country: 'Burundi', flag: '🇧🇮' },
    { code: '+855', country: 'Cambodia', flag: '🇰🇭' },
    { code: '+237', country: 'Cameroon', flag: '🇨🇲' },
    { code: '+1', country: 'Canada', flag: '🇨🇦' },
    { code: '+56', country: 'Chile', flag: '🇨🇱' },
    { code: '+86', country: 'China', flag: '🇨🇳' },
    { code: '+57', country: 'Colombia', flag: '🇨🇴' },
    { code: '+506', country: 'Costa Rica', flag: '🇨🇷' },
    { code: '+385', country: 'Croatia', flag: '🇭🇷' },
    { code: '+53', country: 'Cuba', flag: '🇨🇺' },
    { code: '+357', country: 'Cyprus', flag: '🇨🇾' },
    { code: '+420', country: 'Czech Republic', flag: '🇨🇿' },
    { code: '+45', country: 'Denmark', flag: '🇩🇰' },
    { code: '+253', country: 'Djibouti', flag: '🇩🇯' },
    { code: '+593', country: 'Ecuador', flag: '🇪🇨' },
    { code: '+20', country: 'Egypt', flag: '🇪🇬' },
    { code: '+503', country: 'El Salvador', flag: '🇸🇻' },
    { code: '+372', country: 'Estonia', flag: '🇪🇪' },
    { code: '+251', country: 'Ethiopia', flag: '🇪🇹' },
    { code: '+679', country: 'Fiji', flag: '🇫🇯' },
    { code: '+358', country: 'Finland', flag: '🇫🇮' },
    { code: '+33', country: 'France', flag: '🇫🇷' },
    { code: '+995', country: 'Georgia', flag: '🇬🇪' },
    { code: '+49', country: 'Germany', flag: '🇩🇪' },
    { code: '+233', country: 'Ghana', flag: '🇬🇭' },
    { code: '+30', country: 'Greece', flag: '🇬🇷' },
    { code: '+502', country: 'Guatemala', flag: '🇬🇹' },
    { code: '+224', country: 'Guinea', flag: '🇬🇳' },
    { code: '+509', country: 'Haiti', flag: '🇭🇹' },
    { code: '+504', country: 'Honduras', flag: '🇭🇳' },
    { code: '+852', country: 'Hong Kong', flag: '🇭🇰' },
    { code: '+36', country: 'Hungary', flag: '🇭🇺' },
    { code: '+354', country: 'Iceland', flag: '🇮🇸' },
    { code: '+91', country: 'India', flag: '🇮🇳' },
    { code: '+62', country: 'Indonesia', flag: '🇮🇩' },
    { code: '+98', country: 'Iran', flag: '🇮🇷' },
    { code: '+964', country: 'Iraq', flag: '🇮🇶' },
    { code: '+353', country: 'Ireland', flag: '🇮🇪' },
    { code: '+972', country: 'Israel', flag: '🇮🇱' },
    { code: '+39', country: 'Italy', flag: '🇮🇹' },
    { code: '+81', country: 'Japan', flag: '🇯🇵' },
    { code: '+962', country: 'Jordan', flag: '🇯🇴' },
    { code: '+7', country: 'Kazakhstan', flag: '🇰🇿' },
    { code: '+254', country: 'Kenya', flag: '🇰🇪' },
    { code: '+965', country: 'Kuwait', flag: '🇰🇼' },
    { code: '+996', country: 'Kyrgyzstan', flag: '🇰🇬' },
    { code: '+856', country: 'Laos', flag: '🇱🇦' },
    { code: '+371', country: 'Latvia', flag: '🇱🇻' },
    { code: '+961', country: 'Lebanon', flag: '🇱🇧' },
    { code: '+266', country: 'Lesotho', flag: '🇱🇸' },
    { code: '+231', country: 'Liberia', flag: '🇱🇷' },
    { code: '+218', country: 'Libya', flag: '🇱🇾' },
    { code: '+370', country: 'Lithuania', flag: '🇱🇹' },
    { code: '+352', country: 'Luxembourg', flag: '🇱🇺' },
    { code: '+853', country: 'Macau', flag: '🇲🇴' },
    { code: '+261', country: 'Madagascar', flag: '🇲🇬' },
    { code: '+265', country: 'Malawi', flag: '🇲🇼' },
    { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
    { code: '+960', country: 'Maldives', flag: '🇲🇻' },
    { code: '+223', country: 'Mali', flag: '🇲🇱' },
    { code: '+356', country: 'Malta', flag: '🇲🇹' },
    { code: '+52', country: 'Mexico', flag: '🇲🇽' },
    { code: '+373', country: 'Moldova', flag: '🇲🇩' },
    { code: '+377', country: 'Monaco', flag: '🇲🇨' },
    { code: '+976', country: 'Mongolia', flag: '🇲🇳' },
    { code: '+382', country: 'Montenegro', flag: '🇲🇪' },
    { code: '+212', country: 'Morocco', flag: '🇲🇦' },
    { code: '+258', country: 'Mozambique', flag: '🇲🇿' },
    { code: '+95', country: 'Myanmar', flag: '🇲🇲' },
    { code: '+264', country: 'Namibia', flag: '🇳🇦' },
    { code: '+977', country: 'Nepal', flag: '🇳🇵' },
    { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
    { code: '+64', country: 'New Zealand', flag: '🇳🇿' },
    { code: '+505', country: 'Nicaragua', flag: '🇳🇮' },
    { code: '+227', country: 'Niger', flag: '🇳🇪' },
    { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
    { code: '+47', country: 'Norway', flag: '🇳🇴' },
    { code: '+968', country: 'Oman', flag: '🇴🇲' },
    { code: '+92', country: 'Pakistan', flag: '🇵🇰' },
    { code: '+507', country: 'Panama', flag: '🇵🇦' },
    { code: '+595', country: 'Paraguay', flag: '🇵🇾' },
    { code: '+51', country: 'Peru', flag: '🇵🇪' },
    { code: '+63', country: 'Philippines', flag: '🇵🇭' },
    { code: '+48', country: 'Poland', flag: '🇵🇱' },
    { code: '+351', country: 'Portugal', flag: '🇵🇹' },
    { code: '+974', country: 'Qatar', flag: '🇶🇦' },
    { code: '+40', country: 'Romania', flag: '🇷🇴' },
    { code: '+7', country: 'Russia', flag: '🇷🇺' },
    { code: '+250', country: 'Rwanda', flag: '🇷🇼' },
    { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
    { code: '+221', country: 'Senegal', flag: '🇸🇳' },
    { code: '+381', country: 'Serbia', flag: '🇷🇸' },
    { code: '+65', country: 'Singapore', flag: '🇸🇬' },
    { code: '+421', country: 'Slovakia', flag: '🇸🇰' },
    { code: '+386', country: 'Slovenia', flag: '🇸🇮' },
    { code: '+27', country: 'South Africa', flag: '🇿🇦' },
    { code: '+82', country: 'South Korea', flag: '🇰🇷' },
    { code: '+34', country: 'Spain', flag: '🇪🇸' },
    { code: '+94', country: 'Sri Lanka', flag: '🇱🇰' },
    { code: '+249', country: 'Sudan', flag: '🇸🇩' },
    { code: '+46', country: 'Sweden', flag: '🇸🇪' },
    { code: '+41', country: 'Switzerland', flag: '🇨🇭' },
    { code: '+963', country: 'Syria', flag: '🇸🇾' },
    { code: '+886', country: 'Taiwan', flag: '🇹🇼' },
    { code: '+992', country: 'Tajikistan', flag: '🇹🇯' },
    { code: '+255', country: 'Tanzania', flag: '🇹🇿' },
    { code: '+66', country: 'Thailand', flag: '🇹🇭' },
    { code: '+228', country: 'Togo', flag: '🇹🇬' },
    { code: '+216', country: 'Tunisia', flag: '🇹🇳' },
    { code: '+90', country: 'Turkey', flag: '🇹🇷' },
    { code: '+993', country: 'Turkmenistan', flag: '🇹🇲' },
    { code: '+256', country: 'Uganda', flag: '🇺🇬' },
    { code: '+380', country: 'Ukraine', flag: '🇺🇦' },
    { code: '+971', country: 'UAE', flag: '🇦🇪' },
    { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
    { code: '+1', country: 'United States', flag: '🇺🇸' },
    { code: '+598', country: 'Uruguay', flag: '🇺🇾' },
    { code: '+998', country: 'Uzbekistan', flag: '🇺🇿' },
    { code: '+58', country: 'Venezuela', flag: '🇻🇪' },
    { code: '+84', country: 'Vietnam', flag: '🇻🇳' },
    { code: '+967', country: 'Yemen', flag: '🇾🇪' },
    { code: '+260', country: 'Zambia', flag: '🇿🇲' },
    { code: '+263', country: 'Zimbabwe', flag: '🇿🇼' },
  ];

  const filteredCountries = countryCodes.filter(
    (item) =>
      item.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.includes(searchQuery)
  );

  const handlePhoneChange = (text) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    setPhoneNumber(cleaned);
  };

  const handleSendOTP = async () => {
    if (phoneNumber.length < 7) return;
    setLoading(true);
    setErrorMsg('');
    setDevOtp('');
    try {
      const res = await apiSendOTP(phoneNumber, countryCode);
      setShowOTP(true);
      // Show OTP on screen in dev mode (backend returns it)
      if (res.otp) setDevOtp(res.otp);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await apiVerifyOTP(phoneNumber, otp);
      // data = { token, isNewUser, parent }
      if (onSendOTP) onSendOTP({ phoneNumber, countryCode, token: data.token, isNewUser: data.isNewUser, parent: data.parent });
    } catch (err) {
      setErrorMsg(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const isPhoneValid = phoneNumber.length >= 7;
  const isOTPValid = otp.length === 6;

  const renderButton = () => {
    const enabled = showOTP ? isOTPValid : isPhoneValid;

    if (loading) {
      return (
        <LinearGradient
          colors={['#00CED1', '#45a578', '#90EE90']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientButton}
        >
          <ActivityIndicator color="#FFFFFF" />
        </LinearGradient>
      );
    }

    if (!enabled) {
      return (
        <View style={styles.disabledButton}>
          <Text style={styles.disabledButtonText}>
            {showOTP ? 'Verify OTP' : 'Send OTP'}
          </Text>
        </View>
      );
    }

    return (
      <LinearGradient
        colors={['#00CED1', '#45a578', '#90EE90']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientButton}
      >
        <Text style={styles.gradientButtonText}>
          {showOTP ? 'Verify OTP' : 'Send OTP'}
        </Text>
      </LinearGradient>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Back Button */}
      {onBack && (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Icon name="chevron-back" size={28} color="#333333" />
        </TouchableOpacity>
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        scrollEnabled={!showCountryDropdown}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>
            Grow together, one{'\n'}
            moment at a time with
          </Text>
          <MaskedView
            style={{ flexDirection: 'row' }}
            maskElement={
              <Text style={styles.gradientText}>
                Nudge2Grow
              </Text>
            }
          >
            <LinearGradient
              colors={['#19C2E6', '#39D98A', '#E8E35A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={[styles.gradientText, { opacity: 0 }]}>
                Nudge2Grow
              </Text>
            </LinearGradient>
          </MaskedView>
        </View>

        {/* Phone Input */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Enter your Phone Number</Text>
          <View style={styles.phoneInputContainer}>
            <TouchableOpacity 
              style={styles.countryCodeButton}
              onPress={() => setShowCountryDropdown(!showCountryDropdown)}
            >
              <Text style={styles.countryFlag}>
                {countryCodes.find(c => c.code === countryCode)?.flag}
              </Text>
              <Text style={styles.countryCode}>{countryCode}</Text>
              <Icon name="chevron-down" size={14} color="#999999" />
            </TouchableOpacity>
            <View style={styles.separator} />
            <TextInput
              style={styles.phoneInput}
              value={phoneNumber}
              onChangeText={handlePhoneChange}
              keyboardType="phone-pad"
              maxLength={10}
              editable={!showOTP}
              placeholder="Phone Number"
              placeholderTextColor="#CCCCCC"
            />
          </View>
          
          {/* Country Code Dropdown */}
          {showCountryDropdown && (
            <View style={styles.countryDropdown}>
              {/* Search Bar */}
              <View style={styles.searchContainer}>
                <Icon name="search" size={18} color="#999999" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search country..."
                  placeholderTextColor="#999999"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus={false}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Icon name="close-circle" size={18} color="#999999" />
                  </TouchableOpacity>
                )}
              </View>
              
              {/* Country List */}
              {filteredCountries.length > 0 ? (
                <FlatList
                  data={filteredCountries}
                  keyExtractor={(item, index) => `${item.code}-${item.country}-${index}`}
                  style={styles.countryList}
                  showsVerticalScrollIndicator={true}
                  nestedScrollEnabled={true}
                  keyboardShouldPersistTaps="handled"
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.countryItem,
                        countryCode === item.code && styles.countryItemSelected
                      ]}
                      onPress={() => {
                        setCountryCode(item.code);
                        setShowCountryDropdown(false);
                        setSearchQuery('');
                      }}
                    >
                      <View style={styles.flagContainer}>
                        <Text style={styles.countryCodeBadge}>
                          {item.flag}
                        </Text>
                      </View>
                      <Text style={styles.countryItemName}>{item.country}</Text>
                      <Text style={styles.countryItemCode}>{item.code}</Text>
                      {countryCode === item.code && (
                        <Icon name="checkmark" size={20} color="#45a578" />
                      )}
                    </TouchableOpacity>
                  )}
                />
              ) : (
                <View style={styles.noResultsContainer}>
                  <Text style={styles.noResultsText}>No countries found</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* OTP */}
        {showOTP && (
          <View style={styles.otpSection}>
            <Text style={styles.inputLabel}>Enter OTP</Text>
            <View style={styles.otpInputContainer}>
              <TextInput
                style={styles.otpInput}
                value={otp}
                onChangeText={setOtp}
                keyboardType="numeric"
                maxLength={6}
              />
            </View>
            <Text style={styles.otpSentText}>
              OTP sent to {countryCode}-{phoneNumber}
            </Text>
            {devOtp ? (
              <Text style={{ color: '#45a578', fontSize: 15, fontWeight: '700', textAlign: 'center', marginTop: 8, letterSpacing: 4 }}>
                🔑 {devOtp}
              </Text>
            ) : null}
          </View>
        )}

        {/* Error message */}
        {errorMsg ? (
          <Text style={{ color: '#e53e3e', fontSize: 13, textAlign: 'center', marginBottom: 8, paddingHorizontal: 20 }}>
            {errorMsg}
          </Text>
        ) : null}

        {/* Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={showOTP ? handleVerifyOTP : handleSendOTP}
          disabled={loading || (showOTP ? !isOTPValid : !isPhoneValid)}
        >
          {renderButton()}
        </TouchableOpacity>

        {/* Privacy */}
        <View style={styles.privacyContainer}>
          <Text style={styles.privacyText}>
            We're committed to keeping your information safe. View our{' '}
            <Text style={styles.privacyLink}>Privacy Policy</Text>.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  scrollView: { flex: 1 },

  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  scrollContent: {
    paddingHorizontal: isTablet ? width * 0.15 : 30,
    paddingTop: isTablet ? 90 : 100,
    paddingBottom: 40,
  },

  headerContainer: { marginBottom: isTablet ? 80 : 100 },

  headerText: {
  fontSize: isTablet ? 32 : 28,
    color: '#1A1A1A',
    lineHeight: isTablet ? 32 : 28,
    fontWeight: '500',
    fontFamily: 'Montserrat-Medium',
  },

  gradientText: {
     fontSize: isTablet ? 32 : 28,
    lineHeight: isTablet ? 40 : 36,
    fontWeight: '700',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  inputSection: { marginBottom: 30 },

  inputLabel: {
    fontSize: isTablet ? 18 : 16,
    color: '#333333',
    marginBottom: 20,
    fontFamily: 'Montserrat-Regular',
  },

  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    borderStyle: 'dashed',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },

  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
    gap: 6,
  },

  countryFlag: {
    fontSize: 20,
  },

  countryCode: { 
    fontSize: 16, 
    fontFamily: 'Montserrat-Medium',
    color: '#333333',
    fontWeight: '600',
  },

  separator: {
    width: 1,
    height: 24,
    backgroundColor: '#DDDDDD',
    marginHorizontal: 8,
  },

  phoneInput: { 
    flex: 1, 
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#333333',
  },

  countryDropdown: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    maxHeight: 350,
    zIndex: 1000,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FAFAFA',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    gap: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333333',
    fontFamily: 'Montserrat-Regular',
    padding: 0,
  },

  countryList: {
    maxHeight: 290,
  },

  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },

  countryItemSelected: {
    backgroundColor: '#F0F9F4',
  },

  flagContainer: {
    width: 40,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  countryCodeBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333333',
    fontFamily: 'Montserrat-Bold',
    letterSpacing: 0.5,
  },

  countryItemFlag: {
    fontSize: 24,
    lineHeight: 28,
  },

  countryItemName: {
    flex: 1,
    fontSize: 15,
    color: '#333333',
    fontFamily: 'Montserrat-Medium',
    fontWeight: '500',
  },

  countryItemCode: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Montserrat-Regular',
    marginRight: 8,
  },

  noResultsContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  noResultsText: {
    fontSize: 15,
    color: '#999999',
    fontFamily: 'Montserrat-Regular',
  },

  otpSection: { marginBottom: 30 },

  otpInputContainer: {
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    borderStyle: 'dashed',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },

  otpInput: { fontSize: 16 },

  otpSentText: {
    fontSize: 14,
    color: '#45a578',
    marginTop: 8,
  },

  gradientButton: {
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 8,
  },

  gradientButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Medium',
  },

  disabledButton: {
    backgroundColor: '#E8E8E8',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 8,
  },

  disabledButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  privacyContainer: { marginTop: 0, marginBottom: 0 },

  privacyText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },

  privacyLink: {
    color: '#333333',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
