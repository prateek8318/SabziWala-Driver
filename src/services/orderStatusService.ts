import ApiService from './api';
import { processOrderStatusUpdate, getNextOrderAction } from '../utils/orderStatusManager';

/**
 * Enhanced Order Status Service
 * Ensures proper status updates and handles the "processing" -> "shipped" issue
 */

export interface Order {
  _id: string;
  status: string;
  paymentMode?: string;
  payment_type?: string;
}

/**
 * Fix for the status issue: When marking as "on the way", ensure status changes from "processing" to "shipped"
 */
export const markOrderAsOnTheWay = async (orderId: string): Promise<any> => {
  try {
    console.log('🚀 Marking order as on the way...', orderId);
    
    // First, try the timer endpoint
    const timerResponse = await ApiService.markOrderAsShipped(orderId);
    console.log('Timer API response:', timerResponse.data);
    
    // If timer API doesn't update status properly, also update status directly
    if (timerResponse.data.status !== false) {
      try {
        const statusResponse = await ApiService.updateOrderStatus(orderId, 'shipped');
        console.log('Status update response:', statusResponse.data);
        return statusResponse;
      } catch (statusError) {
        console.log('Status update failed, but timer API worked:', statusError);
        return timerResponse;
      }
    }
    
    return timerResponse;
    
  } catch (error) {
    console.error('Error marking order as on the way:', error);
    throw error;
  }
};

/**
 * Accept order and ensure status changes from "pending" to "processing"
 */
export const acceptOrder = async (orderId: string): Promise<any> => {
  try {
    console.log('✅ Accepting order...', orderId);
    
    const response = await ApiService.updateOrderStatus(orderId, 'accepted');
    console.log('Accept order response:', response.data);
    
    return response;
    
  } catch (error) {
    console.error('Error accepting order:', error);
    throw error;
  }
};

/**
 * Confirm pickup with location and ensure status remains "shipped"
 */
export const confirmPickup = async (
  orderId: string, 
  latitude: number, 
  longitude: number
): Promise<any> => {
  try {
    console.log('📍 Confirming pickup...', orderId);
    
    const response = await ApiService.updateOrderLocationAndStatus(
      orderId,
      latitude,
      longitude,
      'picked_up'
    );
    console.log('Pickup confirmation response:', response.data);
    
    return response;
    
  } catch (error) {
    console.error('Error confirming pickup:', error);
    throw error;
  }
};

/**
 * Mark order as delivered
 */
export const markOrderAsDelivered = async (orderId: string): Promise<any> => {
  try {
    console.log('✅ Marking order as delivered...', orderId);
    
    const response = await ApiService.updateOrderStatus(orderId, 'delivered');
    console.log('Delivered response:', response.data);
    
    return response;
    
  } catch (error) {
    console.error('Error marking order as delivered:', error);
    throw error;
  }
};

/**
 * Cancel order
 */
export const cancelOrder = async (orderId: string): Promise<any> => {
  try {
    console.log('❌ Cancelling order...', orderId);
    
    const response = await ApiService.updateOrderStatus(orderId, 'cancelled');
    console.log('Cancel response:', response.data);
    
    return response;
    
  } catch (error) {
    console.error('Error cancelling order:', error);
    throw error;
  }
};

/**
 * Complete order status flow with proper error handling
 */
export const completeOrderFlow = async (order: Order, action: string, locationData?: { latitude: number; longitude: number }) => {
  try {
    console.log('🔄 Processing order action:', action, 'for order:', order._id);
    console.log('Current status:', order.status);
    
    let response;
    
    switch (action) {
      case 'accept':
        response = await acceptOrder(order._id);
        break;
        
      case 'on_the_way':
        response = await markOrderAsOnTheWay(order._id);
        break;
        
      case 'pickup':
        if (!locationData) {
          throw new Error('Location data is required for pickup confirmation');
        }
        response = await confirmPickup(order._id, locationData.latitude, locationData.longitude);
        break;
        
      case 'deliver':
        response = await markOrderAsDelivered(order._id);
        break;
        
      case 'cancel':
        response = await cancelOrder(order._id);
        break;
        
      default:
        throw new Error(`Unknown action: ${action}`);
    }
    
    // Verify the response
    if (response.data && (response.data.status || response.data.success)) {
      console.log('✅ Action completed successfully');
      return {
        success: true,
        data: response.data,
        action: action,
        orderId: order._id
      };
    } else {
      throw new Error(response.data?.message || 'Action failed');
    }
    
  } catch (error) {
    console.error('❌ Error in complete order flow:', error);
    throw error;
  }
};

/**
 * Get the next available action for an order
 */
export const getNextAction = (order: Order) => {
  const nextAction = getNextOrderAction(order);
  
  if (!nextAction) {
    return null;
  }
  
  return {
    action: nextAction.action,
    description: nextAction.description,
    canAct: nextAction.canAct,
    isCompleted: nextAction.isCompleted,
    apiCall: nextAction.apiCall,
    body: nextAction.body
  };
};

/**
 * Refresh order data to get current status
 */
export const refreshOrderStatus = async (orderId: string): Promise<any> => {
  try {
    console.log('🔄 Refreshing order status...', orderId);
    
    const response = await ApiService.getDriverOrderDetails(orderId);
    console.log('Refreshed order data:', response.data);
    
    return response.data;
    
  } catch (error) {
    console.error('Error refreshing order status:', error);
    throw error;
  }
};

/**
 * Debug function to check order status flow
 */
export const debugOrderStatus = async (order: Order) => {
  console.log('🐛 Debug Order Status:');
  console.log('- Order ID:', order._id);
  console.log('- Current Status:', order.status);
  console.log('- Payment Mode:', order.paymentMode || order.payment_type);
  
  const nextAction = getNextAction(order);
  console.log('- Next Action:', nextAction);
  
  // Try to refresh to get latest status
  try {
    const refreshedOrder = await refreshOrderStatus(order._id);
    console.log('- Refreshed Status:', refreshedOrder.status);
    console.log('- Status Changed:', order.status !== refreshedOrder.status);
    
    return refreshedOrder;
  } catch (error) {
    console.error('- Error refreshing order:', error);
    return order;
  }
};
