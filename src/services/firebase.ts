import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { storage } from './storage';
import { playNotificationSound } from '../utils/notificationSound';

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
      console.log('[FCM] Requesting FCM token...');
      const token = await messaging().getToken();
      // Log token clearly so it's easy to find in logs
      console.log('========== FCM TOKEN (copy this for backend) ==========');
      console.log(token);
      console.log('========================================================');
      console.warn('[FCM] Token:', token);

      // Save token to storage for later use
      await storage.saveFCMToken(token);

      return token;
    } catch (error: any) {
      console.error('[FCM] Error getting FCM token:', error?.message || error);
      console.error('[FCM] Full error:', error);
      return null;
    }
  }

  async initializeNotifications() {
    try {
      console.log('[FCM] Initializing notifications...');

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

      // Get FCM token (logs token in console - search for "FCM TOKEN" or "[FCM]")
      const token = await this.getFCMToken();
      if (token) {
        console.log('[FCM] Notifications ready. Token saved.');
      } else {
        console.warn('[FCM] Notifications init done but token is null - check permission/Google Play Services.');
      }
    } catch (error: any) {
      console.warn('[FCM] Firebase notifications initialization error:', error?.message || error);
      console.warn('[FCM] Full error:', error);
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
    const { notification } = remoteMessage;
    console.log('Foreground notification:', notification?.title, notification?.body);
    // Play notification sound when app is open and FCM message arrives
    playNotificationSound();
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
