import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator } from 'react-native';
import GlobalHeader from '../../components/GlobalHeader';
import { ApiService, IMAGE_BASE_URL } from '../../services/api';
import styles from './ProductDetailsScreen.styles';

interface ProductDetailsScreenProps {
  orderId: string;
  source?: 'ongoing' | 'history';
  onNavigate?: (screen: string) => void;
}

const ProductDetailsScreen: React.FC<ProductDetailsScreenProps> = ({ orderId, source = 'ongoing', onNavigate }) => {
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getDriverOrderDetails(orderId);
      if (response.data.success || response.status === 200) {
        setOrderDetails(response.data.order || response.data.data || response.data);
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
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
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

  const handleBack = () => {
    onNavigate?.(source === 'history' ? 'history' : 'home');
  };

  const toTitleCase = (value?: string) => {
    if (!value) return 'N/A';
    return value
      .toString()
      .split(' ')
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  const resolveImageUrl = (img?: string | null) => {
    if (!img) return null;
    const raw = img.toString();
    if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
    const cleaned = raw.replace(/\\/g, '/').replace(/^\/+/, '');
    const withoutPublicPrefix = cleaned.startsWith('public/') ? cleaned.slice('public/'.length) : cleaned;
    return `${IMAGE_BASE_URL}${withoutPublicPrefix}`;
  };

  const formatOrderId = (orderId: string) => {
    if (!orderId) return 'N/A';
    // Show more characters but truncate if too long for display
    if (orderId.length > 15) {
      return `#${orderId.slice(-12)}`; // Show last 12 chars with #
    }
    return `#${orderId}`; // Show full ID with # prefix
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <GlobalHeader
          title={formatOrderId(orderId)}
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
          title={formatOrderId(orderId)}
          onBack={handleBack}
          showBackButton={true}
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Order not found</Text>
        </View>
      </View>
    );
  }

  const products = orderDetails.products || [];
  const orderIdDisplay = orderDetails.orderId || orderId;
  const shippingAddress = orderDetails.shippingAddress || {};
  const userId = orderDetails.userId || {};
  const statusLabel = source === 'history'
    ? 'Delivered'
    : toTitleCase(orderDetails.status || orderDetails.orderStatus || 'Ongoing');

  // Enhanced data extraction functions
  const getCustomerName = () => {
    console.log('=== PRODUCT DETAILS CUSTOMER DEBUG ===');
    console.log('Full orderDetails:', orderDetails);
    console.log('shippingAddress:', shippingAddress);
    console.log('userId:', userId);
    console.log('delivery:', orderDetails.delivery);
    console.log('rawOrder:', orderDetails.rawOrder);
    console.log('========================');
    
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
      
      // Check delivery object
      orderDetails.delivery?.name,
      orderDetails.delivery?.customerName,
      orderDetails.delivery?.receiverName,
      
      // Check nested structures
      orderDetails.user?.name,
      orderDetails.user?.customerName,
      orderDetails.user?.fullName,
    ].filter(Boolean);
    
    console.log('Customer name fields found:', nameFields);
    
    if (nameFields.length > 0) {
      return nameFields[0].toString().trim();
    }
    
    return 'Customer Name Not Available';
  };

  const getDeliveryAddress = () => {
    // Try multiple address sources
    const addressSources = [
      shippingAddress,
      orderDetails.delivery,
      orderDetails.dropAddress
    ];
    
    for (const addr of addressSources) {
      if (!addr) continue;
      
      const parts = [
        addr.houseNoOrFlatNo || addr.address1,
        addr.floor || addr.address2,
        addr.landmark,
        addr.city,
        addr.pincode
      ].filter(Boolean);
      
      if (parts.length > 0) {
        return parts.join(', ');
      }
    }
    
    return 'N/A';
  };

  const getPaymentMode = () => {
    console.log('=== PRODUCT DETAILS PAYMENT DEBUG ===');
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

  // Get enhanced data
  const customerName = getCustomerName();
  const deliveryAddress = getDeliveryAddress();
  const paymentMode = getPaymentMode();

  // Enhanced grand total calculation
  const getGrandTotal = () => {
    console.log('=== GRAND TOTAL DEBUG ===');
    console.log('orderDetails.rawOrder?.grandTotal:', orderDetails.rawOrder?.grandTotal);
    console.log('orderDetails.totalAmount:', orderDetails.totalAmount);
    console.log('orderDetails.grandTotal:', orderDetails.grandTotal);
    
    // First try rawOrder.grandTotal (most accurate)
    if (orderDetails.rawOrder?.grandTotal) {
      return parseFloat(orderDetails.rawOrder.grandTotal);
    }
    
    // Then try top level totalAmount
    if (orderDetails.totalAmount) {
      return parseFloat(orderDetails.totalAmount);
    }
    
    // Then try top level grandTotal
    if (orderDetails.grandTotal) {
      return parseFloat(orderDetails.grandTotal);
    }
    
    // Try multiple possible total fields
    const totalFields = [
      orderDetails.grandTotal,
      orderDetails.totalAmount,
      orderDetails.amount,
      orderDetails.finalPrice,
      orderDetails.orderValue,
      orderDetails.total
    ].filter(field => field !== undefined && field !== null && field !== '');
    
    console.log('Total fields found:', totalFields);
    
    if (totalFields.length > 0) {
      return parseFloat(totalFields[0]);
    }
    
    // Calculate from products if no total field found
    if (products && products.length > 0) {
      const calculatedTotal = products.reduce((sum: number, product: any) => {
        const price = product.price || product.amount || product.unitPrice || 0;
        const quantity = product.quantity || product.qty || 1;
        return sum + (price * quantity);
      }, 0);
      
      // Add delivery charge and other charges from rawOrder
      const deliveryCharge = orderDetails.rawOrder?.deliveryCharge || orderDetails.deliveryCharge || 0;
      const handlingCharge = orderDetails.rawOrder?.handlingCharge || orderDetails.handlingCharge || 0;
      const finalTotal = calculatedTotal + deliveryCharge + handlingCharge;
      
      console.log('Calculated total from products:', finalTotal);
      return finalTotal;
    }
    
    return 0;
  };

  const grandTotal = getGrandTotal();

  return (
    <View style={styles.container}>
      <GlobalHeader
        title={formatOrderId(orderIdDisplay)}
        onBack={handleBack}
        showBackButton={true}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainCard}>
          {/* Header */}
          <View style={styles.orderHeader}>
            <View>
              <Text style={styles.orderNumber} numberOfLines={1} ellipsizeMode="tail">{formatOrderId(orderIdDisplay)}</Text>
              <Text style={styles.orderDate}>{formatDate(orderDetails.createdAt)}</Text>
            </View>
            <View style={styles.statusChip}>
              <Text style={styles.statusChipText} numberOfLines={1} ellipsizeMode="tail">{statusLabel}</Text>
            </View>
          </View>

          {/* Delivery Address */}
          <View style={styles.addressSection}>
            <View style={styles.addressRow}>
              <Text style={styles.addressLabel}>Delivery Address:</Text>
              <Text style={styles.addressText}>{deliveryAddress}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaText}>Time: {formatTime(orderDetails.createdAt)}</Text>
              <Text style={styles.metaText}>Date: {formatDate(orderDetails.createdAt)}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Customer Info */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Customer Name:</Text>
            <Text style={styles.infoValue}>{customerName}</Text>
          </View>
          {userId.mobileNo && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mobile No:</Text>
              <Text style={styles.infoValue}>{userId.mobileNo}</Text>
            </View>
          )}
          {shippingAddress.receiverNo && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Receiver No:</Text>
              <Text style={styles.infoValue}>{shippingAddress.receiverNo}</Text>
            </View>
          )}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Payment Mode:</Text>
            <Text style={styles.infoValue}>{paymentMode}</Text>
          </View>

          <View style={styles.divider} />

          {/* Products */}
          <Text style={styles.sectionTitle}>{products.length} Items In order</Text>

          {products.map((product: any, index: number) => {
            console.log('=== PRODUCT DEBUG ===');
            console.log('Product data:', product);
            console.log('Product keys:', Object.keys(product));
            
            // Enhanced product info extraction
            const productInfo = product.productId || product.product || product;
            console.log('ProductInfo:', productInfo);
            
            const productName = productInfo?.name || product.name || product.productName || 'Product Name';
            const productDescription = productInfo?.description || product.description || '';
            const quantity = product.quantity || product.qty || 1;
            const price = product.price || product.amount || product.unitPrice || 0;
            const totalPrice = price * quantity;

            // Enhanced image extraction
            let productImage = null;
            
            // Try multiple image sources
            if (productInfo?.images && productInfo.images.length > 0) {
              productImage = productInfo.images[0];
            } else if (product.images && product.images.length > 0) {
              productImage = product.images[0];
            } else if (product.image) {
              productImage = product.image;
            } else if (product.productImage) {
              productImage = product.productImage;
            } else if (product.thumbnail) {
              productImage = product.thumbnail;
            }
            
            console.log('Product image found:', productImage);
            const imageUrl = resolveImageUrl(productImage);
            console.log('Image URL:', imageUrl);

            return (
              <View key={product._id || index} style={styles.productItem}>
                <Image
                  source={imageUrl ? { uri: imageUrl } : require('../../images/profile.png')}
                  style={styles.productImage}
                  defaultSource={require('../../images/profile.png')}
                  onError={() => console.log('Image load failed for:', productImage)}
                />
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{productName}</Text>
                  {productDescription ? (
                    <Text style={styles.productDescription} numberOfLines={2}>
                      {productDescription}
                    </Text>
                  ) : null}
                  <Text style={styles.productQuantity}>Quantity: {quantity}</Text>
                  <View style={styles.productPriceRow}>
                    <Text style={styles.productPrice}>₹{totalPrice}</Text>
                    <Text style={styles.productUnitPrice}>₹{price} per unit</Text>
                  </View>
                </View>
              </View>
            );
          })}

          <View style={styles.divider} />

          {/* Bill Summary */}
          <Text style={styles.sectionTitle}>Bill Summary</Text>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Item Price Total</Text>
            <Text style={styles.billValue}>₹{products.reduce((sum: number, product: any) => {
              const price = product.price || product.amount || product.unitPrice || 0;
              const quantity = product.quantity || product.qty || 1;
              return sum + (price * quantity);
            }, 0)}</Text>
          </View>

          {orderDetails.rawOrder?.handlingCharge > 0 && (
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Handling Charge</Text>
              <Text style={styles.billValue}>₹{orderDetails.rawOrder.handlingCharge}</Text>
            </View>
          )}

          {orderDetails.rawOrder?.deliveryCharge > 0 && (
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Delivery Charge</Text>
              <Text style={styles.billValue}>₹{orderDetails.rawOrder.deliveryCharge}</Text>
            </View>
          )}

          {orderDetails.rawOrder?.couponUsage && orderDetails.rawOrder.couponUsage.length > 0 && (
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Coupon ({orderDetails.rawOrder.couponUsage[0].couponCode})</Text>
              <Text style={[styles.billValue, { color: '#086B48' }]}>
                -₹{orderDetails.rawOrder.couponUsage[0].discountAmount}
              </Text>
            </View>
          )}

          {orderDetails.rawOrder?.remark && (
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Remark</Text>
              <Text style={styles.billValue}>{orderDetails.rawOrder.remark}</Text>
            </View>
          )}

          {orderDetails.rawOrder?.paymentStatus && (
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Payment Status</Text>
              <Text style={[styles.billValue, { 
                color: orderDetails.rawOrder.paymentStatus === 'paid' ? '#086B48' : 
                       orderDetails.rawOrder.paymentStatus === 'pending' ? '#F59E0B' : '#EF4444'
              }]}>
                {orderDetails.rawOrder.paymentStatus.charAt(0).toUpperCase() + orderDetails.rawOrder.paymentStatus.slice(1)}
              </Text>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.billRow}>
            <Text style={styles.billTotalLabel}>Grand Total</Text>
            <Text style={styles.billTotalValue}>₹{grandTotal}</Text>
          </View>

          {/* Bottom Status */}
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{statusLabel}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProductDetailsScreen;
