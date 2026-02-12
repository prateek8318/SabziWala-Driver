import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import GlobalHeader from '../../../components/GlobalHeader';
import ApiService from '../../../services/api';
import CustomToast from '../../../components/CustomToast';
import styles from './BankDetailsScreen.styles';

interface BankDetails {
  bankName?: string;
  branchName?: string;
  beneficiaryName?: string;
  accountNo?: string;
  ifsc?: string;
  upiId?: string;
}

interface BankDetailsScreenProps {
  onNavigate?: (screen: string) => void;
}

const BankDetailsScreen: React.FC<BankDetailsScreenProps> = ({ onNavigate }) => {
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'success' as 'success' | 'error' | 'warning' | 'info',
  });
  const [formData, setFormData] = useState({
    bankName: '',
    branchName: '',
    beneficiaryName: '',
    accountNo: '',
    confirmAccountNo: '',
    ifsc: '',
    upiId: ''
  });

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  useEffect(() => {
    fetchBankDetails();
  }, []);

  const fetchBankDetails = async () => {
    try {
      const response = await ApiService.getDriverBankDetails();
      if (response.data?.success && response.data?.data) {
        setBankDetails(response.data.data);
      } else {
        setBankDetails(null);
      }
    } catch (error) {
      console.log('Error fetching bank details:', error);
      setBankDetails(null);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleBack = () => {
    if (onNavigate) {
      onNavigate('profile');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEdit = () => {
    if (bankDetails) {
      setFormData({
        bankName: bankDetails.bankName || '',
        branchName: bankDetails.branchName || '',
        beneficiaryName: bankDetails.beneficiaryName || '',
        accountNo: bankDetails.accountNo || '',
        confirmAccountNo: bankDetails.accountNo || '',
        ifsc: bankDetails.ifsc || '',
        upiId: bankDetails.upiId || ''
      });
      setIsEditing(true);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Bank Details',
      'Are you sure you want to delete your bank details?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: deleteBankDetails
        }
      ]
    );
  };

  const deleteBankDetails = async () => {
    setLoading(true);
    try {
      const response = await ApiService.deleteDriverBankDetails();
      if (response.data?.success) {
        setBankDetails(null);
        setIsEditing(false);
        showToast('Bank details deleted successfully', 'success');
      } else {
        showToast(response.data?.message || 'Failed to delete bank details', 'error');
      }
    } catch (error: any) {
      console.log('Delete bank details error:', error);
      showToast(error.response?.data?.message || 'Failed to delete bank details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      bankName: '',
      branchName: '',
      beneficiaryName: '',
      accountNo: '',
      confirmAccountNo: '',
      ifsc: '',
      upiId: ''
    });
  };

  const validateForm = () => {
    if (!formData.bankName.trim()) {
      showToast('Please enter bank name', 'warning');
      return false;
    }
    if (!formData.branchName.trim()) {
      showToast('Please enter branch name', 'warning');
      return false;
    }
    if (!formData.beneficiaryName.trim()) {
      showToast('Please enter account holder name', 'warning');
      return false;
    }
    if (!formData.accountNo.trim()) {
      showToast('Please enter account number', 'warning');
      return false;
    }
    if (formData.accountNo !== formData.confirmAccountNo) {
      showToast('Account numbers do not match', 'warning');
      return false;
    }
    if (!formData.ifsc.trim()) {
      showToast('Please enter IFSC code', 'warning');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await ApiService.updateDriverBankDetails({
        bankName: formData.bankName,
        branchName: formData.branchName,
        beneficiaryName: formData.beneficiaryName,
        accountNo: formData.accountNo,
        ifsc: formData.ifsc,
        upiId: formData.upiId.trim() || undefined
      });

      if (response.data?.success) {
        const updatedDetails = {
          bankName: formData.bankName,
          branchName: formData.branchName,
          beneficiaryName: formData.beneficiaryName,
          accountNo: formData.accountNo,
          ifsc: formData.ifsc,
          upiId: formData.upiId.trim() || undefined
        };
        setBankDetails(updatedDetails);
        setIsEditing(false);
        showToast(
          isEditing ? 'Bank details updated successfully!' : 'Bank details added successfully!',
          'success'
        );
      } else {
        showToast(response.data?.message || 'Failed to save bank details', 'error');
      }
    } catch (error: any) {
      console.log('Bank details error:', error);
      showToast(error.response?.data?.message || 'Failed to save bank details. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const renderBankDetails = () => {
    if (!bankDetails || !bankDetails.bankName) {
      return null;
    }

    return (
      <View style={styles.detailsCard}>
        <View style={styles.detailsHeader}>
          <Text style={styles.detailsTitle}>Bank Account Details</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEdit}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roundIconBtn, styles.deleteBtn]}
              onPress={handleDelete}
            >
              <Image 
                source={require('../../../images/delete.png')} 
                style={styles.deleteIcon} 
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Bank Name:</Text>
          <Text style={styles.detailValue}>{bankDetails.bankName}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Branch Name:</Text>
          <Text style={styles.detailValue}>{bankDetails.branchName}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Account Holder:</Text>
          <Text style={styles.detailValue}>{bankDetails.beneficiaryName}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Account Number:</Text>
          <Text style={styles.detailValue}>{bankDetails.accountNo}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>IFSC Code:</Text>
          <Text style={styles.detailValue}>{bankDetails.ifsc}</Text>
        </View>
        
        {bankDetails.upiId && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>UPI ID:</Text>
            <Text style={styles.detailValue}>{bankDetails.upiId}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderForm = () => {
    if (!isEditing && bankDetails && bankDetails.bankName) {
      return null;
    }

    return (
      <View>
        {!isEditing && (
          <Text style={styles.formTitle}>Add Bank Details</Text>
        )}
        
        <TextInput
          style={styles.input}
          placeholder="Bank Name"
          placeholderTextColor="#9E9E9E"
          value={formData.bankName}
          onChangeText={(value) => handleInputChange('bankName', value)}
        />

        <TextInput
          style={styles.input}
          placeholder="Branch Name"
          placeholderTextColor="#9E9E9E"
          value={formData.branchName}
          onChangeText={(value) => handleInputChange('branchName', value)}
        />

        <TextInput
          style={styles.input}
          placeholder="Account Holder Name"
          placeholderTextColor="#9E9E9E"
          value={formData.beneficiaryName}
          onChangeText={(value) => handleInputChange('beneficiaryName', value)}
        />

        <TextInput
          style={styles.input}
          placeholder="Account Number"
          placeholderTextColor="#9E9E9E"
          keyboardType="number-pad"
          value={formData.accountNo}
          onChangeText={(value) => handleInputChange('accountNo', value)}
        />

        <TextInput
          style={styles.input}
          placeholder="Re- Account Number"
          placeholderTextColor="#9E9E9E"
          keyboardType="number-pad"
          value={formData.confirmAccountNo}
          onChangeText={(value) => handleInputChange('confirmAccountNo', value)}
        />

        <TextInput
          style={styles.input}
          placeholder="IFSC Code"
          placeholderTextColor="#9E9E9E"
          autoCapitalize="characters"
          value={formData.ifsc}
          onChangeText={(value) => handleInputChange('ifsc', value.toUpperCase())}
        />

        <TextInput
          style={styles.input}
          placeholder="UPI ID (Optional)"
          placeholderTextColor="#9E9E9E"
          value={formData.upiId}
          onChangeText={(value) => handleInputChange('upiId', value)}
        />

        <View style={styles.buttonRow}>
          {isEditing && (
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel} disabled={loading}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[styles.addButton, isEditing && styles.updateButton]} 
            onPress={handleSubmit} 
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.addButtonText}>
                {isEditing ? 'Update' : 'Add Account'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (fetchLoading) {
    return (
      <View style={styles.container}>
        <GlobalHeader
          title="Account Details"
          onBack={handleBack}
          showBackButton
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0A8F5A" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GlobalHeader
        title="Account Details"
        onBack={handleBack}
        showBackButton
      />

      <ScrollView contentContainerStyle={styles.content}>
        {renderBankDetails()}
        {renderForm()}
      </ScrollView>

      <CustomToast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
    </View>
  );
};

export default BankDetailsScreen;
