import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image, TextInput } from 'react-native';
import GlobalHeader from '../../components/GlobalHeader';
import BottomNavigation from '../../components/BottomNavigation';
import styles from './OrderHistoryScreen.styles';
import { ApiService } from '../../services/api';

interface OrderHistoryScreenProps {
  onLogout?: () => void;
  onNavigate?: (screen: string) => void;
}

const OrderHistoryScreen: React.FC<OrderHistoryScreenProps> = ({ onLogout, onNavigate }) => {
  const [activeTab, setActiveTab] = React.useState('orderHistory');



  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setFilteredOrders(orders);
      return;
    }
    setFilteredOrders(
      orders.filter((o: any) => {
        const id = (o.orderId || o.bookingId || o._id || '').toString().toLowerCase();
        return id.includes(q);
      })
    );
  }, [searchQuery, orders]);

  const normalizeStatus = (order: any) =>
    (order?.status || order?.orderStatus || order?.state || '').toString().toLowerCase();

  const fetchOrders = async () => {
    try {
      setLoading(true);

      // Try multiple approaches to get history orders
      let response;

      try {
        // First try with type=history
        console.log('Trying driver/orders?type=history');
        response = await ApiService.getDriverOrders('history');
      } catch (historyError: any) {
        console.log('History endpoint failed, trying all orders');

        // Handle both 404 and 500 errors for history endpoint
        if (historyError.response?.status === 404 || historyError.response?.status === 500) {
          // If history fails, try getting all orders and filter client-side
          try {
            response = await ApiService.getDriverOrders('all');
            console.log('Got all orders, will filter for completed ones');
          } catch (allError: any) {
            // If all fails, try without type parameter
            try {
              response = await ApiService.getDriverOrders();
              console.log('Got orders without type parameter');
            } catch (finalError: any) {
              console.log('All endpoints failed, setting empty orders');
              response = null;
            }
          }
        } else {
          throw historyError;
        }
      }

      console.log('=== ORDER HISTORY SCREEN ===');
      console.log('OrderHistory Response:', response);

      if (response && response.data && response.data.success) {
        let orderList = response.data.orderList || [];

        // Debug: Log first order structure to understand available fields
        if (orderList.length > 0) {
          console.log('=== FIRST ORDER STRUCTURE ===');
          console.log('First order data:', JSON.stringify(orderList[0], null, 2));
          console.log('Available fields:', Object.keys(orderList[0]));
        }

        // If we got all orders, filter for history-worthy orders
        if (orderList.length > 0) {
          const completedOrders = orderList.filter((order: any) =>
            ['delivered', 'completed', 'cancelled', 'shipped'].includes(normalizeStatus(order))
          );

          if (completedOrders.length < orderList.length) {
            console.log(`Filtered ${orderList.length} orders to ${completedOrders.length} completed orders`);
            orderList = completedOrders;
          }
        }

        console.log('Final orders to display:', orderList.length);
        setOrders(orderList);
        setFilteredOrders(orderList);
      } else {
        console.log('No orders found or API response failed');
        setOrders([]);
        setFilteredOrders([]);
      }
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      // Set empty arrays on any error
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    if (tab !== 'orderHistory' && onNavigate) {
      onNavigate(tab);
    }
  };

  const handleRefresh = () => {
    fetchOrders();
  };

  const applyFilter = (filterType: string) => {
    setSelectedFilter(filterType);
    setShowFilterDropdown(false);

    const today = new Date();
    let filtered = [...orders];

    switch (filterType) {
      case 'last7days':
        const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = orders.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= sevenDaysAgo;
        });
        break;

      case 'last30days':
        const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        filtered = orders.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= thirtyDaysAgo;
        });
        break;

      case 'custom':
        // For custom, we'll show date inputs
        return;

      case 'all':
      default:
        filtered = [...orders];
        break;
    }

    setFilteredOrders(filtered);
  };

  const applyCustomFilter = () => {
    if (customStartDate && customEndDate) {
      const filtered = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        const start = new Date(customStartDate);
        const end = new Date(customEndDate);
        return orderDate >= start && orderDate <= end;
      });
      setFilteredOrders(filtered);
    }
    setShowFilterDropdown(false);
  };

  const handleBack = () => {
    onNavigate?.('home');
  };

  const handleOrderPress = (orderId: string) => {
    if (onNavigate) {
      onNavigate(`productDetails:${orderId}:history`);
    }
  };

  const handleOrderDetailsPress = (orderId: string) => {
    if (onNavigate) {
      onNavigate(`orderDetails:${orderId}`);
    }
  };

  // Helper functions to extract data from order object
  const getOrderField = (order: any, field: string, fallback: any = 'N/A') => {
    return order[field] || fallback;
  };

  const getCustomerName = (order: any) => {
    if (order.delivery?.name) return order.delivery.name;
    return order.userId?.name || 
           order.shippingAddress?.receiverName || 
           order.customerName || 
           'N/A';
  };

  const getPickupAddress = (order: any) => {
    if (order.pickup?.address) return order.pickup.address;
    return order.pickupAddress || 
           order.pickupLocation?.address || 
           'N/A';
  };

  const getDropAddress = (order: any) => {
    if (order.delivery) {
      const parts = [
        order.delivery.address1,
        order.delivery.address2,
        order.delivery.city,
        order.delivery.pincode
      ].filter(Boolean);
      if (parts.length > 0) return parts.join(', ');
    }
    return order.dropAddress || 
           order.shippingAddress || 
           order.deliveryAddress || 
           'N/A';
  };

  const getFullDropAddress = (order: any) => {
    if (order.delivery) {
      const parts = [
        order.delivery.address1,
        order.delivery.address2,
        order.delivery.city,
        order.delivery.pincode
      ].filter(Boolean);
      if (parts.length > 0) return parts.join(', ');
    }
    const shippingAddr = order.shippingAddress || {};
    if (typeof shippingAddr === 'string') return shippingAddr;
    
    const parts = [
      shippingAddr.houseNoOrFlatNo,
      shippingAddr.floor,
      shippingAddr.landmark,
      shippingAddr.city,
      shippingAddr.pincode
    ].filter(Boolean);
    
    return parts.length > 0 ? parts.join(', ') : 'N/A';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return '#086B48';
      case 'shipped': return '#3B82F6';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      {/* Global Header */}
      <GlobalHeader
        title="Order History"
        onBack={handleBack}
        showBackButton
      />
      {/* Search Bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Image source={require('../../images/search.png')} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for Order"
            placeholderTextColor="#086B48"

            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilterDropdown(!showFilterDropdown)}>
          <Image source={require('../../images/filter.png')} style={styles.filterIcon} />
        </TouchableOpacity>
      </View>

      {/* Filter Dropdown */}
      {showFilterDropdown && (
        <View style={styles.filterDropdown}>
          <TouchableOpacity
            style={styles.filterOption}
            onPress={() => applyFilter('last7days')}
          >
            <Text style={styles.filterOptionText}>Last 7 days</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterOption}
            onPress={() => applyFilter('last30days')}
          >
            <Text style={styles.filterOptionText}>Last 30 days</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterOption}
            onPress={() => applyFilter('custom')}
          >
            <Text style={styles.filterOptionText}>Custom</Text>
          </TouchableOpacity>

          {/* Custom Date Inputs */}
          {selectedFilter === 'custom' && (
            <View style={styles.customDateContainer}>
              <TextInput
                style={styles.dateInput}
                placeholder="Start Date (YYYY-MM-DD)"
                placeholderTextColor="#999"
                value={customStartDate}
                onChangeText={setCustomStartDate}
              />
              <TextInput
                style={styles.dateInput}
                placeholder="End Date (YYYY-MM-DD)"
                placeholderTextColor="#999"
                value={customEndDate}
                onChangeText={setCustomEndDate}
              />
              <TouchableOpacity
                style={styles.applyCustomFilterBtn}
                onPress={applyCustomFilter}
              >
                <Text style={styles.applyCustomFilterText}>Apply</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* Orders List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#086B48" />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      ) : filteredOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No orders found</Text>
        </View>
      ) : (
        <ScrollView style={styles.ordersList} showsVerticalScrollIndicator={false}>
          {filteredOrders.map((order) => (
            <View
              key={order._id}
              style={styles.orderCard}
            >
               <View style={styles.orderHeader}>
    <View>
      <Text style={styles.orderId}>Order #{order.orderId || order.bookingId || order._id}</Text>
      <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
    </View>

    <View style={[
      styles.statusBadge,
      { backgroundColor: getStatusColor(normalizeStatus(order)) }
    ]}>
      <Text style={styles.statusText}>{normalizeStatus(order)}</Text>
    </View>
  </View>

  <View style={styles.summaryRow}>
    <View>
      <Text style={styles.label}>Order Value</Text>
      <Text style={styles.value}>₹{getOrderField(order, 'totalAmount') || getOrderField(order, 'grandTotal') || 0}</Text>

      <Text style={styles.label}>Payment Mode</Text>
      <Text style={styles.value}>
        {getOrderField(order, 'paymentMode', '').toString().toUpperCase() || 'N/A'}
      </Text>

      <Text style={styles.label}>Total Items</Text>
      <Text style={styles.value}>
        {order.products?.length || getOrderField(order, 'totalItems') || 0}
      </Text>
    </View>

    <View style={styles.chevronWrap}>
      <TouchableOpacity
        onPress={() => handleOrderDetailsPress(order._id || order.orderId || order.bookingId)}
      >
        <Image
          source={require('../../images/drop.png')}
          style={styles.chevron}
        />
      </TouchableOpacity>
    </View>
  </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
};

export default OrderHistoryScreen;
