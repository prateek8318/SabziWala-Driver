import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from './RegistrationSubmittedScreen.styles';

const { width, height } = Dimensions.get('window');

interface RegistrationSubmittedScreenProps {
  onOkayPress: () => void;
}

const RegistrationSubmittedScreen: React.FC<RegistrationSubmittedScreenProps> = ({ onOkayPress }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <View style={styles.checkmarkContainer}>
          <Text style={styles.checkmark}>✓</Text>
        </View>
        
        <Text style={styles.title}>Registration Submitted</Text>
        <Text style={styles.subtitle}>
          Your registration has been successfully submitted. We will review your details and get back to you within 24-48 hours.
        </Text>
        
        <TouchableOpacity style={styles.okayButton} onPress={onOkayPress}>
          <Text style={styles.okayButtonText}>Okay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegistrationSubmittedScreen;
