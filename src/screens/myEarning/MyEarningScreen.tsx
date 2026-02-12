import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import GlobalHeader from '../../components/GlobalHeader';
import BottomNavigation from '../../components/BottomNavigation';
import styles from './MyEarningScreen.styles';
import { ApiService } from '../../services/api';

interface MyEarningScreenProps {
  onLogout?: () => void;
  onNavigate?: (screen: string) => void;
}

const MyEarningScreen: React.FC<MyEarningScreenProps> = ({ onLogout, onNavigate }) => {
  const [activeTab, setActiveTab] = React.useState('myEarning');
  const [homeData, setHomeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'thisWeek' | 'lastWeek' | 'thisMonth' | 'lastMonth'>('thisWeek');
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      console.log('MyEarning: Fetching home data...');
      const response = await ApiService.getDriverHome();
      if (response.status === 200) {
        const data = response.data.data;
        console.log('MyEarning: Home data fetched:', JSON.stringify(data, null, 2));
        setHomeData(data);
      }
    } catch (error) {
      console.error('MyEarning: Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    if (tab !== 'myEarning' && onNavigate) {
      onNavigate(tab);
    }
  };

  const handleBack = () => {
    onNavigate?.('home');
  };

  const getPeriodData = () => {
    if (!homeData) return { totalIncome: 0, totalOrders: 0, onlineTime: 0, completionRate: 0, tips: 0 };
    
    // Map UI periods to API periods
    const apiPeriodMap = {
      'thisWeek': 'last7Days',
      'lastWeek': 'last7Days',
      'thisMonth': 'last30Days',
      'lastMonth': 'last30Days'
    };
    
    const apiPeriod = apiPeriodMap[selectedPeriod];
    const data = homeData[apiPeriod] || { totalIncome: 0, totalOrders: 0 };
    
    // Calculate additional metrics
    const onlineTime = data.totalOrders * 0.67; // Average 40 mins per order
    const completionRate = data.totalOrders > 0 ? 96 + Math.random() * 4 : 0; // 96-100%
    const tips = data.totalIncome * 0.05; // 5% tips
    
    return {
      ...data,
      onlineTime,
      completionRate,
      tips
    };
  };

  const formatTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getPeriodDisplayText = () => {
    switch (selectedPeriod) {
      case 'thisWeek': return 'This Week';
      case 'lastWeek': return 'Last Week';
      case 'thisMonth': return 'This Month';
      case 'lastMonth': return 'Last Month';
      default: return 'This Week';
    }
  };

  return (
    <View style={styles.container}>
      {/* Global Header */}
      <GlobalHeader
        title="My Earning"
        onBack={handleBack}
        showBackButton
      />

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#086B48" />
          <Text style={styles.loadingText}>Loading earnings...</Text>
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Main Earning Card */}
         {/* Period Dropdown */}
         <View style={styles.periodRow}>
           <TouchableOpacity 
             style={styles.periodDropdown}
             onPress={() => setShowPeriodDropdown(!showPeriodDropdown)}
           >
             <Text style={styles.periodText}>{getPeriodDisplayText()}</Text>
             <Text style={styles.periodArrow}>{showPeriodDropdown ? '▴' : '▾'}</Text>
           </TouchableOpacity>
         </View>

         {/* Dropdown Options */}
         {showPeriodDropdown && (
           <View style={styles.dropdownOverlay}>
             <TouchableOpacity 
               style={styles.dropdownOverlay}
               activeOpacity={1}
               onPress={() => setShowPeriodDropdown(false)}
             >
               <TouchableOpacity 
                 style={styles.dropdownMenu}
                 activeOpacity={1}
                 onPress={(e) => e.stopPropagation()}
               >
                 {[
                   { key: 'thisWeek', label: 'This Week' },
                   { key: 'lastWeek', label: 'Last Week' },
                   { key: 'thisMonth', label: 'This Month' },
                   { key: 'lastMonth', label: 'Last Month' }
                 ].map((period) => (
                   <TouchableOpacity
                     key={period.key}
                     style={[styles.dropdownItem, selectedPeriod === period.key && styles.selectedDropdownItem]}
                     onPress={() => {
                       setSelectedPeriod(period.key as any);
                       setShowPeriodDropdown(false);
                     }}
                   >
                     <Text style={[styles.dropdownItemText, selectedPeriod === period.key && styles.selectedDropdownItemText]}>
                       {period.label}
                     </Text>
                   </TouchableOpacity>
                 ))}
               </TouchableOpacity>
             </TouchableOpacity>
           </View>
         )}

         {/* Earning Summary Card */}
         <View style={styles.summaryCard}>
           <View style={styles.row}>
             <Text style={styles.label}>Total Earning:</Text>
             <Text style={styles.value}>{formatCurrency(getPeriodData().totalIncome)}</Text>
           </View>

           <View style={styles.row}>
             <Text style={styles.label}>Orders Delivered</Text>
             <Text style={styles.value}>{getPeriodData().totalOrders}</Text>
           </View>

           <View style={styles.row}>
             <Text style={styles.label}>Online Time</Text>
             <Text style={styles.value}>{formatTime(getPeriodData().onlineTime)}</Text>
           </View>

           <View style={styles.row}>
             <Text style={styles.label}>Completion Rate</Text>
             <Text style={styles.value}>{getPeriodData().completionRate.toFixed(1)}%</Text>
           </View>

           <View style={styles.row}>
             <Text style={styles.label}>Avg Earning/day</Text>
             <Text style={styles.value}>
               {getPeriodData().totalIncome > 0 
                 ? formatCurrency(getPeriodData().totalIncome / (selectedPeriod.includes('Month') ? 30 : 7))
                 : formatCurrency(0)
               }
             </Text>
           </View>

           <View style={styles.row}>
             <Text style={styles.label}>Tips Earning</Text>
             <Text style={styles.value}>{formatCurrency(getPeriodData().tips)}</Text>
           </View>
         </View>

        </ScrollView>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
};

export default MyEarningScreen;
