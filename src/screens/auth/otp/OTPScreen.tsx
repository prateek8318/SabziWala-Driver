import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StatusBar, KeyboardAvoidingView, Platform, ActivityIndicator, Image, ScrollView, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import styles from './OTPScreen.styles';
import { ApiService } from '../../../services/api';
import { storage } from '../../../services/storage';

interface OTPScreenProps {
  onVerifyOTP: (otp: string) => void;
  onResendOTP: () => void;
  onBackPress: () => void;
  phoneNumber: string;
}

const OTPScreen: React.FC<OTPScreenProps> = ({ phoneNumber, onVerifyOTP, onResendOTP, onBackPress }) => {
  const insets = useSafeAreaInsets();
  const [otp, setOtp] = useState(['', '', '', '']); // 4-digit OTP for driver API
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>(Array(4).fill(null));

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      // Force layout reset when keyboard hides
      setTimeout(() => {
        // This helps reset the layout
      }, 100);
    });

    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleOTPChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input when a digit is entered
    if (value && index < 3) {
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 100);
    }

    // Auto-submit when last digit is entered
    if (value && index === 3) {
      const otpString = [...newOtp.slice(0, 3), value].join('');
      if (otpString.length === 4) {
        setTimeout(() => {
          handleVerifyOTP(otpString);
        }, 200);
      }
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    // Handle backspace
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async (passedOtp?: string) => {
    const otpString = passedOtp || otp.join('');
    
    // Driver API uses 4-digit OTP
    if (otpString.length !== 4) {
      Toast.show({
        type: 'error',
        text1: 'Incomplete OTP',
        text2: 'Please enter 4 digit OTP',
      });
      return;
    }

    try {
      setLoading(true);
      // Use driver login endpoint with OTP
      const response = await ApiService.driverLogin(phoneNumber, otpString);
      
      if (response.status === 200 || response.status === 201) {
        // Token is already saved in driverLogin function
        Toast.show({
          type: 'success',
          text1: 'OTP Verified!',
          text2: 'Login successful!',
        });
        onVerifyOTP(otpString);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Invalid OTP',
          text2: 'Please try again',
        });
      }
    } catch (error: any) {
      console.error('Verify OTP Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || error.response?.data?.error || 'Invalid OTP. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setResendLoading(true);
      const response = await ApiService.sendOtp(phoneNumber);
      
      if (response.status === 200 || response.status === 201) {
        Toast.show({
          type: 'success',
          text1: 'OTP Sent!',
          text2: '📤 OTP has been sent to your mobile number',
        });
        // Clear OTP inputs (4 digits)
        setOtp(['', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed to Resend',
          text2: '❌ Please try again',
        });
      }
    } catch (error: any) {
      console.error('Resend OTP Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: '❌ ' + (error.response?.data?.message || 'Failed to resend OTP. Please try again.'),
      });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 🔹 GREEN CURVED HEADER - SAME AS LOGIN */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          
          <Image
            source={require('../../../images/Vector.png')}
            style={styles.headerVector}
          />

          <View style={styles.headerContent}>
            <Image
              source={require('../../../images/test.png')}
              style={styles.headerText}
            />
          </View>
        </View>

        {/* 🔹 WHITE CONTENT */}
        <View style={styles.content}>
          <React.Fragment>
            <Text style={styles.instructionText}>
              We have sent OTP to
            </Text>
            <Text style={styles.phoneNumberText}>+91 {phoneNumber}</Text>
          </React.Fragment>

          {/* 🔹 OTP INPUTS */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                style={styles.otpInput}
                value={digit}
                onChangeText={(value) => handleOTPChange(value, index)}
                onKeyPress={({ nativeEvent: { key } }) => handleKeyPress(key, index)}
                keyboardType="number-pad"
                maxLength={1}
                secureTextEntry={false}
                textAlign="center"
                selectionColor="#086B48"
              />
            ))}
          </View>

          {/* 🔹 RESEND LINK */}
          <TouchableOpacity onPress={handleResendOTP} disabled={resendLoading}>
            {resendLoading ? (
              <ActivityIndicator color="#086B48" size="small" />
            ) : (
              <Text style={styles.resendLink}>Re-send</Text>
            )}
          </TouchableOpacity>

          {/* 🔹 VERIFY BUTTON */}
          <TouchableOpacity
            style={[
              styles.verifyButton,
              otp.join('').length !== 4 && styles.disabledButton,
            ]}
            disabled={otp.join('').length !== 4 || loading}
            onPress={() => handleVerifyOTP()}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.verifyButtonText}>Continue</Text>
            )}
          </TouchableOpacity>

          {/* 🔹 RESEND SECTION */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive the OTP SMS?</Text>
          </View>

          {/* 🔹 REGISTER SECTION */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Doesn't have an account? </Text>
            <TouchableOpacity>
              <Text style={styles.registerLink}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default OTPScreen;