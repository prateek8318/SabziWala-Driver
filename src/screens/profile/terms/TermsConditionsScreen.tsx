import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlobalHeader from '../../../components/GlobalHeader';
import styles from './TermsConditionsScreen.styles';
import ApiService from '../../../services/api';
import { PolicyData } from '../../../types/policies';

interface TermsConditionsScreenProps {
  onNavigate?: (screen: string) => void;
}

const TermsConditionsScreen: React.FC<TermsConditionsScreenProps> = ({ onNavigate }) => {
  const [termsData, setTermsData] = useState<PolicyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchTermsConditions();
  }, []);

  const fetchTermsConditions = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getTermsConditions();
      setTermsData(response.data.data);
      setError('');
    } catch (err: any) {
      console.error('Error fetching terms and conditions:', err);
      setError('Failed to load terms and conditions. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const handleBack = () => {
    if (onNavigate) {
      onNavigate('profile');
    }
  };

  return (
    <View style={styles.container}>
      {/* Global Header */}
      <GlobalHeader
        screenName="TermsConditions"
        title="Terms & Conditions"
        onBack={handleBack}
        showBackButton={true}
      />

       <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#086B48" />
            <Text style={styles.loadingText}>Loading terms and conditions...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={fetchTermsConditions}>
              <Text style={styles.retryBtnText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : termsData ? (
          <Text style={styles.text}>{termsData.content}</Text>
        ) : (
          <Text style={styles.noDataText}>No terms and conditions available.</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default TermsConditionsScreen;
