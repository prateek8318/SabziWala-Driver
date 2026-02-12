import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import { Platform } from 'react-native';
import { storage } from './storage';

class FirebaseService {
  async initializeApp(): Promise<void> {
    try {
      // Firebase is auto-initialized with google-services.json on Android
      // No need to manually access the app - it's ready when needed
      console.log('Firebase initialization checked - ready for use');
    } catch (error: any) {
      console.warn('Firebase initialization error:', error.message);
      // Don't throw error - app can continue without Firebase
    }
  }

  async requestUserPermission(): Promise<boolean> {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Notification permission granted');
        await this.getFCMToken();
      } else {
        console.log('Notification permission denied');
      }
      
      return enabled;
    } catch (error: any) {
      console.error('Error requesting permission:', error.message);
      return false;
    }
  }

  async getFCMToken(): Promise<string | null> {
    try {
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
      
      // Save token to storage for later use
      await storage.saveFCMToken(token);
      
      return token;
    } catch (error: any) {
      console.error('Error getting FCM token:', error.message);
      return null;
    }
  }

  async initializeNotifications() {
    try {
      // Request permission for iOS
      if (Platform.OS === 'ios') {
        await messaging().requestPermission();
      }

      // Get initial notification if app was opened from notification
      const initialNotification = await messaging().getInitialNotification();
      if (initialNotification) {
        console.log('App opened from notification:', initialNotification);
        this.handleNotificationPress(initialNotification);
      }

      // Handle notification when app is in foreground
      this.unsubscribeForeground = messaging().onMessage(async remoteMessage => {
        console.log('Received foreground notification:', remoteMessage);
        // You can show a custom in-app notification here
        this.handleForegroundNotification(remoteMessage);
      });

      // Handle notification when app is in background but opened
      this.unsubscribeBackground = messaging().onNotificationOpenedApp(remoteMessage => {
        console.log('App opened from background notification:', remoteMessage);
        this.handleNotificationPress(remoteMessage);
      });

      // Handle token refresh
      this.unsubscribeTokenRefresh = messaging().onTokenRefresh(async token => {
        console.log('FCM Token refreshed:', token);
        await storage.saveFCMToken(token);
        // You might want to send this new token to your backend
      });

      // Get FCM token
      await this.getFCMToken();
      
    } catch (error: any) {
      console.warn('Firebase notifications initialization error:', error.message);
      // Don't throw error - app can continue without notifications
    }
  }

  private handleNotificationPress(notification: any) {
    // Handle notification press based on your app's logic
    const { data, notification: notificationData } = notification;
    
    // Example: Navigate to specific screen based on notification data
    if (data?.screen) {
      // You can emit an event or use navigation to handle this
      console.log('Navigate to screen:', data.screen);
    }
    
    // Handle order notifications
    if (data?.type === 'new_order') {
      console.log('New order received:', data.orderId);
    }
  }

  private handleForegroundNotification(remoteMessage: any) {
    // Show custom in-app notification when app is in foreground
    const { notification, data } = remoteMessage;
    
    // You can use react-native-toast-message or custom modal
    console.log('Foreground notification:', notification?.title, notification?.body);
    
    // Example: Show toast message
    // Toast.show({
    //   type: 'info',
    //   text1: notification?.title || 'New Notification',
    //   text2: notification?.body || '',
    // });
  }

  async unsubscribe() {
    if (this.unsubscribeForeground) {
      this.unsubscribeForeground();
    }
    if (this.unsubscribeBackground) {
      this.unsubscribeBackground();
    }
    if (this.unsubscribeTokenRefresh) {
      this.unsubscribeTokenRefresh();
    }
  }

  private unsubscribeForeground: (() => void) | null = null;
  private unsubscribeBackground: (() => void) | null = null;
  private unsubscribeTokenRefresh: (() => void) | null = null;
}

export const firebaseService = new FirebaseService();
