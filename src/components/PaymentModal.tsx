import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { ApiService } from '../services/api';
import { QRGenerateResponse, CashCollectionResponse } from '../types/payment';
import styles from './PaymentModal.styles';

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  orderId: string;
  orderAmount: number;
  onPaymentComplete: (method: 'qr' | 'cash') => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  visible,
  onClose,
  orderId,
  orderAmount,
  onPaymentComplete,
}) => {
  const [qrData, setQrData] = useState<QRGenerateResponse['data'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [cashLoading, setCashLoading] = useState(false);

  const generateQRCode = async () => {
    try {
      setLoading(true);
      console.log('Generating QR Code for order:', orderId, 'amount:', orderAmount);
      
      const response = await ApiService.generateQRCode({
        orderId,
        amount: orderAmount,
      });

      console.log('QR Generation Response:', response.data);

      if (response.data.success && response.data.data) {
        setQrData(response.data.data);
        console.log('QR Code generated successfully:', response.data.data.qrImageUrl);
      } else {
        console.log('QR Generation failed:', response.data);
        Alert.alert('Error', response.data.message || 'Failed to generate QR code');
      }
    } catch (error: any) {
      console.error('QR Generation Error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      let errorMessage = 'Failed to generate QR code. Please try again.';
      if (error.response?.status === 404) {
        errorMessage = 'QR generation endpoint not found. Please check server configuration.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.code === 'NETWORK_ERROR') {
        errorMessage = 'Network error. Please check your internet connection.';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const markCashCollected = async () => {
    try {
      setCashLoading(true);
      console.log('Marking cash as collected for order:', orderId, 'amount:', orderAmount);
      
      const response = await ApiService.markCashCollected({
        orderId,
        amount: orderAmount,
      });

      console.log('Cash Collection Response:', response.data);

      if (response.data.success) {
        Alert.alert('Success', 'Cash payment marked as collected');
        onPaymentComplete('cash');
        onClose();
      } else {
        console.log('Cash Collection failed:', response.data);
        Alert.alert('Error', response.data.message || 'Failed to mark cash as collected');
      }
    } catch (error: any) {
      console.error('Cash Collection Error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      let errorMessage = 'Failed to mark cash as collected. Please try again.';
      if (error.response?.status === 404) {
        errorMessage = 'Cash collection endpoint not found. Please check server configuration.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.code === 'NETWORK_ERROR') {
        errorMessage = 'Network error. Please check your internet connection.';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setCashLoading(false);
    }
  };

  const handleClose = () => {
    setQrData(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Payment Options</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          {/* Order Info */}
          <View style={styles.orderInfo}>
            <Text style={styles.orderLabel}>Order #{orderId}</Text>
            <Text style={styles.orderAmount}>Amount: ₹{orderAmount}</Text>
          </View>

          {/* Payment Options */}
          <View style={styles.paymentOptions}>
            {/* QR Payment Option */}
            <TouchableOpacity
              style={styles.paymentOption}
              onPress={generateQRCode}
              disabled={loading}
            >
              <View style={styles.paymentOptionLeft}>
                <Text style={styles.paymentOptionTitle}>Pay via QR Code</Text>
                <Text style={styles.paymentOptionSubtitle}>
                  Generate QR for UPI payment
                </Text>
              </View>
              {loading ? (
                <ActivityIndicator size="small" color="#086B48" />
              ) : (
                <Image
                  source={require('../images/qr.png')}
                  style={styles.paymentOptionIcon}
                />
              )}
            </TouchableOpacity>

            {/* Cash Payment Option */}
            <TouchableOpacity
              style={styles.paymentOption}
              onPress={markCashCollected}
              disabled={cashLoading}
            >
              <View style={styles.paymentOptionLeft}>
                <Text style={styles.paymentOptionTitle}>Pay by Cash</Text>
                <Text style={styles.paymentOptionSubtitle}>
                  Mark cash as collected
                </Text>
              </View>
              {cashLoading ? (
                <ActivityIndicator size="small" color="#086B48" />
              ) : (
                <Image
                  source={require('../images/wallet.png')}
                  style={styles.paymentOptionIcon}
                />
              )}
            </TouchableOpacity>
          </View>

          {/* Cancel Button - Only show if no QR generated */}
          {!qrData && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}

          {/* QR Code Display - Show after payment options */}
          {qrData && (
            <View style={styles.qrDisplay}>
              <Text style={styles.qrTitle}>Scan QR Code to Pay</Text>
              <Text style={styles.qrSubtitle}>Order #{orderId}</Text>
              <Text style={styles.qrAmount}>Amount: ₹{orderAmount}</Text>
              
              <View style={styles.qrCodeWrapper}>
                <Image
                  source={{ uri: qrData.qrImageUrl }}
                  style={styles.qrCodeImage}
                  resizeMode="contain"
                />
              </View>
              
              <Text style={styles.qrInstruction}>
                Scan this QR code with any UPI app
              </Text>
              <Text style={styles.qrExpiry}>
                Expires in 15 minutes
              </Text>
              
              {/* Close button after QR generation */}
              <TouchableOpacity
                style={[styles.cancelButton, { marginTop: 15 }]}
                onPress={handleClose}
              >
                <Text style={styles.cancelButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Note */}
          <Text style={styles.noteText}>
            Note: Once payment is completed, the order will be marked as delivered
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default PaymentModal;
