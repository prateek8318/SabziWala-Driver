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

  // Function to remove HTML tags and format content
  const stripHtmlTags = (html: string): string => {
    if (!html) return '';
    
    // Remove HTML tags
    let text = html.replace(/<[^>]*>/g, '');
    
    // Replace HTML entities
    text = text.replace(/&amp;/g, '&');
    text = text.replace(/&lt;/g, '<');
    text = text.replace(/&gt;/g, '>');
    text = text.replace(/&quot;/g, '"');
    text = text.replace(/&#39;/g, "'");
    text = text.replace(/&nbsp;/g, ' ');
    
    // Clean up extra whitespace
    text = text.replace(/\s+/g, ' ').trim();
    
    // Add proper line breaks for common HTML elements
    text = text.replace(/\.\s*/g, '.\n\n');
    text = text.replace(/\d+\.\s*/g, (match) => match + '\n');
    text = text.replace(/([.!?])\s*/g, '$1\n\n');
    
    return text;
  };

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
          <Text style={styles.text}>{stripHtmlTags(termsData.content)}</Text>
        ) : (
          <Text style={styles.noDataText}>No terms and conditions available.</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default TermsConditionsScreen;
