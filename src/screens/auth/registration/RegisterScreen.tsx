import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, Alert, Modal, StatusBar, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { launchImageLibrary, launchCamera, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import styles from './RegisterScreen.styles';
import { ApiService } from '../../../services/api';

interface RegisterScreenProps {
  onSubmit: (formData: any) => void;
  onBackPress: () => void;
  onNavigateToLogin?: () => void;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ onSubmit, onBackPress, onNavigateToLogin }) => {
  const insets = useSafeAreaInsets();
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    password: '',
    address: '',
    idProof: '',
    aadharNumber: '',
    vehicleType: '',
    vehicleNumber: '',
    bikeRC: '',
    carRC: '',
    frontImage: '',
    backImage: '',
    dlNumber: '',
    photo: '',
  });

  const [imageFiles, setImageFiles] = useState<{
    image?: any; // driver photo
    vehicleRcImage?: any; // RC book (for bike) or front/back (for car)
    insuranceImage?: any; // insurance
    licenseImage?: any; // license
    adharImage?: any; // aadhar card
    frontImage?: any; // car RC front
    backImage?: any; // car RC back
  }>({});

  const [showImagePickerBottomSheet, setShowImagePickerBottomSheet] = useState(false);
  const [currentImageField, setCurrentImageField] = useState<'photo' | 'frontImage' | 'backImage' | 'vehicleRcImage' | 'insuranceImage' | 'licenseImage' | 'adharImage'>('photo');
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSubmittedModal, setShowSubmittedModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const vehicleTypes = ['Bike', 'Car'];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const showImagePickerOptions = (field: typeof currentImageField) => {
    setCurrentImageField(field);
    setShowImagePickerBottomSheet(true);
  };

  const handleImagePicker = (source: 'camera' | 'gallery' | 'files') => {
    if (source === 'files') {
      // For files, we can use document picker if needed, but for now use gallery
      const options = {
        mediaType: 'photo' as const,
        quality: 0.8 as any,
        includeBase64: false,
      };

      launchImageLibrary(options, (response: ImagePickerResponse) => {
        if (response.didCancel) {
          setShowImagePickerBottomSheet(false);
          return;
        }

        if (response.errorCode) {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: response.errorMessage || 'Failed to pick image',
          });
          setShowImagePickerBottomSheet(false);
          return;
        }

        if (response.assets && response.assets[0]) {
          const asset = response.assets[0];
          const fieldMap: any = {
            'photo': 'image',
            'frontImage': 'frontImage',
            'backImage': 'backImage',
            'adharImage': 'adharImage',
          };
          const apiField = fieldMap[currentImageField] || currentImageField;
          
          setImageFiles(prev => ({
            ...prev,
            [apiField]: {
              uri: asset.uri,
              type: asset.type || 'image/jpeg',
              name: asset.fileName || `${apiField}.jpg`,
            },
          }));
          
          // Also update formData for display
          if (currentImageField === 'photo') {
            setFormData(prev => ({ ...prev, photo: asset.uri || '' }));
          } else if (currentImageField === 'frontImage') {
            setFormData(prev => ({ ...prev, frontImage: asset.uri || '' }));
          } else if (currentImageField === 'backImage') {
            setFormData(prev => ({ ...prev, backImage: asset.uri || '' }));
          } else if (currentImageField === 'adharImage') {
            setFormData(prev => ({ ...prev, idProof: asset.fileName || 'ID Proof uploaded' }));
          }
          
          setShowImagePickerBottomSheet(false);
        }
      });
      return;
    }

    const options = {
      mediaType: 'photo' as const,
      quality: 0.8 as any,
      includeBase64: false,
    };

    const picker = source === 'camera' ? launchCamera : launchImageLibrary;

    picker(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        setShowImagePickerBottomSheet(false);
        return;
      }

      if (response.errorCode) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.errorMessage || 'Failed to pick image',
        });
        setShowImagePickerBottomSheet(false);
        return;
      }

      if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        const fieldMap: any = {
          'photo': 'image',
          'frontImage': 'frontImage',
          'backImage': 'backImage',
          'adharImage': 'adharImage',
        };
        const apiField = fieldMap[currentImageField] || currentImageField;
        
        setImageFiles(prev => ({
          ...prev,
          [apiField]: {
            uri: asset.uri,
            type: asset.type || 'image/jpeg',
            name: asset.fileName || `${apiField}.jpg`,
          },
        }));
        
        // Also update formData for display
        if (currentImageField === 'photo') {
          setFormData(prev => ({ ...prev, photo: asset.uri || '' }));
        } else if (currentImageField === 'frontImage') {
          setFormData(prev => ({ ...prev, frontImage: asset.uri || '' }));
        } else if (currentImageField === 'backImage') {
          setFormData(prev => ({ ...prev, backImage: asset.uri || '' }));
        } else if (currentImageField === 'adharImage') {
          setFormData(prev => ({ ...prev, idProof: asset.fileName || 'ID Proof uploaded' }));
        }
        
        setShowImagePickerBottomSheet(false);
      }
    });
  };


  const handleVehicleTypeSelect = (type: string) => {
    setFormData(prev => ({ 
      ...prev, 
      vehicleType: type,
      bikeRC: type === 'Bike' ? prev.bikeRC : '',
      carRC: type === 'Car' ? prev.carRC : '',
      frontImage: type === 'Car' ? prev.frontImage : '',
      backImage: type === 'Car' ? prev.backImage : ''
    }));
    setShowVehicleDropdown(false);
  };

  const handleSubmit = async () => {
    // Validate required fields
    const requiredFields = ['name', 'phoneNumber', 'email', 'password', 'address', 'aadharNumber', 'vehicleType', 'vehicleNumber', 'dlNumber'];
    const missingFields = requiredFields.filter(field => {
      const value = formData[field as keyof typeof formData];
      return !value || value.toString().trim() === '';
    });
    
    console.log('Form validation:', {
      formData,
      requiredFields,
      missingFields,
      values: requiredFields.map(field => ({ field, value: formData[field as keyof typeof formData] }))
    });
    
    if (missingFields.length > 0) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: `Please fill: ${missingFields.join(', ')}`,
      });
      return;
    }

    // Validate required images based on vehicle type
    if (!imageFiles.image) {
      Toast.show({
        type: 'error',
        text1: 'Missing Photo',
        text2: 'Please upload your photo',
      });
      return;
    }

    if (formData.vehicleType === 'Car' && (!imageFiles.frontImage || !imageFiles.backImage)) {
      Toast.show({
        type: 'error',
        text1: 'Missing RC',
        text2: 'Please upload both Front and Back Car RC images',
      });
      return;
    }

    if (!imageFiles.adharImage) {
      Toast.show({
        type: 'error',
        text1: 'Missing Document',
        text2: 'Please upload Aadhar image',
      });
      return;
    }

    try {
      setLoading(true);

      // Create FormData
      const formDataToSend = new FormData();
      
      // Add text fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('phone', formData.phoneNumber);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('aadharNumber', formData.aadharNumber);
      formDataToSend.append('vehicleNumber', formData.vehicleNumber);
      formDataToSend.append('vehicleType', formData.vehicleType.toLowerCase());
      formDataToSend.append('dlNumber', formData.dlNumber);
      
      // Add bike RC number if bike is selected
      if (formData.vehicleType === 'Bike' && formData.bikeRC) {
        formDataToSend.append('bikeRC', formData.bikeRC);
        // Also try alternative field names
        formDataToSend.append('rcNumber', formData.bikeRC);
        formDataToSend.append('vehicle_rc', formData.bikeRC);
      }
      
      // Add car RC number if car is selected
      if (formData.vehicleType === 'Car' && formData.carRC) {
        formDataToSend.append('carRC', formData.carRC);
        // Also try alternative field names
        formDataToSend.append('rcNumber', formData.carRC);
        formDataToSend.append('vehicle_rc', formData.carRC);
      }

      // Add image files
      if (imageFiles.image) {
        formDataToSend.append('image', imageFiles.image as any);
        // Try alternative field names
        formDataToSend.append('profileImage', imageFiles.image as any);
        formDataToSend.append('driverPhoto', imageFiles.image as any);
      }
      
      // Vehicle RC - for bike use vehicleRcImage, for car use frontImage as vehicleRcImage
      if (formData.vehicleType === 'Bike' && imageFiles.vehicleRcImage) {
        formDataToSend.append('vehicleRcImage', imageFiles.vehicleRcImage as any);
        // Try alternative field names
        formDataToSend.append('rcImage', imageFiles.vehicleRcImage as any);
        formDataToSend.append('bikeRcImage', imageFiles.vehicleRcImage as any);
      } else if (formData.vehicleType === 'Car' && imageFiles.frontImage) {
        // For car, use front image as vehicle RC (backend might need both, adjust as needed)
        formDataToSend.append('vehicleRcImage', imageFiles.frontImage as any);
        // Try alternative field names
        formDataToSend.append('rcImage', imageFiles.frontImage as any);
        formDataToSend.append('carRcFrontImage', imageFiles.frontImage as any);
      }
      
      // For car, also send back image if available
      if (formData.vehicleType === 'Car' && imageFiles.backImage) {
        formDataToSend.append('vehicleRcBackImage', imageFiles.backImage as any);
        // Try alternative field names
        formDataToSend.append('rcBackImage', imageFiles.backImage as any);
        formDataToSend.append('carRcBackImage', imageFiles.backImage as any);
      }
      
      if (imageFiles.adharImage) {
        formDataToSend.append('adharImage', imageFiles.adharImage as any);
        // Try alternative field names
        formDataToSend.append('aadharImage', imageFiles.adharImage as any);
        formDataToSend.append('idProofImage', imageFiles.adharImage as any);
      }

      // Debug: Log what we're sending
      console.log('Registration form data being sent:', {
        textFields: {
          name: formData.name,
          phone: formData.phoneNumber,
          email: formData.email,
          password: formData.password,
          address: formData.address,
          aadharNumber: formData.aadharNumber,
          vehicleNumber: formData.vehicleNumber,
          vehicleType: formData.vehicleType.toLowerCase(),
          dlNumber: formData.dlNumber,
          bikeRC: formData.bikeRC || '',
          carRC: formData.carRC || '',
          // Alternative RC fields being sent
          rcNumber: (formData.vehicleType === 'Bike' ? formData.bikeRC : formData.carRC) || '',
          vehicle_rc: (formData.vehicleType === 'Bike' ? formData.bikeRC : formData.carRC) || '',
        },
        imageFiles: {
          hasImage: !!imageFiles.image,
          hasVehicleRc: !!(formData.vehicleType === 'Bike' ? imageFiles.vehicleRcImage : imageFiles.frontImage),
          hasVehicleRcBack: !!imageFiles.backImage,
          hasAdharImage: !!imageFiles.adharImage,
          // Alternative image fields being sent
          profileImage: !!imageFiles.image,
          driverPhoto: !!imageFiles.image,
          rcImage: !!(formData.vehicleType === 'Bike' ? imageFiles.vehicleRcImage : imageFiles.frontImage),
          bikeRcImage: !!imageFiles.vehicleRcImage,
          carRcFrontImage: !!imageFiles.frontImage,
          carRcBackImage: !!imageFiles.backImage,
          aadharImage: !!imageFiles.adharImage,
          idProofImage: !!imageFiles.adharImage,
        }
      });

      // Call driver register API
      const response = await ApiService.registerDriver(formDataToSend);
      
      console.log('Registration API response:', response);
      
      if (response.status === 200 || response.status === 201) {
        setShowSubmittedModal(true);
        onSubmit(formData);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Registration Failed',
          text2: response.data?.message || response.data?.error || 'Please try again',
        });
      }
    } catch (error: any) {
      console.error('Registration Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || error.response?.data?.error || 'Registration failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* 🔹 WHITE HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Registration</Text>
      </View>

      {/* 🔹 SCROLLABLE CONTENT */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Enter your details to proceed further </Text>
          {/* Upload Your Photo */}
          <View style={styles.photoSection}>
            <TouchableOpacity 
              style={styles.profileImageContainer}
              onPress={() => showImagePickerOptions('photo')}
            >
              <Image 
                source={formData.photo ? { uri: formData.photo } : require('../../../images/profile.png')}
                style={styles.profileImage}
              />
            </TouchableOpacity>
            <Text style={styles.photoLabel}>Upload Your Photo</Text>
          </View>

          {/* Name */}
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            placeholder="Name *"
            placeholderTextColor="#00000080"
          />

          {/* Phone Number */}
          <TextInput
            style={styles.input}
            value={formData.phoneNumber}
            onChangeText={(value) => handleInputChange('phoneNumber', value)}
            placeholder="Phone Number *"
            placeholderTextColor="#00000080"
            keyboardType="phone-pad"
            maxLength={10}
          />

          {/* Email ID */}
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            placeholder="Email ID *"
            placeholderTextColor="#00000080"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Password */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              placeholder="Password *"
              placeholderTextColor="#00000080"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity 
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.eyeIconText}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
            </TouchableOpacity>
          </View>

          {/* Address */}
          <TextInput
            style={[styles.input]}
            value={formData.address}
            onChangeText={(value) => handleInputChange('address', value)}
            placeholder="Address *"
            placeholderTextColor="#00000080"
            numberOfLines={1}
          />

          {/* ID Proof */}
          <TouchableOpacity 
            style={styles.inputWithIcon}
            onPress={() => showImagePickerOptions('adharImage')}
          >
            <TextInput
              style={styles.inputText}
              value={formData.idProof}
              placeholder="ID Proof"
              placeholderTextColor="#00000080"
              editable={false}
            />
            <Text style={styles.paperclipIcon}>📎</Text>
          </TouchableOpacity>

          {/* Aadhar Card Number */}
          <TextInput
            style={styles.input}
            value={formData.aadharNumber}
            onChangeText={(value) => handleInputChange('aadharNumber', value)}
            placeholder="Aadhar Card Number *"
            placeholderTextColor="#00000080"
            keyboardType="numeric"
            maxLength={12}
          />

          {/* Vehicle Type Dropdown */}
          <View style={styles.dropdownContainer}>
            <TouchableOpacity 
              style={styles.inputWithIcon}
              onPress={() => setShowVehicleDropdown(!showVehicleDropdown)}
            >
              <TextInput
                style={styles.inputText}
                value={formData.vehicleType}
                placeholder="Vehicle Type"
                placeholderTextColor="#00000080"
                editable={false}
              />
              <Text style={[styles.dropdownIcon, showVehicleDropdown && styles.dropdownIconRotated]}>▼</Text>
            </TouchableOpacity>
            
            {/* Dropdown Options */}
            {showVehicleDropdown && (
              <View style={styles.dropdownOptions}>
                {vehicleTypes.map((type) => (
                  <TouchableOpacity 
                    key={type} 
                    style={styles.dropdownOption}
                    onPress={() => handleVehicleTypeSelect(type)}
                  >
                    <Text style={styles.dropdownOptionText}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Conditional RC Field */}
          {formData.vehicleType === 'Bike' && (
            <View>
              <TextInput
                style={styles.input}
                value={formData.bikeRC}
                onChangeText={(value) => handleInputChange('bikeRC', value)}
                placeholder="Bike RC"
                placeholderTextColor="#00000080"
              />
            </View>
          )}

          {formData.vehicleType === 'Car' && (
            <>
              <Text style={styles.carRcLabel}>Car RC</Text>
              
              {/* Front and Back Image Upload in Same Row */}
              <View style={styles.imageRowContainer}>
                {/* Front Image Upload */}
                <View style={styles.imageColumn}>
                  <TouchableOpacity 
                    style={styles.imageUploadButton}
                    onPress={() => showImagePickerOptions('frontImage')}
                  >
                    <View style={styles.imageUploadContent}>
                      <Image 
                        source={formData.frontImage ? { uri: formData.frontImage } : require('../../../images/front.png')}
                        style={styles.uploadIcon}
                      />
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Back Image Upload */}
                <View style={styles.imageColumn}>
                  <TouchableOpacity 
                    style={styles.imageUploadButton}
                    onPress={() => showImagePickerOptions('backImage')}
                  >
                    <View style={styles.imageUploadContent}>
                      <Image 
                        source={formData.backImage ? { uri: formData.backImage } : require('../../../images/back.png')}
                        style={styles.uploadIcon}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}

          {/* Vehicle Number */}
          <TextInput
            style={styles.input}
            value={formData.vehicleNumber}
            onChangeText={(value) => handleInputChange('vehicleNumber', value)}
            placeholder="Vehicle Number *"
            placeholderTextColor="#00000080"
          />

          {/* DL Number */}
          <TextInput
            style={styles.input}
            value={formData.dlNumber}
            onChangeText={(value) => handleInputChange('dlNumber', value)}
            placeholder="DL Number *"
            placeholderTextColor="#00000080"
          />

          {/* Submit Button */}
          <TouchableOpacity 
            style={[styles.submitButton, loading && styles.disabledButton]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>Submit For Approval</Text>
            )}
          </TouchableOpacity>

          {/* Already have account */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={onNavigateToLogin}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>


      {/* Image Picker Bottom Sheet */}
      <Modal
        visible={showImagePickerBottomSheet}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowImagePickerBottomSheet(false)}
      >
        <TouchableOpacity 
          style={styles.bottomSheetOverlay}
          activeOpacity={1}
          onPress={() => setShowImagePickerBottomSheet(false)}
        >
          <TouchableOpacity 
            style={styles.bottomSheetContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.bottomSheetHandle} />
            <View style={styles.horizontalPickerContainer}>
              <TouchableOpacity 
                style={styles.pickerOption}
                onPress={() => handleImagePicker('camera')}
              >
                <Text style={styles.pickerIcon}>📷</Text>
                <Text style={styles.pickerLabel}>Camera</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.pickerOption}
                onPress={() => handleImagePicker('gallery')}
              >
                <Text style={styles.pickerIcon}>🖼️</Text>
                <Text style={styles.pickerLabel}>Gallery</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.pickerOption}
                onPress={() => handleImagePicker('files')}
              >
                <Text style={styles.pickerIcon}>📎</Text>
                <Text style={styles.pickerLabel}>Files</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Registration Submitted Modal */}
      <Modal
        visible={showSubmittedModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSubmittedModal(false)}
      >
        <View style={styles.submittedModalOverlay}>
          <View style={styles.submittedModalContent}>
            <Text style={styles.submittedModalTitle}>Registration Submitted</Text>
            <Text style={styles.submittedModalMessage}>
              Thank you for registering! Your details are under review. You'll be notified once approved and can then start accepting deliveries
            </Text>
            <Image 
              source={require('../../../images/truck.png')}
              style={styles.truckImage}
              resizeMode="contain"
            />
            <TouchableOpacity 
              style={styles.submittedModalButton}
              onPress={() => setShowSubmittedModal(false)}
            >
              <Text style={styles.submittedModalButtonText}>Okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default RegisterScreen;
