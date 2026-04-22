/**
 * Settings Screen - Full Functionality
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Switch,
  Modal,
  TextInput,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import DatePicker from 'react-native-date-picker';
import { BASE_URL, fetchAvatars, fetchBeyondSchool, fetchProfile, saveProfile, addChild as addChildApi, sendPhoneChangeOTP, verifyPhoneChange, updatePhone, updateChild, deleteChild, switchActiveChild, updateParentEmail, uploadAvatar, fetchSubjects } from '../api';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;
const isSmallDevice = width < 375;

const SettingsScreen = ({ onBack, onNavigate, userData, onUpdateUserData }) => {
  // Derive parent email and child from userData
  const child = userData?.children?.[0] || null;

  // Helper: resolve child.avatar to an image source
  // Handles: local preset IDs (A1-A6), DB _id strings (resolved after API load), URI/base64 strings
  const resolveChildAvatar = (avatar) => {
    if (!avatar) return null;
    const localMap = { A1: require('../assets/images/A1.jpeg'), A2: require('../assets/images/A2.jpeg'), A3: require('../assets/images/A3.jpeg'), A4: require('../assets/images/A4.jpeg'), A5: require('../assets/images/A5.jpeg'), A6: require('../assets/images/A6.jpeg') };
    if (localMap[avatar]) return localMap[avatar]; // local preset
    if (avatar.startsWith('data:') || avatar.startsWith('http') || avatar.startsWith('file') || avatar.startsWith('/')) return { uri: avatar };
    return null; // DB _id — resolved later after API loads
  };

  // User Profile State
  const [userName, setUserName] = useState(child?.name || 'Parent');
  const [userEmail, setUserEmail] = useState(userData?.email || 'parent@example.com');
  const [userAvatar, setUserAvatar] = useState(() => resolveChildAvatar(child?.avatar));
  const [avatarType, setAvatarType] = useState(child?.avatar ? 'image' : 'initial');
  
  // Notification Settings
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [dailyReminders, setDailyReminders] = useState(true);
  
  // Modals
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showRateUs, setShowRateUs] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showAddChild, setShowAddChild] = useState(false);

  // Add Child form fields
  const [newChildName, setNewChildName] = useState('');
  const [newChildDOB, setNewChildDOB] = useState('');
  const [newChildGrade, setNewChildGrade] = useState('');
  const [newChildBoard, setNewChildBoard] = useState('');
  const [newChildAvatar, setNewChildAvatar] = useState('');
  const [newChildSubjectLevels, setNewChildSubjectLevels] = useState({});
  const [newChildTopics, setNewChildTopics] = useState([]);
  const [showNewGradeDropdown, setShowNewGradeDropdown] = useState(false);
  const [showNewBoardDropdown, setShowNewBoardDropdown] = useState(false);
  const [showNewDatePicker, setShowNewDatePicker] = useState(false);
  const [newSelectedDate, setNewSelectedDate] = useState(new Date(2015, 0, 1));
  const [showEditDatePicker, setShowEditDatePicker] = useState(false);
  const [editSelectedDate, setEditSelectedDate] = useState(new Date(2015, 0, 1));
  
  // Edit Profile Fields
  const [editName, setEditName] = useState(userName);
  const [editEmail, setEditEmail] = useState(userEmail);
  const [editAvatar, setEditAvatar] = useState(() => resolveChildAvatar(child?.avatar));
  const [editAvatarType, setEditAvatarType] = useState(child?.avatar ? 'image' : 'initial');

  // Child edit fields (from PersonalSetupScreen)
  const [editChildName, setEditChildName] = useState(child?.name || '');
  const [editChildDOB, setEditChildDOB] = useState(child?.dateOfBirth || '');
  const [editChildGrade, setEditChildGrade] = useState(child?.grade || '');
  const [editChildBoard, setEditChildBoard] = useState(child?.educationBoard || '');
  const [showGradeDropdown, setShowGradeDropdown] = useState(false);
  const [showBoardDropdown, setShowBoardDropdown] = useState(false);
  const [editChildTopics, setEditChildTopics] = useState(child?.topics || []);
  const [editSubjectLevels, setEditSubjectLevels] = useState(child?.subjectLevels || {});

  // Phone change flow
  const [newPhone, setNewPhone] = useState(userData?.phoneNumber || userData?.phone || '');
  const [newCountryCode, setNewCountryCode] = useState(userData?.countryCode || '+91');

  // Core subjects loaded from admin panel (Learning Subjects)
  const [coreAreas, setCoreAreas] = useState([
    { id: 'mathematics', name: 'Mathematics', icon: 'calculator-variant-outline' },
    { id: 'science', name: 'Science', icon: 'flask-outline' },
    { id: 'english', name: 'English', icon: 'book-open-outline' },
    { id: 'social-studies', name: 'Social Studies', icon: 'earth' },
  ]);
  
  useEffect(() => {
    fetchSubjects()
      .then(data => {
        if (data.length > 0) {
          // Filter to show only non-premium (core) subjects
          const coreSubjects = data.filter(s => s.type !== 'premium' && !s.isPremium);
          setCoreAreas(coreSubjects.map(s => ({
            id: s._id || s.id,
            name: s.name || s.title,
            icon: s.rnIcon || 'book-open-outline',
            imageUrl: s.imageUrl || null,
          })));
        }
      })
      .catch(() => {});
  }, []);
  
  const levels = ['Basic', 'Intermediate', 'Advanced'];

  const grades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4'];
  const boards = ['CBSE', 'ICSE', 'State Board', 'IB', 'Cambridge', 'Other'];

  // Beyond School interest options (mirrors PersonalSetupScreen)
  const [exploratoryAreas, setExploratoryAreas] = useState([
    { _id: 'ai',            name: 'Artificial Intelligence', rnIcon: 'brain' },
    { _id: 'financial',     name: 'Financial Literacy',      rnIcon: 'cash-multiple' },
    { _id: 'safety',        name: 'Sex & Safety',            rnIcon: 'shield-check' },
  ]);

  useEffect(() => {
    fetchBeyondSchool()
      .then(data => { if (data.length > 0) setExploratoryAreas(data); })
      .catch(() => {});
  }, []);
  
  // Rating
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  // Avatar options — loaded from admin panel API, fallback to local
  const fallbackAvatars = [
    { id: 'A1', image: require('../assets/images/A1.jpeg'), uri: null },
    { id: 'A2', image: require('../assets/images/A2.jpeg'), uri: null },
    { id: 'A3', image: require('../assets/images/A3.jpeg'), uri: null },
    { id: 'A4', image: require('../assets/images/A4.jpeg'), uri: null },
    { id: 'A5', image: require('../assets/images/A5.jpeg'), uri: null },
    { id: 'A6', image: require('../assets/images/A6.jpeg'), uri: null },
  ];
  const [avatarImages, setAvatarImages] = useState(fallbackAvatars);

  useEffect(() => {
    fetchAvatars()
      .then(data => {
        if (data.length > 0) {
          const mapped = data.map(a => ({ id: a._id, image: null, uri: a.image }));
          setAvatarImages(mapped);
          // If child's avatar is a DB _id, resolve it now
          if (child?.avatar) {
            const found = mapped.find(a => a.id === child.avatar);
            if (found?.uri) {
              const src = { uri: found.uri };
              setUserAvatar(src);
              setEditAvatar(src);
              setAvatarType('image');
              setEditAvatarType('image');
            }
          }
        }
      })
      .catch(() => {});
  }, []);

  // Resolve child's avatar ID to actual image source
  const resolveAvatar = (avatarId) => {
    if (!avatarId) return null;
    const found = avatarImages.find(a => a.id === avatarId);
    return found ? found.image : null;
  };

  const handleSaveProfile = async () => {
    // Resolve updated avatar value
    let updatedAvatar = child?.avatar;
    if (editAvatarType === 'image' && editAvatar) {
      const matchedApiAvatar = avatarImages.find(a => a.uri && editAvatar?.uri === a.uri);
      if (matchedApiAvatar) {
        updatedAvatar = matchedApiAvatar.id; // DB _id from admin panel
      } else if (editAvatar?.uri) {
        updatedAvatar = editAvatar.uri; // custom uploaded photo
      }
    }

    // Only save subjects that were actually selected (have a level set)
    const finalSubjectLevels = { ...editSubjectLevels };

    const updatedChild = child ? {
      ...child,
      name: editChildName,
      dateOfBirth: editChildDOB,
      grade: editChildGrade,
      educationBoard: editChildBoard,
      topics: editChildTopics,
      subjectLevels: finalSubjectLevels,
      avatar: updatedAvatar,
    } : null;

    // 1. Update local state immediately
    setUserName(editChildName);
    setUserEmail(editEmail);
    setUserAvatar(editAvatar);
    setAvatarType(editAvatarType);
    if (onUpdateUserData && updatedChild) {
      onUpdateUserData({ email: editEmail, children: [updatedChild] });
    }

    // 2. Sync to backend
    if (userData?.token) {
      try {
        // If custom photo is a local file URI, upload it first to get a server URL
        let avatarForBackend = updatedAvatar?.startsWith('data:') ? 'custom' : updatedAvatar;
        if (
          updatedAvatar &&
          !updatedAvatar.startsWith('data:') &&
          !updatedAvatar.startsWith('http') &&
          (updatedAvatar.startsWith('file://') || updatedAvatar.startsWith('/'))
        ) {
          try {
            const uploaded = await uploadAvatar(userData.token, updatedAvatar);
            avatarForBackend = uploaded.url; // server URL accessible by admin panel
            // Also update local display to use server URL
            const serverSrc = { uri: uploaded.url };
            setUserAvatar(serverSrc);
            setEditAvatar(serverSrc);
            if (onUpdateUserData && updatedChild) {
              onUpdateUserData({ email: editEmail, children: [{ ...updatedChild, avatar: uploaded.url }] });
            }
          } catch (uploadErr) {
            console.error('[Settings] photo upload failed:', uploadErr.message);
          }
        }

        // Update email on parent record
        if (editEmail !== userData?.email) {
          await updateParentEmail(userData.token, editEmail);
        }
        // Update phone if changed
        const currentPhone = userData?.phoneNumber || userData?.phone || '';
        if (newPhone && (newPhone !== currentPhone || newCountryCode !== (userData?.countryCode || '+91'))) {
          await updatePhone(userData.token, newPhone, newCountryCode);
          if (onUpdateUserData) onUpdateUserData({ phoneNumber: newPhone, countryCode: newCountryCode });
        }
        // Update child record using its _id
        if (updatedChild?._id) {
          await updateChild(userData.token, updatedChild._id, {
            name: updatedChild.name,
            dateOfBirth: updatedChild.dateOfBirth,
            grade: updatedChild.grade,
            educationBoard: updatedChild.educationBoard,
            topics: updatedChild.topics,
            subjectLevels: updatedChild.subjectLevels,
            avatar: avatarForBackend,
          });
        }

        // Re-fetch full profile so app state matches what admin sees
        try {
          const freshProfile = await fetchProfile(userData.token);
          if (onUpdateUserData) {
            onUpdateUserData({ email: freshProfile.email, children: freshProfile.children });
          }
        } catch (refreshErr) {
          console.error('[Settings] profile refresh failed:', refreshErr.message);
        }
      } catch (err) {
        console.error('[Settings] sync failed:', err.message);
      }
    }

    setShowEditProfile(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleAddChild = async () => {
    if (!newChildName.trim() || !newChildDOB.trim() || !newChildGrade) {
      Alert.alert('Missing Info', 'Please fill in name, date of birth and grade.');
      return;
    }
    
    // Check if already at limit
    if (userData?.children && userData.children.length >= 3) {
      Alert.alert('Limit Reached', 'You can add a maximum of 3 children to your account.');
      return;
    }
    
    // Only save subjects that were actually selected (have a level set)
    const finalSubjectLevels = { ...newChildSubjectLevels };
    
    const newChild = {
      name: newChildName.trim(),
      dateOfBirth: newChildDOB.trim(),
      grade: newChildGrade,
      educationBoard: newChildBoard,
      avatar: newChildAvatar,
      topics: newChildTopics,
      subjectLevels: finalSubjectLevels,
    };

    // Save to backend first
    if (userData?.token) {
      try {
        const res = await addChildApi(userData.token, newChild);
        // Refresh full profile from backend to get the complete data with _id
        const fresh = await fetchProfile(userData.token);
        if (onUpdateUserData) onUpdateUserData({ children: fresh.children });
        
        setNewChildName('');
        setNewChildDOB('');
        setNewChildGrade('');
        setNewChildBoard('');
        setNewChildAvatar('');
        setNewChildSubjectLevels({});
        setNewChildTopics([]);
        setShowAddChild(false);
        Alert.alert('Success', `${newChild.name} has been added!`);
      } catch (e) {
        console.error('[Settings] addChild failed:', e.message);
        const errorMsg = e.response?.data?.message || e.message || 'Failed to add child. Please try again.';
        Alert.alert('Error', errorMsg);
      }
    } else {
      // No token - just update local state (shouldn't happen in normal flow)
      const updatedChildren = [...(userData?.children || []), newChild];
      if (onUpdateUserData) onUpdateUserData({ children: updatedChildren });
      
      setNewChildName('');
      setNewChildDOB('');
      setNewChildGrade('');
      setNewChildBoard('');
      setNewChildAvatar('');
      setNewChildSubjectLevels({});
      setNewChildTopics([]);
      setShowAddChild(false);
      Alert.alert('Success', `${newChild.name} has been added!`);
    }
  };

  const handleDeleteChild = (c) => {
    Alert.alert(
      'Remove Child',
      `Remove ${c.name} from your account?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const updated = (userData?.children || []).filter(ch => ch._id !== c._id);
            if (onUpdateUserData) onUpdateUserData({ children: updated });
            if (userData?.token && c._id) {
              try { await deleteChild(userData.token, c._id); } catch (e) { console.error('[Settings] deleteChild:', e.message); }
            }
          },
        },
      ]
    );
  };

  const handleSelectAvatar = (avatar, type) => {    setEditAvatar(avatar);
    setEditAvatarType(type);
    setShowAvatarPicker(false);
  };

  const handleUploadImage = () => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.8, selectionLimit: 1 },
      (response) => {
        if (response.didCancel || response.errorCode) return;
        const asset = response.assets?.[0];
        if (asset?.uri) {
          setEditAvatar({ uri: asset.uri });
          setEditAvatarType('image');
          setShowAvatarPicker(false);
        }
      }
    );
  };

  const renderAvatar = (avatar, type, size = 60) => {
    if (type === 'image' && avatar) {
      return (
        <Image
          source={avatar}
          style={[styles.profileAvatar, { width: size, height: size, borderRadius: size / 2 }]}
          resizeMode="cover"
        />
      );
    } else {
      return (
        <View style={[styles.profileAvatar, { width: size, height: size, borderRadius: size / 2 }]}>
          <Text style={[styles.profileInitial, { fontSize: size * 0.4 }]}>{userName.charAt(0)}</Text>
        </View>
      );
    }
  };

  const handleSubmitRating = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating');
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
          phone: userData?.phoneNumber ? `${userData.countryCode || ''}${userData.phoneNumber}` : (userData?.phone ? `${userData.countryCode || ''}${userData.phone}` : ''),
        }),
      });
    } catch (e) {
      console.error('[Rating] submit failed:', e.message);
    }
    Alert.alert('Thank You!', 'Thank you for your feedback! We appreciate your support.');
    setShowRateUs(false);
    setRating(0);
    setFeedback('');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Icon name="chevron-back" size={28} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── PROFILE HERO CARD ── */}
        <View style={styles.profileHeroCard}>
          <View style={styles.profileHeroTop}>
            {renderAvatar(userAvatar, avatarType, 72)}
            <View style={styles.profileHeroInfo}>
              <Text style={styles.profileHeroName}>
                {userData?.children?.[0]?.name || userName}
              </Text>
              <Text style={styles.profileHeroPhone}>
                {userData?.countryCode || ''} {userData?.phoneNumber || userData?.phone || '—'}
              </Text>
              <Text style={styles.profileHeroEmail} numberOfLines={1}>{userEmail}</Text>
            </View>
            <TouchableOpacity
              style={styles.profileHeroEdit}
              onPress={() => {
                setEditName(userName);
                setEditEmail(userEmail);
                setEditAvatar(userAvatar);
                setEditAvatarType(avatarType);
                setShowEditProfile(true);
              }}
            >
              <MaterialIcon name="pencil-outline" size={18} color="#45a578" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── CHILDREN SECTION ── */}
        <View style={styles.childrenSection}>
          <View style={styles.childrenSectionHeader}>
            <Text style={styles.childrenSectionTitle}>My Children</Text>
            {(!userData?.children || userData.children.length < 3) && (
              <TouchableOpacity style={styles.addChildBtn} onPress={() => setShowAddChild(true)}>
                <MaterialIcon name="plus" size={16} color="#45a578" />
                <Text style={styles.addChildBtnText}>Add Child</Text>
              </TouchableOpacity>
            )}
          </View>

          {userData?.children?.length > 0 ? (
            userData.children.map((c, i) => {
              const isActive = i === 0;
              const avatarSrc = (() => {
                if (!c.avatar) return null;
                const local = { A1: require('../assets/images/A1.jpeg'), A2: require('../assets/images/A2.jpeg'), A3: require('../assets/images/A3.jpeg'), A4: require('../assets/images/A4.jpeg'), A5: require('../assets/images/A5.jpeg'), A6: require('../assets/images/A6.jpeg') };
                if (local[c.avatar]) return local[c.avatar];
                const apiMatch = avatarImages.find(a => a.id === c.avatar);
                if (apiMatch?.uri) return { uri: apiMatch.uri };
                if (c.avatar.startsWith('http') || c.avatar.startsWith('file')) return { uri: c.avatar };
                return null;
              })();
              const resolvedTopics = (c.topics || [])
                .map(t => exploratoryAreas.find(a => a._id === t || a.name === t)?.name)
                .filter(Boolean);

              return (
                <TouchableOpacity
                  key={c._id || i}
                  activeOpacity={isActive ? 1 : 0.7}
                  style={[styles.childCard, isActive && styles.childCardActive]}
                  onPress={() => {
                    if (isActive) return;
                    Alert.alert(
                      'Switch Account',
                      `Switch to ${c.name}?`,
                      [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Switch',
                          onPress: async () => {
                            const all = userData?.children || [];
                            const idx = all.findIndex(ch => (ch._id || ch.name) === (c._id || c.name));
                            const reordered = [all[idx], ...all.filter((_, j) => j !== idx)];
                            if (onUpdateUserData) onUpdateUserData({ children: reordered });
                            if (userData?.token && c._id) {
                              try { await switchActiveChild(userData.token, c._id); }
                              catch (e) { console.error('[Settings] switchActiveChild:', e.message); }
                            }
                          },
                        },
                      ]
                    );
                  }}
                >
                  {/* Active badge */}
                  {isActive && (
                    <View style={styles.activeBadgeRow}>
                      <View style={styles.activeBadge}>
                        <MaterialIcon name="check-circle" size={12} color="#45a578" />
                        <Text style={styles.activeBadgeText}>Active Account</Text>
                      </View>
                    </View>
                  )}

                  {/* Avatar + Name row */}
                  <View style={styles.childCardTop}>
                    <View style={styles.childAvatarWrap}>
                      {avatarSrc ? (
                        <Image source={avatarSrc} style={styles.childAvatar} resizeMode="cover" />
                      ) : (
                        <View style={[styles.childAvatar, styles.childAvatarFallback]}>
                          <Text style={styles.childAvatarInitial}>{c.name?.charAt(0)?.toUpperCase()}</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.childCardInfo}>
                      <Text style={styles.childCardName}>{c.name}</Text>
                      <Text style={styles.childCardSub}>{c.grade}{c.educationBoard ? ` · ${c.educationBoard}` : ''}</Text>
                      {c.dateOfBirth ? <Text style={styles.childCardDob}>DOB: {c.dateOfBirth}</Text> : null}
                    </View>
                    {/* Actions — only delete for non-active */}
                    <View style={styles.childCardActions}>
                      {!isActive && (
                        <View style={styles.switchHintBadge}>
                          <MaterialIcon name="gesture-tap" size={13} color="#45a578" />
                          <Text style={styles.switchHintText}>Tap to switch</Text>
                        </View>
                      )}
                      {!isActive && (
                        <TouchableOpacity
                          style={[styles.childActionBtn, styles.childActionBtnDelete]}
                          onPress={(e) => { e.stopPropagation?.(); handleDeleteChild(c); }}
                        >
                          <MaterialIcon name="trash-can-outline" size={20} color="#EF4444" />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>

                  {/* Subject levels */}
                  {c.subjectLevels && Object.keys(c.subjectLevels).length > 0 && (
                    <View style={styles.childCardChipsRow}>
                      {Object.entries(c.subjectLevels).map(([sid, lvl]) => {
                        const name = coreAreas.find(a => a.id === sid)?.name || sid;
                        return (
                          <View key={sid} style={styles.childSubjectChip}>
                            <Text style={styles.childSubjectChipName}>{name}</Text>
                            <Text style={styles.childSubjectChipLevel}>{lvl}</Text>
                          </View>
                        );
                      })}
                    </View>
                  )}

                  {/* Beyond school */}
                  {resolvedTopics.length > 0 && (
                    <View style={styles.childCardChipsRow}>
                      {resolvedTopics.map((t, ti) => (
                        <View key={ti} style={styles.childTopicChip}>
                          <MaterialIcon name="star-four-points-small" size={11} color="#3B82F6" />
                          <Text style={styles.childTopicChipText}>{t}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })
          ) : (
            <TouchableOpacity style={styles.noChildCard} onPress={() => setShowAddChild(true)}>
              <MaterialIcon name="account-child-circle-outline" size={36} color="#D1D5DB" />
              <Text style={styles.noChildText}>No children added yet</Text>
              <Text style={styles.noChildHint}>Tap to add your first child</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── ACCOUNT SECTION ──
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => onNavigate && onNavigate('SubscriptionPlan')}
          >
            <MaterialIcon name="crown-outline" size={24} color="#666666" />
            <Text style={styles.settingText}>Manage Subscription</Text>
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumBadgeText}>Premium</Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#999999" />
          </TouchableOpacity>
        </View> */}

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingItem}>
            <MaterialIcon name="bell-outline" size={24} color="#666666" />
            <Text style={styles.settingText}>Push Notifications</Text>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: '#E0E0E0', true: '#90EE90' }}
              thumbColor={pushNotifications ? '#45a578' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <MaterialIcon name="email-outline" size={24} color="#666666" />
            <Text style={styles.settingText}>Email Notifications</Text>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              trackColor={{ false: '#E0E0E0', true: '#90EE90' }}
              thumbColor={emailNotifications ? '#45a578' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <MaterialIcon name="alarm" size={24} color="#666666" />
            <Text style={styles.settingText}>Daily Reminders</Text>
            <Switch
              value={dailyReminders}
              onValueChange={setDailyReminders}
              trackColor={{ false: '#E0E0E0', true: '#90EE90' }}
              thumbColor={dailyReminders ? '#45a578' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Privacy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setShowPrivacyPolicy(true)}
          >
            <MaterialIcon name="shield-check-outline" size={24} color="#666666" />
            <Text style={styles.settingText}>Privacy Policy</Text>
            <Icon name="chevron-forward" size={20} color="#999999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setShowTerms(true)}
          >
            <MaterialIcon name="file-document-outline" size={24} color="#666666" />
            <Text style={styles.settingText}>Terms of Service</Text>
            <Icon name="chevron-forward" size={20} color="#999999" />
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => onNavigate && onNavigate('HelpSupport')}
          >
            <MaterialIcon name="help-circle-outline" size={24} color="#666666" />
            <Text style={styles.settingText}>Help & Support</Text>
            <Icon name="chevron-forward" size={20} color="#999999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setShowRateUs(true)}
          >
            <MaterialIcon name="star-outline" size={24} color="#666666" />
            <Text style={styles.settingText}>Rate Us</Text>
            <Icon name="chevron-forward" size={20} color="#999999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setShowAbout(true)}
          >
            <MaterialIcon name="information-outline" size={24} color="#666666" />
            <Text style={styles.settingText}>About</Text>
            <Text style={styles.settingValue}>v1.0.0</Text>
            <Icon name="chevron-forward" size={20} color="#999999" />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditProfile}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditProfile(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setShowEditProfile(false)}>
                <Icon name="close" size={28} color="#333333" />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.modalBody}
              contentContainerStyle={{ paddingBottom: 32 }}
              showsVerticalScrollIndicator={false}
            >
              {/* Avatar Section */}
              <View style={styles.avatarSection}>
                <Text style={styles.inputLabel}>Profile Photo</Text>
                <View style={styles.avatarPreview}>
                  {renderAvatar(editAvatar, editAvatarType, 80)}
                  <TouchableOpacity 
                    style={styles.changeAvatarButton}
                    onPress={() => setShowAvatarPicker(true)}
                  >
                    <MaterialIcon name="camera" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Parent Details */}
              <Text style={styles.sectionDividerLabel}>Parent Details</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <View style={styles.phoneEditRow}>
                  <TextInput
                    style={styles.phoneEditCode}
                    value={newCountryCode}
                    onChangeText={setNewCountryCode}
                    keyboardType="phone-pad"
                    maxLength={4}
                  />
                  <TextInput
                    style={styles.phoneEditInput}
                    value={newPhone}
                    onChangeText={setNewPhone}
                    placeholder="Phone number"
                    keyboardType="phone-pad"
                    maxLength={10}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={editEmail}
                  onChangeText={setEditEmail}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Child Details */}
              {child && (
                <>
                  <Text style={styles.sectionDividerLabel}>Child Details</Text>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Child's Name</Text>
                    <TextInput
                      style={styles.input}
                      value={editChildName}
                      onChangeText={setEditChildName}
                      placeholder="Enter child's name"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Date of Birth</Text>
                    <TouchableOpacity
                      style={styles.dropdownButton}
                      onPress={() => setShowEditDatePicker(true)}
                    >
                      <Text style={editChildDOB ? styles.dropdownText : styles.dropdownPlaceholder}>
                        {editChildDOB || 'Select Date of Birth'}
                      </Text>
                      <Icon name="calendar-outline" size={20} color="#666" />
                    </TouchableOpacity>
                    <DatePicker
                      modal
                      open={showEditDatePicker}
                      date={editSelectedDate}
                      mode="date"
                      maximumDate={new Date()}
                      onConfirm={(date) => {
                        setEditSelectedDate(date);
                        const d = String(date.getDate()).padStart(2, '0');
                        const m = String(date.getMonth() + 1).padStart(2, '0');
                        const y = date.getFullYear();
                        setEditChildDOB(`${d}/${m}/${y}`);
                        setShowEditDatePicker(false);
                      }}
                      onCancel={() => setShowEditDatePicker(false)}
                    />
                  </View>

                  {/* Grade Dropdown */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Grade</Text>
                    <TouchableOpacity
                      style={styles.dropdownButton}
                      onPress={() => { setShowGradeDropdown(!showGradeDropdown); setShowBoardDropdown(false); }}
                    >
                      <Text style={editChildGrade ? styles.dropdownText : styles.dropdownPlaceholder}>
                        {editChildGrade || 'Select Grade'}
                      </Text>
                      <Icon name={showGradeDropdown ? 'chevron-up' : 'chevron-down'} size={20} color="#666" />
                    </TouchableOpacity>
                    {showGradeDropdown && (
                      <View style={styles.dropdownList}>
                        {grades.map((g) => (
                          <TouchableOpacity key={g} style={styles.dropdownItem} onPress={() => { setEditChildGrade(g); setShowGradeDropdown(false); }}>
                            <Text style={[styles.dropdownItemText, editChildGrade === g && styles.dropdownItemSelected]}>{g}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>

                  {/* Education Board Dropdown */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Education Board</Text>
                    <TouchableOpacity
                      style={styles.dropdownButton}
                      onPress={() => { setShowBoardDropdown(!showBoardDropdown); setShowGradeDropdown(false); }}
                    >
                      <Text style={editChildBoard ? styles.dropdownText : styles.dropdownPlaceholder}>
                        {editChildBoard || 'Select Board'}
                      </Text>
                      <Icon name={showBoardDropdown ? 'chevron-up' : 'chevron-down'} size={20} color="#666" />
                    </TouchableOpacity>
                    {showBoardDropdown && (
                      <View style={styles.dropdownList}>
                        {boards.map((b) => (
                          <TouchableOpacity key={b} style={styles.dropdownItem} onPress={() => { setEditChildBoard(b); setShowBoardDropdown(false); }}>
                            <Text style={[styles.dropdownItemText, editChildBoard === b && styles.dropdownItemSelected]}>{b}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>

                  {/* Subject Levels */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Subject Levels</Text>
                    <View style={styles.subjectLevelsEditGrid}>
                      {coreAreas.map((area) => {
                        const active = editSubjectLevels[area.id] || 'Intermediate';
                        return (
                          <View key={area.id} style={styles.subjectLevelCard}>
                            <View style={styles.subjectLevelCardHeader}>
                              {area.imageUrl ? (
                                <Image 
                                  source={{ uri: area.imageUrl }} 
                                  style={styles.subjectCardImage}
                                  resizeMode="cover"
                                />
                              ) : (
                                <MaterialIcon name={area.icon} size={18} color="#45a578" />
                              )}
                              <Text style={styles.subjectLevelCardName}>{area.name}</Text>
                            </View>
                            <View style={styles.levelPillRow}>
                              {levels.map((lvl) => (
                                <TouchableOpacity
                                  key={lvl}
                                  style={[styles.levelPill, active === lvl && styles.levelPillActive]}
                                  onPress={() => setEditSubjectLevels(prev => ({ ...prev, [area.id]: lvl }))}
                                >
                                  <Text style={[styles.levelPillText, active === lvl && styles.levelPillTextActive]}>
                                    {lvl}
                                  </Text>
                                </TouchableOpacity>
                              ))}
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  </View>

                  {/* Beyond School Interests */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Beyond School Interests</Text>
                    <View style={styles.topicsEditGrid}>
                      {exploratoryAreas.map((area) => {
                        const selected = editChildTopics.includes(area._id || area.name);
                        const key = area._id || area.name;
                        return (
                          <TouchableOpacity
                            key={key}
                            style={[styles.topicEditChip, selected && styles.topicEditChipSelected]}
                            onPress={() => {
                              setEditChildTopics(prev =>
                                prev.includes(key)
                                  ? prev.filter(t => t !== key)
                                  : [...prev, key]
                              );
                            }}
                          >
                            <MaterialIcon
                              name={area.rnIcon || 'star-outline'}
                              size={14}
                              color={selected ? '#FFFFFF' : '#6B7280'}
                            />
                            <Text style={[styles.topicEditChipText, selected && styles.topicEditChipTextSelected]}>
                              {area.name}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>

                </>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowEditProfile(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveProfile}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Privacy Policy Modal */}
      <Modal
        visible={showPrivacyPolicy}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPrivacyPolicy(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Privacy Policy</Text>
              <TouchableOpacity onPress={() => setShowPrivacyPolicy(false)}>
                <Icon name="close" size={28} color="#333333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <Text style={styles.policyTitle}>Last Updated: February 26, 2026</Text>
              
              <Text style={styles.policySection}>1. Information We Collect</Text>
              <Text style={styles.policyText}>
                We collect information you provide directly to us, including your name, email address, phone number, and learning progress data. We also collect information about your device and how you use our app.
              </Text>

              <Text style={styles.policySection}>2. How We Use Your Information</Text>
              <Text style={styles.policyText}>
                We use the information we collect to provide, maintain, and improve our services, to personalize your learning experience, and to communicate with you about updates and new features.
              </Text>

              <Text style={styles.policySection}>3. Information Sharing</Text>
              <Text style={styles.policyText}>
                We do not sell your personal information. We may share your information with service providers who help us operate our app, and when required by law.
              </Text>

              <Text style={styles.policySection}>4. Data Security</Text>
              <Text style={styles.policyText}>
                We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.
              </Text>

              <Text style={styles.policySection}>5. Your Rights</Text>
              <Text style={styles.policyText}>
                You have the right to access, update, or delete your personal information. You can do this through your account settings or by contacting us.
              </Text>

              <Text style={styles.policySection}>6. Children's Privacy</Text>
              <Text style={styles.policyText}>
                Our service is designed for parents and guardians. We do not knowingly collect personal information from children under 13 without parental consent.
              </Text>

              <Text style={styles.policySection}>7. Contact Us</Text>
              <Text style={[styles.policyText, { marginBottom: 40 }]}>
                If you have any questions about this Privacy Policy, please contact us at support@nudge2grow.com
              </Text>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.fullButton}
                onPress={() => setShowPrivacyPolicy(false)}
              >
                <Text style={styles.fullButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Terms of Service Modal */}
      <Modal
        visible={showTerms}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTerms(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Terms of Service</Text>
              <TouchableOpacity onPress={() => setShowTerms(false)}>
                <Icon name="close" size={28} color="#333333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <Text style={styles.policyTitle}>Last Updated: February 26, 2026</Text>
              
              <Text style={styles.policySection}>1. Acceptance of Terms</Text>
              <Text style={styles.policyText}>
                By accessing and using Nudge2Grow, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our service.
              </Text>

              <Text style={styles.policySection}>2. Use of Service</Text>
              <Text style={styles.policyText}>
                You agree to use our service only for lawful purposes and in accordance with these Terms. You are responsible for maintaining the confidentiality of your account.
              </Text>

              <Text style={styles.policySection}>3. Subscription and Payment</Text>
              <Text style={styles.policyText}>
                Some features require a paid subscription. You agree to pay all fees associated with your subscription. Subscriptions automatically renew unless cancelled.
              </Text>

              <Text style={styles.policySection}>4. Content Ownership</Text>
              <Text style={styles.policyText}>
                All content provided through our service, including text, graphics, and educational materials, is owned by Nudge2Grow and protected by copyright laws.
              </Text>

              <Text style={styles.policySection}>5. User Conduct</Text>
              <Text style={styles.policyText}>
                You agree not to misuse our service, interfere with its operation, or attempt to access it through unauthorized means.
              </Text>

              <Text style={styles.policySection}>6. Termination</Text>
              <Text style={styles.policyText}>
                We reserve the right to suspend or terminate your account if you violate these Terms or engage in fraudulent activity.
              </Text>

              <Text style={styles.policySection}>7. Limitation of Liability</Text>
              <Text style={styles.policyText}>
                Nudge2Grow is provided "as is" without warranties. We are not liable for any indirect, incidental, or consequential damages.
              </Text>

              <Text style={styles.policySection}>8. Changes to Terms</Text>
              <Text style={[styles.policyText, { marginBottom: 40 }]}>
                We may modify these Terms at any time. Continued use of the service after changes constitutes acceptance of the new Terms.
              </Text>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.fullButton}
                onPress={() => setShowTerms(false)}
              >
                <Text style={styles.fullButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Rate Us Modal */}
      <Modal
        visible={showRateUs}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowRateUs(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Rate Nudge2Grow</Text>
              <TouchableOpacity onPress={() => setShowRateUs(false)}>
                <Icon name="close" size={28} color="#333333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.rateContainer}>
                <MaterialIcon name="star" size={60} color="#FFB84D" />
                <Text style={styles.rateTitle}>How would you rate us?</Text>
                <Text style={styles.rateSubtitle}>
                  Your feedback helps us improve and serve you better
                </Text>

                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => setRating(star)}
                      style={styles.starButton}
                    >
                      <Icon
                        name={star <= rating ? 'star' : 'star-outline'}
                        size={48}
                        color={star <= rating ? '#FFB84D' : '#E0E0E0'}
                      />
                    </TouchableOpacity>
                  ))}
                </View>

                {rating > 0 && (
                  <Text style={styles.ratingText}>
                    {rating === 1 && 'Poor'}
                    {rating === 2 && 'Fair'}
                    {rating === 3 && 'Good'}
                    {rating === 4 && 'Very Good'}
                    {rating === 5 && 'Excellent'}
                  </Text>
                )}

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Tell us more (Optional)</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={feedback}
                    onChangeText={setFeedback}
                    placeholder="Share your experience with us..."
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowRateUs(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton, rating === 0 && styles.disabledButton]}
                onPress={handleSubmitRating}
                disabled={rating === 0}
              >
                <Text style={styles.saveButtonText}>Submit Rating</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* About Modal */}
      <Modal
        visible={showAbout}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAbout(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>About Nudge2Grow</Text>
              <TouchableOpacity onPress={() => setShowAbout(false)}>
                <Icon name="close" size={28} color="#333333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.aboutContainer}>
                <View style={styles.appIconContainer}>
                  <Image 
                    source={require('../assets/images/logo.jpeg')}
                    style={styles.appLogo}
                    resizeMode="contain"
                  />
                </View>
                
                <Text style={styles.appName}>Nudge2Grow</Text>
                <Text style={styles.appVersion}>Version 1.0.0</Text>
                <Text style={styles.appTagline}>
                  Empowering Parents, Nurturing Children
                </Text>

                <View style={styles.aboutSection}>
                  <Text style={styles.aboutTitle}>Our Mission</Text>
                  <Text style={styles.aboutText}>
                    Nudge2Grow is dedicated to helping parents create meaningful learning moments with their children. We provide bite-sized educational activities that fit seamlessly into your daily routine.
                  </Text>
                </View>

                <View style={styles.aboutSection}>
                  <Text style={styles.aboutTitle}>What We Offer</Text>
                  <View style={styles.featureList}>
                    <View style={styles.featureItem}>
                      <Icon name="checkmark-circle" size={20} color="#45a578" />
                      <Text style={styles.featureText}>Daily learning nudges</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Icon name="checkmark-circle" size={20} color="#45a578" />
                      <Text style={styles.featureText}>Progress tracking</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Icon name="checkmark-circle" size={20} color="#45a578" />
                      <Text style={styles.featureText}>Expert-curated content</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Icon name="checkmark-circle" size={20} color="#45a578" />
                      <Text style={styles.featureText}>Personalized recommendations</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.aboutSection}>
                  <Text style={styles.aboutTitle}>Contact Us</Text>
                  <View style={styles.contactItem}>
                    <MaterialIcon name="email" size={20} color="#666666" />
                    <Text style={styles.contactText}>support@nudge2grow.com</Text>
                  </View>
                  <View style={styles.contactItem}>
                    <MaterialIcon name="phone" size={20} color="#666666" />
                    <Text style={styles.contactText}>+91 1800-123-4567</Text>
                  </View>
                  <View style={styles.contactItem}>
                    <MaterialIcon name="web" size={20} color="#666666" />
                    <Text style={styles.contactText}>www.nudge2grow.com</Text>
                  </View>
                </View>

                <Text style={styles.copyright}>
                  © 2026 Nudge2Grow. All rights reserved.
                </Text>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.fullButton}
                onPress={() => setShowAbout(false)}
              >
                <Text style={styles.fullButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Avatar Picker Modal */}
      <Modal
        visible={showAvatarPicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAvatarPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose Profile Photo</Text>
              <TouchableOpacity onPress={() => setShowAvatarPicker(false)}>
                <Icon name="close" size={28} color="#333333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Upload Photo Option */}
              <TouchableOpacity 
                style={styles.uploadOption}
                onPress={handleUploadImage}
              >
                <View style={styles.uploadIconContainer}>
                  <MaterialIcon name="camera" size={32} color="#45a578" />
                </View>
                <View style={styles.uploadTextContainer}>
                  <Text style={styles.uploadTitle}>Upload Photo</Text>
                  <Text style={styles.uploadSubtitle}>Take a photo or choose from gallery</Text>
                </View>
                <Icon name="chevron-forward" size={24} color="#999999" />
              </TouchableOpacity>

              {/* Avatar Emojis */}
              <Text style={styles.avatarSectionTitle}>Choose Avatar</Text>
              <View style={styles.avatarGrid}>
                {avatarImages.map((avatarItem) => {
                  const source = avatarItem.uri ? { uri: avatarItem.uri } : avatarItem.image;
                  const isSelected = editAvatarType === 'image' && editAvatar === source;
                  return (
                    <TouchableOpacity
                      key={avatarItem.id}
                      style={[styles.avatarImageOption, isSelected && styles.avatarOptionSelected]}
                      onPress={() => handleSelectAvatar(source, 'image')}
                    >
                      <Image source={source} style={styles.avatarImage} resizeMode="cover" />
                      {isSelected && (
                        <View style={styles.avatarCheckmark}>
                          <Icon name="checkmark" size={16} color="#FFFFFF" />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.fullButton}
                onPress={() => setShowAvatarPicker(false)}
              >
                <Text style={styles.fullButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Child Modal */}
      <Modal
        visible={showAddChild}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddChild(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { height: '92%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Child</Text>
              <TouchableOpacity onPress={() => setShowAddChild(false)}>
                <Icon name="close" size={28} color="#333333" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalBody}
              contentContainerStyle={{ paddingBottom: 32 }}
              showsVerticalScrollIndicator={false}
            >
              {/* ── Basic Info ── */}
              <Text style={styles.sectionDividerLabel}>Basic Info</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Child's Name *</Text>
                <TextInput
                  style={styles.input}
                  value={newChildName}
                  onChangeText={setNewChildName}
                  placeholder="Enter child's name"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Date of Birth *</Text>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => setShowNewDatePicker(true)}
                >
                  <Text style={newChildDOB ? styles.dropdownText : styles.dropdownPlaceholder}>
                    {newChildDOB || 'Select Date of Birth'}
                  </Text>
                  <Icon name="calendar-outline" size={20} color="#666" />
                </TouchableOpacity>
                <DatePicker
                  modal
                  open={showNewDatePicker}
                  date={newSelectedDate}
                  mode="date"
                  maximumDate={new Date()}
                  onConfirm={(date) => {
                    setNewSelectedDate(date);
                    const d = String(date.getDate()).padStart(2, '0');
                    const m = String(date.getMonth() + 1).padStart(2, '0');
                    const y = date.getFullYear();
                    setNewChildDOB(`${d}/${m}/${y}`);
                    setShowNewDatePicker(false);
                  }}
                  onCancel={() => setShowNewDatePicker(false)}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Grade *</Text>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => { setShowNewGradeDropdown(!showNewGradeDropdown); setShowNewBoardDropdown(false); }}
                >
                  <Text style={newChildGrade ? styles.dropdownText : styles.dropdownPlaceholder}>
                    {newChildGrade || 'Select Grade'}
                  </Text>
                  <Icon name={showNewGradeDropdown ? 'chevron-up' : 'chevron-down'} size={20} color="#666" />
                </TouchableOpacity>
                {showNewGradeDropdown && (
                  <View style={styles.dropdownList}>
                    {grades.map((g) => (
                      <TouchableOpacity key={g} style={styles.dropdownItem} onPress={() => { setNewChildGrade(g); setShowNewGradeDropdown(false); }}>
                        <Text style={[styles.dropdownItemText, newChildGrade === g && styles.dropdownItemSelected]}>{g}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Education Board</Text>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => { setShowNewBoardDropdown(!showNewBoardDropdown); setShowNewGradeDropdown(false); }}
                >
                  <Text style={newChildBoard ? styles.dropdownText : styles.dropdownPlaceholder}>
                    {newChildBoard || 'Select Board'}
                  </Text>
                  <Icon name={showNewBoardDropdown ? 'chevron-up' : 'chevron-down'} size={20} color="#666" />
                </TouchableOpacity>
                {showNewBoardDropdown && (
                  <View style={styles.dropdownList}>
                    {boards.map((b) => (
                      <TouchableOpacity key={b} style={styles.dropdownItem} onPress={() => { setNewChildBoard(b); setShowNewBoardDropdown(false); }}>
                        <Text style={[styles.dropdownItemText, newChildBoard === b && styles.dropdownItemSelected]}>{b}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* ── Subject Levels ── */}
              <Text style={styles.sectionDividerLabel}>Foundation Skills</Text>
              <Text style={styles.sectionDividerHint}>Tap a subject to set the level</Text>
              <View style={styles.subjectLevelsEditGrid}>
                {coreAreas.map((area) => {
                  const active = newChildSubjectLevels[area.id] || 'Intermediate';
                  return (
                    <View key={area.id} style={styles.subjectLevelCard}>
                      <View style={styles.subjectLevelCardHeader}>
                        {area.imageUrl ? (
                          <Image 
                            source={{ uri: area.imageUrl }} 
                            style={styles.subjectCardImage}
                            resizeMode="cover"
                          />
                        ) : (
                          <MaterialIcon name={area.icon} size={18} color="#45a578" />
                        )}
                        <Text style={styles.subjectLevelCardName}>{area.name}</Text>
                      </View>
                      <View style={styles.levelPillRow}>
                        {levels.map((lvl) => (
                          <TouchableOpacity
                            key={lvl}
                            style={[styles.levelPill, active === lvl && styles.levelPillActive]}
                            onPress={() => setNewChildSubjectLevels(prev => ({ ...prev, [area.id]: lvl }))}
                          >
                            <Text style={[styles.levelPillText, active === lvl && styles.levelPillTextActive]}>
                              {lvl}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  );
                })}
              </View>

              {/* ── Beyond School ── */}
              <Text style={[styles.sectionDividerLabel, { marginTop: 20 }]}>Beyond School</Text>
              <Text style={styles.sectionDividerHint}>Select topics your child is interested in</Text>
              <View style={styles.topicsEditGrid}>
                {exploratoryAreas.map((area) => {
                  const key = area._id || area.name;
                  const selected = newChildTopics.includes(key);
                  return (
                    <TouchableOpacity
                      key={key}
                      style={[styles.topicEditChip, selected && styles.topicEditChipSelected]}
                      onPress={() => setNewChildTopics(prev =>
                        prev.includes(key) ? prev.filter(t => t !== key) : [...prev, key]
                      )}
                    >
                      <MaterialIcon
                        name={area.rnIcon || 'star-outline'}
                        size={14}
                        color={selected ? '#FFFFFF' : '#6B7280'}
                      />
                      <Text style={[styles.topicEditChipText, selected && styles.topicEditChipTextSelected]}>
                        {area.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* ── Avatar ── */}
              <Text style={[styles.sectionDividerLabel, { marginTop: 20 }]}>Choose Avatar</Text>
              <View style={styles.addChildAvatarGrid}>
                {avatarImages.map((a) => {
                  const source = a.uri ? { uri: a.uri } : a.image;
                  return (
                    <TouchableOpacity
                      key={a.id}
                      onPress={() => setNewChildAvatar(a.id)}
                      style={[styles.addChildAvatarItem, newChildAvatar === a.id && styles.addChildAvatarSelected]}
                    >
                      <Image source={source} style={styles.addChildAvatarImage} resizeMode="cover" />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowAddChild(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleAddChild}>
                <Text style={styles.saveButtonText}>Add Child</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SettingsScreen;

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
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
  },

  content: {
    flex: 1,
  },

  section: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#999999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 20,
    marginBottom: 12,
  },

  // ── NEW PROFILE HERO & INFO CARDS ────────────────────────────────────────
  profileHeroCard: {
    margin: 16,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  profileHeroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  profileHeroInfo: {
    flex: 1,
  },
  profileHeroName: {
    fontSize: isTablet ? 20 : 17,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 3,
  },
  profileHeroPhone: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  profileHeroEmail: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  profileHeroEdit: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  infoCard: {
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  infoCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  infoLabel: {
    fontSize: 13,
    color: '#9CA3AF',
    width: 100,
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'right',
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  infoSubHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.6,
    marginTop: 12,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  subjectLevelsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  subjectLevelChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  subjectLevelName: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  subjectLevelBadge: {
    fontSize: 11,
    color: '#45a578',
    fontWeight: '700',
  },
  topicsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  topicChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  topicChipText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '600',
  },

  // ── EDIT MODAL EXTRAS ────────────────────────────────────────────────────
  inputReadOnly: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
  },
  inputReadOnlyText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  phoneEditRow: {
    flexDirection: 'row',
    gap: 8,
  },
  phoneEditCode: {
    width: 64,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1A1A1A',
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
  },
  phoneEditInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1A1A1A',
    backgroundColor: '#FFFFFF',
  },
  changePhoneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  changePhoneBadgeText: {
    fontSize: 11,
    color: '#45a578',
    fontWeight: '700',
  },
  phoneChangeBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    gap: 10,
  },
  phoneChangeHint: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  phoneChangeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  phoneChangeCode: {
    width: 60,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1A1A1A',
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
  },
  phoneChangeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1A1A1A',
    backgroundColor: '#FFFFFF',
  },
  phoneChangeError: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 2,
  },
  phoneChangeBtns: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  phoneChangeCancelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  phoneChangeCancelText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  phoneChangeSendBtn: {
    flex: 2,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#45a578',
    alignItems: 'center',
  },
  phoneChangeSendText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  topicsEditGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  topicEditChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
  },
  topicEditChipSelected: {
    backgroundColor: '#45a578',
    borderColor: '#45a578',
  },
  topicEditChipText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  topicEditChipTextSelected: {
    color: '#FFFFFF',
  },

  // Subject level row in edit modal
  subjectLevelsEditGrid: {
    gap: 10,
  },
  subjectLevelCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    gap: 10,
  },
  subjectLevelCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subjectCardImage: {
    width: 18,
    height: 18,
    borderRadius: 4,
  },
  subjectLevelCardName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  levelPillRow: {
    flexDirection: 'row',
    gap: 8,
  },
  levelPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  levelPillActive: {
    backgroundColor: '#45a578',
    borderColor: '#45a578',
  },
  levelPillText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  levelPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // ── CHILDREN SECTION ─────────────────────────────────────────────────────
  childrenSection: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  childrenSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  childrenSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  addChildBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addChildBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#45a578',
  },
  childCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    gap: 12,
  },
  childCardActive: {
    borderWidth: 1.5,
    borderColor: '#45a578',
  },
  activeBadgeRow: {
    flexDirection: 'row',
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDF4',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  activeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#45a578',
  },
  childCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  childCardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  childActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  childActionBtnDelete: {
    backgroundColor: '#FEF2F2',
  },
  switchHintBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDF4',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  switchHintText: {
    fontSize: 11,
    color: '#45a578',
    fontWeight: '600',
  },
  childAvatarWrap: {
    shadowColor: '#45a578',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  childAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#BBF7D0',
  },
  childAvatarFallback: {
    backgroundColor: '#45a578',
    justifyContent: 'center',
    alignItems: 'center',
  },
  childAvatarInitial: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  childCardInfo: {
    flex: 1,
  },
  childCardName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  childCardSub: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  childCardDob: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  childCardChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  childSubjectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  childSubjectChipName: {
    fontSize: 11,
    color: '#374151',
    fontWeight: '500',
  },
  childSubjectChipLevel: {
    fontSize: 11,
    color: '#45a578',
    fontWeight: '700',
  },
  childTopicChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  childTopicChipText: {
    fontSize: 11,
    color: '#3B82F6',
    fontWeight: '600',
  },
  noChildCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    gap: 6,
  },
  noChildText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  noChildHint: {
    fontSize: 12,
    color: '#D1D5DB',
  },

  profileCard: {    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#45a578',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  profileInitial: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  profileInfo: {
    flex: 1,
  },

  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 4,
  },

  profileEmail: {
    fontSize: 14,
    color: '#666666',
  },

  editButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    marginLeft: 16,
  },

  settingValue: {
    fontSize: 14,
    color: '#999999',
    marginRight: 8,
  },

  premiumBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },

  premiumBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  bottomPadding: {
    height: 40,
  },

  addChildAvatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },

  addChildAvatarItem: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },

  addChildAvatarSelected: {
    borderColor: '#45a578',
  },

  addChildAvatarImage: {
    width: '100%',
    height: '100%',
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
    height: '85%',
    marginHorizontal: 16,
    marginTop: 16,
    flex: 0,
    flexDirection: 'column',
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
    flex: 1,
    paddingHorizontal: 32,
    paddingVertical: 28,
  },

  inputGroup: {
    marginBottom: 20,
  },

  sectionDividerLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#45a578',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
    marginTop: 4,
  },
  sectionDividerHint: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 12,
  },

  dropdownButton: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  dropdownText: {
    fontSize: 16,
    color: '#333333',
  },

  dropdownPlaceholder: {
    fontSize: 16,
    color: '#AAAAAA',
  },

  dropdownList: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    marginTop: 4,
    overflow: 'hidden',
  },

  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  dropdownItemText: {
    fontSize: 15,
    color: '#333333',
  },

  dropdownItemSelected: {
    color: '#45a578',
    fontWeight: '700',
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 8,
  },

  input: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#333333',
  },

  passwordHintText: {
    flex: 1,
    fontSize: 13,
    color: '#4A90E2',
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
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },

  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },

  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#45a578',
    alignItems: 'center',
  },

  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  fullButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#45a578',
    alignItems: 'center',
  },

  fullButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  disabledButton: {
    backgroundColor: '#CCCCCC',
  },

  // Policy Styles
  policyTitle: {
    fontSize: 14,
    color: '#999999',
    marginBottom: 20,
  },

  policySection: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
    marginTop: 20,
    marginBottom: 8,
  },

  policyText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 22,
    marginBottom: 12,
  },

  // Rate Us Styles
  rateContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },

  rateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    marginTop: 16,
    marginBottom: 8,
  },

  rateSubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 32,
  },

  starsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },

  starButton: {
    padding: 4,
  },

  ratingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#45a578',
    marginBottom: 24,
  },

  textArea: {
    height: 100,
    paddingTop: 12,
  },

  // About Styles
  aboutContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingBottom: 40,
  },

  appIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },

  appLogo: {
    width: 150,
    height: 120,
  },

  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },

  appVersion: {
    fontSize: 16,
    color: '#999999',
    marginBottom: 8,
  },

  appTagline: {
    fontSize: 16,
    color: '#45a578',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 32,
  },

  aboutSection: {
    width: '100%',
    marginBottom: 24,
  },

  aboutTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 12,
  },

  aboutText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 22,
  },

  featureList: {
    gap: 12,
  },

  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  featureText: {
    fontSize: 14,
    color: '#666666',
  },

  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },

  contactText: {
    fontSize: 14,
    color: '#666666',
  },

  copyright: {
    fontSize: 12,
    color: '#999999',
    marginTop: 24,
    textAlign: 'center',
  },

  // Avatar Styles
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },

  avatarPreview: {
    position: 'relative',
    marginTop: 12,
  },

  changeAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#45a578',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },

  uploadOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    marginBottom: 12,
  },

  uploadIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  initialText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  uploadTextContainer: {
    flex: 1,
  },

  uploadTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },

  uploadSubtitle: {
    fontSize: 13,
    color: '#666666',
  },

  avatarSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
    marginTop: 12,
    marginBottom: 16,
  },

  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },

  avatarOption: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
    position: 'relative',
  },

  avatarImageOption: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#E0E0E0',
    position: 'relative',
    overflow: 'hidden',
  },

  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },

  avatarOptionSelected: {
    borderColor: '#45a578',
    backgroundColor: '#E8F5E9',
  },

  avatarEmoji: {
    fontSize: 30,
  },

  avatarCheckmark: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#45a578',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
