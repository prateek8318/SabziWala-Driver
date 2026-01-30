/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import SplashScreen from './src/screens/SplashScreen';
import AuthNavigator from './src/navigation/AuthNavigator';
import DashboardScreen from './src/screens/dashboard/DashboardScreen';
import WalletScreen from './src/screens/wallet/WalletScreen';
import OrderHistoryScreen from './src/screens/orderHistory/OrderHistoryScreen';
import MyEarningScreen from './src/screens/myEarning/MyEarningScreen';
import SosScreen from './src/screens/sos/SosScreen';
import ProfileScreen from './src/screens/profile/ProfileScreen';
import EditProfileScreen from './src/screens/profile/edit/EditProfileScreen';
import BankDetailsScreen from './src/screens/profile/bank/BankDetailsScreen';
import PrivacyPolicyScreen from './src/screens/profile/privacy/PrivacyPolicyScreen';
import TermsConditionsScreen from './src/screens/profile/terms/TermsConditionsScreen';
import ReportIssueScreen from './src/screens/report-issue/ReportIssueScreen';
import ProductDetailsScreen from './src/screens/productDetails/ProductDetailsScreen';
import DeliveryImageScreen from './src/screens/delivery/DeliveryImageScreen';
import DeliveryCompletedScreen from './src/screens/delivery/DeliveryCompletedScreen';
import OrderDetailsScreen from './src/screens/orderHistory/OrderDetailsScreen';
import Toast from 'react-native-toast-message';
import React, { useState, useEffect } from 'react';
import { storage } from './src/services/storage';
import { firebaseService } from './src/services/firebase';

type ScreenType =
  | 'dashboard'
  | 'wallet'
  | 'orderHistory'
  | 'myEarning'
  | 'sos'
  | 'profile'
  | 'editProfile'
  | 'bankDetails'
  | 'privacyPolicy'
  | 'termsConditions'
  | 'reportIssue'
  | 'productDetails'
  | 'deliveryImage'
  | 'deliveryCompleted'
  | 'orderDetails';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('dashboard');
  const [productDetailsOrderId, setProductDetailsOrderId] = useState<string>('');
  const [productDetailsSource, setProductDetailsSource] = useState<'ongoing' | 'history'>('ongoing');
  const [deliveryOrderId, setDeliveryOrderId] = useState<string>('');
  const [deliveryPhotoUri, setDeliveryPhotoUri] = useState<string>('');
  const [orderDetailsOrderId, setOrderDetailsOrderId] = useState<string>('');

  // Check if user is logged in on app start
  useEffect(() => {
    checkLoginStatus();
    // Firebase initialization moved to when needed
  }, []);

  
  const checkLoginStatus = async () => {
    try {
      const token = await storage.getToken();
      setIsLoggedIn(!!token);
    } catch (error) {
      console.error('Error checking login status:', error);
      setIsLoggedIn(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    storage.removeToken();
  };

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleNavigate = (screen: string) => {
    // Handle productDetails:orderId pattern
    if (screen.startsWith('productDetails:')) {
      // productDetails:orderId[:source]
      const payload = screen.replace('productDetails:', '');
      const [orderId, source = 'ongoing'] = payload.split(':', 2);
      setProductDetailsOrderId(orderId);
      setProductDetailsSource(source === 'history' ? 'history' : 'ongoing');
      setCurrentScreen('productDetails');
      return;
    }

    // Handle orderDetails:orderId pattern
    if (screen.startsWith('orderDetails:')) {
      const orderId = screen.replace('orderDetails:', '');
      setOrderDetailsOrderId(orderId);
      setCurrentScreen('orderDetails');
      return;
    }

    // Handle delivery flow screens
    if (screen.startsWith('deliveryImage:')) {
      const orderId = screen.replace('deliveryImage:', '');
      setDeliveryOrderId(orderId);
      setCurrentScreen('deliveryImage');
      return;
    }

    if (screen.startsWith('deliveryCompleted:')) {
      // deliveryCompleted:orderId[:photoUri]
      const payload = screen.replace('deliveryCompleted:', '');
      const [orderId, photoUri = ''] = payload.split(':', 2);
      setDeliveryOrderId(orderId);
      setDeliveryPhotoUri(photoUri);
      setCurrentScreen('deliveryCompleted');
      return;
    }

    const screenMap: { [key: string]: ScreenType } = {
      'home': 'dashboard',
      'wallet': 'wallet',
      'history': 'orderHistory',
      'earning': 'myEarning',
      'sos': 'sos',
      'profile': 'profile',
      'editProfile': 'editProfile',
      'bankDetails': 'bankDetails',
      'privacyPolicy': 'privacyPolicy',
      'termsConditions': 'termsConditions',
      'reportIssue': 'reportIssue',
    };
    
    const mappedScreen = screenMap[screen];
    if (mappedScreen) {
      setCurrentScreen(mappedScreen);
    }
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <DashboardScreen onLogout={handleLogout} onNavigate={handleNavigate} />;
      case 'wallet':
        return <WalletScreen onNavigate={handleNavigate} />;
      case 'orderHistory':
        return <OrderHistoryScreen onLogout={handleLogout} onNavigate={handleNavigate} />;
      case 'myEarning':
        return <MyEarningScreen onLogout={handleLogout} onNavigate={handleNavigate} />;
      case 'sos':
        return <SosScreen onLogout={handleLogout} onNavigate={handleNavigate} />;
      case 'profile':
        return <ProfileScreen onLogout={handleLogout} onNavigate={handleNavigate} />;
      case 'editProfile':
        return <EditProfileScreen onNavigate={handleNavigate} />;
      case 'bankDetails':
        return <BankDetailsScreen onNavigate={handleNavigate} />;
      case 'privacyPolicy':
        return <PrivacyPolicyScreen onNavigate={handleNavigate} />;
      case 'termsConditions':
        return <TermsConditionsScreen onNavigate={handleNavigate} />;
      case 'reportIssue':
        return <ReportIssueScreen onNavigate={handleNavigate} />;
      case 'productDetails':
        return (
          <ProductDetailsScreen
            orderId={productDetailsOrderId}
            source={productDetailsSource}
            onNavigate={handleNavigate}
          />
        );
      case 'orderDetails':
        return <OrderDetailsScreen orderId={orderDetailsOrderId} onNavigate={handleNavigate} />;
      case 'deliveryImage':
        return <DeliveryImageScreen orderId={deliveryOrderId} onNavigate={handleNavigate} />;
      case 'deliveryCompleted':
        return (
          <DeliveryCompletedScreen
            orderId={deliveryOrderId}
            photoUri={deliveryPhotoUri}
            onNavigate={handleNavigate}
          />
        );
      default:
        return <DashboardScreen onLogout={handleLogout} onNavigate={handleNavigate} />;
    }
  };

  // Show splash while checking login status or during splash animation
  if (showSplash || isLoggedIn === null) {
    return (
      <View style={styles.container}>
        <SplashScreen onAnimationComplete={handleSplashComplete} />
        <Toast />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isLoggedIn ? (
        renderCurrentScreen()
      ) : (
        <AuthNavigator onLoginSuccess={handleLoginSuccess} />
      )}
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
