import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, Modal, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ApiService } from '../../services/api';
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
        
        if (profile?.image) {
          const imageUrl = `http://192.168.1.23:5002/${profile.image.replace(/\\/g, '/')}`;
          console.log('ProfileScreen: Image URL:', imageUrl);
        }
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
            <Image
              source={driverProfile?.image ? 
                { uri: `http://192.168.1.23:5002/${driverProfile.image.replace(/\\/g, '/')}` } : 
                require('../../images/profile.png')
              }
              style={styles.avatarImg}
              onError={() => console.log('Profile image load error:', `http://192.168.1.23:5002/${driverProfile?.image?.replace(/\\/g, '/')}`)}
              defaultSource={require('../../images/profile.png')}
            />
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
