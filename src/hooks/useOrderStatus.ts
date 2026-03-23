import { useState, useCallback } from 'react';
import { 
  completeOrderFlow, 
  getNextAction, 
  refreshOrderStatus,
  debugOrderStatus 
} from '../services/orderStatusService';
import { 
  getOrderMenuItems, 
  getOrderStatusDisplayText, 
  getOrderStatusColor,
  isCodOrder 
} from '../utils/orderStatusManager';

export interface Order {
  _id: string;
  status: string;
  paymentMode?: string;
  payment_type?: string;
  // Add other order fields as needed
}

export interface OrderStatusState {
  order: Order | null;
  loading: boolean;
  error: string | null;
  nextAction: any;
  menuItems: Array<{ id: string; title: string; action: string }>;
}

export const useOrderStatus = (initialOrder: Order | null = null) => {
  const [state, setState] = useState<OrderStatusState>({
    order: initialOrder,
    loading: false,
    error: null,
    nextAction: null,
    menuItems: []
  });

  // Update order and recalculate actions
  const updateOrder = useCallback((newOrder: Order) => {
    const nextAction = getNextAction(newOrder);
    const menuItems = getOrderMenuItems(newOrder);
    
    setState(prev => ({
      ...prev,
      order: newOrder,
      nextAction,
      menuItems,
      error: null
    }));
  }, []);

  // Handle order action
  const handleOrderAction = useCallback(async (
    action: string, 
    locationData?: { latitude: number; longitude: number }
  ) => {
    if (!state.order) {
      setState(prev => ({ ...prev, error: 'No order available' }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await completeOrderFlow(state.order, action, locationData);
      
      // Refresh order to get updated status
      const refreshedOrder = await refreshOrderStatus(state.order._id);
      
      // Update state with new order data
      updateOrder(refreshedOrder);
      
      setState(prev => ({ 
        ...prev, 
        loading: false,
        error: null 
      }));
      
      return response;
      
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update order status';
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
      throw error;
    }
  }, [state.order, updateOrder]);

  // Refresh order status
  const refreshOrder = useCallback(async () => {
    if (!state.order) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const refreshedOrder = await refreshOrderStatus(state.order._id);
      updateOrder(refreshedOrder);
      
      setState(prev => ({ 
        ...prev, 
        loading: false,
        error: null 
      }));
      
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to refresh order';
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
    }
  }, [state.order, updateOrder]);

  // Debug order status
  const debugOrder = useCallback(async () => {
    if (!state.order) return;

    try {
      const debugInfo = await debugOrderStatus(state.order);
      return debugInfo;
    } catch (error) {
      console.error('Debug error:', error);
    }
  }, [state.order]);

  // Get status display text
  const getStatusText = useCallback(() => {
    if (!state.order) return '';
    return getOrderStatusDisplayText(state.order.status);
  }, [state.order]);

  // Get status color
  const getStatusColor = useCallback(() => {
    if (!state.order) return '#8E8E93';
    return getOrderStatusColor(state.order.status);
  }, [state.order]);

  // Check if order is COD
  const isCOD = useCallback(() => {
    if (!state.order) return false;
    return isCodOrder(state.order);
  }, [state.order]);

  // Check if payment status should be shown
  const shouldShowPaymentStatus = useCallback(() => {
    return !isCOD();
  }, [isCOD]);

  // Reset state
  const reset = useCallback(() => {
    setState({
      order: null,
      loading: false,
      error: null,
      nextAction: null,
      menuItems: []
    });
  }, []);

  return {
    // State
    order: state.order,
    loading: state.loading,
    error: state.error,
    nextAction: state.nextAction,
    menuItems: state.menuItems,
    
    // Actions
    updateOrder,
    handleOrderAction,
    refreshOrder,
    debugOrder,
    reset,
    
    // Getters
    getStatusText,
    getStatusColor,
    isCOD,
    shouldShowPaymentStatus,
    
    // Computed values
    canAct: state.nextAction?.canAct || false,
    isCompleted: state.nextAction?.isCompleted || false,
    currentStatus: state.order?.status || '',
    orderId: state.order?._id || ''
  };
};

// Example usage in a component:
/*
import { useOrderStatus } from '../hooks/useOrderStatus';

const OrderComponent = ({ order }) => {
  const {
    order: currentOrder,
    loading,
    error,
    nextAction,
    menuItems,
    handleOrderAction,
    getStatusText,
    getStatusColor,
    shouldShowPaymentStatus
  } = useOrderStatus(order);

  const handleAccept = () => {
    handleOrderAction('accept');
  };

  const handleOnTheWay = () => {
    handleOrderAction('on_the_way');
  };

  const handlePickup = () => {
    handleOrderAction('pickup', { latitude: 28.6139, longitude: 77.2090 });
  };

  const handleDeliver = () => {
    handleOrderAction('deliver');
  };

  return (
    <View>
      <Text style={{ color: getStatusColor() }}>
        {getStatusText()}
      </Text>
      
      {shouldShowPaymentStatus() && (
        <Text>Payment Status: {currentOrder?.paymentStatus}</Text>
      )}
      
      {nextAction && (
        <Button 
          title={nextAction.description}
          onPress={() => {
            switch (nextAction.action) {
              case 'accept':
                handleAccept();
                break;
              case 'on_the_way':
                handleOnTheWay();
                break;
              case 'pickup':
                handlePickup();
                break;
              case 'deliver':
                handleDeliver();
                break;
            }
          }}
          disabled={loading}
        />
      )}
      
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
    </View>
  );
};
*/
