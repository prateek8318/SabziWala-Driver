import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  Linking,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import GlobalHeader from '../../components/GlobalHeader';
import styles from './SosScreen.styles';
import ApiService from '../../services/api';
import { SOSRequest } from '../../types/sos';
import { SOSSettingsData } from '../../types/sos-settings';

interface SOSScreenProps {
  onLogout?: () => void;
  onNavigate?: (screen: string) => void;
}

const SOSScreen: React.FC<SOSScreenProps> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [remarks, setRemarks] = useState('');
  const [sosType, setSosType] = useState<SOSRequest['sosType']>('breakdown');
  const [loading, setLoading] = useState(false);
  const [showSosOptions, setShowSosOptions] = useState(false);
  const [sosSettings, setSosSettings] = useState<SOSSettingsData | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(true);

  const sosTypeOptions = [
    { label: 'Breakdown', value: 'breakdown' as const },
    { label: 'Accident', value: 'accident' as const },
    { label: 'Medical', value: 'medical' as const },
    { label: 'Theft', value: 'theft' as const },
    { label: 'Emergency', value: 'emergency' as const },
  ];

  // Fetch SOS settings on component mount
  useEffect(() => {
    fetchSOSSettings();
  }, []);

  const fetchSOSSettings = async () => {
    try {
      const response = await ApiService.getSOSSettings();
      setSosSettings(response.data.data);
      
      // Auto-fill driver details if enabled
      if (response.data.data.formSettings.autoFillDriverDetails) {
        // You can get driver details from storage or API
        // For now, keeping empty as we don't have driver profile data
      }
    } catch (error) {
      console.error('Error fetching SOS settings:', error);
      // Continue with default settings if API fails
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleBack = () => {
    onNavigate?.('home');
  };

  const validateForm = (): boolean => {
    // Check if remarks are required
    if (sosSettings?.formSettings.requireRemarks && !remarks.trim()) {
      Alert.alert('Error', 'Please enter remarks');
      return false;
    }
    
    // Check if emergency contact is required
    if (sosSettings?.formSettings.showEmergencyContact) {
      if (!name.trim()) {
        Alert.alert('Error', 'Please enter emergency contact name');
        return false;
      }
      if (!mobile.trim() || mobile.length !== 10) {
        Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
        return false;
      }
    }
    return true;
  };

  const handleEmergencyCall = () => {
    if (sosSettings?.emergencyCall.isActive && sosSettings.emergencyCall.mobile) {
      Linking.openURL(`tel:${sosSettings.emergencyCall.mobile}`);
    } else {
      Alert.alert('Error', 'Emergency call service is not available');
    }
  };

  const handleWhatsAppSupport = () => {
    if (sosSettings?.whatsappSupport.isActive && sosSettings.whatsappSupport.mobile) {
      const message = sosSettings.whatsappSupport.message.replace('[location]', 'Current Location');
      const whatsappUrl = `https://wa.me/${sosSettings.whatsappSupport.mobile}?text=${encodeURIComponent(message)}`;
      Linking.openURL(whatsappUrl);
    } else {
      Alert.alert('Error', 'WhatsApp support is not available');
    }
  };

  const getIconForEmergencyType = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'police':
      case 'shield':
        return require('../../images/police.png');
      case 'ambulance':
        return require('../../images/ambulance.png');
      case 'fire':
        return require('../../images/fire.png');
      default:
        return require('../../images/call.png');
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const sosData: SOSRequest = {
        remarks: remarks.trim(),
        sosType,
        emergencyContact: {
          name: name.trim(),
          mobile: mobile.trim(),
        },
      };

      const response = await ApiService.submitSOSRequest(sosData);
      
      Alert.alert(
        'Success',
        'SOS request submitted successfully. We will contact you soon.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setName('');
              setMobile('');
              setRemarks('');
              setSosType('breakdown');
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('SOS submission error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to submit SOS request. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <GlobalHeader title="SOS" onBack={handleBack} />

        {settingsLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#086B48" />
            <Text style={styles.loadingText}>Loading SOS settings...</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.content}>

            {/* Call Buttons - Only show if active in settings */}
            {sosSettings?.emergencyCall.isActive && (
              <TouchableOpacity style={styles.actionCard} onPress={handleEmergencyCall}>
                <Image
                  source={require('../../images/call.png')}
                  style={styles.actionIcon}
                />
                <Text style={styles.actionText}>{sosSettings.emergencyCall.name}</Text>
              </TouchableOpacity>
            )}

            {sosSettings?.whatsappSupport.isActive && (
              <TouchableOpacity style={styles.actionCard} onPress={handleWhatsAppSupport}>
                <Image
                  source={require('../../images/whatsapp.png')}
                  style={styles.actionIcon}
                />
                <Text style={styles.actionText}>{sosSettings.whatsappSupport.name}</Text>
              </TouchableOpacity>
            )}

            {/* Enquiry Form */}
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Fill this Enquiry Form</Text>

              {/* SOS Type Selection */}
              <View style={styles.sosTypeContainer}>
                <Text style={styles.sosTypeLabel}>SOS Type:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sosOptionsContainer}>
                  {sosTypeOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.sosOptionButton,
                        sosType === option.value && styles.sosOptionButtonActive,
                      ]}
                      onPress={() => setSosType(option.value)}
                    >
                      <Text
                        style={[
                          styles.sosOptionText,
                          sosType === option.value && styles.sosOptionTextActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Emergency Contact Fields - Only show if enabled in settings */}
              {sosSettings?.formSettings.showEmergencyContact && (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Your Name"
                    placeholderTextColor="#000"
                    value={name}
                    onChangeText={setName}
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Mobile Number"
                    placeholderTextColor="#000"
                    keyboardType="phone-pad"
                    value={mobile}
                    onChangeText={setMobile}
                  />
                </>
              )}

              {/* Remarks - Only show if required in settings */}
              {sosSettings?.formSettings.requireRemarks && (
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Remarks"
                  placeholderTextColor="#000"
                  multiline
                  numberOfLines={4}
                  value={remarks}
                  onChangeText={setRemarks}
                />
              )}

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
            </View>

            {/* Emergency Services - Use quick dial buttons from settings */}
            <View style={styles.emergencyRow}>
              {sosSettings?.quickDialButtons
                .sort((a, b) => a.order - b.order)
                .map((button) => (
                  <EmergencyItem
                    key={button.name}
                    icon={getIconForEmergencyType(button.icon)}
                    label={`${button.name} (${button.mobile})`}
                    onPress={() => Linking.openURL(`tel:${button.mobile}`)}
                  />
                ))}
            </View>

          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const EmergencyItem = ({
  icon,
  label,
  onPress,
}: {
  icon: any;
  label: string;
  onPress?: () => void;
}) => (
  <TouchableOpacity style={styles.emergencyItem} onPress={onPress}>
    <Image source={icon} style={styles.emergencyIcon} />
    <Text style={styles.emergencyText}>{label}</Text>
  </TouchableOpacity>
);

export default SOSScreen;
