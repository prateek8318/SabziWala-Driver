import { PaymentStatusFilter } from '../types/driver-status';

/**
 * Utility functions for order management and status filtering
 */

/**
 * Check if payment status should be shown for an order
 * Based on your requirement: COD orders should not show payment status
 */
export const shouldShowPaymentStatus = (order: any): boolean => {
  // If order is COD, don't show payment status
  if (order.paymentMethod === 'cod' || order.payment_type === 'cod') {
    return false;
  }
  
  // Show payment status for wallet and online payments
  return order.paymentMethod === 'wallet' || 
         order.paymentMethod === 'online' ||
         order.payment_type === 'wallet' || 
         order.payment_type === 'online';
};

/**
 * Get payment method display text
 */
export const getPaymentMethodText = (order: any): string => {
  const method = order.paymentMethod || order.payment_type || 'cod';
  
  switch (method.toLowerCase()) {
    case 'cod':
      return 'Cash on Delivery';
    case 'wallet':
      return 'Wallet';
    case 'online':
      return 'Online Payment';
    default:
      return 'Cash on Delivery';
  }
};

/**
 * Check if order is paid (non-COD orders)
 */
export const isOrderPaid = (order: any): boolean => {
  // COD orders are considered paid only after delivery
  if (order.paymentMethod === 'cod' || order.payment_type === 'cod') {
    return order.status === 'delivered';
  }
  
  // Wallet and online orders are paid upfront
  return order.paymentStatus === 'paid' || order.payment_status === 'paid';
};

/**
 * Get order status flow for driver operations
 */
export const getOrderStatusFlow = () => ({
  // 1. Accept Order
  acceptOrder: {
    apiCall: 'updateOrderStatus',
    body: { status: 'accepted' },
    databaseStatus: 'processing',
    description: 'Order accepted by driver'
  },
  
  // 2. On The Way
  markOnTheWay: {
    apiCall: 'markOrderAsShipped',
    body: {},
    databaseStatus: 'shipped',
    description: 'Order is on the way'
  },
  
  // 3. Pickup Confirmed
  confirmPickup: {
    apiCall: 'updateOrderLocationAndStatus',
    body: { status: 'picked_up' },
    databaseStatus: 'shipped',
    description: 'Pickup confirmed with location'
  },
  
  // 4. Delivered
  markDelivered: {
    apiCall: 'updateOrderStatus',
    body: { status: 'delivered' },
    databaseStatus: 'delivered',
    description: 'Order delivered successfully'
  }
});

/**
 * Get next available action for an order based on current status
 */
export const getNextOrderAction = (currentStatus: string) => {
  const statusFlow = {
    pending: {
      action: 'accept',
      apiCall: 'updateOrderStatus',
      body: { status: 'accepted' },
      description: 'Accept Order'
    },
    processing: {
      action: 'shipped',
      apiCall: 'markOrderAsShipped',
      body: {},
      description: 'Mark as On The Way'
    },
    shipped: {
      action: 'pickup',
      apiCall: 'updateOrderLocationAndStatus',
      body: { status: 'picked_up' },
      description: 'Confirm Pickup'
    },
    delivered: null,
    cancelled: null
  };
  
  return statusFlow[currentStatus as keyof typeof statusFlow] || null;
};
