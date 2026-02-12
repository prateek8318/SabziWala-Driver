import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import AuthLandingScreen from '../screens/auth/AuthLandingScreen';
import LoginScreen from '../screens/auth/login/LoginScreen';
import OTPScreen from '../screens/auth/otp/OTPScreen';
import RegisterScreen from '../screens/auth/registration/RegisterScreen';
import RegistrationSubmittedScreen from '../screens/auth/registration/RegistrationSubmittedScreen';

type AuthScreen = 'landing' | 'login' | 'otp' | 'register' | 'submitted';

interface AuthNavigatorProps {
  onLoginSuccess: () => void;
}

const AuthNavigator: React.FC<AuthNavigatorProps> = ({ onLoginSuccess }) => {
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('landing');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleLoginPress = () => {
    setCurrentScreen('login');
  };

  const handleRegisterPress = () => {
    setCurrentScreen('register');
  };

  const handleSendOTP = (phone: string) => {
    setPhoneNumber(phone);
    setCurrentScreen('otp');
  };

  const handleVerifyOTP = (otp: string) => {
    // Handle OTP verification logic here
    console.log('OTP verified:', otp);
    // Navigate to Dashboard after successful verification
    onLoginSuccess();
  };

  const handleResendOTP = () => {
    // Handle resend OTP logic here
    console.log('Resend OTP to:', phoneNumber);
  };

  const handleRegistrationSubmit = (formData: any) => {
    // Handle registration submission logic here
    console.log('Registration submitted:', formData);
    setCurrentScreen('submitted');
  };

  const handleOkayPress = () => {
    setCurrentScreen('landing');
  };

  const handleBackPress = () => {
    setCurrentScreen('landing');
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'landing':
        return (
          <AuthLandingScreen
            onLoginPress={handleLoginPress}
            onRegisterPress={handleRegisterPress}
          />
        );
      case 'login':
        return (
          <LoginScreen
            onSendOTP={handleSendOTP}
            onBackPress={handleBackPress}
            onNavigateToRegister={handleRegisterPress}
          />
        );
      case 'otp':
        return (
          <OTPScreen
            onVerifyOTP={handleVerifyOTP}
            onResendOTP={handleResendOTP}
            onBackPress={handleBackPress}
            phoneNumber={phoneNumber}
          />
        );
      case 'register':
        return (
          <RegisterScreen
            onSubmit={handleRegistrationSubmit}
            onBackPress={handleBackPress}
            onNavigateToLogin={handleLoginPress}
          />
        );
      case 'submitted':
        return (
          <RegistrationSubmittedScreen
            onOkayPress={handleOkayPress}
          />
        );
      default:
        return (
          <AuthLandingScreen
            onLoginPress={handleLoginPress}
            onRegisterPress={handleRegisterPress}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      {renderCurrentScreen()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AuthNavigator;
