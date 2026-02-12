import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from './AuthLandingScreen.styles';

const { width, height } = Dimensions.get('window');

interface AuthLandingScreenProps {
  onLoginPress: () => void;
  onRegisterPress: () => void;
}

const AuthLandingScreen: React.FC<AuthLandingScreenProps> = ({ onLoginPress, onRegisterPress }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <Image 
          source={require('../../images/delivery.png')} 
          style={styles.deliveryImage}
          resizeMode="contain"
        />
        <Text style={styles.title}>Your Next Delivery Awaits</Text>
        
        
        <TouchableOpacity style={styles.loginButton} onPress={onLoginPress}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.registerButton} onPress={onRegisterPress}>
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AuthLandingScreen;
