/**
 * Example usage of Driver Status APIs
 * This file demonstrates how to use all the driver status management APIs
 */

import ApiService from '../services/api';
import { shouldShowPaymentStatus, getNextOrderAction } from '../utils/orderUtils';

// ========================================
// 1. DRIVER ACCOUNT STATUS MANAGEMENT
// ========================================

/**
 * Toggle driver active/inactive status
 * @param driverId - ID of the driver
 * @param isActive - true for active, false for inactive
 */
export const toggleDriverAccountStatus = async (driverId: string, isActive: boolean) => {
  try {
    const response = await ApiService.toggleDriverStatus(driverId, isActive);
    console.log('Driver status updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating driver status:', error);
    throw error;
  }
};

/**
 * Toggle driver block/unblock status
 * @param driverId - ID of the driver
 * @param isBlocked - true for blocked, false for unblocked
 */
export const toggleDriverBlockStatus = async (driverId: string, isBlocked: boolean) => {
  try {
    const response = await ApiService.toggleDriverBlockStatus(driverId, isBlocked);
    console.log('Driver block status updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating driver block status:', error);
    throw error;
  }
};

// ========================================
// 2. ORDER STATUS MANAGEMENT
// ========================================

/**
 * Complete order status flow example
 * @param orderId - ID of the order
 */
export const completeOrderStatusFlow = async (orderId: string) => {
  try {
    // Step 1: Accept Order
    console.log('🟢 Accepting order...');
    const acceptResponse = await ApiService.updateOrderStatus(orderId, 'accepted');
    console.log('Order accepted:', acceptResponse.data);
    
    // Wait a bit (simulating time)
    await new Promise<void>(resolve => setTimeout(resolve, 1000));
    
    // Step 2: Mark as Shipped (On The Way)
    console.log('🚚 Marking order as shipped...');
    const shippedResponse = await ApiService.markOrderAsShipped(orderId);
    console.log('Order shipped:', shippedResponse.data);
    
    // Wait a bit (simulating time)
    await new Promise<void>(resolve => setTimeout(resolve, 1000));
    
    // Step 3: Update Location and Status (Pickup Confirmed)
    console.log('📍 Updating location and confirming pickup...');
    const locationResponse = await ApiService.updateOrderLocationAndStatus(
      orderId,
      28.6139,  // latitude
      77.2090,  // longitude
      'picked_up'
    );
    console.log('Location updated:', locationResponse.data);
    
    // Wait a bit (simulating time)
    await new Promise<void>(resolve => setTimeout(resolve, 1000));
    
    // Step 4: Mark as Delivered
    console.log('✅ Marking order as delivered...');
    const deliveredResponse = await ApiService.updateOrderStatus(orderId, 'delivered');
    console.log('Order delivered:', deliveredResponse.data);
    
    return {
      success: true,
      message: 'Order completed successfully',
      steps: ['accepted', 'shipped', 'picked_up', 'delivered']
    };
    
  } catch (error) {
    console.error('Error in order status flow:', error);
    throw error;
  }
};

// ========================================
// 3. LOCATION UPDATES
// ========================================

/**
 * Update order location with different statuses
 */
export const updateOrderLocationExamples = async (orderId: string) => {
  const locations = [
    {
      latitude: 28.6139,
      longitude: 77.2090,
      status: 'picked_up',
      description: 'Pickup location'
    },
    {
      latitude: 28.6140,
      longitude: 77.2091,
      status: 'out_for_delivery',
      description: 'Out for delivery'
    },
    {
      latitude: 28.6141,
      longitude: 77.2092,
      status: 'delivered',
      description: 'Delivery location'
    }
  ];
  
  for (const location of locations) {
    try {
      console.log(`📍 Updating location: ${location.description}`);
      const response = await ApiService.updateOrderLocationAndStatus(
        orderId,
        location.latitude,
        location.longitude,
        location.status as any
      );
      console.log(`Location updated:`, response.data);
      
      // Wait between updates
      await new Promise<void>(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Error updating location for ${location.description}:`, error);
    }
  }
};

// ========================================
// 4. PAYMENT STATUS FILTERING
// ========================================

/**
 * Example of payment status filtering
 */
export const paymentStatusFilteringExample = (orders: any[]) => {
  console.log('📊 Payment Status Filtering Example');
  
  orders.forEach((order, index) => {
    console.log(`\n--- Order ${index + 1} ---`);
    console.log('Order ID:', order._id);
    console.log('Payment Method:', order.paymentMethod || order.payment_type);
    console.log('Order Status:', order.status);
    
    // Check if payment status should be shown
    const showPaymentStatus = shouldShowPaymentStatus(order);
    console.log('Show Payment Status:', showPaymentStatus);
    
    if (showPaymentStatus) {
      console.log('Payment Status:', order.paymentStatus || order.payment_status);
    } else {
      console.log('Payment Status: Hidden (COD Order)');
    }
    
    // Get next available action
    const nextAction = getNextOrderAction(order.status);
    if (nextAction) {
      console.log('Next Action:', nextAction.description);
    } else {
      console.log('Next Action: None (Order completed/cancelled)');
    }
  });
};

// ========================================
// 5. COMPLETE DRIVER WORKFLOW EXAMPLE
// ========================================

/**
 * Complete driver workflow example
 */
export const completeDriverWorkflow = async (driverId: string, orderId: string) => {
  try {
    console.log('🚀 Starting complete driver workflow...');
    
    // 1. Set driver as active
    console.log('\n1️⃣ Setting driver as active...');
    await toggleDriverAccountStatus(driverId, true);
    
    // 2. Process the order
    console.log('\n2️⃣ Processing order...');
    await completeOrderStatusFlow(orderId);
    
    // 3. Set driver as inactive (after delivery)
    console.log('\n3️⃣ Setting driver as inactive...');
    await toggleDriverAccountStatus(driverId, false);
    
    console.log('\n✅ Complete workflow finished successfully!');
    
  } catch (error) {
    console.error('❌ Workflow failed:', error);
    throw error;
  }
};

// ========================================
// 6. ERROR HANDLING EXAMPLES
// ========================================

/**
 * Example of proper error handling
 */
export const errorHandlingExample = async (orderId: string) => {
  try {
    const response = await ApiService.updateOrderStatus(orderId, 'accepted');
    
    if (response.data.status) {
      console.log('✅ Order accepted successfully');
      return response.data;
    } else {
      console.log('❌ Order acceptance failed:', response.data.message);
      throw new Error(response.data.message);
    }
    
  } catch (error: any) {
    if (error.response) {
      // API returned an error response
      console.error('API Error:', error.response.status, error.response.data);
      
      switch (error.response.status) {
        case 400:
          throw new Error('Bad request: Invalid order data');
        case 401:
          throw new Error('Unauthorized: Please login again');
        case 403:
          throw new Error('Forbidden: You cannot modify this order');
        case 404:
          throw new Error('Order not found');
        case 500:
          throw new Error('Server error: Please try again later');
        default:
          throw new Error('Unknown error occurred');
      }
    } else if (error.request) {
      // Network error
      console.error('Network Error:', error.message);
      throw new Error('Network error: Please check your connection');
    } else {
      // Other error
      console.error('Error:', error.message);
      throw error;
    }
  }
};
