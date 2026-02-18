import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import GlobalHeader from '../../../components/GlobalHeader';
import styles from './PrivacyPolicyScreen.styles';
import ApiService from '../../../services/api';
import { PolicyData } from '../../../types/policies';

interface PrivacyPolicyScreenProps {
  onNavigate?: (screen: string) => void;
}

const PrivacyPolicyScreen: React.FC<PrivacyPolicyScreenProps> = ({ onNavigate }) => {
  const [privacyData, setPrivacyData] = useState<PolicyData | null>(null);
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
    fetchPrivacyPolicy();
  }, []);

  const fetchPrivacyPolicy = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getPrivacyPolicy();
      setPrivacyData(response.data.data);
      setError('');
    } catch (err: any) {
      console.error('Error fetching privacy policy:', err);
      setError('Failed to load privacy policy. Please try again.');
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
      <GlobalHeader
        title="Privacy & Policy"
        onBack={handleBack}
        showBackButton
      />

      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#086B48" />
            <Text style={styles.loadingText}>Loading privacy policy...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={fetchPrivacyPolicy}>
              <Text style={styles.retryBtnText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : privacyData ? (
          <Text style={styles.text}>{stripHtmlTags(privacyData.content)}</Text>
        ) : (
          <Text style={styles.noDataText}>No privacy policy available.</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default PrivacyPolicyScreen;
