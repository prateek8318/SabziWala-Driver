import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import styles from './DeliveryCompletedScreen.styles';

interface DeliveryCompletedScreenProps {
  orderId: string;
  photoUri?: string;
  onNavigate?: (screen: string) => void;
}

const DeliveryCompletedScreen: React.FC<DeliveryCompletedScreenProps> = ({ orderId, onNavigate }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delivery Completed</Text>

      <View style={styles.illustrationWrap}>
        <Image source={require('../../images/box.png')} style={styles.box} />
       
      </View>

      <TouchableOpacity style={styles.backBtn} onPress={() => onNavigate?.('home')}>
        <Text style={styles.backBtnText}>Back to home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DeliveryCompletedScreen;

