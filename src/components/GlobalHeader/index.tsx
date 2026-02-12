import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'react-native';

const { width, height } = Dimensions.get('window');

// Responsive scaling factors
const scaleWidth = (size: number) => (size / 375) * width; // Base width: 375 (iPhone X)
const scaleHeight = (size: number) => (size / 812) * height; // Base height: 812 (iPhone X)
const scaleFont = (size: number) => {
  const scaleFactor = Math.min(width / 375, height / 812);
  return size * scaleFactor;
};

// Screen title mapping
const SCREEN_TITLES: { [key: string]: string } = {
  'Dashboard': 'Home',
  'Profile': 'Profile',
  'EditProfile': 'Edit Profile',
  'BankDetails': 'Bank Details',
  'PrivacyPolicy': 'Privacy Policy',
  'TermsConditions': 'Terms & Conditions',
  'Wallet': 'Wallet',
  'OrderHistory': 'Order History',
  'MyEarning': 'My Earning',
  'SOS': 'SOS',
  'Login': 'Login',
  'Register': 'Registration',
  'OTP': 'Verification',
  'AuthLanding': 'Welcome',
  'Notification': 'Notification',
};

interface GlobalHeaderProps {
  title?: string;
  onBack?: () => void;
  showBackButton?: boolean;
  backgroundColor?: string;
  titleColor?: string;
  backIconColor?: string;
  screenName?: string; // For auto title detection
}

const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  title,
  onBack,
  showBackButton = true,
  backgroundColor = '#FFFFFF',
  titleColor = '#000000',
  backIconColor = '#0A8F5A',
  screenName,
}) => {
  const insets = useSafeAreaInsets();
  
  // Auto-detect title if not provided
  const displayTitle = title || (screenName && SCREEN_TITLES[screenName]) || 'Screen';

  return (
    <View style={[
      styles.container,
      { 
        backgroundColor,
        paddingTop: insets.top,
        height: scaleHeight(56) + insets.top,
      }
    ]}>
      {showBackButton && (
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Image
            source={require('../../images/previous.png')}
            style={[styles.backIcon]}
          />
        </TouchableOpacity>
      )}
      <Text style={[styles.headerTitle, { color: titleColor }]}>
        {displayTitle}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 100,
  },
  backBtn: {
    position: 'absolute',
    left: scaleWidth(16),
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scaleWidth(8),
    zIndex: 101,
  },

  backIcon: {
    width: scaleWidth(24),
    height: scaleWidth(24),
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: scaleFont(20),
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: scaleWidth(60), // Ensure title doesn't overlap with back button
    maxWidth: width - scaleWidth(120), // Prevent title from being too wide
  },
});

export default GlobalHeader;
