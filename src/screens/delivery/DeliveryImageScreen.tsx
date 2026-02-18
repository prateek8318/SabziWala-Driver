import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, Alert } from 'react-native';
import { launchCamera, MediaType, ImagePickerResponse } from 'react-native-image-picker';
import GlobalHeader from '../../components/GlobalHeader';
import styles from './DeliveryImageScreen.styles';
import { ApiService } from '../../services/api';

interface DeliveryImageScreenProps {
  orderId: string;
  onNavigate?: (screen: string) => void;
}

const DeliveryImageScreen: React.FC<DeliveryImageScreenProps> = ({ orderId, onNavigate }) => {
  const [uploading, setUploading] = useState(false);
  const [photoUri, setPhotoUri] = useState<string>('');

  const title = useMemo(() => (orderId ? `Order #${orderId}` : 'Order'), [orderId]);

  const handleBack = () => {
    onNavigate?.('home');
  };

  const pickPhotoPlaceholder = async () => {
    const options = {
      mediaType: 'photo' as MediaType,
      quality: 0.8 as any,
      maxWidth: 800,
      maxHeight: 600,
    };

    launchCamera(options, async (response: ImagePickerResponse) => {
      if (response.didCancel) {
        return;
      }
      
      if (response.errorMessage) {
        Alert.alert('Error', 'Failed to open camera. Please try again.');
        return;
      }

      if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        setPhotoUri(asset.uri || '');
      }
    });
  };

  const markDelivered = async () => {
    if (!orderId) return;
    if (!photoUri || photoUri === 'placeholder://delivery-photo') {
      Alert.alert('Image Required', 'Please select an image before marking as delivered');
      return;
    }
    
    try {
      setUploading(true);

      // First, get order details to find earnings
      const orderResponse = await ApiService.getDriverOrderDetails(orderId);
      const order = orderResponse.data?.data || orderResponse.data;
      
      // Update order status to delivered
      await ApiService.updateOrderStatus(orderId, 'delivered');

      // Calculate earnings from order
      const earning = 
        order.driverEarning || 
        order.earning || 
        order.deliveryCharge || 
        order.driverIncome || 
        0;

      // Add earnings to wallet if there's any earning
      if (earning > 0) {
        try {
          await ApiService.addEarningsToWallet(orderId, earning);
          console.log(`Added ₹${earning} to wallet for order ${orderId}`);
        } catch (walletError) {
          console.warn('Failed to add earnings to wallet:', walletError);
          // Don't fail the delivery if wallet update fails
        }
      }

      ApiService.createDriverNotification({
        title: 'Order Delivered',
        message: earning > 0
          ? `Order #${orderId} delivered. Earnings: ₹${earning}`
          : `Order #${orderId} delivered successfully.`,
        type: 'order_delivered',
        orderId,
        amount: earning > 0 ? earning : undefined,
      }).catch(() => {});

      onNavigate?.(`deliveryCompleted:${orderId}:${encodeURIComponent(photoUri || '')}`);
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || 'Failed to mark delivered');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <GlobalHeader title={title} onBack={handleBack} showBackButton />

      <View style={styles.center}>
        <Modal visible transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Add Photo</Text>

              <TouchableOpacity 
                style={styles.imagePlaceholder}
                onPress={pickPhotoPlaceholder}
                disabled={uploading}
              >
                {photoUri && photoUri !== 'placeholder://delivery-photo' ? (
                  <Image source={{ uri: photoUri }} style={styles.selectedImage} />
                ) : (
                  <>
                    <Image source={require('../../images/image.png')} style={styles.placeholderIcon} />
                    <Text style={styles.placeholderText}>Tap to take photo</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.uploadBtn, 
                  (!photoUri || photoUri === 'placeholder://delivery-photo') && styles.uploadBtnDisabled,
                  uploading && styles.uploadBtnDisabled
                ]}
                onPress={markDelivered}
                disabled={!photoUri || photoUri === 'placeholder://delivery-photo' || uploading}
              >
                <Text style={styles.uploadBtnText}>
                  {uploading ? 'Uploading...' : 'Mark as Delivered'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </View>
    </View>
  );
};

export default DeliveryImageScreen;

