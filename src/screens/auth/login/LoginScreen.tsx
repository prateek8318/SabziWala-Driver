import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, Linking, StatusBar, ActivityIndicator, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import styles from './LoginScreen.styles';
import { ApiService } from '../../../services/api';

const LoginScreen = ({ onSendOTP, onNavigateToRegister }: any) => {
  const insets = useSafeAreaInsets();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!agreedToTerms || phoneNumber.length !== 10) {
      if (!agreedToTerms) {
        Toast.show({
          type: 'error',
          text1: 'Terms Required',
          text2: 'Please agree to our Terms of Use and Privacy Policy',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Invalid Number',
          text2: 'Please enter a valid 10-digit mobile number',
        });
      }
      return;
    }

    try {
      setLoading(true);
      const response = await ApiService.sendOtp(phoneNumber);
      
      if (response.status === 200 || response.status === 201) {
        // OTP sent successfully
        Toast.show({
          type: 'success',
          text1: 'OTP Sent!',
          text2: 'OTP has been sent to your mobile number',
        });
        onSendOTP(phoneNumber);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed to Send OTP',
          text2: 'Please try again later',
        });
      }
    } catch (error: any) {
      console.error('Send OTP Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || error.response?.data?.error || 'Failed to send OTP. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >

      {/* 🔹 GREEN CURVED HEADER */}
      <View style={styles.header}>
        <Image
          source={require('../../../images/Vector.png')}
          style={styles.headerVector}
        />

        <Image
          source={require('../../../images/test.png')}
          style={styles.headerText}
        />
      </View>

      {/* 🔹 WHITE CONTENT */}
      <View style={styles.content}>
        <Text style={styles.title}>Please enter Your mobile Number</Text>

        <View style={styles.phoneInputContainer}>
          <Text style={styles.countryCode}>+91</Text>
          <View style={styles.divider} />
          <TextInput
            style={styles.phoneInput}
            placeholder="Enter 10 digit mobile number"
            keyboardType="phone-pad"
            maxLength={10}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        <View style={styles.checkboxContainer}>
          <TouchableOpacity onPress={() => setAgreedToTerms(!agreedToTerms)}>
            <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
              {agreedToTerms && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </TouchableOpacity>

          <Text style={styles.checkboxText}>
            By signing up, you agree to our{' '}
            <Text style={styles.linkText}>Terms of Use</Text> and{' '}
            <Text style={styles.linkText}>Privacy Policy</Text>
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.sendOTPButton,
            (!agreedToTerms || phoneNumber.length !== 10) && styles.disabledButton,
          ]}
          disabled={!agreedToTerms || phoneNumber.length !== 10 || loading}
          onPress={handleSendOTP}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={styles.sendOTPButtonText}>Send OTP</Text>
          )}
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Doesn't have an account? </Text>
          <TouchableOpacity onPress={onNavigateToRegister}>
            <Text style={styles.registerLink}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    </View>
  );
};

export default LoginScreen;
