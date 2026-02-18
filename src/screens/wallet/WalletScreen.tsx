import React, { useState, useEffect } from 'react';

import { 

  View, 

  Text, 

  TextInput, 

  TouchableOpacity, 

  ScrollView, 

  ActivityIndicator,

  Alert,

  Dimensions 

} from 'react-native';

import GlobalHeader from '../../components/GlobalHeader';

import BottomNavigation from '../../components/BottomNavigation';

import { ApiService } from '../../services/api';

import styles from './WalletScreen.styles';



interface WalletScreenProps {

  onNavigate?: (screen: string) => void;

}



interface WalletData {

  walletBalance: number;

  cashCollection: number;

  totalCredits?: number;

  totalDebits?: number;

  walletHistory: Array<{

    _id: string;

    action: 'credit' | 'debit' | 'withdrawal' | 'settlement';

    type?: 'credit' | 'debit' | 'pending_settlement';

    label?: string;

    icon?: string;

    amount: number;

    balance?: number;

    balance_after_action?: number;

    description: string;

    date?: string;

    createdAt: string;

    status?: string;

  }>;

}



interface WalletRequest {

  _id: string;

  amount_requested: number;

  message: string;

  status: 'pending' | 'approved' | 'rejected';

  admin_settled: boolean;

  request_date: string;

  createdAt: string;

  updatedAt: string;

}



const WalletScreen: React.FC<WalletScreenProps> = ({ onNavigate }) => {

  const [activeTab, setActiveTab] = useState('wallet');

  const [historyTab, setHistoryTab] = useState<'transaction' | 'settlement'>('transaction');

  const [walletData, setWalletData] = useState<WalletData | null>(null);

  const [walletRequests, setWalletRequests] = useState<WalletRequest[]>([]);

  const [amount, setAmount] = useState('');

  const [loading, setLoading] = useState(true);

  const [redeemLoading, setRedeemLoading] = useState(false);



  const normalizeWalletData = (payload: any): WalletData | null => {

    if (!payload) return null;



    // Backend may return either:

    // A) { status:'success', walletBalance, cashCollection, walletHistory }

    // B) { walletBalance, cashCollection, walletHistory }

    // C) { data: { walletBalance, ... } }

    const src = payload.data && typeof payload.data === 'object' ? payload.data : payload;



    const walletBalance = Number(src.walletBalance ?? 0);

    const cashCollection = Number(src.cashCollection ?? 0);

    const walletHistory = Array.isArray(src.walletHistory) ? src.walletHistory : [];



    return {

      walletBalance: Number.isFinite(walletBalance) ? walletBalance : 0,

      cashCollection: Number.isFinite(cashCollection) ? cashCollection : 0,

      walletHistory,

    } as WalletData;

  };



  // Fetch wallet data

  const fetchWalletData = async () => {

    try {

      console.log('Fetching wallet data...');

      const response = await ApiService.getDriverWallet();

      console.log('Wallet response:', response);

      const data = normalizeWalletData(response?.data);

      console.log('Normalized wallet data:', data);

      if (data) setWalletData(data);

    } catch (error) {

      console.error('Error fetching wallet data:', error);

      Alert.alert('Error', 'Failed to fetch wallet data');

    } finally {

      setLoading(false);

    }

  };



  // Fetch wallet requests

  const fetchWalletRequests = async () => {

    try {

      console.log('Fetching wallet requests...');

      const response = await ApiService.getWalletRequests();

      console.log('Wallet requests response:', response);

      const payload = response?.data;

      const src = payload?.data && typeof payload.data === 'object' ? payload.data : payload;

      const list = (src?.wallet_requests ?? src?.walletRequests ?? src?.wallet_requests_list) as any;

      console.log('Wallet requests list:', list);

      setWalletRequests(Array.isArray(list) ? list : []);

    } catch (error) {

      console.error('Error fetching wallet requests:', error);

    }

  };



  useEffect(() => {

    fetchWalletData();

    fetchWalletRequests();

  }, []);



  // Validate amount

  const validateAmount = () => {

    const numAmount = parseFloat(amount);

    

    if (!amount || isNaN(numAmount) || numAmount <= 0) {

      return false;

    }

    

    if (walletData?.cashCollection && walletData.cashCollection > 0) {

      return false;

    }

    

    if (walletData && numAmount > walletData.walletBalance) {

      return false;

    }

    

    return true;

  };



  // Handle redeem request

  const handleRedeem = async () => {

    if (!validateAmount()) {

      if (walletData?.cashCollection && walletData.cashCollection > 0) {

        Alert.alert('Error', 'Cannot raise request: Clear the Cash balance first');

      } else if (walletData && parseFloat(amount) > walletData.walletBalance) {

        Alert.alert('Error', 'Insufficient wallet balance');

      } else {

        Alert.alert('Error', 'Please enter a valid amount');

      }

      return;

    }



    setRedeemLoading(true);

    try {

      const response = await ApiService.createWalletRequest(

        parseFloat(amount),

        'Withdrawal request'

      );

      

      console.log('Redeem response:', response);

      

      if (response.data?.status === 'success') {

        Alert.alert('Success', 'Withdrawal request submitted successfully. It will be processed by admin.');

        setAmount('');

        // Refresh data to show updated requests

        await fetchWalletRequests();

        await fetchWalletData();

      } else {

        Alert.alert('Error', response.data?.message || 'Failed to submit request');

      }

    } catch (error: any) {

      console.error('Redeem error:', error);

      const errorMessage = error.response?.data?.message || 'Failed to submit request';

      Alert.alert('Error', errorMessage);

    } finally {

      setRedeemLoading(false);

    }

  };



  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return '--';
    
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '--';

    try {
      // For better responsive display, use shorter format on smaller screens
      const { width } = Dimensions.get('window');
      if (width < 360) {
        // Very small screens - use DD/MM/YY format
        return date.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        });
      } else if (width < 400) {
        // Small screens - use DD MMM YY format
        return date.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: '2-digit',
        });
      } else {
        // Larger screens - use full format
        return date.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
      }
    } catch {
      return '--';
    }
  };



  // Format time

  const formatTime = (dateString: string) => {

    if (!dateString) return '--';

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) return '--';

    try {

      return date.toLocaleTimeString('en-IN', {

        hour: '2-digit',

        minute: '2-digit',

      });

    } catch {

      return '--';

    }

  };



  const handleTabPress = (tab: string) => {

    console.log('Tab pressed:', tab);

    setActiveTab(tab);

    if (tab !== 'wallet') {

      onNavigate?.(tab);

    }

  };



  const handleBack = () => {

    console.log('Back button pressed');

    onNavigate?.('home');

  };



  if (loading) {

    return (

      <View style={styles.container}>

        <GlobalHeader

          title="Wallet"

          onBack={handleBack}

          showBackButton={true}

        />

        <View style={styles.loadingContainer}>

          <ActivityIndicator size="large" color="#4CAF50" />

          <Text style={styles.loadingText}>Loading wallet data...</Text>

        </View>

        <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />

      </View>

    );

  }



  // Error boundary fallback

  if (!walletData) {

    return (

      <View style={styles.container}>

        <GlobalHeader

          title="Wallet"

          onBack={handleBack}

          showBackButton={true}

        />

        <View style={styles.loadingContainer}>

          <Text style={styles.loadingText}>Unable to load wallet data</Text>

          <TouchableOpacity onPress={fetchWalletData} style={{ marginTop: 20 }}>

            <Text style={{ color: '#4CAF50' }}>Retry</Text>

          </TouchableOpacity>

        </View>

        <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />

      </View>

    );

  }



  return (

    <View style={styles.container}>

      {/* Global Header */}

      <GlobalHeader

        title="Wallet"

        onBack={handleBack}

        showBackButton={true}

      />



      {/* Content */}

      <ScrollView 

        style={styles.content} 

        showsVerticalScrollIndicator={false}

        keyboardShouldPersistTaps="handled"

        nestedScrollEnabled={true}

      >

        {/* Balance Card */}

        <View style={styles.balanceCard}>

          <Text style={styles.walletTitle}>Total Balance</Text>

          <Text style={styles.balanceAmount}>

            ₹{walletData?.walletBalance || 0}

          </Text>

        </View>



        {/* Amount Input Section */}

        <View style={styles.inputSection}>

          <Text>Enter Amount</Text>

          <TextInput

            style={styles.amountInput}

            placeholderTextColor="#C6C9C8"

            value={amount}

            onChangeText={setAmount}

            placeholder="Enter amount"

            keyboardType="numeric"

            editable={!walletData?.cashCollection || walletData.cashCollection === 0}

          />

          {walletData?.cashCollection && walletData.cashCollection > 0 ? (

            <Text style={styles.errorMessage}>

              ❌ Withdrawals disabled: Clear ₹{walletData.cashCollection} cash collection first

            </Text>

          ) : null}

        </View>



        {/* Redeem Button */}

        <TouchableOpacity

          style={[

            styles.redeemButton,

            validateAmount() && styles.redeemButtonActive

          ]}

          onPress={handleRedeem}

          disabled={!validateAmount() || redeemLoading}

        >

          <Text style={styles.redeemButtonText}>

            {redeemLoading ? 'Processing...' : 'Redeem'}

          </Text>

        </TouchableOpacity>



        {/* History Tabs */}

        <View style={styles.tabContainer}>

          <TouchableOpacity

            style={[

              styles.tabButton,

              historyTab === 'transaction' && styles.tabButtonActive

            ]}

            onPress={() => setHistoryTab('transaction')}

          >

            <Text style={[

              styles.tabButtonText,

              historyTab === 'transaction' && styles.tabButtonTextActive

            ]}>

              Transaction history

            </Text>

          </TouchableOpacity>

          <TouchableOpacity

            style={[

              styles.tabButton,

              historyTab === 'settlement' && styles.tabButtonActive

            ]}

            onPress={() => setHistoryTab('settlement')}

          >

            <Text style={[

              styles.tabButtonText,

              historyTab === 'settlement' && styles.tabButtonTextActive

            ]}>

              Settlement history

            </Text>

          </TouchableOpacity>

        </View>



        {/* History Content */}

        {historyTab === 'transaction' ? (

          <View style={styles.transactionList}>

            {walletData?.walletHistory && walletData.walletHistory.length > 0 ? (

              walletData.walletHistory.map((transaction) => (

                <View key={transaction._id || `${transaction.createdAt}-${transaction.amount}`} style={styles.transactionItem}>

                  <View style={styles.transactionHeader}>

                    <Text style={styles.transactionType}>

                      {transaction.action === 'credit'

                        ? 'Credit'

                        : transaction.action === 'debit'

                          ? 'Debit'

                          : transaction.action === 'settlement'

                            ? 'Settlement'

                            : 'Withdrawal'}

                    </Text>

                    <Text style={[

                      styles.transactionAmount,

                      transaction.action === 'credit' ? styles.creditAmount : styles.debitAmount

                    ]}>

                      {transaction.action === 'credit' ? '+' : '-'}₹{transaction.amount ?? 0}

                    </Text>

                  </View>

                  <View style={styles.transactionDetails}>

                    <View style={{ flex: 1 }}>

                      <Text style={styles.transactionOrderId}>

                        Order ID#{(transaction.description || '').slice(-6) || '------'}

                      </Text>

                      <Text style={styles.transactionId}>

                        Transaction ID: {transaction._id || '--'}

                      </Text>

                    </View>

                    <Text style={styles.transactionDate}>

                      {formatTime(transaction.date || transaction.createdAt)} | {formatDate(transaction.date || transaction.createdAt)}

                    </Text>

                  </View>

                </View>

              ))

            ) : (

              <View style={styles.emptyContainer}>

                <Text style={styles.emptyText}>No transaction history</Text>

              </View>

            )}

          </View>

        ) : (

          <View style={styles.tableContainer}>

            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderTextDate}>Date</Text>
              <Text style={styles.tableHeaderTextAmount}>Amount</Text>
              <Text style={styles.tableHeaderTextStatus}>Status</Text>
              <Text style={styles.tableHeaderTextNotes}>Notes</Text>
            </View>

            {walletRequests.length > 0 ? (

              walletRequests.map((request) => (

                <View key={request._id || `${request.request_date}-${request.amount_requested}`} style={styles.tableRow}>
                  <Text style={styles.tableCellDate}>
                    {formatDate(request.request_date || request.createdAt)}
                  </Text>
                  <Text style={styles.tableCellAmount}>
                    ₹{request.amount_requested ?? 0}
                  </Text>
                  <View style={styles.tableCellStatus}>
                    <View style={[
                      styles.statusBadge,
                      request.status === 'approved' && styles.statusSettled,
                      request.status === 'pending' && styles.statusPending,
                      request.status === 'rejected' && styles.statusRejected
                    ]}>
                      <Text style={styles.statusText}>
                        {request.status === 'approved' ? 'Settled' : 
                         request.status === 'pending' ? 'Pending' : 'Rejected'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.tableCellNotes}>
                    #{(request._id || '').slice(-4) || '----'}
                  </Text>
                </View>

              ))

            ) : (

              <View style={styles.emptyContainer}>

                <Text style={styles.emptyText}>No settlement history</Text>

              </View>

            )}

          </View>

        )}

      </ScrollView>



      {/* Bottom Navigation */}

      <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />

    </View>

  );

};



export default WalletScreen;

