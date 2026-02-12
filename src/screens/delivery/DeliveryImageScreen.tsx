import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, Alert } from 'react-native';
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
    // NOTE: This project currently doesn't have an image picker dependency wired.
    // We keep a placeholder URI so UI flow works; integrate react-native-image-picker later if needed.
    setPhotoUri('placeholder://delivery-photo');
  };

  const markDelivered = async () => {
    if (!orderId) return;
    try {
      setUploading(true);

      // If backend expects a photo upload, wire ApiService.upload(...) to the correct endpoint.
      // For now we only update status to delivered.
      await ApiService.updateOrderStatus(orderId, 'delivered');

      ApiService.createDriverNotification({
        title: 'Order Delivered',
        message: `Order #${orderId} delivered successfully.`,
        type: 'order_delivered',
        orderId,
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

              <View style={styles.imagePlaceholder}>
                <Image source={require('../../images/image.png')} style={styles.placeholderIcon} />
              </View>

              <TouchableOpacity
                style={[styles.uploadBtn, uploading && styles.uploadBtnDisabled]}
                onPress={async () => {
                  await pickPhotoPlaceholder();
                  await markDelivered();
                }}
                disabled={uploading}
              >
                <Text style={styles.uploadBtnText}>{uploading ? 'Uploading...' : 'Click here to upload'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default DeliveryImageScreen;

