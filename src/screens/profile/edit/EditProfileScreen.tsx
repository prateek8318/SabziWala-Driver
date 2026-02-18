import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
  Image,
} from 'react-native';
import GlobalHeader from '../../../components/GlobalHeader';
import styles from './EditProfileScreen.styles';
import { ApiService, IMAGE_BASE_URL } from '../../../services/api';
import { launchImageLibrary } from 'react-native-image-picker';


const EditProfileScreen = ({ onNavigate }: any) => {
  const [driverProfile, setDriverProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [imageLoadErrors, setImageLoadErrors] = useState<{[key: string]: number}>({});
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobileNo: '',
    email: '',
  });

  useEffect(() => {
    fetchDriverProfile();
  }, []);

  const fetchDriverProfile = async () => {
    try {
      const response = await ApiService.getDriverProfile();
      if (response.status === 200) {
        const profile = response.data.driver;
        setDriverProfile(profile);
        setFormData({
          name: profile.name || '',
          mobileNo: profile.mobileNo || '',
          email: profile.email || '',
        });
      }
    } catch (error) {
      console.error('Error fetching driver profile:', error);
    }
  };

  const handleImagePick = () => {
    const options = {
      mediaType: 'photo' as const,
      includeBase64: false,
      maxHeight: 200,
      maxWidth: 200,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const source = response.assets?.[0];
        if (source?.uri) {
          uploadProfileImage(source.uri);
        }
      }
    });
  };

  const uploadProfileImage = async (imageUri: string) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      } as any);

      const response = await ApiService.updateDriverProfile(formData);
      if (response.status === 200) {
        Alert.alert('Success', 'Profile image updated successfully!');
        fetchDriverProfile(); // Refresh profile data
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Check if any changes were made
    const hasChanges = (
      formData.name !== (driverProfile?.name || '') ||
      formData.mobileNo !== (driverProfile?.mobileNo || '') ||
      formData.email !== (driverProfile?.email || '')
    );

    if (!hasChanges) {
      Alert.alert('No Changes', 'No changes were made to update.');
      return;
    }

    try {
      setLoading(true);
      const profileFormData = new FormData();
      profileFormData.append('name', formData.name);
      profileFormData.append('mobileNo', formData.mobileNo);
      profileFormData.append('email', formData.email);
      
      const response = await ApiService.updateDriverProfile(profileFormData);
      if (response.status === 200) {
        Alert.alert('Success', 'Profile updated successfully!');
        onNavigate?.('profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    onNavigate?.('profile');
  };

  return (
    <View style={styles.container}>
      <GlobalHeader
        title="User Profile"
        showBackButton
        onBack={handleBack}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Avatar - Editable */}
        <View style={styles.avatarWrapper}>
          <TouchableOpacity onPress={handleImagePick} disabled={loading}>
            <View style={styles.avatar}>
              {driverProfile?.image ? (
                (() => {
                  const imagePath = driverProfile.image.replace(/\\/g, '/');
                  // Remove 'public/' prefix if it exists since IMAGE_BASE_URL already includes it
                  const cleanPath = imagePath.startsWith('public/') ? imagePath.substring(6) : imagePath;
                  // Ensure no leading slash to avoid double slashes
                  const normalizedPath = cleanPath.startsWith('/') ? cleanPath.substring(1) : cleanPath;
                  
                  const imageUrl = `${IMAGE_BASE_URL}${normalizedPath}`;
                  const fallbackUrl = `${IMAGE_BASE_URL}${imagePath}`;
                  const alternativeUrl1 = `${IMAGE_BASE_URL.replace('/public/', '/')}${normalizedPath}`;
                  const alternativeUrl2 = `${IMAGE_BASE_URL}driver/${driverProfile.image.split('\\').pop()}`;
                  
                  const errorCount = imageLoadErrors[driverProfile.image] || 0;
                  const urls = [imageUrl, fallbackUrl, alternativeUrl1, alternativeUrl2];
                  const currentUrl = urls[Math.min(errorCount, urls.length - 1)];
                  
                  return (
                    <Image 
                      source={{ uri: currentUrl }} 
                      style={styles.profileImage}
                      onError={(e) => {
                        if (errorCount < urls.length - 1) {
                          setImageLoadErrors(prev => ({
                            ...prev,
                            [driverProfile.image]: errorCount + 1
                          }));
                        }
                      }}
                      onLoad={() => {
                        setImageLoadErrors(prev => {
                          const newState = { ...prev };
                          delete newState[driverProfile.image];
                          return newState;
                        });
                      }}
                    />
                  );
                })()
              ) : (
                <Image
                  source={require('../../../images/profile.png')}
                  style={styles.profileImage}
                />
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleImagePick} disabled={loading}>
            <Text style={styles.editText}>Edit Photo</Text>
          </TouchableOpacity>
        </View>


        {/* Editable Fields */}
        <Input 
          value={formData.name} 
          onChangeText={(text: string) => setFormData({...formData, name: text})}
          placeholder="Name"
          editable={true}
        />
        <Input 
          value={formData.mobileNo} 
          onChangeText={(text: string) => setFormData({...formData, mobileNo: text})}
          placeholder="Mobile Number"
          editable={true}
        />
        <Input 
          value={formData.email} 
          onChangeText={(text: string) => setFormData({...formData, email: text})}
          placeholder="Email"
          editable={true}
        />

        {/* Read-only Fields */}
        <View style={styles.readOnlySection}>
          <Text style={styles.readOnlyTitle}>Vehicle Information (Read-only)</Text>
          <Input 
            value={driverProfile?.vehicleType || ''} 
            placeholder="Vehicle Type" 
            editable={false}
            onChangeText={() => {}}
          />
          <Input 
            value={driverProfile?.vehicleNumber || ''} 
            placeholder="Vehicle Number" 
            editable={false}
            onChangeText={() => {}}
          />
          <Input 
            value={driverProfile?.dlNumber || ''} 
            placeholder="DL Number" 
            editable={false}
            onChangeText={() => {}}
          />
        </View>

        {/* Vehicle RC - Only for bikes */}
        {driverProfile?.vehicleType?.toLowerCase() === 'bike' && (
          <View style={styles.rcSection}>
            <Text style={styles.sectionTitle}>Vehicle RC</Text>
            <View style={styles.uploadRow}>
              <UploadBox label="Front Image" />
              <UploadBox label="Back Image" />
            </View>
          </View>
        )}

        {/* Save */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.saveText}>Save</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const Input = ({ value, placeholder, rightIcon, editable = true, onChangeText }: any) => (
  <View style={styles.inputWrapper}>
    <TextInput
      value={value}
      placeholder={placeholder}
      placeholderTextColor="#999"
      style={styles.input}
      editable={editable}
      onChangeText={onChangeText}
    />
    {rightIcon && <Text style={styles.rightIcon}>{rightIcon}</Text>}
  </View>
);

const UploadBox = ({ label }: any) => (
  <View style={styles.uploadBox}>
    <Image
      source={label === 'Front Image' ? require('../../../images/front.png') : require('../../../images/back.png')}
      style={styles.uploadImage}
    />
  </View>
);

export default EditProfileScreen;
