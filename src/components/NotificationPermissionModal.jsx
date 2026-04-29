/**
 * NotificationPermissionModal
 * Custom bottom-sheet style dialog shown on first app open
 * to request notification permission before login.
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { PermissionsAndroid } from 'react-native';

const { height } = Dimensions.get('window');

const NotificationPermissionModal = ({ visible, onAllow, onDeny }) => {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 60,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleAllow = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      try {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
      } catch (_) {}
    }
    onAllow();
  };

  return (
    <Modal transparent visible={visible} animationType="none" statusBarTranslucent>
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: backdropAnim }]} />

      {/* Sheet */}
      <View style={styles.container}>
        <Animated.View
          style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
        >
          {/* Bell Icon */}
          <View style={styles.iconWrapper}>
            <BellIcon />
          </View>

          {/* Title */}
          <Text style={styles.title}>
            Allow <Text style={styles.bold}>Nudge2Grow</Text> to send you
            notifications?
          </Text>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Allow */}
          <TouchableOpacity style={styles.btn} activeOpacity={0.6} onPress={handleAllow}>
            <Text style={styles.btnAllow}>Allow</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Don't Allow */}
          <TouchableOpacity style={styles.btn} activeOpacity={0.6} onPress={onDeny}>
            <Text style={styles.btnDeny}>Don't allow</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

/* ── Inline SVG-style bell using RN shapes ─────────────────────────────────── */
const BellIcon = () => (
  <View style={bell.wrapper}>
    {/* Bell body */}
    <View style={bell.body} />
    {/* Bell top stem */}
    <View style={bell.stem} />
    {/* Bell clapper */}
    <View style={bell.clapper} />
  </View>
);

const bell = StyleSheet.create({
  wrapper: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    width: 34,
    height: 30,
    borderRadius: 17,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderWidth: 3,
    borderColor: '#4A90E2',
    backgroundColor: 'transparent',
    marginTop: 6,
  },
  stem: {
    position: 'absolute',
    top: 2,
    width: 4,
    height: 8,
    borderRadius: 2,
    backgroundColor: '#4A90E2',
  },
  clapper: {
    position: 'absolute',
    bottom: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 3,
    borderColor: '#4A90E2',
    backgroundColor: 'transparent',
  },
});

/* ── Styles ─────────────────────────────────────────────────────────────────── */
const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  sheet: {
    width: '100%',
    backgroundColor: '#F2F2F7',
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 4,
  },
  iconWrapper: {
    marginBottom: 16,
  },
  title: {
    fontSize: 17,
    color: '#1C1C1E',
    textAlign: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
    lineHeight: 24,
  },
  bold: {
    fontWeight: '700',
  },
  divider: {
    width: '100%',
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#C6C6C8',
  },
  btn: {
    width: '100%',
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnAllow: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  btnDeny: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1C1C1E',
  },
});

export default NotificationPermissionModal;
