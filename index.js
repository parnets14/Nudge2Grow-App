/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Import FCM service at the top level so the background message handler
// is registered before the app mounts — required for killed-state notifications.
import './src/services/firebaseNotificationService';

// Create the notification channel immediately at boot so Android can display
// FCM notifications even when the app is fully killed.
import notifee, { AndroidImportance, AndroidVisibility } from '@notifee/react-native';
notifee.createChannel({
  id: 'nudge2grow_notifications',
  name: 'Nudge2Grow Notifications',
  importance: AndroidImportance.HIGH,
  visibility: AndroidVisibility.PUBLIC,
  sound: 'default',
  vibration: true,
}).catch(() => {});

AppRegistry.registerComponent(appName, () => App);
