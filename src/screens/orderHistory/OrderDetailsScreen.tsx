import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Linking } from 'react-native';
import GlobalHeader from '../../components/GlobalHeader';
import { ApiService } from '../../services/api';
import styles from './OrderDetailsScreen.styles';

interface OrderDetailsScreenProps {
  orderId: string;
  onNavigate?: (screen: string) => void;
}

const OrderDetailsScreen: React.FC<OrderDetailsScreenProps> = ({ orderId, onNavigate }) => {
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getDriverOrderDetails(orderId);
      console.log('Order Details API Response:', JSON.stringify(response.data, null, 2));
      if (response.data.success || response.status === 200) {
        const orderData = response.data.order || response.data.data || response.data;
        console.log('Setting order details:', JSON.stringify(orderData, null, 2));
        setOrderDetails(orderData);
      }
    } catch (error: any) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-IN', { month: 'long' });
    const year = date.getFullYear().toString().slice(-2);
    // Format: "11-June-25"
    return `${day}-${month}-${year}`;
  };

  const formatDateShort = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}-${month}-${year}`;
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

  const getPaymentModeText = (mode?: string) => {
    if (!mode) return 'N/A';
    const modeLower = mode.toLowerCase();
    if (modeLower === 'cod' || modeLower === 'cash on delivery') return 'Cash On Delivery';
    if (modeLower === 'upi') return 'UPI';
    if (modeLower === 'online') return 'Online';
    return mode;
  };

  const isCOD = (mode?: string) => {
    if (!mode) return false;
    const modeLower = mode.toLowerCase();
    return modeLower === 'cod' || modeLower === 'cash on delivery';
  };

  const handleBack = () => {
    onNavigate?.('history');
  };

  const handleCall = (phoneNumber: string) => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  const handleLocation = (lat: string | number, long: string | number) => {
    // Open location in maps
    const latNum = typeof lat === 'string' ? parseFloat(lat) : lat;
    const longNum = typeof long === 'string' ? parseFloat(long) : long;
    const url = `https://www.google.com/maps?q=${latNum},${longNum}`;
    Linking.openURL(url);
  };

  const handleProductDetails = () => {
    if (onNavigate) {
      onNavigate(`productDetails:${orderId}:history`);
    }
  };

  const handlePaymentScanner = () => {
    // Handle payment scanner functionality
    console.log('Payment Scanner clicked');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <GlobalHeader
          title="Order History"
          onBack={handleBack}
          showBackButton={true}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#086B48" />
          <Text style={styles.loadingText}>Loading order details...</Text>
        </View>
      </View>
    );
  }

  if (!orderDetails) {
    return (
      <View style={styles.container}>
        <GlobalHeader
          title="Order History"
          onBack={handleBack}
          showBackButton={true}
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Order not found</Text>
        </View>
      </View>
    );
  }

  // Extract data from API response structure
  // Remove "Order#" prefix if present in orderId
  let orderIdDisplay = orderDetails.orderId || orderDetails.bookingId || orderId;
  if (orderIdDisplay && orderIdDisplay.toString().startsWith('Order#')) {
    orderIdDisplay = orderIdDisplay.toString().replace('Order#', '');
  }
  const orderDate = formatDate(orderDetails.createdAt);
  const shippingAddress = orderDetails.shippingAddress || {};
  const userId = orderDetails.userId || {};

  // Pickup address - use warehouse/store address or default
  const pickup = orderDetails.pickup || {};
  const pickupAddress = pickup.address || 'Warehouse/Store Address';
  const pickupPhone = pickup.mobileNo || pickup.phone || pickup.mobile || pickup.contact || '';
  const pickupLat = pickup.lat;
  const pickupLong = pickup.long;
  
  // Debug: Log pickup data to check what's available
  console.log('Pickup data:', pickup);
  console.log('Pickup phone:', pickupPhone);
  console.log('Full orderDetails:', orderDetails);
  console.log('OrderDetails keys:', Object.keys(orderDetails));

  // Drop address - construct from shippingAddress
  const getDropAddress = () => {
    // First try shippingAddress structure
    if (shippingAddress.houseNoOrFlatNo || shippingAddress.landmark || shippingAddress.city) {
      const parts = [
        shippingAddress.houseNoOrFlatNo,
        shippingAddress.floor,
        shippingAddress.landmark,
        shippingAddress.city,
        shippingAddress.pincode
      ].filter(Boolean);
      if (parts.length > 0) return parts.join(', ');
    }

    // Fallback to delivery object if exists
    const delivery = orderDetails.delivery || {};
    if (delivery.address1 || delivery.city) {
      const parts = [
        delivery.address1,
        delivery.address2,
        delivery.city,
        delivery.pincode
      ].filter(Boolean);
      if (parts.length > 0) return parts.join(', ');
    }

    return 'N/A';
  };
  const dropAddress = getDropAddress();
  const dropPhone = shippingAddress.receiverNo || userId.mobileNo || '';
  const dropLat = userId.lat;
  const dropLong = userId.long;

  // Customer info
  const customerName = shippingAddress.receiverName || userId.name || 'N/A';
  const orderValue = orderDetails.grandTotal || orderDetails.totalAmount || 0;
  const paymentMode = getPaymentModeText(orderDetails.paymentMethod || orderDetails.paymentMode);
  const isCODPayment = isCOD(orderDetails.paymentMethod || orderDetails.paymentMode);
  const status = orderDetails.status || 'N/A';
  const totalKm = orderDetails.totalKm || 0;
  const totalItems = orderDetails.products?.length || 0;

  // Pickup and drop times/dates
  const pickupTime = formatTime(orderDetails.createdAt);
  const pickupDate = formatDateShort(orderDetails.createdAt);
  const dropTime = formatTime(orderDetails.updatedAt || orderDetails.createdAt);
  const dropDate = formatDateShort(orderDetails.updatedAt || orderDetails.createdAt);

  return (
    <View style={styles.container}>
      <GlobalHeader
        title="Order History"
        onBack={handleBack}
        showBackButton={true}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Header with Distance */}


        {/* Main Card */}
        <View style={styles.mainCard}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderNumber}>Order #{orderIdDisplay}</Text>
            {totalKm > 0 && (
              <Text style={styles.distanceText}>{totalKm} Km</Text>
            )}
          </View>
          {/* Pick Up Section */}
          <View style={styles.locationWrapper}>

            {/* LEFT : Pickup + Drop */}
            <View style={styles.locationLeft}>

              {/* PICKUP */}
              <View style={styles.locationSection}>
                <Text style={styles.sectionTitle}>Pick Up :</Text>
                <Text style={styles.addressText}>{pickupAddress}</Text>
                <Text style={styles.metaText}>Time : {pickupTime}</Text>
                <Text style={styles.metaText}>Date : {pickupDate}</Text>
              </View>

              <View style={styles.divider} />

              {/* DROP */}
              <View style={styles.locationSection}>
                <Text style={styles.sectionTitle}>Drop :</Text>
                <Text style={styles.addressText}>{dropAddress}</Text>
                <Text style={styles.metaText}>Time : {dropTime}</Text>
                <Text style={styles.metaText}>Date : {dropDate}</Text>
              </View>

            </View>

            {/* RIGHT : ICONS */}
            <View style={styles.locationRight}>

              {/* Pickup Icons */}
              {pickupLat && pickupLong && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleLocation(pickupLat, pickupLong)}
                >
                  <Image source={require('../../images/location.png')} style={styles.actionIcon} />
                </TouchableOpacity>
              )}

              {pickupPhone && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleCall(pickupPhone)}
                >
                  <Image source={require('../../images/phone.png')} style={styles.actionIcon} />
                </TouchableOpacity>
              )}

              <View style={{ height: 24 }} />

              {/* Drop Icons */}
              {dropLat && dropLong && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleLocation(dropLat, dropLong)}
                >
                  <Image source={require('../../images/location.png')} style={styles.actionIcon} />
                </TouchableOpacity>
              )}

              {dropPhone && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleCall(dropPhone)}
                >
                  <Image source={require('../../images/phone.png')} style={styles.actionIcon} />
                </TouchableOpacity>
              )}

            </View>
          </View>


          {/* Divider */}
          <View style={styles.divider} />

          {/* Customer and Payment Details */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Customer Name</Text>
            <Text style={styles.infoValue}>{customerName}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              {isCODPayment ? 'Amount to be collected' : 'Order Value:'}
            </Text>
            <Text style={styles.infoValue}>₹{orderValue}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Patment Mode:</Text>
            <Text style={styles.infoValue}>{paymentMode}</Text>
          </View>

          {/* Payment Scanner Button - Only for COD */}
          {isCODPayment && (
            <TouchableOpacity
              style={styles.paymentScannerButton}
              onPress={handlePaymentScanner}
            >
              <Text style={styles.paymentScannerText}>Payment Scanner</Text>
            </TouchableOpacity>
          )}

          {/* Product Details Link */}
          <TouchableOpacity
            style={styles.productDetailsLink}
            onPress={handleProductDetails}
          >
            <Text style={styles.productDetailsText}>Product Details</Text>
          </TouchableOpacity>

          {/* Status Badge - Grey pill button */}
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{status}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default OrderDetailsScreen;
