import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Linking, Modal, Alert } from 'react-native';
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
  const [showQRCode, setShowQRCode] = useState(false);

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
  const delivery = orderDetails.delivery || {};

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
    console.log('=== ADDRESS DEBUG ===');
    console.log('shippingAddress:', shippingAddress);
    console.log('delivery:', delivery);
    console.log('userId:', userId);
    console.log('rawOrder:', orderDetails.rawOrder);
    console.log('========================');
    
    // First try shippingAddress structure
    if (shippingAddress.houseNoOrFlatNo || shippingAddress.landmark || shippingAddress.city) {
      const parts = [
        shippingAddress.houseNoOrFlatNo,
        shippingAddress.floor,
        shippingAddress.buildingName,
        shippingAddress.street,
        shippingAddress.landmark,
        shippingAddress.area,
        shippingAddress.city,
        shippingAddress.state,
        shippingAddress.pincode,
        shippingAddress.postalCode
      ].filter(Boolean);
      if (parts.length > 0) {
        console.log('Address from shippingAddress:', parts.join(', '));
        return parts.join(', ');
      }
    }

    // Try delivery object if exists
    if (delivery.address1 || delivery.city) {
      const parts = [
        delivery.address1,
        delivery.address2,
        delivery.street,
        delivery.landmark,
        delivery.area,
        delivery.city,
        delivery.state,
        delivery.pincode,
        delivery.postalCode
      ].filter(Boolean);
      if (parts.length > 0) {
        console.log('Address from delivery:', parts.join(', '));
        return parts.join(', ');
      }
    }

    // Try userId address fields
    if (userId.address1 || userId.city) {
      const parts = [
        userId.address1,
        userId.address2,
        userId.street,
        userId.landmark,
        userId.area,
        userId.city,
        userId.state,
        userId.pincode,
        userId.postalCode
      ].filter(Boolean);
      if (parts.length > 0) {
        console.log('Address from userId:', parts.join(', '));
        return parts.join(', ');
      }
    }

    // Try rawOrder address fields
    if (orderDetails.rawOrder?.shippingAddress) {
      const rawShipping = orderDetails.rawOrder.shippingAddress;
      const parts = [
        rawShipping.houseNoOrFlatNo,
        rawShipping.floor,
        rawShipping.buildingName,
        rawShipping.street,
        rawShipping.landmark,
        rawShipping.area,
        rawShipping.city,
        rawShipping.state,
        rawShipping.pincode,
        rawShipping.postalCode
      ].filter(Boolean);
      if (parts.length > 0) {
        console.log('Address from rawOrder:', parts.join(', '));
        return parts.join(', ');
      }
    }

    // Try direct order level address fields
    const directParts = [
      orderDetails.address1,
      orderDetails.address2,
      orderDetails.street,
      orderDetails.landmark,
      orderDetails.city,
      orderDetails.state,
      orderDetails.pincode,
      orderDetails.postalCode
    ].filter(Boolean);
    
    if (directParts.length > 0) {
      console.log('Address from direct fields:', directParts.join(', '));
      return directParts.join(', ');
    }

    return 'Customer Address Not Available';
  };
  const dropAddress = getDropAddress();
  
  // Enhanced phone number extraction
  const getDropPhone = () => {
    console.log('=== PHONE DEBUG ===');
    const phoneFields = [
      // Try shipping address fields first
      shippingAddress.receiverNo,
      shippingAddress.mobileNo,
      shippingAddress.phone,
      shippingAddress.mobile,
      shippingAddress.contact,
      
      // Then try user object
      userId.mobileNo,
      userId.phone,
      userId.mobile,
      userId.contact,
      
      // Then try delivery object
      delivery.mobileNo,
      delivery.phone,
      delivery.mobile,
      delivery.contact,
      
      // Check rawOrder
      orderDetails.rawOrder?.shippingAddress?.receiverNo,
      orderDetails.rawOrder?.shippingAddress?.mobileNo,
      orderDetails.rawOrder?.user?.mobileNo,
      orderDetails.rawOrder?.delivery?.mobileNo,
      
      // Check nested structures
      orderDetails.user?.mobileNo,
      orderDetails.user?.phone,
      
      // Direct order fields
      orderDetails.customerPhone,
      orderDetails.receiverPhone,
      orderDetails.buyerPhone,
    ].filter(Boolean);
    
    console.log('Phone fields found:', phoneFields);
    console.log('========================');
    
    if (phoneFields.length > 0) {
      return phoneFields[0].toString().trim();
    }
    
    return '';
  };
  
  const dropPhone = getDropPhone();
  const dropLat = userId.lat || delivery.lat;
  const dropLong = userId.long || delivery.long;

  // Customer info - Enhanced extraction logic
  const getCustomerName = () => {
    // Debug: Log all available data
    console.log('=== CUSTOMER NAME DEBUG ===');
    console.log('Full orderDetails:', orderDetails);
    console.log('shippingAddress:', shippingAddress);
    console.log('userId:', userId);
    console.log('delivery:', delivery);
    console.log('rawOrder:', orderDetails.rawOrder);
    console.log('========================');
    
    // Try multiple possible fields for customer name in order of priority
    const nameFields = [
      // First try direct customer fields
      orderDetails.customerName,
      orderDetails.receiverName,
      orderDetails.customer,
      orderDetails.buyerName,
      orderDetails.userName,
      
      // Then try shipping address fields
      shippingAddress.receiverName,
      shippingAddress.name,
      shippingAddress.fullName,
      
      // Then try delivery object fields
      delivery.name,
      delivery.customerName,
      delivery.receiverName,
      delivery.fullName,
      
      // Then try user object fields
      userId.name,
      userId.customerName,
      userId.fullName,
      userId.firstName,
      userId.lastName,
      
      // Check rawOrder if available
      orderDetails.rawOrder?.customerName,
      orderDetails.rawOrder?.receiverName,
      orderDetails.rawOrder?.name,
      
      // Check nested structures
      orderDetails.user?.name,
      orderDetails.user?.customerName,
      orderDetails.user?.fullName,
    ].filter(Boolean);
    
    console.log('Customer name fields found:', nameFields);
    
    if (nameFields.length > 0) {
      const name = nameFields[0];
      // Clean up the name if it contains extra spaces or formatting
      return name.toString().trim();
    }
    
    return 'Customer Name Not Available';
  };
  
  const customerName = getCustomerName();
  
  // Enhanced payment mode extraction
  const getPaymentMode = () => {
    console.log('=== PAYMENT MODE DEBUG ===');
    const paymentFields = [
      orderDetails.paymentMethod,
      orderDetails.paymentMode,
      orderDetails.payment_type,
      orderDetails.payment,
      orderDetails.paymentOption
    ].filter(Boolean);
    
    console.log('Payment fields found:', paymentFields);
    console.log('========================');
    
    if (paymentFields.length > 0) {
      return getPaymentModeText(paymentFields[0]);
    }
    
    return 'N/A';
  };
  
  const paymentMode = getPaymentMode();
  const orderValue = orderDetails.grandTotal || orderDetails.totalAmount || orderDetails.amount || 0;
  const isCODPayment = isCOD(orderDetails.paymentMethod || orderDetails.paymentMode || orderDetails.payment);
  const status = orderDetails.status || orderDetails.orderStatus || 'N/A';
  const paymentStatus = orderDetails.paymentStatus || 'pending';
  const paymentMethodUsed = orderDetails.paymentMethodUsed;
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

          {/* Payment Status - Show for all orders */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Payment Status:</Text>
            <Text style={[
              styles.infoValue,
              paymentStatus === 'paid' ? styles.paidStatus : 
              paymentStatus === 'failed' ? styles.failedStatus : 
              styles.pendingStatus
            ]}>
              {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
            </Text>
          </View>

          {/* Payment Method Used - Show if payment is completed */}
          {paymentMethodUsed && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Payment Method:</Text>
              <Text style={styles.infoValue}>
                {paymentMethodUsed === 'cash' ? 'Cash' : 
                 paymentMethodUsed === 'upi_qr' ? 'UPI QR' : 
                 paymentMethodUsed}
              </Text>
            </View>
          )}


          {/* Payment Scanner Button - Only for COD orders with pending payment */}
          {isCODPayment && paymentStatus === 'pending' && (
            <TouchableOpacity
              style={styles.paymentScannerButton}
              onPress={() => {
                console.log('Payment Scanner clicked');
                Alert.alert('Info', 'Payment scanner functionality would be implemented here');
              }}
            >
              <Text style={styles.paymentScannerText}>Collect Payment</Text>
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
