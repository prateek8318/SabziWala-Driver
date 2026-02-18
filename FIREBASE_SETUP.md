# Firebase Push Notifications Setup

This guide will help you complete the Firebase setup for push notifications in your SabziDriver app.

## 🚀 Quick Setup Steps

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" 
3. Enter project name: "SabziDriver"
4. Follow the setup steps

### 2. Add Android App
1. In Firebase Console, click "Add app" → Android
2. Package name: `com.sabzidriver`
3. Download `google-services.json`
4. Place it in: `android/app/google-services.json`

### 3. Add iOS App
1. In Firebase Console, click "Add app" → iOS
2. Bundle ID: `com.sabzidriver` (check your actual bundle ID in Xcode)
3. Download `GoogleService-Info.plist`
4. Place it in: `ios/SabziDriver/GoogleService-Info.plist`

### 4. Install Dependencies

#### For Android:
```bash
cd android
./gradlew clean
./gradlew build
```

#### For iOS:
```bash
cd ios
pod install
```

### 5. Enable Cloud Messaging
1. In Firebase Console → Project Settings → Cloud Messaging
2. Enable Cloud Messaging API
3. Configure Android/iOS settings as needed

## 🔧 Configuration Files Already Added

### Android Configuration:
- ✅ `google-services` plugin added to `android/build.gradle`
- ✅ `com.google.gms.google-services` plugin applied to `android/app/build.gradle`

### iOS Configuration:
- ✅ Firebase pods added to `ios/Podfile`

### App Integration:
- ✅ Firebase service created at `src/services/firebase.ts`
- ✅ Storage service updated with FCM token management
- ✅ Firebase initialization added to `App.tsx`

## 📱 Testing Push Notifications

### 1. Get FCM Token
The app automatically requests permission and gets FCM token on startup. Check console logs for the token.

### 2. Send Test Notification
Use Firebase Console → Cloud Messaging → Create your first campaign:
- Enter notification title and body
- Target your app by FCM token
- Send notification

## 🛠️ Notification Handling

The Firebase service handles:
- ✅ Permission requests
- ✅ FCM token generation and refresh
- ✅ Foreground notifications
- ✅ Background notifications
- ✅ App opened from notification

### Notification sound
- **Background (app closed/minimized):** Uses the default notification channel `order_notifications` with system sound. No extra setup needed.
- **In-app (socket or FCM when app is open):** To hear a sound when an order arrives while the app is open, add an MP3 file:
  - **Android:** Place `order_notification.mp3` (lowercase, underscore only) in `android/app/src/main/res/raw/`. See that folder’s README.
  - **iOS:** Add the same file to the Xcode project (e.g. drag into the project and ensure it’s in “Copy Bundle Resources”).
  - If the file is missing, the app falls back to vibration/haptic feedback.

### Custom Notification Handling:
Edit `src/services/firebase.ts` to customize:
- Navigation logic when notification is pressed
- In-app notification display
- Data payload handling

## 🔍 Troubleshooting

### Common Issues:
1. **Missing google-services.json**: Download from Firebase Console and place in `android/app/`
2. **Missing GoogleService-Info.plist**: Download from Firebase Console and place in `ios/SabziDriver/`
3. **Build errors**: Run `cd android && ./gradlew clean` and `cd ios && pod install`
4. **No notifications**: Check device settings and app notification permissions

### Debug Commands:
```bash
# Android debug
npx react-native run-android --variant=debug

# iOS debug  
npx react-native run-ios --simulator="iPhone 14"
```

## 📋 Next Steps

1. ✅ Complete Firebase Console setup
2. ✅ Add config files to project
3. ✅ Test push notifications
4. 🔄 Integrate with your backend API to send notifications programmatically
5. 🔄 Customize notification handling for your app's specific needs

## 🌐 Server Integration

To send notifications from your backend, you'll need:
- Firebase Server Key (from Project Settings → Cloud Messaging)
- FCM tokens from users (stored in your database)
- Use Firebase Admin SDK or HTTP API to send notifications

Example server code (Node.js):
```javascript
const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const message = {
  notification: {
    title: 'New Order!',
    body: 'You have a new delivery order'
  },
  token: 'user_fcm_token_here'
};

admin.messaging().send(message);
```
