import { Platform } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const ANDROID_RAW_FILENAME = 'order_notification.mp3'; // Android raw: lowercase + underscore only
const IOS_BUNDLE_FILENAME = 'order_notification.mp3';

/**
 * Plays notification sound. Uses order_notification.mp3 from:
 * - Android: android/app/src/main/res/raw/order_notification.mp3
 * - iOS: add file to Xcode project (e.g. in project root or Resources)
 */
export function playNotificationSound(): void {
  try {
    const Sound = require('react-native-sound');

    Sound.setCategory('Playback', true);

    const filename = Platform.OS === 'android' ? ANDROID_RAW_FILENAME : IOS_BUNDLE_FILENAME;
    const sound = new Sound(filename, Sound.MAIN_BUNDLE, (error: unknown) => {
      if (error) {
        console.warn('Notification sound load failed, using fallback:', error);
        playFallbackFeedback();
        return;
      }
      sound.play((success: boolean) => {
        if (!success) {
          playFallbackFeedback();
        }
        setTimeout(() => sound.release(), 2000);
      });
    });
  } catch (e) {
    console.warn('react-native-sound not available:', e);
    playFallbackFeedback();
  }
}

function playFallbackFeedback(): void {
  try {
    ReactNativeHapticFeedback.trigger('notificationSuccess', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
  } catch {
    // ignore
  }
}
