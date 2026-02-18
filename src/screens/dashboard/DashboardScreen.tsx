import React, { useMemo, useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Image, PanResponder, Animated, Linking, Alert, Modal, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import BottomNavigation from '../../components/BottomNavigation';
import OrderNotification from '../../components/OrderNotification';
import styles from './DashboardScreen.styles';
import { ApiService, IMAGE_BASE_URL } from '../../services/api';
import socketService from '../../services/socketService';
import NotificationScreen from '../notifications/NotificationScreen';
import Toast from 'react-native-toast-message';

interface DashboardScreenProps {
  onLogout: () => void;
  onNavigate: (screen: string) => void;
}

const SwipeIcon = () => (
  <View style={styles.swipeIcon}>
    <View style={styles.swipeArrow} />
    <View style={styles.swipeArrow} />
    <View style={styles.swipeArrow} /> 
  </View>
);

const SwipeableOrderCard = ({
  apiOrderId,
  displayOrderId,
  distance,
  pickup,
  drop,
  customer,
  value,
  timerText,
  timerBorderColor,
  onAccept,
}: {
  apiOrderId: string;
  displayOrderId: string;
  distance: string;
  pickup: string;
  drop: string;
  customer: string;
  value: string;
  timerText: string;
  timerBorderColor: string;
  onAccept: (apiOrderId: string) => void;
}) => {
  const animatedValue = new Animated.Value(0);
  const [accepted, setAccepted] = useState(false);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dx) > 5,
    onPanResponderTerminationRequest: () => false,
    onPanResponderMove: (_, gs) => {
      if (gs.dx > 0) {
        animatedValue.setValue(Math.min(gs.dx, 300));
      }
    },
    onPanResponderRelease: (_, gs) => {
      if (gs.dx > 100 && gs.vx > 0.5) {
        Animated.timing(animatedValue, {
          toValue: 300,
          duration: 200,
          useNativeDriver: false,
        }).start(() => {
          setAccepted(true);
          onAccept(apiOrderId);
        });
      } else {
        Animated.spring(animatedValue, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: false,
        }).start();
      }
    },
    onPanResponderTerminate: () => {
      Animated.spring(animatedValue, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: false,
      }).start();
    },
  });

  const translateX = animatedValue.interpolate({
    inputRange: [0, 300],
    outputRange: [0, 260],
  });

  const textOpacity = animatedValue.interpolate({
    inputRange: [0, 100, 300],
    outputRange: [1, 0.3, 0],
    extrapolate: 'clamp',
  });

  const imageRotation = animatedValue.interpolate({
    inputRange: [0, 150, 300],
    outputRange: ['0deg', '90deg', '180deg'],
    extrapolate: 'clamp',
  });

  if (accepted) {
    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderNumber}>Order #{displayOrderId}</Text>
          <Text style={styles.orderDistance}>{distance}</Text>
        </View>
        <View style={styles.addressSection}>
          <View style={styles.addressRow}>
            <Text style={styles.addressLabel}>Pick Up</Text>
            <Text style={styles.addressText}>{pickup}</Text>
          </View>
          <View style={styles.addressRow}>
            <Text style={styles.addressLabel}>Drop</Text>
            <Text style={styles.addressText}>{drop}</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.customerSection}>
          <Text style={styles.customerLabel}>Customer Name</Text>
          <Text style={styles.customerName}>{customer}</Text>
        </View>
        <View style={styles.orderValueSection}>
          <Text style={styles.orderValueLabel}>Order Value</Text>
          <Text style={styles.orderValueAmount}>{value}</Text>
        </View>
        <View style={styles.timerCenterSection}>
          <View style={styles.timerCircleAccepted}>
            <Text style={styles.timerTextAccepted}>Accepted</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>Order #{displayOrderId}</Text>
        <Text style={styles.orderDistance}>{distance}</Text>
      </View>
      <View style={styles.addressSection}>
        <View style={styles.addressRow}>
          <Text style={styles.addressLabel}>Pick Up:</Text>
          <Text style={styles.addressText}>{pickup}</Text>
        </View>
        <View style={styles.addressRow}>
          <Text style={styles.addressLabel}>Drop:</Text>
          <Text style={styles.addressText}>{drop}</Text>
        </View>
      </View>

      <View style={styles.customerSection}>
        <Text style={styles.customerLabel}>Customer Name</Text>
        <Text style={styles.customerName}>{customer}</Text>
      </View>
      <View style={styles.orderValueSection}>
        <Text style={styles.orderValueLabel}>Order Value</Text>
        <Text style={styles.orderValueAmount}>{value}</Text>
      </View>
      <View style={styles.timerCenterSection}>
        <View style={[styles.timerCircle, { borderColor: timerBorderColor }]}>
          <Text style={[styles.timerText, { color: timerBorderColor }]}>{timerText}</Text>
        </View>
      </View>
      <Text style={styles.timerWarningCenter}>Order will cancel after 30s.</Text>

      <View style={styles.swipeContainer} {...panResponder.panHandlers}>
        <LinearGradient
          colors={['#605238', '#086B48']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.swipeButton}
        >
          <View style={styles.swipeContent}>
            <Animated.View style={[styles.swipeLeftContent, { transform: [{ translateX }, { rotate: imageRotation }] }]}>
              <Image source={require('../../images/swipe.png')} style={styles.swipeImage} />
            </Animated.View>
            <Animated.Text style={[styles.swipeButtonText, { opacity: textOpacity }]}>Swipe To Accept</Animated.Text>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
};

const DashboardScreen: React.FC<DashboardScreenProps> = ({ onLogout, onNavigate }) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('home');
  const [orderTab, setOrderTab] = useState('new');
  const [isOnline, setIsOnline] = useState(true);
  const [driverProfile, setDriverProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [homeData, setHomeData] = useState<any>(null);
  const [newOrders, setNewOrders] = useState<any[]>([]);
  const [ongoingOrders, setOngoingOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderStatuses, setOrderStatuses] = useState<{ [key: string]: string }>({});
  const [orderTimers, setOrderTimers] = useState<Record<string, { remaining: number; total: number }>>({});
  const [showQRModal, setShowQRModal] = useState(false);
  const [imageLoadErrors, setImageLoadErrors] = useState<{ [key: string]: number }>({});
  const timerIntervalsRef = useRef<Record<string, any>>({});
  const autoRefreshIntervalRef = useRef<any>(null);
  const [previousNewOrdersCount, setPreviousNewOrdersCount] = useState(0);

  const safeNumber = (v: any, fallback = 0) => {
    const n = typeof v === 'number' ? v : Number(v);
    return Number.isFinite(n) ? n : fallback;
  };

  // Optional: Google Maps API key (provided)
  const GOOGLE_MAPS_API_KEY = 'AIzaSyAVnkWhVaQ3Sj4XjlNi65oCMiBoh0BzuFA';

  useEffect(() => {
    fetchDriverProfile();
    fetchHomeData();
    fetchOrders();
  }, []);

  // Socket connection effect
  useEffect(() => {
    if (driverProfile?._id) {
      // Connect to socket when driver profile is available
      socketService.connect(driverProfile._id);
      
      return () => {
        // Disconnect socket on unmount
        socketService.disconnect();
      };
    }
  }, [driverProfile?._id]);

  // Stop reconnection after component unmounts or when driver profile changes
  useEffect(() => {
    return () => {
      // Stop any ongoing reconnection attempts
      socketService.stopReconnection();
    };
  }, []);

  // Auto-refresh effect
  useEffect(() => {
    // Set up auto-refresh interval (every 15 seconds)
    autoRefreshIntervalRef.current = setInterval(async () => {
      try {
        // Refresh home data and orders
        await Promise.all([
          fetchHomeData(),
          fetchOrders()
        ]);
        
        // Check if new orders arrived
        if (orderTab === 'new' && newOrders.length > previousNewOrdersCount) {
          // Show toast for new orders
          Toast.show({
            type: 'success',
            text1: 'New Order Available!',
            text2: `${newOrders.length - previousNewOrdersCount} new order(s) received`,
          });
          
          // Update previous count
          setPreviousNewOrdersCount(newOrders.length);
        }
      } catch (error) {
        console.error('Auto-refresh error:', error);
      }
    }, 15000); // Refresh every 15 seconds

    // Cleanup interval on unmount
    return () => {
      if (autoRefreshIntervalRef.current) {
        clearInterval(autoRefreshIntervalRef.current);
      }
    };
  }, [orderTab, previousNewOrdersCount, newOrders.length]);

  useEffect(() => {
    fetchOrders();
  }, [orderTab]);

  useEffect(() => {
    return () => {
      // Clear all intervals on unmount
      Object.values(timerIntervalsRef.current).forEach((id) => clearInterval(id));
      timerIntervalsRef.current = {};
      
      // Clear auto-refresh interval
      if (autoRefreshIntervalRef.current) {
        clearInterval(autoRefreshIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (orderTab === 'new' && newOrders.length > 0) {
      startTimersForNewOrders(newOrders);
    }
    
    // Cleanup timers when switching away from new tab or when orders change
    return () => {
      if (orderTab !== 'new') {
        Object.keys(timerIntervalsRef.current).forEach(orderId => {
          clearOrderTimer(orderId);
        });
      }
    };
  }, [newOrders, orderTab]);

  const normalizeOrderStatus = (order: any): string => {
    const s = (order?.orderStatus || order?.status || order?.state || '').toString().toLowerCase();
    return s;
  };

  const isOngoing = (order: any) => {
    const s = normalizeOrderStatus(order);
    return (
      s === 'accepted' ||
      s === 'running' ||
      s === 'ongoing' ||
      s === 'inprogress' ||
      s === 'in_progress' ||
      s === 'processing'
    );
  };

  const isNew = (order: any) => {
    const s = normalizeOrderStatus(order);
    // "shipped" means available for other drivers after timeout (per requirement)
    return !isOngoing(order) && s !== 'delivered' && s !== 'cancelled';
  };

  const getTimerColor = (remaining: number, total: number) => {
    const pct = total <= 0 ? 0 : Math.max(0, Math.min(1, remaining / total));
    // green -> orange -> red
    if (pct > 0.5) return '#086B48';
    if (pct > 0.25) return '#F59E0B';
    return '#EF4444';
  };

  const openInMaps = (address?: string) => {
    if (!address) {
      Alert.alert('Location not available');
      return;
    }

    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open Google Maps');
    });
  };

  const callPhoneNumber = (order: any) => {
    const phone =
      order?.delivery?.mobile ||
      order?.delivery?.phone ||
      order?.delivery?.contact ||
      order?.delivery?.mobileNo ||
      order?.delivery?.customerPhone;

    if (!phone) {
      Alert.alert('Phone number not available');
      return;
    }

    const url = `tel:${phone}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to start call');
    });
  };

  const fetchDriverProfile = async () => {
    try {
      const response = await ApiService.getDriverProfile();
      if (response.status === 200) {
        const profileData = response.data.driver;
        console.log('Driver Profile Data:', JSON.stringify(profileData, null, 2));
        setDriverProfile(profileData);
      }
    } catch (error) {
      console.error('Error fetching driver profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      console.log('Dashboard: Fetching home data...');
      const response = await ApiService.getDriverHome();
      if (response.status === 200) {
        const data = response.data.data;
        console.log('Dashboard: Home data fetched:', JSON.stringify(data, null, 2));
        setHomeData(data);
      }
    } catch (error) {
      console.error('Dashboard: Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
            
      const orderType = orderTab === 'new' ? 'new' : 'ongoing';
      console.log('=== DASHBOARD SCREEN ===');
      console.log(`Fetching orders with type: ${orderType}`);
      const response = await ApiService.getDriverOrders(orderType);
      
      if (response.data.success) {
        const orders = response.data.orderList || [];
        const filtered =
          orderType === 'new' ? orders.filter(isNew) : orders.filter(isOngoing);
                
        if (orderTab === 'new') {
          // Check for new orders before updating
          const currentCount = newOrders.length;
          setNewOrders(filtered);
          
          // Update previous count if this is the first load or if orders changed
          if (currentCount === 0 || filtered.length !== currentCount) {
            setPreviousNewOrdersCount(filtered.length);
          }
        } else {
          setOngoingOrders(filtered);
        }
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        if (orderTab === 'new') {
          setNewOrders([]);
          setPreviousNewOrdersCount(0);
        } else {
          setOngoingOrders([]);
        }
      } else {
        if (orderTab === 'new') {
          setNewOrders([]);
          setPreviousNewOrdersCount(0);
        } else {
          setOngoingOrders([]);
        }
      }
    } finally {
      setOrdersLoading(false);
    }
  };

  const clearOrderTimer = (apiOrderId: string) => {
    const id = timerIntervalsRef.current[apiOrderId];
    if (id) clearInterval(id);
    delete timerIntervalsRef.current[apiOrderId];
    setOrderTimers((prev) => {
      const next = { ...prev };
      delete next[apiOrderId];
      return next;
    });
  };

  const handleOrderTimeout = async (apiOrderId: string) => {
    // Auto timeout & reassign flow (client-driven trigger)
    try {
      clearOrderTimer(apiOrderId);
      setNewOrders((prev) => prev.filter((o) => (o._id || o.orderId) !== apiOrderId));

      // Mark as shipped (available for others) if backend supports it
      await ApiService.updateOrderStatus(apiOrderId, 'shipped');

      ApiService.createDriverNotification({
        title: 'Order Timeout',
        message: 'Order reassigned due to timeout',
        type: 'order_timeout',
        orderId: apiOrderId,
      }).catch(() => {});

      Toast.show({
        type: 'info',
        text1: 'Timeout',
        text2: 'Order reassigned due to timeout',
      });

      fetchOrders();
    } catch (e: any) {
      // Even if backend doesn't support shipped, keep UI consistent
      fetchOrders();
    }
  };

  const startTimersForNewOrders = async (orders: any[]) => {
    const list = orders || [];
    await Promise.all(
      list.map(async (order) => {
        const apiOrderId = (order?._id || order?.orderId || '').toString();
        if (!apiOrderId) return;
        if (timerIntervalsRef.current[apiOrderId]) return;

        // Use local 30-second timer without API call
        const total = 30;
        setOrderTimers((prev) => ({ ...prev, [apiOrderId]: { remaining: total, total } }));

        ApiService.createDriverNotification({
          title: 'New Order Assigned',
          message: `New Order Assigned (${total}s timeout)`,
          type: 'order_assigned',
          orderId: apiOrderId,
          meta: { hasActiveTimer: true, timeoutSeconds: total },
        }).catch(() => {});

        timerIntervalsRef.current[apiOrderId] = setInterval(() => {
          setOrderTimers((prev) => {
            const cur = prev[apiOrderId];
            if (!cur) return prev;
            const nextRemaining = Math.max(0, cur.remaining - 1);
            const next = { ...prev, [apiOrderId]: { ...cur, remaining: nextRemaining } };
            if (nextRemaining <= 0) {
              // fire and forget; avoid blocking setState
              setTimeout(() => handleOrderTimeout(apiOrderId), 0);
            }
            return next;
          });
        }, 1000);
      })
    );
  };

  const handleStatusToggle = async (newValue: boolean) => {
    try {
      setIsOnline(newValue);
      
      if (!driverProfile?._id) {
        console.error('Driver ID not found');
        return;
      }

      const status = newValue ? 'active' : 'inactive';
      console.log('Toggling driver status to:', status);
      
      const response = await ApiService.toggleDriverStatus(driverProfile._id, status);
      
      if (response.data.success) {
        console.log('Status updated successfully:', response.data.message);
        setDriverProfile((prev: any) => ({
          ...prev,
          status: newValue
        }));
        
        // Show success toast notification
        Toast.show({
          type: 'success',
          text1: 'Status Updated',
          text2: `Status ${newValue ? 'Active' : 'Inactive'} Successfully`,
        });
      } else {
        console.error('Failed to update status:', response.data.message);
        setIsOnline(!newValue);
        
        // Show error toast notification
        Toast.show({
          type: 'error',
          text1: 'Status Update Failed',
          text2: response.data.message || 'Failed to update status',
        });
      }
    } catch (error) {
      console.error('Error toggling driver status:', error);
      setIsOnline(!newValue);
      
      // Show error toast notification
      Toast.show({
        type: 'error',
        text1: 'Status Update Failed',
        text2: 'Network error. Please try again.',
      });
    }
  };

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    if (tab !== 'home') onNavigate(tab);
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getPaymentModeText = (mode?: string) => {
    if (!mode) return 'N/A';
    const modeLower = mode.toLowerCase();
    if (modeLower === 'cod' || modeLower === 'cash on delivery') return 'Cash On Delivery';
    if (modeLower === 'upi') return 'UPI';
    if (modeLower === 'online') return 'Online';
    return mode;
  };

  const formatPickupAddress = (order: any) => {
    // Try to get proper pickup address from API, fallback to hardcoded if needed
    if (order.pickup?.address) {
      return order.pickup.address;
    }
    
    // If API returns structured pickup data
    if (order.pickup?.name && order.pickup?.address) {
      return `${order.pickup.name}: ${order.pickup.address}`;
    }
    
    // Fallback to store/warehouse info if available
    if (order.store?.name || order.warehouse?.name) {
      const storeName = order.store?.name || order.warehouse?.name || 'Store';
      const storeAddress = order.store?.address || order.warehouse?.address || 'Store Address';
      return `${storeName}: ${storeAddress}`;
    }
    
    return 'Pickup address not available';
  };

  const formatDeliveryAddress = (order: any) => {
    // Debug: Log order data to understand structure
    console.log('=== formatDeliveryAddress DEBUG ===');
    console.log('Order ID:', order._id || order.orderId);
    console.log('Full order object:', JSON.stringify(order, null, 2));
    console.log('shippingAddress:', JSON.stringify(order.shippingAddress, null, 2));
    console.log('delivery:', JSON.stringify(order.delivery, null, 2));
    console.log('===============================');
    
    // Priority 1: Try shippingAddress (from Order Details API)
    const shippingAddress = order.shippingAddress || {};
    if (shippingAddress.houseNoOrFlatNo || shippingAddress.landmark || shippingAddress.city) {
      const addressParts = [];
      if (shippingAddress.houseNoOrFlatNo) {
        addressParts.push(shippingAddress.houseNoOrFlatNo);
      }
      if (shippingAddress.floor) {
        addressParts.push(shippingAddress.floor);
      }
      if (shippingAddress.landmark) {
        addressParts.push(shippingAddress.landmark);
      }
      if (shippingAddress.city) {
        addressParts.push(shippingAddress.city);
      }
      if (shippingAddress.pincode) {
        addressParts.push(shippingAddress.pincode);
      }
      
      const result = addressParts.join(', ');
      console.log('Final address from shippingAddress:', result);
      return result;
    }
    
    // Priority 2: Try delivery object (from Dashboard Orders API)
    const delivery = order.delivery || {};
    if (delivery.address1 || delivery.address2 || delivery.city) {
      const addressParts = [];
      if (delivery.address1) {
        addressParts.push(delivery.address1);
      }
      if (delivery.address2) {
        addressParts.push(delivery.address2);
      }
      if (delivery.city) {
        addressParts.push(delivery.city);
      }
      if (delivery.pincode) {
        addressParts.push(delivery.pincode);
      }
      
      const result = addressParts.join(', ');
      console.log('Final address from delivery object:', result);
      return result;
    }
    
    // Priority 3: Fallback to delivery.address if it exists
    if (delivery.address) {
      console.log('Fallback to delivery.address:', delivery.address);
      return delivery.address;
    }
    
    // Final fallback
    console.log('No address found, returning fallback');
    return 'Delivery address not available';
  };

  const handleUpdateStatus = (order: any) => {
    setSelectedOrder(order);
    setShowStatusModal(true);
  };

  const handleStatusSelect = async (status: string) => {
    if (!selectedOrder) return;

    try {
      let apiStatus: 'accepted' | 'cancelled' | 'delivered';
      
      // Map UI status to API status
      if (status === 'Pickup Confirmed') {
        apiStatus = 'accepted';
      } else if (status === 'Delivered') {
        apiStatus = 'delivered';
      } else if (status === 'Payment') {
        // Payment status - for COD, this means ready for payment collection
        // We'll still use 'accepted' status but track UI state separately
        apiStatus = 'accepted';
      } else {
        // "On the way" - still accepted status
        apiStatus = 'accepted';
      }

      const apiOrderId = (selectedOrder._id || selectedOrder.orderId || selectedOrder.bookingId || '').toString();

      // Delivered flow: open add-photo screen -> then delivered -> delivery completed
      if (status === 'Delivered') {
        setShowStatusModal(false);
        setSelectedOrder(null);
        onNavigate(`deliveryImage:${apiOrderId}`);
        return;
      }

      const response = await ApiService.updateOrderStatus(apiOrderId, apiStatus);
      
      if (response.data.status || response.status === 200) {
        // Auto-trigger: create notification when delivered
        if (status === 'Delivered') {
          const orderId = selectedOrder.orderId || selectedOrder.bookingId || selectedOrder._id || '';
          const earning =
            safeNumber(selectedOrder.driverEarning) ||
            safeNumber(selectedOrder.earning) ||
            safeNumber(selectedOrder.deliveryCharge) ||
            safeNumber(selectedOrder.driverIncome) ||
            0;

          ApiService.createDriverNotification({
            title: 'Order Delivered',
            message: earning > 0
              ? `Order #${orderId} delivered. Earnings: ₹${earning}`
              : `Order #${orderId} delivered successfully.`,
            type: 'order_delivered',
            orderId: orderId ? orderId.toString() : undefined,
            amount: earning > 0 ? earning : undefined,
          }).catch(() => {});
        }

        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: response.data.message || 'Status updated successfully',
        });

        // Update local status
        const orderId = apiOrderId;
        setOrderStatuses(prev => ({
          ...prev,
          [orderId]: status
        }));

        // If status is Delivered and payment is COD, refresh to show payment scanner
        if (status === 'Delivered' && selectedOrder.paymentMode === 'cod') {
          // Update the order status in the list
          setOngoingOrders(prev => prev.map(order => 
            order._id === orderId || order.orderId === orderId
              ? { ...order, orderStatus: 'delivered', status: 'delivered' }
              : order
          ));
        }

        // Refresh orders
        fetchOrders();
        setShowStatusModal(false);
        setSelectedOrder(null);
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to update status',
      });
    }
  };

  const acceptOrder = async (orderId: string) => {
    try {
      clearOrderTimer(orderId);
      const response = await ApiService.updateOrderStatus(orderId, 'accepted');

      if (response.data.status || response.status === 200) {
        // Auto-trigger: create notification when accepted
        ApiService.createDriverNotification({
          title: 'Order Accepted',
          message: `Order #${orderId} accepted successfully.`,
          type: 'order_accepted',
          orderId,
        }).catch(() => {});

        Toast.show({
          type: 'success',
          text1: 'Order Accepted',
          text2: 'Order has been accepted successfully',
        });

        fetchOrders();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.data.message || 'Failed to accept order',
        });
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to accept order',
      });
    }
  };

  const cancelOrder = async (orderId: string) => {
    try {
      clearOrderTimer(orderId);
      const response = await ApiService.updateOrderStatus(orderId, 'cancelled');
      if (response.data.status || response.status === 200) {
        ApiService.createDriverNotification({
          title: 'Order Cancelled',
          message: `Order #${orderId} cancelled successfully.`,
          type: 'order_cancelled',
          orderId,
        }).catch(() => {});

        Toast.show({
          type: 'success',
          text1: 'Cancelled',
          text2: 'Order cancelled',
        });
        fetchOrders();
      }
    } catch (e: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: e.response?.data?.message || 'Failed to cancel order',
      });
    }
  };

  const handleProductDetails = (order: any) => {
    onNavigate(`productDetails:${order._id || order.orderId}`);
  };

  const handlePaymentScanner = (order: any) => {
    setSelectedOrder(order);
    setShowQRModal(true);
  };

  const isCODPayment = (order: any) => {
    const mode = order?.paymentMode?.toLowerCase();
    return mode === 'cod' || mode === 'cash on delivery';
  };

  const isOnlinePayment = (order: any) => {
    const mode = order?.paymentMode?.toLowerCase();
    return mode === 'upi' || mode === 'online' || mode === 'phonepe' || mode === 'gpay' || mode === 'paytm';
  };

  const getCurrentStatus = (order: any): string => {
    if (!order) return 'Pickup Confirmed';
    const orderId = order._id || order.orderId;
    if (orderStatuses[orderId]) {
      return orderStatuses[orderId];
    }
    // Map API status to UI status
    const apiStatus = order.orderStatus || order.status || '';
    if (apiStatus === 'running' || apiStatus === 'accepted') return 'Pickup Confirmed';
    if (apiStatus === 'delivered') return 'Delivered';
    return 'Pickup Confirmed'; // Default
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <OrderNotification
        onAcceptOrder={(orderId) => {
          acceptOrder(orderId);
          fetchOrders();
        }}
        onRejectOrder={(orderId) => {
          cancelOrder(orderId);
          fetchOrders();
        }}
      />
      <View style={styles.headerSection}>
        <View style={styles.headerTop}>
          <View style={styles.userInfo}>
            <TouchableOpacity onPress={() => onNavigate('profile')}>
              {driverProfile?.image ? (
                (() => {
                  const imagePath = driverProfile.image.replace(/\\/g, '/');
                  // Remove 'public/' prefix if it exists since IMAGE_BASE_URL already includes it
                  const cleanPath = imagePath.startsWith('public/') ? imagePath.substring(6) : imagePath;
                  // Ensure no leading slash to avoid double slashes
                  const normalizedPath = cleanPath.startsWith('/') ? cleanPath.substring(1) : cleanPath;
                  
                  // Try different URL patterns
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
                  console.log('IMAGE_BASE_URL:', IMAGE_BASE_URL);
                  console.log('Error Count:', errorCount);
                  console.log('Current URL:', currentUrl);
                  console.log('All URLs:', urls);
                  console.log('==========================');
                  
                  return (
                    <Image 
                      source={{ uri: currentUrl }} 
                      style={styles.profileImage} 
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
                <Image source={require('../../images/dp.png')} style={styles.profileImage} />
              )}
            </TouchableOpacity>
            <View style={styles.userTextContainer}>
              <Text style={styles.greetingText}>Hello</Text>
              <Text style={styles.userName}>{driverProfile?.name || 'Driver'}</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <Switch
              value={isOnline}
              onValueChange={handleStatusToggle}
              trackColor={{ false: '#767577', true: '#086B48' }}
              thumbColor={isOnline ? '#fff' : '#f4f3f4'}
            />
            <TouchableOpacity style={styles.bellIcon} onPress={() => setShowNotifications(true)}>
              <Image source={require('../../images/notify.png')} style={styles.notificationIcon} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.earningsContainer}>

          {/* Today's */}
          <LinearGradient
            colors={['#E37399', '#9050A4']}
            style={styles.earningCard}
          >
            <Text style={styles.earningTitle}>Today's Earning</Text>
            <Text style={styles.earningAmount}>₹{homeData?.today?.totalIncome || 0}</Text>

            <Text style={styles.orderLabel}>Order Completed</Text>
            <Text style={styles.orderValue}>{homeData?.today?.totalOrders || 0}</Text>
          </LinearGradient>

          {/* Weekly */}
          <LinearGradient
            colors={['#8CD1E1', '#4570A2']}
            style={styles.earningCard}
          >
            <Text style={styles.earningTitle}>Weekly Earning</Text>
            <Text style={styles.earningAmount}>₹{homeData?.last7Days?.totalIncome || 0}</Text>

            <Text style={styles.orderLabel}>Order Completed</Text>
            <Text style={styles.orderValue}>{homeData?.last7Days?.totalOrders || 0}</Text>
          </LinearGradient>

          {/* Monthly */}
          <LinearGradient
            colors={['#11B3A6', '#0F889B']}
            style={styles.earningCard}
          >
            <Text style={styles.earningTitle}>Monthly Earning</Text>
            <Text style={styles.earningAmount}>₹{homeData?.last30Days?.totalIncome || 0}</Text>

            <Text style={styles.orderLabel}>Order Completed</Text>
            <Text style={styles.orderValue}>{homeData?.last30Days?.totalOrders || 0}</Text>
          </LinearGradient>

        </View>

      </View>

      <View style={styles.orderTabs}>
        <TouchableOpacity
          style={[styles.tabButton, orderTab === 'new' && styles.activeTab]}
          onPress={() => setOrderTab('new')}
        >
          <Text style={[styles.tabText, orderTab === 'new' && styles.activeTabText]}>
            New Orders
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, orderTab === 'ongoing' && styles.activeTab]}
          onPress={() => setOrderTab('ongoing')}
        >
          <Text style={[styles.tabText, orderTab === 'ongoing' && styles.activeTabText]}>
            Ongoing Orders
          </Text>
        </TouchableOpacity>
      </View>

      <SafeAreaView style={[styles.contentContainer, { paddingBottom: insets.bottom }]}>
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          nestedScrollEnabled={true}
        >
          {ordersLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading orders...</Text>
            </View>
          ) : (
            <View>
              {orderTab === 'new' ? (
                newOrders.length > 0 ? (
                  newOrders.map((order: any, index: number) => (
                    <SwipeableOrderCard
                      key={order._id || index}
                      apiOrderId={(order._id || order.orderId || '').toString()}
                      displayOrderId={(order.orderId || order.bookingId || order._id || 'N/A').toString()}
                      distance={`${order.totalKm || 0} Km`}
                      pickup={formatPickupAddress(order)}
                      drop={formatDeliveryAddress(order)}
                      customer={order.delivery?.name || order.userId?.name || 'Customer'}
                      value={`₹${order.totalAmount || 0}`}
                      timerText={`${Math.max(0, (orderTimers[(order._id || order.orderId || '')]?.remaining ?? 30))}s`}
                      timerBorderColor={getTimerColor((orderTimers[(order._id || order.orderId || '')]?.remaining ?? 30), 30)}
                      onAccept={acceptOrder}
                    />
                  ))
                ) : (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No new orders available</Text>
                  </View>
                )
              ) : (
                ongoingOrders.length > 0 ? (
                  ongoingOrders.map((order: any, index: number) => (
                    <View key={order._id || index} style={styles.ongoingOrderCard}>
                      {/* HEADER */}
                      <View style={styles.orderHeader}>
                        <Text style={styles.orderNumber}>Order #{order.orderId || order.bookingId || 'N/A'}</Text>
                        <Text style={styles.orderDate}>{new Date(order.createdAt || Date.now()).toLocaleDateString()}</Text>
                      </View>

                      {/* PICKUP */}
                      <View style={styles.locationRow}>
                        <View style={styles.locationLeft}>
                          <View style={styles.locationTitleRow}>
                            <Text style={styles.locationLabel}>Pick Up :</Text>
                            <Text style={styles.locationAddress}>
                              {formatPickupAddress(order)}
                            </Text>
                          </View>
                          <View style={styles.metaRow}>
                            <Text style={styles.metaLabel}>Time: {formatTime(order.pickup?.time || order.pickupTime || order.createdAt)}</Text>
                          </View>
                          <View style={styles.metaRow}>
                            <Text style={styles.metaLabel}>Date: {formatDate(order.pickup?.date || order.pickupDate || order.createdAt)}</Text>
                          </View>
                        </View>
                        <View style={styles.locationCenter}>
                          <Text style={styles.metaValue}>{order.totalKm || 0} km</Text>
                        </View>
                        <View style={styles.locationRight}>
                          <TouchableOpacity
                            onPress={() => openInMaps(order.pickup?.address)}
                          >
                            <Image
                              source={require('../../images/location.png')}
                              style={styles.circleIcon}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => callPhoneNumber(order)}>
                            <Image
                              source={require('../../images/phone.png')}
                              style={styles.circleIcon}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>

                      <View style={styles.divider} />

                      {/* DROP */}
                      <View style={styles.locationRow}>
                        <View style={styles.locationLeft}>
                          <View style={styles.locationTitleRow}>
                            <Text style={styles.locationLabel}>Drop :</Text>
                            <Text style={styles.locationAddress}>
                              {formatDeliveryAddress(order)}
                            </Text>
                          </View>
                          <View style={styles.metaRow}>
                            <Text style={styles.metaLabel}>Time: {formatTime(order.delivery?.time || order.deliveryTime || order.createdAt)}</Text>
                          </View>
                          <View style={styles.metaRow}>
                            <Text style={styles.metaLabel}>Date: {formatDate(order.delivery?.date || order.deliveryDate || order.createdAt)}</Text>
                          </View>
                        </View>
                        <View style={styles.locationCenter} />
                        <View style={styles.locationRight}>
                          <TouchableOpacity
                            onPress={() => openInMaps(order.delivery?.address)}
                          >
                            <Image
                              source={require('../../images/location.png')}
                              style={styles.circleIcon}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => callPhoneNumber(order)}>
                            <Image
                              source={require('../../images/phone.png')}
                              style={styles.circleIcon}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>

                      <View style={styles.divider} />

                      {/* CUSTOMER */}
                      <View style={styles.customerSection}>
                        <Text style={styles.customerLabel}>Customer Name</Text>
                        <Text style={styles.customerName}>{order.delivery?.name || 'Customer'}</Text>
                      </View>

                      {/* ORDER VALUE */}
                      <View style={styles.orderValueSection}>
                        <Text style={styles.orderValueLabel}>Order Value</Text>
                        <Text style={styles.orderValueAmount}>₹{order.totalAmount || 0}</Text>
                      </View>

                      {/* PAYMENT MODE */}
                      <View style={styles.orderValueSection}>
                        <Text style={styles.orderValueLabel}>Payment Mode</Text>
                        <Text style={styles.orderValueAmount}>{getPaymentModeText(order.paymentMode)}</Text>
                      </View>

                      {/* PRODUCT DETAILS LINK */}
                      <TouchableOpacity 
                        style={styles.reportLink}
                        onPress={() => handleProductDetails(order)}
                      >
                        <Text style={styles.productLink}>Product Details</Text>
                      </TouchableOpacity>

                      {/* PRIMARY ACTION BUTTON */}
                      {order.paymentMode === 'cod' && getCurrentStatus(order) === 'Delivered' ? (
                        <TouchableOpacity
                          style={styles.updateButtonFull}
                          onPress={() => handlePaymentScanner(order)}
                        >
                          <Text style={styles.updateButtonText}>Payment Scanner</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={styles.updateButtonFull}
                          onPress={() => handleUpdateStatus(order)}
                        >
                          <Text style={styles.updateButtonText}>{getCurrentStatus(order)}</Text>
                        </TouchableOpacity>
                      )}

                      {/* REPORT ISSUE LINK */}
                      <TouchableOpacity 
                        style={styles.reportLink}
                        onPress={() => onNavigate('reportIssue')}
                      >
                        <Text style={styles.reportText}>Report Issue</Text>
                      </TouchableOpacity>
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No ongoing orders</Text>
                  </View>
                )
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />

      {showNotifications && (
        <NotificationScreen onBack={() => setShowNotifications(false)} />
      )}

      {/* Status Update Modal */}
      <Modal
        visible={showStatusModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setShowStatusModal(false);
          setSelectedOrder(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.statusModalContent}>
            <Text style={styles.statusModalTitle}>Update Status</Text>
            <TouchableOpacity
              style={[
                styles.statusOption,
                getCurrentStatus(selectedOrder || {}) === 'Pickup Confirmed' && styles.statusOptionActive
              ]}
              onPress={() => handleStatusSelect('Pickup Confirmed')}
            >
              <Text style={[
                styles.statusOptionText,
                getCurrentStatus(selectedOrder || {}) === 'Pickup Confirmed' && styles.statusOptionTextActive
              ]}>
                Pickup Confirmed
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.statusOption,
                getCurrentStatus(selectedOrder || {}) === 'On the way' && styles.statusOptionActive
              ]}
              onPress={() => handleStatusSelect('On the way')}
            >
              <Text style={[
                styles.statusOptionText,
                getCurrentStatus(selectedOrder || {}) === 'On the way' && styles.statusOptionTextActive
              ]}>
                On the way
              </Text>
            </TouchableOpacity>
            {selectedOrder?.paymentMode === 'cod' && (
              <TouchableOpacity
                style={[
                  styles.statusOption,
                  getCurrentStatus(selectedOrder || {}) === 'Payment' && styles.statusOptionActive
                ]}
                onPress={() => handleStatusSelect('Payment')}
              >
                <Text style={[
                  styles.statusOptionText,
                  getCurrentStatus(selectedOrder || {}) === 'Payment' && styles.statusOptionTextActive
                ]}>
                  Payment
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.statusOption,
                getCurrentStatus(selectedOrder || {}) === 'Delivered' && styles.statusOptionActive
              ]}
              onPress={() => handleStatusSelect('Delivered')}
            >
              <Text style={[
                styles.statusOptionText,
                getCurrentStatus(selectedOrder || {}) === 'Delivered' && styles.statusOptionTextActive
              ]}>
                Delivered
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.statusModalCancel}
              onPress={() => {
                setShowStatusModal(false);
                setSelectedOrder(null);
              }}
            >
              <Text style={styles.statusModalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DashboardScreen;