/**
 * Example showing how to fix the order status issue
 * This demonstrates the proper way to handle the "processing" -> "shipped" transition
 */

import ApiService from '../services/api';
import { markOrderAsOnTheWay, acceptOrder, confirmPickup, markOrderAsDelivered } from '../services/orderStatusService';
import { useOrderStatus } from '../hooks/useOrderStatus';

// Your order object (example)
const yourOrderObject = {
  "_id": "69bfb0eacea73c7ddcc1311e",
  "bookingId": "69bfb0eacea73c7ddcc1311e",
  "orderId": "69bfb0eacea73c7ddcc1311e",
  "status": "processing", // This is the issue - should change to "shipped" when on the way
  "paymentMode": "cod",
  "totalAmount": 443,
  // ... other fields
};

/**
 * Method 1: Using the enhanced API service (Recommended)
 */
export const fixOrderStatusEnhanced = async () => {
  try {
    console.log('🔧 Fixing order status with enhanced API...');
    
    // If order is "processing" and you want to mark it as "on the way"
    if (yourOrderObject.status === 'processing') {
      console.log('📦 Current status: processing');
      console.log('🚀 Marking as on the way...');
      
      const response = await markOrderAsOnTheWay(yourOrderObject._id);
      console.log('✅ Response:', response.data);
      
      // The enhanced API will try both timer and status update
      // This ensures the status changes from "processing" to "shipped"
    }
    
  } catch (error) {
    console.error('❌ Error fixing order status:', error);
  }
};

/**
 * Method 2: Using the React Hook (Best for components)
 */
export const OrderStatusComponent = () => {
  const {
    order,
    loading,
    error,
    nextAction,
    handleOrderAction,
    getStatusText,
    getStatusColor,
    shouldShowPaymentStatus
  } = useOrderStatus(yourOrderObject);

  const handleOnTheWay = async () => {
    try {
      await handleOrderAction('on_the_way');
      console.log('✅ Order marked as on the way!');
    } catch (error) {
      console.error('❌ Failed to mark as on the way:', error);
    }
  };

  // In your component JSX:
  /*
  return (
    <View>
      <Text style={{ color: getStatusColor() }}>
        Status: {getStatusText()}
      </Text>
      
      {!shouldShowPaymentStatus() && (
        <Text>COD Order - Payment status hidden</Text>
      )}
      
      {nextAction?.action === 'on_the_way' && (
        <Button 
          title="Mark as On The Way"
          onPress={handleOnTheWay}
          disabled={loading}
        />
      )}
      
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
    </View>
  );
  */
};

/**
 * Method 3: Manual API calls with fallback
 */
export const fixOrderStatusManual = async () => {
  try {
    console.log('🔧 Manual fix for order status...');
    
    const orderId = yourOrderObject._id;
    
    // Step 1: Try the timer endpoint
    console.log('1️⃣ Trying timer endpoint...');
    const timerResponse = await ApiService.markOrderAsShipped(orderId);
    console.log('Timer response:', timerResponse.data);
    
    // Step 2: If status doesn't change, update it directly
    console.log('2️⃣ Updating status directly...');
    const statusResponse = await ApiService.updateOrderStatus(orderId, 'shipped');
    console.log('Status update response:', statusResponse.data);
    
    // Step 3: Verify the change
    console.log('3️⃣ Verifying status change...');
    const orderDetails = await ApiService.getDriverOrderDetails(orderId);
    console.log('Current order status:', orderDetails.data.status);
    
    if (orderDetails.data.status === 'shipped') {
      console.log('✅ Status successfully changed to shipped!');
    } else {
      console.log('❌ Status still shows as:', orderDetails.data.status);
    }
    
  } catch (error) {
    console.error('❌ Manual fix failed:', error);
  }
};

/**
 * Method 4: Complete order flow example
 */
export const completeOrderFlowExample = async () => {
  try {
    const orderId = yourOrderObject._id;
    
    console.log('🔄 Starting complete order flow...');
    
    // If order is pending, accept it first
    if (yourOrderObject.status === 'pending') {
      console.log('📦 Accepting order...');
      await acceptOrder(orderId);
    }
    
    // Mark as on the way (processing -> shipped)
    if (yourOrderObject.status === 'processing') {
      console.log('🚚 Marking as on the way...');
      await markOrderAsOnTheWay(orderId);
    }
    
    // Confirm pickup with location
    console.log('📍 Confirming pickup...');
    await confirmPickup(orderId, 28.6139, 77.2090);
    
    // Mark as delivered
    console.log('✅ Marking as delivered...');
    await markOrderAsDelivered(orderId);
    
    console.log('🎉 Order flow completed!');
    
  } catch (error) {
    console.error('❌ Order flow failed:', error);
  }
};

/**
 * Debug function to check what's happening
 */
export const debugCurrentOrder = async () => {
  try {
    console.log('🐛 Debugging current order...');
    console.log('Order ID:', yourOrderObject._id);
    console.log('Current Status:', yourOrderObject.status);
    console.log('Payment Mode:', yourOrderObject.paymentMode);
    
    // Get fresh order data from API
    const freshOrder = await ApiService.getDriverOrderDetails(yourOrderObject._id);
    console.log('Fresh Order Status:', freshOrder.data.status);
    
    // Check if status is different
    if (yourOrderObject.status !== freshOrder.data.status) {
      console.log('⚠️ Status mismatch detected!');
      console.log('Local status:', yourOrderObject.status);
      console.log('Server status:', freshOrder.data.status);
    } else {
      console.log('✅ Status is in sync');
    }
    
    return freshOrder.data;
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
};

/**
 * Quick fix you can use right now
 */
export const quickFix = async () => {
  // Just call this function to fix the status issue
  await fixOrderStatusEnhanced();
};
