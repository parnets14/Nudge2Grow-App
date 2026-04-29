import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { requestNotificationPermission, getFCMToken, sendTokenToBackend } from '../services/firebaseNotificationService';
import { sendTopicCompletionNotification } from '../services/notificationService';
import { getLoginCredentials } from '../utils/secureStorage';

const NotificationTest = ({ onMarkTopicComplete }) => {
  const testNotificationPermission = async () => {
    try {
      console.log('[NotificationTest] Testing notification permission...');
      const granted = await requestNotificationPermission();
      
      Alert.alert(
        'Permission Result',
        granted ? 'Notification permission granted!' : 'Notification permission denied',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('[NotificationTest] Error:', error);
      Alert.alert('Error', error.message);
    }
  };

  const testGetFCMToken = async () => {
    try {
      console.log('[NotificationTest] Getting FCM token...');
      const token = await getFCMToken();
      
      if (token) {
        Alert.alert(
          'FCM Token',
          `Token obtained: ${token.substring(0, 50)}...`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', 'Failed to get FCM token');
      }
    } catch (error) {
      console.error('[NotificationTest] Error:', error);
      Alert.alert('Error', error.message);
    }
  };

  const testSendTokenToBackend = async () => {
    try {
      console.log('[NotificationTest] Testing token registration...');
      
      // Get FCM token
      const fcmToken = await getFCMToken();
      if (!fcmToken) {
        Alert.alert('Error', 'No FCM token available');
        return;
      }

      // Get auth token
      const credentials = await getLoginCredentials();
      if (!credentials?.token) {
        Alert.alert('Error', 'No auth token available. Please login first.');
        return;
      }

      // Send to backend
      const success = await sendTokenToBackend(fcmToken, credentials.token);
      
      Alert.alert(
        'Backend Registration',
        success ? 'Token registered successfully!' : 'Failed to register token',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('[NotificationTest] Error:', error);
      Alert.alert('Error', error.message);
    }
  };

  const testSendNotification = async () => {
    try {
      console.log('[NotificationTest] Sending test notification...');
      
      const credentials = await getLoginCredentials();
      if (!credentials?.token) {
        Alert.alert('Error', 'No auth token available. Please login first.');
        return;
      }

      const response = await fetch('http://localhost:5000fications/test', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${credentials.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Test Notification',
          message: 'This is a test notification from the app!'
        }),
      });

      if (response.ok) {
        const result = await response.json();
        Alert.alert('Success', 'Test notification sent!');
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('[NotificationTest] Error:', error);
      Alert.alert('Error', `Failed to send test notification: ${error.message}`);
    }
  };

  const testSendCompletionNotification = async () => {
    try {
      console.log('[NotificationTest] Sending test completion notification...');
      
      const credentials = await getLoginCredentials();
      if (!credentials?.token) {
        Alert.alert('Error', 'No auth token available. Please login first.');
        return;
      }

      const completionData = {
        topicName: 'Test Math Topic',
        subjectName: 'Mathematics',
        userName: 'Test Student',
        grade: 'Grade 1',
        level: 'Basic',
      };

      const success = await sendTopicCompletionNotification(completionData, credentials.token);
      
      Alert.alert(
        'Completion Notification',
        success ? 'Topic completion notification sent!' : 'Failed to send completion notification',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('[NotificationTest] Error:', error);
      Alert.alert('Error', `Failed to send completion notification: ${error.message}`);
    }
  };

  const testManualCompletion = async () => {
    try {
      console.log('[NotificationTest] Testing manual topic completion...');
      
      // Simulate completing a topic manually
      const testKey = 'Mathematics::Test Topic';
      
      // Get the markTopicComplete function from App context
      // Since we don't have direct access, we'll call the notification service directly
      const credentials = await getLoginCredentials();
      if (!credentials?.token) {
        Alert.alert('Error', 'No auth token available. Please login first.');
        return;
      }

      const completionData = {
        topicName: 'Test Topic',
        subjectName: 'Mathematics',
        userName: 'Test Student',
        grade: 'Grade 1',
        level: 'Basic',
      };

      console.log('[NotificationTest] Sending completion data:', completionData);
      const success = await sendTopicCompletionNotification(completionData, credentials.token);
      
      Alert.alert(
        'Manual Completion Test',
        success ? 'Manual completion notification created! Check your notifications.' : 'Failed to create completion notification',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('[NotificationTest] Error:', error);
      Alert.alert('Error', `Manual completion test failed: ${error.message}`);
    }
  };

  const testDirectCompletion = () => {
    try {
      console.log('[NotificationTest] Testing direct topic completion...');
      
      if (onMarkTopicComplete) {
        const testKey = 'Mathematics::Test Direct Topic';
        console.log('[NotificationTest] Calling markTopicComplete with key:', testKey);
        onMarkTopicComplete(testKey);
        Alert.alert('Test', 'Direct completion test triggered!', [{ text: 'OK' }]);
      } else {
        Alert.alert('Error', 'markTopicComplete function not available', [{ text: 'OK' }]);
      }
    } catch (error) {
      console.error('[NotificationTest] Error:', error);
      Alert.alert('Error', `Direct completion test failed: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Test Panel</Text>
      
      <TouchableOpacity style={styles.button} onPress={testNotificationPermission}>
        <Text style={styles.buttonText}>1. Test Permission Request</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={testGetFCMToken}>
        <Text style={styles.buttonText}>2. Get FCM Token</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={testSendTokenToBackend}>
        <Text style={styles.buttonText}>3. Register Token with Backend</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={testSendNotification}>
        <Text style={styles.buttonText}>4. Send Test Notification</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={testSendCompletionNotification}>
        <Text style={styles.buttonText}>5. Send Completion Notification</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={testManualCompletion}>
        <Text style={styles.buttonText}>6. Test Manual Completion</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={testDirectCompletion}>
        <Text style={styles.buttonText}>7. Test Direct Completion</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    margin: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#45a578',
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default NotificationTest;