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
import { ApiService } from '../../../services/api';
import { launchImageLibrary } from 'react-native-image-picker';


const EditProfileScreen = ({ onNavigate }: any) => {
  const [driverProfile, setDriverProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNo: '',
    vehicleType: '',
    vehicleNumber: '',
    dlNumber: '',
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
          email: profile.email || '',
          mobileNo: profile.mobileNo || '',
          vehicleType: profile.vehicleType || '',
          vehicleNumber: profile.vehicleNumber || '',
          dlNumber: profile.dlNumber || '',
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
    try {
      setLoading(true);
      const profileFormData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          profileFormData.append(key, value);
        }
      });
      
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
        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          <TouchableOpacity onPress={handleImagePick}>
            {driverProfile?.image ? (
              <Image
                source={{ uri: `http://192.168.1.23:5002/${driverProfile.image.replace(/\\/g, '/')}` }}
                style={styles.profileImage}
              />
            ) : (
              <Image
                source={require('../../../images/profile.png')}
                style={styles.profileImage}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={handleImagePick}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>


        {/* Inputs */}
        <Input 
          value={formData.name} 
          onChangeText={(text: string) => setFormData({...formData, name: text})}
          placeholder="Name"
        />
        <Input 
          value={formData.mobileNo} 
          onChangeText={(text: string) => setFormData({...formData, mobileNo: text})}
          placeholder="Mobile Number"
          editable={false}
        />
        <Input 
          value={formData.email} 
          onChangeText={(text: string) => setFormData({...formData, email: text})}
          placeholder="Email"
        />

        {/* ID Proof */}
        <View style={styles.inputWithIcon}>
          <TextInput
            placeholder="ID Proof"
            style={styles.input}
            placeholderTextColor="#999"
          />
          <Text style={styles.clip}>📎</Text>
        </View>

        <Input 
          value={formData.vehicleType} 
          onChangeText={(text: string) => setFormData({...formData, vehicleType: text})}
          placeholder="Vehicle Type" 
          rightIcon="⌄" 
        />
        <Input 
          value={formData.vehicleNumber} 
          onChangeText={(text: string) => setFormData({...formData, vehicleNumber: text})}
          placeholder="Vehicle Number" 
        />

        {/* Vehicle RC */}
        <Text style={styles.sectionTitle}>Vehicle RC</Text>

        <View style={styles.uploadRow}>
          <UploadBox label="Front Image" />
          <UploadBox label="Back Image" />
        </View>

        <Input 
          value={formData.dlNumber} 
          onChangeText={(text: string) => setFormData({...formData, dlNumber: text})}
          placeholder="DL Number" 
        />

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

const Input = ({ value, placeholder, rightIcon }: any) => (
  <View style={styles.inputWrapper}>
    <TextInput
      value={value}
      placeholder={placeholder}
      placeholderTextColor="#999"
      style={styles.input}
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
