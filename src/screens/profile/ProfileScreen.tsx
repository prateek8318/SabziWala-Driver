import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, Modal, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ApiService, IMAGE_BASE_URL } from '../../services/api';
import GlobalHeader from '../../components/GlobalHeader';
import styles from './ProfileScreen.styles';


interface ProfileScreenProps {
  onLogout?: () => void;
  onNavigate?: (screen: string) => void;
}



const ProfileScreen: React.FC<ProfileScreenProps> = ({ onLogout, onNavigate }) => {
  const insets = useSafeAreaInsets();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [driverProfile, setDriverProfile] = useState<any>(null);
  const [imageLoadErrors, setImageLoadErrors] = useState<{[key: string]: number}>({});

  useEffect(() => {
    fetchDriverProfile();
  }, []);

  const fetchDriverProfile = async () => {
    try {
      console.log('ProfileScreen: Fetching driver profile...');
      const response = await ApiService.getDriverProfile();
      if (response.status === 200) {
        const profile = response.data.driver;
        console.log('ProfileScreen: Driver profile fetched:', JSON.stringify(profile, null, 2));
        setDriverProfile(profile);
      }
    } catch (error) {
      console.error('ProfileScreen: Error fetching driver profile:', error);
    }
  };

  const handleLogout = async () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      setLoading(true);
      await ApiService.logout();
      // Call the logout callback
      if (onLogout) {
        onLogout();
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API fails, call logout callback
      if (onLogout) {
        onLogout();
      }
    } finally {
      setLoading(false);
      setShowLogoutModal(false);
    }
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const handleBack = () => {
    // Navigate back to dashboard
    if (onNavigate) {
      onNavigate('home');
    }
  };

  return (
    <View style={styles.container}>
      {/* Global Header */}
      <GlobalHeader
        screenName="Profile"
        onBack={handleBack}
        showBackButton={true}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
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
                
                console.log('=== PROFILE IMAGE DEBUG ===');
                console.log('Original Image Path:', driverProfile.image);
                console.log('Converted Image Path:', imagePath);
                console.log('Clean Path:', cleanPath);
                console.log('Normalized Path:', normalizedPath);
                console.log('Current URL:', currentUrl);
                console.log('Error Count:', errorCount);
                console.log('============================');
                
                return (
                  <Image 
                    source={{ uri: currentUrl }} 
                    style={styles.avatarImg}
                    onError={(e) => {
                      console.log('Image load error:', e.nativeEvent.error);
                      console.log('Failed URL:', currentUrl);
                      
                      if (errorCount < urls.length - 1) {
                        // Try next URL
                        setImageLoadErrors(prev => ({
                          ...prev,
                          [driverProfile.image]: errorCount + 1
                        }));
                      } else {
                        // All URLs failed, show default image
                        console.log('All URLs failed, showing default image');
                      }
                    }}
                    onLoad={() => {
                      console.log('Image loaded successfully:', currentUrl);
                      // Reset error state on successful load
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
              <Image source={require('../../images/profile.png')} style={styles.avatarImg} />
            )}
          </View>
          <TouchableOpacity onPress={() => onNavigate && onNavigate('editProfile')}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Menu */}
        <View style={styles.menu}>
          <MenuItem 
            title="User Profile" 
            onPress={() => onNavigate && onNavigate('editProfile')}
          />
          <MenuItem 
            title="Report Issue" 
            onPress={() => onNavigate && onNavigate('reportIssue')}
          />
          <MenuItem 
            title="Bank Details" 
            onPress={() => onNavigate && onNavigate('bankDetails')}
          />
          <MenuItem 
            title="Privacy & Policy" 
            onPress={() => onNavigate && onNavigate('privacyPolicy')}
          />
          <MenuItem 
            title="Terms & Condition" 
            onPress={() => onNavigate && onNavigate('termsConditions')}
          />
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logout} onPress={handleLogout}>
          <View style={styles.logoutIcon}>
            <Image
              source={require('../../images/logout.png')}
              style={styles.logoutIconImg}
            />
          </View>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelLogout}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.blurLayer1} />
          <View style={styles.blurLayer2} />
          <View style={styles.modalContent}>
            
            <Text style={styles.modalMessage}>Are you sure you want to logout?</Text>
            
            <View style={styles.modalButtons}>
               <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmLogout}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.confirmButtonText}>Yes </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={cancelLogout}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>No</Text>
              </TouchableOpacity>
              
             
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const MenuItem = ({ title, onPress }: { title: string; onPress?: () => void }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Text style={styles.menuText}>{title}</Text>
  </TouchableOpacity>
);

export default ProfileScreen;
