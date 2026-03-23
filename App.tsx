/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar, StyleSheet, useColorScheme, View, BackHandler, Modal, Text, TouchableOpacity, Animated } from 'react-native';
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
import { AppState, AppStateStatus } from 'react-native';

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
      <StatusBar hidden={true} />
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
  const [showExitModal, setShowExitModal] = useState(false);
  const [modalAnimation] = useState(new Animated.Value(0));

  // Check if user is logged in on app start
  useEffect(() => {
    checkLoginStatus();
    // Initialize Firebase notifications safely
    setTimeout(() => {
      firebaseService.initializeNotifications();
    }, 1000); // Delay to ensure Firebase is fully initialized
  }, []);

  // Handle app state changes (background/foreground)
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      console.log('App state changed to:', nextAppState);
      
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        // App is going to background - DON'T change driver status
        console.log('App went to background - keeping driver status as is');
      } else if (nextAppState === 'active') {
        // App is coming to foreground - DON'T change driver status  
        console.log('App came to foreground - keeping driver status as is');
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, []);

  // Handle app close (when app is being terminated)
  useEffect(() => {
    // React Native doesn't have a reliable app close event
    // We'll handle this through the logout and app state changes
    console.log('App close handler initialized');
  }, []);

  // Handle back button press
  useEffect(() => {
    const backAction = () => {
      // If user is not logged in, allow default back behavior (exit app)
      if (!isLoggedIn) {
        return false;
      }

      // If on dashboard, show exit confirmation
      if (currentScreen === 'dashboard') {
        setShowExitModal(true);
        animateModalIn();
        return true; // Prevent default back behavior
      }

      // For all other screens, navigate back to dashboard
      setCurrentScreen('dashboard');
      return true; // Prevent default back behavior
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [isLoggedIn, currentScreen]);

  // Modal animation functions
  const animateModalIn = () => {
    Animated.timing(modalAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const animateModalOut = (callback?: () => void) => {
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setShowExitModal(false);
      callback?.();
    });
  };

  const handleExitConfirm = () => {
    animateModalOut(() => {
      BackHandler.exitApp();
    });
  };

  const handleExitCancel = () => {
    animateModalOut();
  };

  
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

  const handleLogout = async () => {
    setIsLoggedIn(false);
    storage.removeToken();
    
    // Set driver status to inactive on logout
    try {
      await storage.saveDriverStatus('inactive');
      console.log('Driver status set to inactive on logout');
    } catch (error) {
      console.error('Error setting driver status to inactive on logout:', error);
    }
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
      
      {/* Custom Exit Modal */}
      <Modal
        transparent={true}
        visible={showExitModal}
        animationType="none"
        onRequestClose={handleExitCancel}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.modalContent,
              {
                opacity: modalAnimation,
                transform: [
                  {
                    scale: modalAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    })
                  }
                ]
              }
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Exit App</Text>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={styles.modalMessage}>
                Are you sure you want to exit?
              </Text>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleExitCancel}
                activeOpacity={0.8}
              >
                <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.exitButton]}
                onPress={handleExitConfirm}
                activeOpacity={0.8}
              >
                <Text style={[styles.buttonText, styles.exitButtonText]}>Exit</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
  },
  // Custom Exit Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#086B48',
    textAlign: 'center',
  },
  modalBody: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalMessage: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  exitButton: {
    backgroundColor: '#086B48',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: '#374151',
  },
  exitButtonText: {
    color: '#ffffff',
  },
});

export default App;
