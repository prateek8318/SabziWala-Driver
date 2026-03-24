import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, Alert } from 'react-native';
import { launchCamera, MediaType, ImagePickerResponse } from 'react-native-image-picker';
import GlobalHeader from '../../components/GlobalHeader';
import styles from './DeliveryImageScreen.styles';
import { ApiService } from '../../services/api';
import { markOrderAsDelivered } from '../../services/orderStatusService';

interface DeliveryImageScreenProps {
  orderId: string;
  onNavigate?: (screen: string) => void;
}

const DeliveryImageScreen: React.FC<DeliveryImageScreenProps> = ({ orderId, onNavigate }) => {
  const [uploading, setUploading] = useState(false);
  const [photoUri, setPhotoUri] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(true);

  const title = useMemo(() => (orderId ? `Order #${orderId}` : 'Order'), [orderId]);

  // Ensure modal is always visible when component mounts
  useEffect(() => {
    setModalVisible(true);
  }, []);

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
    
    // Check if photo is required and not taken
    if (!photoUri || photoUri === 'placeholder://delivery-photo') {
      Alert.alert(
        'Photo Required', 
        'Please take a photo before marking the order as delivered.',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }
    
    try {
      setUploading(true);
      
      // First, check current order status
      const orderCheck = await ApiService.getDriverOrderDetails(orderId);
      const currentOrder = orderCheck.data?.order || orderCheck.data;
      const currentStatus = currentOrder?.status;
      
      console.log('Current order status before delivery:', currentStatus);
      console.log('API Response structure:', JSON.stringify(orderCheck.data, null, 2));
      
      // Validate order status for delivery
      if (!['shipped', 'processing', 'on_the_way', 'accepted'].includes(currentStatus)) {
        Alert.alert(
          'Cannot Deliver Order',
          `Order must be accepted and on the way before delivery. Current status: ${currentStatus}`,
          [{ text: 'OK', style: 'default' }]
        );
        return;
      }

      // First, upload the delivery image
      console.log('Uploading delivery image...');
      const uploadResponse = await ApiService.upload(`driver/upload-delivery-image/${orderId}`, photoUri, 'deliveryImage');
      
      if (!uploadResponse.data.success) {
        throw new Error(uploadResponse.data.message || 'Failed to upload image');
      }
      
      console.log('Image uploaded successfully');

      // First, get order details to find earnings
      const orderResponse = await ApiService.getDriverOrderDetails(orderId);
      const order = orderResponse.data?.order || orderResponse.data;
      
      // Update order status to delivered using proper flow
      // First, ensure order is in accepted status (backend requirement)
      if (currentStatus === 'on_the_way') {
        console.log('Updating status from on_the_way to accepted for delivery...');
        await ApiService.updateOrderStatus(orderId, 'accepted');
      }
      
      await markOrderAsDelivered(orderId);

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
      console.log('=== DELIVERY ERROR ===');
      console.log('Error:', e);
      console.log('Error response:', e?.response?.data);
      console.log('Error status:', e?.response?.status);
      console.log('Order ID:', orderId);
      
      // Try to get current order status for debugging
      try {
        const orderCheck = await ApiService.getDriverOrderDetails(orderId);
        console.log('Current order status:', orderCheck.data?.order?.status || orderCheck.data?.status);
      } catch (checkError) {
        console.log('Could not check order status:', checkError);
      }
      
      Alert.alert('Error', e?.response?.data?.message || e?.message || 'Failed to mark delivered');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <GlobalHeader title={title} onBack={handleBack} showBackButton />

      <View style={styles.center}>
        <Modal visible={modalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Add Photo</Text>
              <Text style={styles.requiredText}>Photo is required to mark order as delivered</Text>

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

              {!photoUri || photoUri === 'placeholder://delivery-photo' ? (
                <Text style={styles.warningText}>⚠️ Photo required before delivery</Text>
              ) : null}
            </View>
          </View>
        </Modal>

      </View>
    </View>
  );
};

export default DeliveryImageScreen;

