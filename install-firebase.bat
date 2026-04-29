@echo off
echo ========================================
echo Firebase Cloud Messaging Installation
echo ========================================
echo.
echo This will install:
echo - @react-native-firebase/app
echo - @react-native-firebase/messaging
echo.
echo Press Ctrl+C to cancel, or
pause

echo.
echo Installing Firebase packages...
echo ========================================
call npm install @react-native-firebase/app @react-native-firebase/messaging

echo.
echo ========================================
echo Installation complete!
echo.
echo NEXT STEPS:
echo 1. Read FIREBASE_NOTIFICATION_SETUP.md
echo 2. Update App.jsx with FCM initialization
echo 3. Update NotificationScreen with token handling
echo 4. Clear cache: npx react-native start --reset-cache
echo 5. Rebuild: npx react-native run-android
echo ========================================
pause
