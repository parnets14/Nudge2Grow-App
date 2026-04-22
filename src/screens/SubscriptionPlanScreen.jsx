/**
 * Subscription Plan Screen - Enhanced with Full Functionality
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  Dimensions,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { fetchTestimonials, fetchSubscriptionFaqs } from '../api';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;
const isSmallDevice = width < 375;

const SubscriptionPlanScreen = ({ onBack }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState('yearly'); // monthly or yearly
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [showComparison, setShowComparison] = useState(false);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentProcessing, setShowPaymentProcessing] = useState(false);
  
  // Card payment fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  
  // Net Banking fields
  const [selectedBank, setSelectedBank] = useState('');
  const [showBankOTP, setShowBankOTP] = useState(false);
  const [bankOTP, setBankOTP] = useState('');
  
  // UPI fields
  const [upiId, setUpiId] = useState('');
  const [showUPIConfirm, setShowUPIConfirm] = useState(false);
  
  // Wallet fields
  const [selectedWallet, setSelectedWallet] = useState('');
  const [showWalletOTP, setShowWalletOTP] = useState(false);
  const [walletOTP, setWalletOTP] = useState('');
  
  const [testimonials, setTestimonials] = useState([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const [faqs, setFaqs] = useState([]);
  const [loadingFaqs, setLoadingFaqs] = useState(true);
  
  const testimonialFlatListRef = useRef(null);

  // Load testimonials from backend
  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const data = await fetchTestimonials();
        setTestimonials(data);
      } catch (error) {
        console.error('[SubscriptionPlan] Failed to load testimonials:', error);
        setTestimonials([]);
      } finally {
        setLoadingTestimonials(false);
      }
    };
    loadTestimonials();
  }, []);

  // Load FAQs from backend
  useEffect(() => {
    const loadFaqs = async () => {
      try {
        const data = await fetchSubscriptionFaqs();
        setFaqs(data);
      } catch (error) {
        console.error('[SubscriptionPlan] Failed to load FAQs:', error);
        // Fallback to hardcoded FAQs if fetch fails
        setFaqs(fallbackFaqs);
      } finally {
        setLoadingFaqs(false);
      }
    };
    loadFaqs();
  }, []);

  const banks = [
    'State Bank of India',
    'HDFC Bank',
    'ICICI Bank',
    'Axis Bank',
    'Kotak Mahindra Bank',
    'Punjab National Bank',
    'Bank of Baroda',
    'Canara Bank',
  ];

  const wallets = [
    'Paytm',
    'PhonePe',
    'Google Pay',
    'Amazon Pay',
    'Mobikwik',
    'Freecharge',
  ];

  const currentPlan = {
    id: 'free',
    name: 'Free Explorer',
    nudgesUsed: 3,
    nudgesTotal: 'Unlimited subjects',
    nudgesPerSubject: 2,
    daysRemaining: null,
    renewDate: null,
  };

  const plans = [
    {
      id: 'free',
      name: 'Free Explorer',
      monthlyPrice: 0,
      yearlyPrice: 0,
      tagline: 'Try before you commit',
      features: [
        { text: '2 nudges per subject', included: true },
        { text: 'Access to all subjects', included: true },
        { text: 'Up to 3 children profiles', included: true },
        { text: 'Progress tracking & reports', included: true },
      ],
      color: '#999999',
      icon: 'gift',
    },
    {
      id: 'basic',
      name: 'Basic',
      monthlyPrice: 199,
      yearlyPrice: 1999,
      tagline: 'Core subjects unlimited',
      popular: false,
      features: [
        { text: 'Unlimited nudges in core subjects', included: true },
        { text: 'Math, Science, English, Social Studies', included: true },
        { text: 'Up to 3 children profiles', included: true },
        { text: 'Progress tracking & reports', included: true },
      ],
      color: '#4A90E2',
      icon: 'rocket',
    },
    {
      id: 'premium',
      name: 'Premium',
      monthlyPrice: 299,
      yearlyPrice: 2999,
      tagline: 'All subjects unlimited',
      popular: true,
      features: [
        { text: 'Unlimited nudges in ALL subjects', included: true },
        { text: 'Core: Math, Science, English, Social Studies', included: true },
        { text: 'Premium: AI, Finance, Life Skills & more', included: true },
        { text: 'Up to 3 children profiles', included: true },
        { text: 'Progress tracking & reports', included: true },
      ],
      color: '#9B59B6',
      icon: 'star',
    },
    {
      id: 'family',
      name: 'Family Plus',
      monthlyPrice: 499,
      yearlyPrice: 4999,
      tagline: 'All subjects + priority support',
      recommended: true,
      features: [
        { text: 'Unlimited nudges in ALL subjects', included: true },
        { text: 'Core: Math, Science, English, Social Studies', included: true },
        { text: 'Premium: AI, Finance, Life Skills & more', included: true },
        { text: 'Up to 3 children profiles', included: true },
        { text: 'Progress tracking & reports', included: true },
        { text: 'Priority 24/7 support', included: true },
      ],
      color: '#27AE60',
      icon: 'people',
    },
  ];

  const benefits = [
    {
      icon: 'brain',
      color: '#4A90E2',
      title: 'Expert-Curated Learning Nudges',
      description: 'Every nudge is carefully designed by child development experts and educators to spark meaningful conversations.',
    },
    {
      icon: 'chart-line',
      color: '#9B59B6',
      title: 'Track Your Child\'s Progress',
      description: 'Monitor which subjects your child explores and see their learning journey unfold with detailed progress reports.',
    },
    {
      icon: 'account-group',
      color: '#27AE60',
      title: 'Support Up to 3 Children',
      description: 'All paid plans support up to 3 children. Each child gets their own profile with personalized tracking.',
    },
    {
      icon: 'lightbulb-on',
      color: '#FFB84D',
      title: 'Core & Premium Subjects',
      description: 'From Math and Science to AI, Financial Literacy, and Life Skills - comprehensive learning across all areas.',
    },
    {
      icon: 'shield-check',
      color: '#27AE60',
      title: 'Safe & Ad-Free Experience',
      description: 'No ads, no distractions. Just quality learning moments with your child in a safe environment.',
    },
    {
      icon: 'clock-outline',
      color: '#00CED1',
      title: 'Just 5-10 Minutes Daily',
      description: 'Short, engaging nudges that fit into your busy schedule. Quality conversations don\'t need hours.',
    },
  ];

  const fallbackFaqs = [
    {
      id: 1,
      question: 'What do I get with the free plan?',
      answer: 'With the free plan, you get 2 nudges per subject to explore and experience the quality of our content. This allows you to try different subjects and see how meaningful conversations can transform your child\'s learning journey.',
    },
    {
      id: 2,
      question: 'What happens after I use my 2 free nudges per subject?',
      answer: 'After using your 2 free nudges in any subject, you\'ll need to upgrade to a paid plan to access more nudges in that subject. Paid plans give you unlimited access to nudges based on your chosen plan.',
    },
    {
      id: 3,
      question: 'What\'s the difference between Basic and Premium plans?',
      answer: 'Basic plan includes unlimited nudges in core subjects (Math, Science, English, Social Studies). Premium plan includes unlimited nudges in ALL subjects - both core subjects and premium subjects like AI & Technology, Financial Literacy, Life Skills, and Environmental Awareness.',
    },
    {
      id: 4,
      question: 'How many children can I add to my account?',
      answer: 'All plans support up to 3 children. Each child gets their own profile with personalized nudges and individual progress tracking.',
    },
    {
      id: 5,
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit/debit cards (Visa, Mastercard, American Express), UPI payments, net banking, and popular digital wallets like Paytm, PhonePe, and Google Pay. All transactions are secure and encrypted.',
    },
    {
      id: 6,
      question: 'How long does my subscription last?',
      answer: 'Your subscription is valid for the duration you choose - either monthly or yearly. Once purchased, you have full access to all features for that entire period. The yearly plan offers better value with 17% savings.',
    },
    {
      id: 7,
      question: 'What are core subjects?',
      answer: 'Core subjects include Math, Science, English, and Social Studies. These are the fundamental academic subjects that form the foundation of your child\'s learning journey.',
    },
    {
      id: 8,
      question: 'What are premium subjects?',
      answer: 'Premium subjects include AI & Technology, Financial Literacy, Life Skills, and Environmental Awareness. These subjects are available only in Premium and Family Plus plans, helping your child develop future-ready skills beyond traditional academics.',
    },
    {
      id: 9,
      question: 'Is the yearly plan worth it?',
      answer: 'Absolutely! The yearly plan saves you 17% compared to paying monthly. Plus, you get uninterrupted access for the entire year without worrying about monthly renewals. It\'s our most popular billing option among families.',
    },
    {
      id: 10,
      question: 'What\'s the difference between Premium and Family Plus?',
      answer: 'Both plans include unlimited nudges in all subjects (core + premium) and support up to 3 children. The main difference is that Family Plus includes Priority 24/7 support, ensuring you get immediate assistance whenever you need it.',
    },
  ];

  const getPrice = (plan) => {
    if (!plan) return '₹0';
    if (plan.id === 'free') return '₹0';
    return billingCycle === 'monthly' ? `₹${plan.monthlyPrice}` : `₹${plan.yearlyPrice}`;
  };

  const getPeriod = (plan) => {
    if (!plan) return '';
    if (plan.id === 'free') return 'Forever';
    return billingCycle === 'monthly' ? 'per month' : 'per year';
  };

  const getSavings = (plan) => {
    if (!plan || plan.id === 'free' || billingCycle === 'monthly') return null;
    const monthlyCost = plan.monthlyPrice * 12;
    const savings = monthlyCost - plan.yearlyPrice;
    return `Save ₹${savings}`;
  };

  const handleSubscribe = (planId) => {
    setSelectedPlan(planId);
    if (planId !== 'free') {
      setShowPaymentModal(true);
    }
  };

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const onTestimonialViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentTestimonialIndex(viewableItems[0].index);
    }
  }).current;

  const testimonialViewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderTestimonial = ({ item, index }) => (
    <View style={styles.testimonialCardWrapper}>
      <View style={styles.testimonialCard}>
        <View style={styles.testimonialHeader}>
          <View style={styles.testimonialAvatar}>
            <Text style={styles.testimonialInitial}>
              {item.name.charAt(0)}
            </Text>
          </View>
          <View style={styles.testimonialInfo}>
            <Text style={styles.testimonialName}>{item.name}</Text>
            <Text style={styles.testimonialRole}>{item.role}</Text>
          </View>
          <View style={styles.ratingContainer}>
            {[...Array(item.rating)].map((_, i) => (
              <Icon key={i} name="star" size={14} color="#FFB84D" />
            ))}
          </View>
        </View>
        <Text style={styles.testimonialText}>"{item.text}"</Text>
      </View>
    </View>
  );

  const handleStartFreeTrial = () => {
    // Validate based on selected payment method
    let isValid = false;
    
    if (selectedPaymentMethod === 'card') {
      isValid = cardNumber.length >= 16 && cardName.trim() !== '' && expiryDate.length >= 5 && cvv.length >= 3;
      if (isValid) {
        // Show processing screen for card payment
        setShowPaymentProcessing(true);
        setTimeout(() => {
          setShowPaymentProcessing(false);
          setShowPaymentModal(false);
          setShowSuccessModal(true);
          resetPaymentForm();
        }, 2500);
      }
    } else if (selectedPaymentMethod === 'netbanking') {
      if (!showBankOTP) {
        // First step: Bank selected, show OTP screen
        isValid = selectedBank !== '';
        if (isValid) {
          setShowBankOTP(true);
        }
      } else {
        // Second step: OTP entered, process payment
        isValid = bankOTP.length === 6;
        if (isValid) {
          setShowPaymentProcessing(true);
          setTimeout(() => {
            setShowPaymentProcessing(false);
            setShowPaymentModal(false);
            setShowSuccessModal(true);
            resetPaymentForm();
          }, 2500);
        }
      }
    } else if (selectedPaymentMethod === 'upi') {
      if (!showUPIConfirm) {
        // First step: UPI ID entered, show confirmation
        isValid = upiId.trim() !== '' && upiId.includes('@');
        if (isValid) {
          setShowUPIConfirm(true);
        }
      } else {
        // Second step: Confirmed, process payment
        setShowPaymentProcessing(true);
        setTimeout(() => {
          setShowPaymentProcessing(false);
          setShowPaymentModal(false);
          setShowSuccessModal(true);
          resetPaymentForm();
        }, 2500);
      }
    } else if (selectedPaymentMethod === 'wallet') {
      if (!showWalletOTP) {
        // First step: Wallet selected, show OTP screen
        isValid = selectedWallet !== '';
        if (isValid) {
          setShowWalletOTP(true);
        }
      } else {
        // Second step: OTP entered, process payment
        isValid = walletOTP.length === 6;
        if (isValid) {
          setShowPaymentProcessing(true);
          setTimeout(() => {
            setShowPaymentProcessing(false);
            setShowPaymentModal(false);
            setShowSuccessModal(true);
            resetPaymentForm();
          }, 2500);
        }
      }
    }
  };

  const resetPaymentForm = () => {
    setSelectedPaymentMethod(null);
    setCardNumber('');
    setCardName('');
    setExpiryDate('');
    setCvv('');
    setSelectedBank('');
    setShowBankOTP(false);
    setBankOTP('');
    setUpiId('');
    setShowUPIConfirm(false);
    setSelectedWallet('');
    setShowWalletOTP(false);
    setWalletOTP('');
  };

  const handleBackInPaymentFlow = () => {
    if (showBankOTP) {
      setShowBankOTP(false);
      setBankOTP('');
    } else if (showUPIConfirm) {
      setShowUPIConfirm(false);
    } else if (showWalletOTP) {
      setShowWalletOTP(false);
      setWalletOTP('');
    }
  };

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19); // 16 digits + 3 spaces
  };

  const formatExpiryDate = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const getPaymentButtonText = () => {
    if (selectedPaymentMethod === 'card') {
      return 'Pay Now';
    } else if (selectedPaymentMethod === 'netbanking') {
      return showBankOTP ? 'Verify OTP' : 'Proceed to Bank';
    } else if (selectedPaymentMethod === 'upi') {
      return showUPIConfirm ? 'Confirm Payment' : 'Continue';
    } else if (selectedPaymentMethod === 'wallet') {
      return showWalletOTP ? 'Verify OTP' : 'Proceed to Wallet';
    }
    return 'Continue';
  };

  const isPaymentFormValid = () => {
    if (!selectedPaymentMethod) return false;
    
    if (selectedPaymentMethod === 'card') {
      return cardNumber.replace(/\s/g, '').length === 16 && 
             cardName.trim() !== '' && 
             expiryDate.length === 5 && 
             cvv.length >= 3;
    } else if (selectedPaymentMethod === 'netbanking') {
      if (showBankOTP) {
        return bankOTP.length === 6;
      }
      return selectedBank !== '';
    } else if (selectedPaymentMethod === 'upi') {
      if (showUPIConfirm) {
        return true;
      }
      return upiId.trim() !== '' && upiId.includes('@');
    } else if (selectedPaymentMethod === 'wallet') {
      if (showWalletOTP) {
        return walletOTP.length === 6;
      }
      return selectedWallet !== '';
    }
    
    return false;
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    // Navigate back to home screen after successful subscription
    onBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Icon name="chevron-back" size={28} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subscription Plans</Text>
        <TouchableOpacity 
          style={styles.compareButton}
          onPress={() => setShowComparison(!showComparison)}
        >
          <MaterialIcon name="compare" size={24} color="#45a578" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* Current Plan Status */}
        <View style={styles.currentPlanCard}>
          <View style={styles.currentPlanHeader}>
            <View style={styles.currentPlanLeft}>
              <MaterialIcon name="gift" size={28} color="#45a578" />
              <View style={styles.currentPlanInfo}>
                <Text style={styles.currentPlanLabel}>Your Current Plan</Text>
                <Text style={styles.currentPlanName}>{currentPlan.name}</Text>
              </View>
            </View>
          </View>

          <View style={styles.usageContainer}>
            <View style={styles.usageHeader}>
              <Text style={styles.usageLabel}>Free Plan Benefits</Text>
              <Text style={styles.usageCount}>
                2 nudges per subject
              </Text>
            </View>
            <Text style={styles.renewText}>
              Try 2 nudges in each subject to experience quality learning conversations
            </Text>
          </View>

          <TouchableOpacity style={styles.upgradePrompt}>
            <MaterialIcon name="arrow-up-circle" size={20} color="#45a578" />
            <Text style={styles.upgradePromptText}>
              Upgrade for unlimited nudges across all subjects
            </Text>
          </TouchableOpacity>
        </View>

        {/* Billing Cycle Toggle */}
        <View style={styles.billingToggleContainer}>
          <Text style={styles.billingLabel}>Choose billing cycle:</Text>
          <View style={styles.billingToggle}>
            <TouchableOpacity
              style={[
                styles.billingOption,
                billingCycle === 'monthly' && styles.billingOptionActive,
              ]}
              onPress={() => setBillingCycle('monthly')}
            >
              <Text
                style={[
                  styles.billingOptionText,
                  billingCycle === 'monthly' && styles.billingOptionTextActive,
                ]}
              >
                Monthly
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.billingOption,
                billingCycle === 'yearly' && styles.billingOptionActive,
              ]}
              onPress={() => setBillingCycle('yearly')}
            >
              <Text
                style={[
                  styles.billingOptionText,
                  billingCycle === 'yearly' && styles.billingOptionTextActive,
                ]}
              >
                Yearly
              </Text>
              <View style={styles.saveBadge}>
                <Text style={styles.saveBadgeText}>Save 17%</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Plans */}
        <Text style={styles.sectionTitle}>Choose Your Perfect Plan</Text>

        {plans.map((plan) => {
          const isCurrentPlan = plan.id === currentPlan.id;
          const savings = getSavings(plan);

          return (
            <View
              key={plan.id}
              style={[
                styles.planCard,
                isCurrentPlan && styles.planCardCurrent,
                plan.recommended && styles.planCardRecommended,
              ]}
            >
              {plan.popular && (
                <View style={[styles.badge, { backgroundColor: '#4A90E2' }]}>
                  <MaterialIcon name="star" size={12} color="#FFFFFF" />
                  <Text style={styles.badgeText}>MOST POPULAR</Text>
                </View>
              )}

              {plan.recommended && (
                <View style={[styles.badge, { backgroundColor: '#666666' }]}>
                  <MaterialIcon name="crown" size={12} color="#FFFFFF" />
                  <Text style={styles.badgeText}>BEST VALUE</Text>
                </View>
              )}

              <View style={styles.planHeader}>
                <View style={styles.planIconContainer}>
                  <MaterialIcon name={plan.icon} size={28} color="#666666" />
                </View>
                <View style={styles.planHeaderInfo}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <Text style={styles.planTagline}>{plan.tagline}</Text>
                </View>
                {isCurrentPlan && (
                  <View style={styles.currentBadge}>
                    <Text style={styles.currentBadgeText}>Active</Text>
                  </View>
                )}
              </View>

              <View style={styles.priceSection}>
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>{getPrice(plan)}</Text>
                  <Text style={styles.period}>{getPeriod(plan)}</Text>
                </View>
                {savings && (
                  <View style={styles.savingsBadge}>
                    <MaterialIcon name="tag" size={14} color="#45a578" />
                    <Text style={styles.savingsText}>{savings}</Text>
                  </View>
                )}
              </View>

              <View style={styles.featuresContainer}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Icon
                      name={feature.included ? 'checkmark-circle' : 'close-circle'}
                      size={20}
                      color={feature.included ? '#45a578' : '#E0E0E0'}
                    />
                    <Text
                      style={[
                        styles.featureText,
                        !feature.included && styles.featureTextDisabled,
                      ]}
                    >
                      {feature.text}
                    </Text>
                  </View>
                ))}
              </View>

              {!isCurrentPlan ? (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleSubscribe(plan.id)}
                  style={[
                    styles.subscribeButton,
                    selectedPlan === plan.id && styles.subscribeButtonSelected
                  ]}
                >
                  <Text style={[
                    styles.subscribeButtonText,
                    selectedPlan === plan.id && styles.subscribeButtonTextSelected
                  ]}>
                    {plan.id === 'free' ? 'Downgrade to Free' : 'Subscribe Now'}
                  </Text>
                  <Icon 
                    name="arrow-forward" 
                    size={18} 
                    color={selectedPlan === plan.id ? "#FFFFFF" : "#666666"} 
                  />
                </TouchableOpacity>
              ) : (
                <View style={styles.currentButton}>
                  <Icon name="checkmark-circle" size={20} color="#45a578" />
                  <Text style={styles.currentButtonText}>Your Current Plan</Text>
                </View>
              )}
            </View>
          );
        })}

        {/* Secure Payment Info */}
        <View style={styles.guaranteeCard}>
          <MaterialIcon name="shield-check" size={48} color="#45a578" />
          <Text style={styles.guaranteeTitle}>Secure & Easy Payment</Text>
          <Text style={styles.guaranteeText}>
            All transactions are encrypted and secure. We accept UPI, cards, net banking, and digital wallets. Your subscription starts immediately after successful payment.
          </Text>
        </View>

        {/* Benefits Section */}
        <View style={styles.benefitsSection}>
          <Text style={styles.benefitsTitle}>Why Families Love Nudge2Grow</Text>

          {benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitItem}>
              <View style={styles.benefitIcon}>
                <MaterialIcon name={benefit.icon} size={28} color="#666666" />
              </View>
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>{benefit.title}</Text>
                <Text style={styles.benefitDescription}>{benefit.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <View style={styles.testimonialsSection}>
            <Text style={styles.testimonialsTitle}>What Parents Are Saying</Text>

            <FlatList
              ref={testimonialFlatListRef}
              data={testimonials}
              renderItem={renderTestimonial}
              keyExtractor={(item, index) => `testimonial-${index}`}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onViewableItemsChanged={onTestimonialViewableItemsChanged}
              viewabilityConfig={testimonialViewabilityConfig}
              snapToInterval={Dimensions.get('window').width - 40}
              decelerationRate="fast"
              contentContainerStyle={styles.testimonialsList}
            />

            {/* Pagination Dots */}
            <View style={styles.paginationDots}>
              {testimonials.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    currentTestimonialIndex === index && styles.dotActive,
                  ]}
                />
              ))}
            </View>
          </View>
        )}

        {/* FAQ */}
        <View style={styles.faqSection}>
          <Text style={styles.faqTitle}>Frequently Asked Questions</Text>

          {faqs.map((faq) => (
            <TouchableOpacity
              key={faq.id}
              style={styles.faqItem}
              onPress={() => toggleFaq(faq.id)}
            >
              <View style={styles.faqQuestionRow}>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <Icon
                  name={expandedFaq === faq.id ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color="#666666"
                />
              </View>
              {expandedFaq === faq.id && (
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Contact Support */}
        <View style={styles.supportCard}>
          <MaterialIcon name="help-circle" size={32} color="#45a578" />
          <Text style={styles.supportTitle}>Still Have Questions?</Text>
          <Text style={styles.supportText}>
            Our support team is here to help you choose the right plan
          </Text>
          
          <View style={styles.contactInfoContainer}>
            <View style={styles.contactInfoItem}>
              <MaterialIcon name="email" size={20} color="#45a578" />
              <Text style={styles.contactInfoText}>support@nudge2grow.com</Text>
            </View>
            
            <View style={styles.contactInfoItem}>
              <MaterialIcon name="phone" size={20} color="#45a578" />
              <Text style={styles.contactInfoText}>+91 1800-123-4567</Text>
            </View>
          </View>
          
         
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Payment Modal - Full Functionality */}
      <Modal
        visible={showPaymentModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                onPress={() => {
                  if (showBankOTP || showUPIConfirm || showWalletOTP) {
                    handleBackInPaymentFlow();
                  } else {
                    setShowPaymentModal(false);
                    setSelectedPlan(null);
                  }
                }}
                style={styles.backButton}
              >
                <Icon name="chevron-back" size={28} color="#333333" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {showBankOTP ? 'Verify OTP' : 
                 showUPIConfirm ? 'Confirm Payment' : 
                 showWalletOTP ? 'Verify OTP' : 
                 'Complete Payment'}
              </Text>
              <TouchableOpacity onPress={() => {
                setShowPaymentModal(false);
                setSelectedPlan(null);
                resetPaymentForm();
              }}>
                <Icon name="close" size={28} color="#333333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Selected Plan Summary */}
              {!showBankOTP && !showUPIConfirm && !showWalletOTP && (
                <View style={styles.planSummary}>
                  <Text style={styles.summaryLabel}>Selected Plan</Text>
                  <Text style={styles.summaryPlanName}>
                    {plans.find(p => p.id === selectedPlan)?.name}
                  </Text>
                  <Text style={styles.summaryPrice}>
                    {getPrice(plans.find(p => p.id === selectedPlan))} {getPeriod(plans.find(p => p.id === selectedPlan))}
                  </Text>
                  <View style={styles.trialBanner}>
                    <MaterialIcon name="gift" size={20} color="#45a578" />
                    <Text style={styles.trialText}>Instant Access After Payment</Text>
                  </View>
                </View>
              )}

              {/* Net Banking OTP Screen */}
              {showBankOTP && (
                <View style={styles.otpContainer}>
                  <View style={styles.otpIconContainer}>
                    <MaterialIcon name="bank" size={48} color="#9B59B6" />
                  </View>
                  <Text style={styles.otpTitle}>Enter OTP</Text>
                  <Text style={styles.otpSubtitle}>
                    We've sent a 6-digit OTP to your registered mobile number with {selectedBank}
                  </Text>
                  
                  <View style={styles.inputGroup}>
                    <TextInput
                      style={[styles.input, styles.otpInput]}
                      placeholder="Enter 6-digit OTP"
                      keyboardType="numeric"
                      value={bankOTP}
                      onChangeText={setBankOTP}
                      maxLength={6}
                      textAlign="center"
                    />
                  </View>

                  <TouchableOpacity style={styles.resendButton}>
                    <Text style={styles.resendText}>Resend OTP</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* UPI Confirmation Screen */}
              {showUPIConfirm && (
                <View style={styles.confirmContainer}>
                  <View style={styles.confirmIconContainer}>
                    <MaterialIcon name="cellphone" size={48} color="#27AE60" />
                  </View>
                  <Text style={styles.confirmTitle}>Confirm Payment</Text>
                  <Text style={styles.confirmSubtitle}>
                    Please check your UPI app to approve this payment
                  </Text>

                  <View style={styles.confirmDetails}>
                    <View style={styles.confirmRow}>
                      <Text style={styles.confirmLabel}>UPI ID</Text>
                      <Text style={styles.confirmValue}>{upiId}</Text>
                    </View>
                    <View style={styles.confirmRow}>
                      <Text style={styles.confirmLabel}>Amount</Text>
                      <Text style={styles.confirmValue}>
                        {getPrice(plans.find(p => p.id === selectedPlan))}
                      </Text>
                    </View>
                    <View style={styles.confirmRow}>
                      <Text style={styles.confirmLabel}>Plan</Text>
                      <Text style={styles.confirmValue}>
                        {plans.find(p => p.id === selectedPlan)?.name}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.upiInstructions}>
                    <MaterialIcon name="information" size={20} color="#4A90E2" />
                    <Text style={styles.upiInstructionsText}>
                      Open your UPI app and approve the payment request
                    </Text>
                  </View>
                </View>
              )}

              {/* Wallet OTP Screen */}
              {showWalletOTP && (
                <View style={styles.otpContainer}>
                  <View style={styles.otpIconContainer}>
                    <MaterialIcon name="wallet" size={48} color="#FF9800" />
                  </View>
                  <Text style={styles.otpTitle}>Enter OTP</Text>
                  <Text style={styles.otpSubtitle}>
                    We've sent a 6-digit OTP to your registered mobile number with {selectedWallet}
                  </Text>
                  
                  <View style={styles.inputGroup}>
                    <TextInput
                      style={[styles.input, styles.otpInput]}
                      placeholder="Enter 6-digit OTP"
                      keyboardType="numeric"
                      value={walletOTP}
                      onChangeText={setWalletOTP}
                      maxLength={6}
                      textAlign="center"
                    />
                  </View>

                  <TouchableOpacity style={styles.resendButton}>
                    <Text style={styles.resendText}>Resend OTP</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Payment Methods - Only show if not in OTP/Confirm screens */}
              {!showBankOTP && !showUPIConfirm && !showWalletOTP && (
                <>
                  <Text style={styles.paymentMethodsTitle}>Choose Payment Method</Text>

                  {/* Credit/Debit Card */}
                  <TouchableOpacity 
                    style={[styles.paymentMethod, selectedPaymentMethod === 'card' && styles.paymentMethodSelected]}
                    onPress={() => setSelectedPaymentMethod('card')}
                  >
                    <MaterialIcon name="credit-card" size={24} color="#4A90E2" />
                    <Text style={styles.paymentMethodText}>Credit / Debit Card</Text>
                    <Icon name="chevron-forward" size={20} color="#999999" />
                  </TouchableOpacity>

                  {selectedPaymentMethod === 'card' && (
                    <View style={styles.paymentForm}>
                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Card Number</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="1234 5678 9012 3456"
                          keyboardType="numeric"
                          value={cardNumber}
                          onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                          maxLength={19}
                        />
                      </View>

                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Cardholder Name</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="John Doe"
                          value={cardName}
                          onChangeText={setCardName}
                          autoCapitalize="words"
                        />
                      </View>

                      <View style={styles.inputRow}>
                        <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                          <Text style={styles.inputLabel}>Expiry Date</Text>
                          <TextInput
                            style={styles.input}
                            placeholder="MM/YY"
                            keyboardType="numeric"
                            value={expiryDate}
                            onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                            maxLength={5}
                          />
                        </View>

                        <View style={[styles.inputGroup, { flex: 1 }]}>
                          <Text style={styles.inputLabel}>CVV</Text>
                          <TextInput
                            style={styles.input}
                            placeholder="123"
                            keyboardType="numeric"
                            value={cvv}
                            onChangeText={setCvv}
                            maxLength={4}
                            secureTextEntry
                          />
                        </View>
                      </View>

                      <View style={styles.securePaymentBadge}>
                        <MaterialIcon name="shield-check" size={20} color="#45a578" />
                        <Text style={styles.securePaymentText}>
                          Your payment information is secure and encrypted
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* Net Banking */}
                  <TouchableOpacity 
                    style={[styles.paymentMethod, selectedPaymentMethod === 'netbanking' && styles.paymentMethodSelected]}
                    onPress={() => setSelectedPaymentMethod('netbanking')}
                  >
                    <MaterialIcon name="bank" size={24} color="#9B59B6" />
                    <Text style={styles.paymentMethodText}>Net Banking</Text>
                    <Icon name="chevron-forward" size={20} color="#999999" />
                  </TouchableOpacity>

                  {selectedPaymentMethod === 'netbanking' && (
                    <View style={styles.paymentForm}>
                      <Text style={styles.inputLabel}>Select Your Bank</Text>
                      <ScrollView style={styles.bankList} nestedScrollEnabled>
                        {banks.map((bank, index) => (
                          <TouchableOpacity
                            key={index}
                            style={[styles.bankItem, selectedBank === bank && styles.bankItemSelected]}
                            onPress={() => setSelectedBank(bank)}
                          >
                            <MaterialIcon name="bank" size={20} color={selectedBank === bank ? '#45a578' : '#666666'} />
                            <Text style={[styles.bankName, selectedBank === bank && styles.bankNameSelected]}>
                              {bank}
                            </Text>
                            {selectedBank === bank && (
                              <Icon name="checkmark-circle" size={20} color="#45a578" />
                            )}
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}

                  {/* UPI */}
                  <TouchableOpacity 
                    style={[styles.paymentMethod, selectedPaymentMethod === 'upi' && styles.paymentMethodSelected]}
                    onPress={() => setSelectedPaymentMethod('upi')}
                  >
                    <MaterialIcon name="cellphone" size={24} color="#27AE60" />
                    <Text style={styles.paymentMethodText}>UPI</Text>
                    <Icon name="chevron-forward" size={20} color="#999999" />
                  </TouchableOpacity>

                  {selectedPaymentMethod === 'upi' && (
                    <View style={styles.paymentForm}>
                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>UPI ID</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="yourname@upi"
                          value={upiId}
                          onChangeText={setUpiId}
                          keyboardType="email-address"
                          autoCapitalize="none"
                        />
                      </View>
                      <View style={styles.upiInfo}>
                        <MaterialIcon name="information" size={18} color="#4A90E2" />
                        <Text style={styles.upiInfoText}>
                          Enter your UPI ID (e.g., yourname@paytm, yourname@phonepe)
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* Digital Wallets */}
                  <TouchableOpacity 
                    style={[styles.paymentMethod, selectedPaymentMethod === 'wallet' && styles.paymentMethodSelected]}
                    onPress={() => setSelectedPaymentMethod('wallet')}
                  >
                    <MaterialIcon name="wallet" size={24} color="#FF9800" />
                    <Text style={styles.paymentMethodText}>Digital Wallets</Text>
                    <Icon name="chevron-forward" size={20} color="#999999" />
                  </TouchableOpacity>

                  {selectedPaymentMethod === 'wallet' && (
                    <View style={styles.paymentForm}>
                      <Text style={styles.inputLabel}>Select Wallet</Text>
                      <View style={styles.walletGrid}>
                        {wallets.map((wallet, index) => (
                          <TouchableOpacity
                            key={index}
                            style={[styles.walletItem, selectedWallet === wallet && styles.walletItemSelected]}
                            onPress={() => setSelectedWallet(wallet)}
                          >
                            <MaterialIcon 
                              name="wallet" 
                              size={24} 
                              color={selectedWallet === wallet ? '#45a578' : '#666666'} 
                            />
                            <Text style={[styles.walletName, selectedWallet === wallet && styles.walletNameSelected]}>
                              {wallet}
                            </Text>
                            {selectedWallet === wallet && (
                              <View style={styles.walletCheckmark}>
                                <Icon name="checkmark" size={12} color="#FFFFFF" />
                              </View>
                            )}
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  )}

                  {/* Payment Info */}
                  <View style={styles.trialInfoBox}>
                    <MaterialIcon name="information" size={20} color="#4A90E2" />
                    <Text style={styles.trialInfoText}>
                      You will be charged {getPrice(plans.find(p => p.id === selectedPlan))} {getPeriod(plans.find(p => p.id === selectedPlan))} immediately after payment. Cancel anytime from Settings.
                    </Text>
                  </View>

                  {/* Terms */}
                  <Text style={styles.termsText}>
                    By continuing, you agree to our Terms of Service and Privacy Policy. 
                    Your payment method will be saved securely for future billing.
                  </Text>
                </>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowPaymentModal(false);
                  setSelectedPlan(null);
                  resetPaymentForm();
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                activeOpacity={0.8}
                disabled={!isPaymentFormValid() || isProcessing}
                onPress={handleStartFreeTrial}
              >
                <LinearGradient
                  colors={isPaymentFormValid() && !isProcessing ? ['#00CED1', '#45a578', '#90EE90'] : ['#CCCCCC', '#CCCCCC', '#CCCCCC']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.proceedButton}
                >
                  <Text style={styles.proceedButtonText}>
                    {getPaymentButtonText()}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Payment Processing Modal */}
      <Modal
        visible={showPaymentProcessing}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.processingOverlay}>
          <View style={styles.processingContent}>
            <MaterialIcon name="loading" size={60} color="#45a578" />
            <Text style={styles.processingTitle}>Processing Payment...</Text>
            <Text style={styles.processingText}>Please wait while we process your payment</Text>
          </View>
        </View>
      </Modal>

      {/* Success Modal - Enhanced */}
      <Modal
        visible={showSuccessModal}
        animationType="fade"
        transparent={true}
        onRequestClose={handleSuccessClose}
      >
        <View style={styles.successModalOverlay}>
          <ScrollView 
            contentContainerStyle={styles.successScrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.successModalContent}>
              {/* Animated Success Icon */}
              <View style={styles.successIconContainer}>
                <View style={styles.successIconCircle}>
                  <MaterialIcon name="check-circle" size={100} color="#45a578" />
                </View>
              </View>
              
              {/* Success Title */}
              <Text style={styles.successTitle}>Payment Successful!</Text>
              <Text style={styles.successSubtitle}>
                Welcome to {plans.find(p => p.id === selectedPlan)?.name}
              </Text>

              {/* Subscription Active Card */}
              <View style={styles.successTrialCard}>
                <View style={styles.successTrialHeader}>
                  <MaterialIcon name="check-circle" size={28} color="#45a578" />
                  <Text style={styles.successTrialTitle}>Subscription Active</Text>
                </View>
                <Text style={styles.successTrialText}>
                  Your {plans.find(p => p.id === selectedPlan)?.name} plan is now active. Enjoy full access to all features.
                </Text>
                <View style={styles.successTrialDates}>
                  <View style={styles.successDateItem}>
                    <Text style={styles.successDateLabel}>Start Date</Text>
                    <Text style={styles.successDateValue}>
                      {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </Text>
                  </View>
                  <View style={styles.successDateDivider} />
                  <View style={styles.successDateItem}>
                    <Text style={styles.successDateLabel}>Next Billing</Text>
                    <Text style={styles.successDateValue}>
                      {new Date(Date.now() + (billingCycle === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </Text>
                  </View>
                </View>
              </View>

              {/* What's Included */}
              <View style={styles.successFeaturesCard}>
                <Text style={styles.successFeaturesTitle}>What's Included:</Text>
                <View style={styles.successFeatures}>
                  {plans.find(p => p.id === selectedPlan)?.features.filter(f => f.included).slice(0, 4).map((feature, index) => (
                    <View key={index} style={styles.successFeatureItem}>
                      <View style={styles.successFeatureIconContainer}>
                        <Icon name="checkmark" size={16} color="#FFFFFF" />
                      </View>
                      <Text style={styles.successFeatureText}>{feature.text}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Payment Details */}
              <View style={styles.successPaymentDetails}>
                <View style={styles.successPaymentRow}>
                  <Text style={styles.successPaymentLabel}>Payment Method</Text>
                  <Text style={styles.successPaymentValue}>
                    {selectedPaymentMethod === 'card' ? 'Card' :
                     selectedPaymentMethod === 'netbanking' ? 'Net Banking' :
                     selectedPaymentMethod === 'upi' ? 'UPI' :
                     selectedPaymentMethod === 'wallet' ? 'Wallet' : 'Saved'}
                  </Text>
                </View>
                <View style={styles.successPaymentRow}>
                  <Text style={styles.successPaymentLabel}>Plan</Text>
                  <Text style={styles.successPaymentValue}>
                    {plans.find(p => p.id === selectedPlan)?.name}
                  </Text>
                </View>
                <View style={styles.successPaymentRow}>
                  <Text style={styles.successPaymentLabel}>Amount</Text>
                  <Text style={styles.successPaymentValue}>
                    {getPrice(plans.find(p => p.id === selectedPlan))} {getPeriod(plans.find(p => p.id === selectedPlan))}
                  </Text>
                </View>
              </View>

              {/* Important Note */}
              <View style={styles.successNote}>
                <MaterialIcon name="information" size={20} color="#4A90E2" />
                <Text style={styles.successNoteText}>
                  You can manage or cancel your subscription anytime from Settings.
                </Text>
              </View>

              {/* Action Buttons */}
              <TouchableOpacity 
                style={styles.successButton}
                onPress={handleSuccessClose}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#00CED1', '#45a578', '#90EE90']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.successButtonGradient}
                >
                  <Text style={styles.successButtonText}>Start Exploring Premium</Text>
                  <Icon name="arrow-forward" size={20} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.successSecondaryButton}
                onPress={handleSuccessClose}
              >
                <Text style={styles.successSecondaryButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default SubscriptionPlanScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 40,
    paddingBottom: 20,
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

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    flex: 1,
    textAlign: 'center',
  },

  compareButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    flex: 1,
  },

  // ── FREE TRIAL HERO BANNER ──────────────────────────────────────────────────
  trialHeroBanner: {
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 4,
    borderRadius: 20,
    padding: 24,
  },
  trialHeroGiftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  trialHeroBadge: {
    backgroundColor: '#FFB84D',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  trialHeroBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1a1a2e',
    letterSpacing: 0.8,
  },
  trialHeroTitle: {
    fontSize: isTablet ? 28 : 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  trialHeroSubtitle: {
    fontSize: isTablet ? 14 : 13,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 20,
    marginBottom: 16,
  },
  trialHeroPerks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  trialHeroPerk: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  trialHeroPerkText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  trialHeroFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 12,
  },
  trialHeroFooterText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },

  currentPlanCard: {    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFB84D',
  },

  currentPlanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  currentPlanLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  currentPlanInfo: {
    marginLeft: 12,
  },

  currentPlanLabel: {
    fontSize: 11,
    color: '#666666',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  currentPlanName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
  },

  usageContainer: {
    marginBottom: 16,
  },

  usageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  usageLabel: {
    fontSize: 13,
    color: '#666666',
  },

  usageCount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333333',
  },

  progressBar: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#45a578',
    borderRadius: 4,
  },

  renewText: {
    fontSize: 11,
    color: '#999999',
  },

  upgradePrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },

  upgradePromptText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#45a578',
  },

  billingToggleContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },

  billingLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 12,
  },

  billingToggle: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  billingOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    position: 'relative',
  },

  billingOptionActive: {
    backgroundColor: '#45a578',
  },

  billingOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },

  billingOptionTextActive: {
    color: '#FFFFFF',
  },

  saveBadge: {
    position: 'absolute',
    top: -8,
    right: 8,
    backgroundColor: '#27AE60',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },

  saveBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#333333',
    marginHorizontal: 20,
    marginBottom: 20,
  },

  planCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    position: 'relative',
  },

  planCardCurrent: {
    borderColor: '#45a578',
  },

  planCardRecommended: {
    borderColor: '#E0E0E0',
  },

  badge: {
    position: 'absolute',
    top: -12,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },

  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  planIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  planHeaderInfo: {
    flex: 1,
  },

  planName: {
    fontSize: 19,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 4,
  },

  planTagline: {
    fontSize: 13,
    color: '#666666',
  },

  currentBadge: {
    backgroundColor: '#45a578',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },

  currentBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  priceSection: {
    marginBottom: 20,
  },

  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },

  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    marginRight: 8,
  },

  period: {
    fontSize: 14,
    color: '#666666',
  },

  savingsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 4,
  },

  savingsText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#45a578',
  },

  featuresContainer: {
    marginBottom: 20,
  },

  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  featureText: {
    fontSize: 14,
    color: '#333333',
    marginLeft: 12,
    flex: 1,
  },

  featureTextDisabled: {
    color: '#CCCCCC',
  },

  subscribeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },

  subscribeButtonSelected: {
    backgroundColor: '#45a578',
  },

  subscribeButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#666666',
  },

  subscribeButtonTextSelected: {
    color: '#FFFFFF',
  },

  currentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },

  currentButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#45a578',
  },

  guaranteeCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },

  guaranteeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },

  guaranteeText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
  },

  benefitsSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
  },

  benefitsTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 24,
  },

  benefitItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },

  benefitIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  benefitContent: {
    flex: 1,
  },

  benefitTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 6,
  },

  benefitDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 22,
  },

  testimonialsSection: {
    marginBottom: 20,
  },

  testimonialsTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 16,
    paddingHorizontal: 20,
  },

  testimonialsList: {
    paddingHorizontal: 20,
  },

  testimonialCardWrapper: {
    width: Dimensions.get('window').width - 40,
    paddingRight: 0,
  },

  testimonialCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 0,
  },

  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
  },

  dotActive: {
    backgroundColor: '#45a578',
    width: 24,
  },

  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  testimonialAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#45a578',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  testimonialInitial: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  testimonialInfo: {
    flex: 1,
  },

  testimonialName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 2,
  },

  testimonialRole: {
    fontSize: 13,
    color: '#666666',
  },

  ratingContainer: {
    flexDirection: 'row',
    gap: 2,
  },

  testimonialText: {
    fontSize: 14,
    color: '#444444',
    lineHeight: 22,
    fontStyle: 'italic',
  },

  faqSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
  },

  faqTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 20,
  },

  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingVertical: 16,
  },

  faqQuestionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  faqQuestion: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginRight: 12,
  },

  faqAnswer: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 22,
    marginTop: 12,
  },

  supportCard: {
    backgroundColor: '#E8F5E9',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },

  supportTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    marginTop: 12,
    marginBottom: 8,
  },

  supportText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 16,
  },

  contactInfoContainer: {
    width: '100%',
    marginBottom: 16,
    gap: 12,
  },

  contactInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 12,
  },

  contactInfoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
  },

  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },

  supportButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#45a578',
  },

  bottomPadding: {
    height: 40,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },

  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
  },

  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  planSummary: {
    backgroundColor: '#F9F9F9',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },

  summaryLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  summaryPlanName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },

  summaryPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#45a578',
    marginBottom: 12,
  },

  trialBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },

  trialText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#45a578',
  },

  paymentMethodsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 16,
  },

  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },

  paymentMethodSelected: {
    borderColor: '#45a578',
    backgroundColor: '#E8F5E9',
  },

  paymentMethodText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
    marginLeft: 12,
  },

  paymentForm: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  inputGroup: {
    marginBottom: 16,
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 8,
  },

  input: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#333333',
  },

  inputRow: {
    flexDirection: 'row',
  },

  securePaymentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },

  securePaymentText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#45a578',
  },

  bankList: {
    maxHeight: 250,
  },

  bankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#F9F9F9',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  bankItemSelected: {
    backgroundColor: '#E8F5E9',
    borderColor: '#45a578',
  },

  bankName: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
    marginLeft: 12,
  },

  bankNameSelected: {
    fontWeight: '600',
    color: '#45a578',
  },

  upiInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },

  upiInfoText: {
    flex: 1,
    fontSize: 12,
    color: '#4A90E2',
  },

  walletGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  walletItem: {
    width: '47%',
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    position: 'relative',
  },

  walletItemSelected: {
    backgroundColor: '#E8F5E9',
    borderColor: '#45a578',
  },

  walletName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333333',
    marginTop: 8,
  },

  walletNameSelected: {
    color: '#45a578',
  },

  walletCheckmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#45a578',
    justifyContent: 'center',
    alignItems: 'center',
  },

  trialInfoBox: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },

  trialInfoText: {
    flex: 1,
    fontSize: 12,
    color: '#4A90E2',
    lineHeight: 20,
  },

  otpContainer: {
    padding: 20,
    alignItems: 'center',
  },

  otpIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },

  otpTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 12,
  },

  otpSubtitle: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },

  otpInput: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 8,
  },

  resendButton: {
    marginTop: 16,
  },

  resendText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#45a578',
  },

  confirmContainer: {
    padding: 20,
    alignItems: 'center',
  },

  confirmIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },

  confirmTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 12,
  },

  confirmSubtitle: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },

  confirmDetails: {
    width: '100%',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },

  confirmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  confirmLabel: {
    fontSize: 13,
    color: '#666666',
  },

  confirmValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333333',
  },

  upiInstructions: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    width: '100%',
  },

  upiInstructionsText: {
    flex: 1,
    fontSize: 12,
    color: '#4A90E2',
    lineHeight: 20,
  },

  processingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  processingContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    width: '80%',
    maxWidth: 300,
  },

  processingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginTop: 20,
    marginBottom: 8,
  },

  processingText: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
  },

  termsText: {
    fontSize: 12,
    color: '#999999',
    lineHeight: 18,
    marginTop: 16,
    textAlign: 'center',
  },

  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 12,
  },

  cancelButton: {
    flex: 0.6,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666666',
    textAlign: 'center',
  },

  proceedButton: {
    flex: 1.4,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  proceedButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    paddingHorizontal: 8,
  },

  // Success Modal Styles
  successModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    padding: 20,
  },

  successScrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  successModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
  },

  successIconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },

  successIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  successTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
  },

  successSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#45a578',
    textAlign: 'center',
    marginBottom: 24,
  },

  successTrialCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },

  successTrialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },

  successTrialTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
  },

  successTrialText: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 22,
    marginBottom: 16,
  },

  successTrialDates: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },

  successDateItem: {
    flex: 1,
    alignItems: 'center',
  },

  successDateLabel: {
    fontSize: 11,
    color: '#666666',
    marginBottom: 6,
  },

  successDateValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333333',
  },

  successDateDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
  },

  successFeaturesCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },

  successFeaturesTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 16,
  },

  successFeatures: {
    gap: 12,
  },

  successFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  successFeatureIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#45a578',
    justifyContent: 'center',
    alignItems: 'center',
  },

  successFeatureText: {
    flex: 1,
    fontSize: 13,
    color: '#333333',
    fontWeight: '500',
  },

  successPaymentDetails: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },

  successPaymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  successPaymentLabel: {
    fontSize: 13,
    color: '#666666',
  },

  successPaymentValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'right',
    flex: 1,
    marginLeft: 12,
  },

  successNote: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },

  successNoteText: {
    flex: 1,
    fontSize: 12,
    color: '#4A90E2',
    lineHeight: 20,
  },

  successButton: {
    marginBottom: 12,
  },

  successButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },

  successButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  successSecondaryButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },

  successSecondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
});
