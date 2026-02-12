import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlobalHeader from '../../../components/GlobalHeader';
import styles from './AccountDetailsScreen.styles';

interface AccountDetailsScreenProps {
  onNavigate?: (screen: string) => void;
}

const AccountDetailsScreen: React.FC<AccountDetailsScreenProps> = ({ onNavigate }) => {
  const [username, setUsername] = useState('anil_sharma');
  const [email, setEmail] = useState('anil.sharma@example.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [accountType, setAccountType] = useState('Driver');
  const [joiningDate, setJoiningDate] = useState('15 Jan 2024');
  const [driverId, setDriverId] = useState('DRV-2024-001');

  const handleBack = () => {
    if (onNavigate) {
      onNavigate('profile');
    }
  };

  const handleSave = () => {
    Alert.alert('Success', 'Account details updated successfully!');
    if (onNavigate) {
      onNavigate('profile');
    }
  };

  const handleDeactivate = () => {
    Alert.alert(
      'Deactivate Account',
      'Are you sure you want to deactivate your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Deactivate', style: 'destructive', onPress: () => {
          Alert.alert('Account Deactivated', 'Your account has been deactivated successfully.');
        }}
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Global Header */}
      <GlobalHeader
        screenName="AccountDetails"
        title="Account Details"
        onBack={handleBack}
        showBackButton={true}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={require('../../../images/profile.png')} 
              style={styles.avatarImg}
            />
          </View>
          <Text style={styles.userName}>Anil Sharma</Text>
          <Text style={styles.userRole}>Driver</Text>
        </View>

        {/* Account Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Username</Text>
            <TextInput
              style={styles.infoInput}
              value={username}
              onChangeText={setUsername}
              editable={false}
            />
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <TextInput
              style={styles.infoInput}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone</Text>
            <TextInput
              style={styles.infoInput}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Account Type</Text>
            <TextInput
              style={[styles.infoInput, styles.disabledInput]}
              value={accountType}
              editable={false}
            />
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Driver ID</Text>
            <TextInput
              style={[styles.infoInput, styles.disabledInput]}
              value={driverId}
              editable={false}
            />
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Joining Date</Text>
            <TextInput
              style={[styles.infoInput, styles.disabledInput]}
              value={joiningDate}
              editable={false}
            />
          </View>
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Actions</Text>
          
          <TouchableOpacity style={styles.actionBtn} onPress={handleSave}>
            <Text style={styles.actionBtnText}>Save Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionBtn, styles.deactivateBtn]} onPress={handleDeactivate}>
            <Text style={[styles.actionBtnText, styles.deactivateBtnText]}>Deactivate Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default AccountDetailsScreen;
