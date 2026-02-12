import { useRoute } from '@react-navigation/native';

// Screen title mapping
const SCREEN_TITLES: { [key: string]: string } = {
  'Dashboard': 'Home',
  'Profile': 'Profile',
  'Wallet': 'Wallet',
  'OrderHistory': 'Order History',
  'MyEarning': 'My Earning',
  'SOS': 'SOS',
  'Login': 'Login',
  'Register': 'Registration',
  'OTP': 'Verification',
  'AuthLanding': 'Welcome',
};

export const useScreenTitle = (): string => {
  const route = useRoute();
  const routeName = route.name as string;
  
  return SCREEN_TITLES[routeName] || routeName;
};

export default useScreenTitle;
