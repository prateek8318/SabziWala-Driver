import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import GlobalHeader from '../../components/GlobalHeader';
import styles from './ReportIssueScreen.styles';
import ApiService from '../../services/api';
import { IncidentType, ReportIssueRequest } from '../../types/report-issue';
import * as ImagePicker from 'react-native-image-picker';

const INCIDENT_TYPES = [
  { label: 'Road Accident', value: 'road_accident' as IncidentType },
  { label: 'Customer Unresponsive', value: 'customer_unresponsive' as IncidentType },
  { label: 'Package Damaged', value: 'package_damaged' as IncidentType },
  { label: 'Personal Injury', value: 'personal_injury' as IncidentType },
  { label: 'Others', value: 'others' as IncidentType },
];

const ReportIssueScreen = ({ onNavigate }: any) => {
  const [selectedIncident, setSelectedIncident] = useState<string>('');
  const [description, setDescription] = useState('');
  const [relatedOrder, setRelatedOrder] = useState('');
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'error' | 'success' | 'info'>('error');

  const INCIDENTS = [
    'Road Accident',
    'Customer Unresponsive',
    'Package Damaged',
    'Personal Injury',
    'Others',
  ];

  const toggleIncident = (incident: string) => {
    setSelectedIncident(prev => prev === incident ? '' : incident);
  };

  const showCustomAlert = (message: string, type: 'error' | 'success' | 'info' = 'error') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      showCustomAlert('Please enter a description', 'error');
      return;
    }

    if (!selectedIncident) {
      showCustomAlert('Please select an incident type', 'error');
      return;
    }

    // Check if any meaningful data was entered
    const hasContent = description.trim().length > 0 || 
                       (relatedOrder.trim().length > 0) || 
                       photos.length > 0;

    if (!hasContent) {
      showCustomAlert('Please provide some details about the issue', 'error');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      
      // Convert selected incident to API format
      const incidentTypeMap: { [key: string]: string } = {
        'Road Accident': 'road_accident',
        'Customer Unresponsive': 'customer_unresponsive',
        'Package Damaged': 'package_damaged',
        'Personal Injury': 'personal_injury',
        'Others': 'others'
      };
      
      formData.append('incidentType', incidentTypeMap[selectedIncident] || 'others');
      formData.append('description', description.trim());
      
      if (relatedOrder.trim()) {
        formData.append('relatedOrder', relatedOrder.trim());
      }
      
      photos.forEach((photo, index) => {
        formData.append(`photos`, {
          uri: photo.uri,
          type: photo.type || 'image/jpeg',
          name: photo.name || `photo_${index}.jpg`,
        } as any);
      });

      const response = await ApiService.submitReportIssue(formData);
      
      setPhotos([]);
      showCustomAlert('Issue reported successfully. We will look into it.', 'success');
      setTimeout(() => {
        onNavigate?.('home');
      }, 1500);
    } catch (error: any) {
      console.error('Report issue error:', error);
      showCustomAlert(
        error.response?.data?.message || 'Failed to report issue. Please try again.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = () => {
    const options = {
      mediaType: 'photo' as const,
      maxWidth: 1024,
      maxHeight: 1024,
      quality: 0.8 as any,
      selectionLimit: 5 - photos.length, // Allow max 5 photos total
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel || response.errorMessage) {
        return;
      }

      if (response.assets && response.assets.length > 0) {
        const newPhotos = [...photos, ...response.assets];
        if (newPhotos.length <= 5) {
          setPhotos(newPhotos);
        } else {
          showCustomAlert('You can only upload a maximum of 5 photos', 'error');
        }
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <GlobalHeader
          title="Report Issue"
          onBack={() => onNavigate?.('profile')}
          showBackButton
        />

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.sectionTitle}>Select Incident Type</Text>

          {INCIDENTS.map(incident => (
            <TouchableOpacity
              key={incident}
              style={styles.checkboxRow}
              onPress={() => toggleIncident(incident)}
            >
              <View style={[
                styles.checkbox,
                selectedIncident === incident && styles.checkboxActive
              ]} />
              <Text style={styles.checkboxText}>{incident}</Text>
            </TouchableOpacity>
          ))}

          <TextInput
            style={styles.input}
            placeholder="Related Order ID (Optional)"
            placeholderTextColor="#000"
            value={relatedOrder}
            onChangeText={setRelatedOrder}
          />

          <TextInput
            style={styles.textArea}
            placeholder="Describe the issue in detail..."
            placeholderTextColor="#000"
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />

          <Text style={styles.attachTitle}>Attach Photos (Max 5)</Text>

          <View style={styles.attachBox}>
            {photos.length > 0 ? (
              <View style={styles.photoPreview}>
                <Text style={styles.photoCount}>{photos.length} photos selected</Text>
              </View>
            ) : (
              <Image
                source={require('../../images/image.png')}
                style={styles.attachImg}
              />
            )}

            <TouchableOpacity style={styles.attachBtn} onPress={handlePhotoUpload}>
              <View style={styles.attachBtnContent}>
                <Image
                  source={require('../../images/attach.png')}
                  style={styles.Img}
                />
                <Text style={styles.attachBtnText}>Attach Photo</Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.submitText}>Submit</Text>
            )}
          </TouchableOpacity>
        </ScrollView>

        {/* SUCCESS MODAL */}
        <Modal transparent visible={showSuccess} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.successIconContainer}>
                <View style={styles.successCircle}>
                  <Text style={styles.successCheck}>✓</Text>
                </View>
              </View>
              
              <Text style={styles.modalTitle}>Issue Reported</Text>
              <Text style={styles.modalSubtitle}>
                Your issue has been reported successfully. We will look into it and get back to you soon.
              </Text>

              <TouchableOpacity
                style={styles.modalBtn}
                onPress={() => {
                  setShowSuccess(false);
                  onNavigate?.('home');
                }}
              >
                <Text style={styles.modalBtnText}>Back to home</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* CUSTOM ALERT MODAL */}
        <Modal transparent visible={showAlert} animationType="fade">
          <View style={styles.alertOverlay}>
            <View style={[
              styles.alertCard,
              alertType === 'error' && styles.alertCardError,
              alertType === 'success' && styles.alertCardSuccess,
              alertType === 'info' && styles.alertCardInfo
            ]}>
              <Text style={[
                styles.alertText,
                alertType === 'error' && styles.alertTextError,
                alertType === 'success' && styles.alertTextSuccess,
                alertType === 'info' && styles.alertTextInfo
              ]}>
                {alertMessage}
              </Text>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ReportIssueScreen;
