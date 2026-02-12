// Optional AsyncStorage import - will be undefined if not properly linked
let AsyncStorage: any;
try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (error) {
  console.log('AsyncStorage not available, using fallback storage');
  AsyncStorage = undefined;
}

// Fallback storage for when AsyncStorage is not available
let fallbackStorage: { [key: string]: string } = {};

const TOKEN_KEY = 'auth_token';
const FCM_TOKEN_KEY = 'fcm_token';

export const storage = {
  // Save token
  saveToken: async (token: string): Promise<void> => {
    try {
      // Try AsyncStorage first
      if (typeof AsyncStorage !== 'undefined' && AsyncStorage.setItem) {
        await AsyncStorage.setItem(TOKEN_KEY, token);
        console.log('Token saved successfully to AsyncStorage');
      } else {
        // Fallback to memory storage
        fallbackStorage[TOKEN_KEY] = token;
        console.log('Token saved successfully to fallback storage');
      }
    } catch (error) {
      console.error('Error saving token:', error);
      // Fallback to memory storage on error
      fallbackStorage[TOKEN_KEY] = token;
      console.log('Token saved to fallback storage due to error');
    }
  },

  // Get token
  getToken: async (): Promise<string | null> => {
    try {
      // Try AsyncStorage first
      if (typeof AsyncStorage !== 'undefined' && AsyncStorage.getItem) {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        if (token) return token;
      }
      
      // Fallback to memory storage
      return fallbackStorage[TOKEN_KEY] || null;
    } catch (error) {
      console.error('Error getting token:', error);
      // Fallback to memory storage on error
      return fallbackStorage[TOKEN_KEY] || null;
    }
  },

  // Remove token
  removeToken: async (): Promise<void> => {
    try {
      // Try AsyncStorage first
      if (typeof AsyncStorage !== 'undefined' && AsyncStorage.removeItem) {
        await AsyncStorage.removeItem(TOKEN_KEY);
        console.log('Token removed successfully from AsyncStorage');
      }
      
      // Always remove from fallback storage
      delete fallbackStorage[TOKEN_KEY];
      console.log('Token removed from fallback storage');
    } catch (error) {
      console.error('Error removing token:', error);
      // Still remove from fallback storage on error
      delete fallbackStorage[TOKEN_KEY];
      console.log('Token removed from fallback storage due to error');
    }
  },

  // Clear all storage (for logout)
  clearAll: async (): Promise<void> => {
    try {
      // Try AsyncStorage first
      if (typeof AsyncStorage !== 'undefined' && AsyncStorage.clear) {
        await AsyncStorage.clear();
        console.log('Storage cleared successfully from AsyncStorage');
      }
      
      // Always clear fallback storage
      fallbackStorage = {};
      console.log('Fallback storage cleared');
    } catch (error) {
      console.error('Error clearing storage:', error);
      // Still clear fallback storage on error
      fallbackStorage = {};
      console.log('Fallback storage cleared due to error');
    }
  },

  // Save FCM token
  saveFCMToken: async (token: string): Promise<void> => {
    try {
      // Try AsyncStorage first
      if (typeof AsyncStorage !== 'undefined' && AsyncStorage.setItem) {
        await AsyncStorage.setItem(FCM_TOKEN_KEY, token);
        console.log('FCM Token saved successfully to AsyncStorage');
      } else {
        // Fallback to memory storage
        fallbackStorage[FCM_TOKEN_KEY] = token;
        console.log('FCM Token saved successfully to fallback storage');
      }
    } catch (error) {
      console.error('Error saving FCM token:', error);
      // Fallback to memory storage on error
      fallbackStorage[FCM_TOKEN_KEY] = token;
      console.log('FCM Token saved to fallback storage due to error');
    }
  },

  // Get FCM token
  getFCMToken: async (): Promise<string | null> => {
    try {
      // Try AsyncStorage first
      if (typeof AsyncStorage !== 'undefined' && AsyncStorage.getItem) {
        const token = await AsyncStorage.getItem(FCM_TOKEN_KEY);
        if (token) return token;
      }
      
      // Fallback to memory storage
      return fallbackStorage[FCM_TOKEN_KEY] || null;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      // Fallback to memory storage on error
      return fallbackStorage[FCM_TOKEN_KEY] || null;
    }
  },
};

export default storage;
