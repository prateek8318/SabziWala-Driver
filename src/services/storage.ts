// Optional AsyncStorage import - will be undefined if not properly linked
let AsyncStorage: any;
try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch {
  console.log('AsyncStorage not available, using fallback storage');
  AsyncStorage = undefined;
}

// Fallback storage for when AsyncStorage is not available
let fallbackStorage: { [key: string]: string } = {};

const TOKEN_KEY = 'auth_token';
const FCM_TOKEN_KEY = 'fcm_token';
const DRIVER_STATUS_KEY = 'driver_status';
const ORDER_TIMERS_KEY = 'order_timers';

type StoredOrderTimer = {
  startedAt: number;
  total: number;
};

export const storage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      if (typeof AsyncStorage !== 'undefined' && AsyncStorage.getItem) {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) return value;
      }

      return fallbackStorage[key] || null;
    } catch (error) {
      console.error(`Error getting storage key ${key}:`, error);
      return fallbackStorage[key] || null;
    }
  },

  setItem: async (key: string, value: string): Promise<void> => {
    try {
      if (typeof AsyncStorage !== 'undefined' && AsyncStorage.setItem) {
        await AsyncStorage.setItem(key, value);
      }

      fallbackStorage[key] = value;
    } catch (error) {
      console.error(`Error setting storage key ${key}:`, error);
      fallbackStorage[key] = value;
    }
  },

  removeItem: async (key: string): Promise<void> => {
    try {
      if (typeof AsyncStorage !== 'undefined' && AsyncStorage.removeItem) {
        await AsyncStorage.removeItem(key);
      }

      delete fallbackStorage[key];
    } catch (error) {
      console.error(`Error removing storage key ${key}:`, error);
      delete fallbackStorage[key];
    }
  },

  // Save token
  saveToken: async (token: string): Promise<void> => {
    try {
      await storage.setItem(TOKEN_KEY, token);
      console.log('Token saved successfully');
    } catch (error) {
      console.error('Error saving token:', error);
    }
  },

  // Get token
  getToken: async (): Promise<string | null> => {
    try {
      return await storage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return fallbackStorage[TOKEN_KEY] || null;
    }
  },

  // Remove token
  removeToken: async (): Promise<void> => {
    try {
      await storage.removeItem(TOKEN_KEY);
      console.log('Token removed successfully');
    } catch (error) {
      console.error('Error removing token:', error);
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
      await storage.setItem(FCM_TOKEN_KEY, token);
      console.log('FCM Token saved successfully');
    } catch (error) {
      console.error('Error saving FCM token:', error);
    }
  },

  // Get FCM token
  getFCMToken: async (): Promise<string | null> => {
    try {
      return await storage.getItem(FCM_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return fallbackStorage[FCM_TOKEN_KEY] || null;
    }
  },

  // Save driver status (always save as 'inactive' when app starts/closes)
  saveDriverStatus: async (status: 'active' | 'inactive'): Promise<void> => {
    try {
      await storage.setItem(DRIVER_STATUS_KEY, status);
      console.log(`Driver status saved successfully: ${status}`);
    } catch (error) {
      console.error('Error saving driver status:', error);
    }
  },

  // Get driver status
  getDriverStatus: async (): Promise<'active' | 'inactive'> => {
    try {
      const status = await storage.getItem(DRIVER_STATUS_KEY);
      if (status) return status as 'active' | 'inactive';
      return fallbackStorage[DRIVER_STATUS_KEY] as 'active' | 'inactive' || 'inactive';
    } catch (error) {
      console.error('Error getting driver status:', error);
      // Fallback to memory storage on error (default to inactive)
      return fallbackStorage[DRIVER_STATUS_KEY] as 'active' | 'inactive' || 'inactive';
    }
  },

  // Remove driver status
  removeDriverStatus: async (): Promise<void> => {
    try {
      await storage.removeItem(DRIVER_STATUS_KEY);
      console.log('Driver status removed successfully');
    } catch (error) {
      console.error('Error removing driver status:', error);
    }
  },

  getOrderTimers: async (): Promise<Record<string, StoredOrderTimer>> => {
    try {
      const raw = await storage.getItem(ORDER_TIMERS_KEY);
      if (!raw) return {};

      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (error) {
      console.error('Error getting order timers:', error);
      return {};
    }
  },

  getOrderTimer: async (orderId: string): Promise<StoredOrderTimer | null> => {
    try {
      const timers = await storage.getOrderTimers();
      return timers[orderId] || null;
    } catch (error) {
      console.error(`Error getting order timer for ${orderId}:`, error);
      return null;
    }
  },

  saveOrderTimer: async (orderId: string, timer: StoredOrderTimer): Promise<void> => {
    try {
      const timers = await storage.getOrderTimers();
      timers[orderId] = timer;
      await storage.setItem(ORDER_TIMERS_KEY, JSON.stringify(timers));
    } catch (error) {
      console.error(`Error saving order timer for ${orderId}:`, error);
    }
  },

  removeOrderTimer: async (orderId: string): Promise<void> => {
    try {
      const timers = await storage.getOrderTimers();
      if (!timers[orderId]) return;

      delete timers[orderId];
      await storage.setItem(ORDER_TIMERS_KEY, JSON.stringify(timers));
    } catch (error) {
      console.error(`Error removing order timer for ${orderId}:`, error);
    }
  },

  retainOrderTimers: async (validOrderIds: string[]): Promise<void> => {
    try {
      const keep = new Set(validOrderIds);
      const timers = await storage.getOrderTimers();
      const next = Object.entries(timers).reduce<Record<string, StoredOrderTimer>>(
        (acc, [orderId, timer]) => {
          if (keep.has(orderId)) {
            acc[orderId] = timer;
          }
          return acc;
        },
        {}
      );
      await storage.setItem(ORDER_TIMERS_KEY, JSON.stringify(next));
    } catch (error) {
      console.error('Error retaining order timers:', error);
    }
  },
};

export default storage;
