import { OrderStatus, LocationStatus } from '../types/driver-status';

/**
 * Order Status Manager - Handles proper status flow for orders
 * Ensures status updates work correctly with the backend
 */

export interface Order {
  _id: string;
  status: string;
  paymentMode?: string;
  payment_type?: string;
  // Add other order fields as needed
}

/**
 * Get the correct status flow based on current order status
 */
export const getOrderStatusFlow = (currentStatus: string) => {
  const statusFlow = {
    'shipped': {
      nextStatus: 'processing',
      action: 'accept',
      description: 'Accept Order',
      apiCall: 'updateOrderStatus',
      body: { status: 'accepted' }
    },
    'processing': {
      nextStatus: 'shipped',
      action: 'on_the_way',
      description: 'Mark as On The Way',
      apiCall: 'markOrderAsShipped',
      body: {}
    },
    'delivered': {
      nextStatus: 'delivered',
      action: null,
      description: 'Order Delivered',
      apiCall: null,
      body: null
    },
    'cancelled': {
      nextStatus: 'cancelled',
      action: null,
      description: 'Order Cancelled',
      apiCall: null,
      body: null
    }
  };

  return statusFlow[currentStatus as keyof typeof statusFlow] || null;
};

/**
 * Check if status transition is valid
 */
export const isValidStatusTransition = (fromStatus: string, toStatus: string): boolean => {
  const validTransitions: Record<string, string[]> = {
    'shipped': ['processing', 'cancelled'], // New order flow (shipped = new orders)
    'processing': ['shipped', 'cancelled'], // processing = accepted orders
    'delivered': [],
    'cancelled': []
  };

  return validTransitions[fromStatus]?.includes(toStatus) || false;
};

/**
 * Get display text for order status
 */
export const getOrderStatusDisplayText = (status: string): string => {
  const statusTexts = {
    'pending': 'Pending',
    'processing': 'Accepted',
    'shipped': 'New Order', // Updated: shipped orders are new orders
    'delivered': 'Delivered',
    'cancelled': 'Cancelled'
  };

  return statusTexts[status as keyof typeof statusTexts] || status;
};

/**
 * Get status color for UI display
 */
export const getOrderStatusColor = (status: string): string => {
  const statusColors = {
    'pending': '#FFA500', // Orange
    'processing': '#007AFF', // Blue
    'shipped': '#FF9500', // Orange - for new orders
    'delivered': '#34C759', // Green
    'cancelled': '#FF3B30' // Red
  };

  return statusColors[status as keyof typeof statusColors] || '#8E8E93'; // Gray
};

/**
 * Check if order can be acted upon by driver
 */
export const canDriverActOnOrder = (order: Order): boolean => {
  const actionableStatuses = ['shipped', 'processing']; // Updated: shipped are new orders
  return actionableStatuses.includes(order.status);
};

/**
 * Get next available action for order
 */
export const getNextOrderAction = (order: Order) => {
  const flow = getOrderStatusFlow(order.status);
  if (!flow) return null;

  return {
    ...flow,
    canAct: canDriverActOnOrder(order),
    isCompleted: order.status === 'delivered' || order.status === 'cancelled'
  };
};

/**
 * Process order status update with proper validation
 */
export const processOrderStatusUpdate = async (
  order: Order,
  action: 'accept' | 'on_the_way' | 'pickup' | 'deliver' | 'cancel',
  apiService: any,
  locationData?: { latitude: number; longitude: number }
) => {
  try {
    let response;

    switch (action) {
      case 'accept':
        if (order.status !== 'pending') {
          throw new Error(`Cannot accept order with status: ${order.status}`);
        }
        response = await apiService.updateOrderStatus(order._id, 'accepted');
        break;

      case 'on_the_way':
        if (order.status !== 'processing') {
          throw new Error(`Cannot mark order as on the way with status: ${order.status}`);
        }
        response = await apiService.markOrderAsShipped(order._id);
        break;

      case 'pickup':
        if (order.status !== 'shipped') {
          throw new Error(`Cannot confirm pickup with status: ${order.status}`);
        }
        if (!locationData) {
          throw new Error('Location data is required for pickup confirmation');
        }
        response = await apiService.updateOrderLocationAndStatus(
          order._id,
          locationData.latitude,
          locationData.longitude,
          'picked_up'
        );
        break;

      case 'deliver':
        if (order.status !== 'shipped') {
          throw new Error(`Cannot deliver order with status: ${order.status}`);
        }
        response = await apiService.updateOrderStatus(order._id, 'delivered');
        break;

      case 'cancel':
        if (['delivered', 'cancelled'].includes(order.status)) {
          throw new Error(`Cannot cancel order with status: ${order.status}`);
        }
        response = await apiService.updateOrderStatus(order._id, 'cancelled');
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return {
      success: true,
      data: response.data,
      newStatus: getNewStatusAfterAction(order.status, action)
    };

  } catch (error) {
    console.error('Error processing order status update:', error);
    throw error;
  }
};

/**
 * Get the new status after an action
 */
export const getNewStatusAfterAction = (currentStatus: string, action: string): string => {
  const statusMap: Record<string, Record<string, string>> = {
    'pending': {
      'accept': 'processing',
      'cancel': 'cancelled'
    },
    'processing': {
      'on_the_way': 'shipped',
      'cancel': 'cancelled'
    },
    'shipped': {
      'pickup': 'shipped',
      'deliver': 'delivered',
      'cancel': 'cancelled'
    }
  };

  return statusMap[currentStatus]?.[action] || currentStatus;
};

/**
 * Check if order is COD (for payment status filtering)
 */
export const isCodOrder = (order: Order): boolean => {
  const paymentMode = (order.paymentMode || order.payment_type || '').toLowerCase();
  return paymentMode === 'cod';
};

/**
 * Get menu items based on order status
 */
export const getOrderMenuItems = (order: Order) => {
  const nextAction = getNextOrderAction(order);
  const menuItems: Array<{ id: string; title: string; action: string }> = [];

  if (!nextAction) return menuItems;

  switch (order.status) {
    case 'shipped':
      menuItems.push(
        { id: 'accept', title: 'Accept Order', action: 'accept' },
        { id: 'cancel', title: 'Cancel Order', action: 'cancel' }
      );
      break;

    case 'processing':
      menuItems.push(
        { id: 'on_the_way', title: 'Mark as On The Way', action: 'on_the_way' },
        { id: 'cancel', title: 'Cancel Order', action: 'cancel' }
      );
      break;

    case 'delivered':
      menuItems.push(
        { id: 'view_details', title: 'Order Details', action: 'view' }
      );
      break;

    case 'cancelled':
      menuItems.push(
        { id: 'view_details', title: 'Order Details', action: 'view' }
      );
      break;
  }

  return menuItems;
};
