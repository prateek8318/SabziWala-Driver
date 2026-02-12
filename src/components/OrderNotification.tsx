import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import socketService from '../services/socketService';

const { width } = Dimensions.get('window');

// Add sound playing function
const playNotificationSound = () => {
  try {
    const { Sound } = require('react-native-sound');
    
    // Set the audio category for iOS
    Sound.setCategory('Playback');
    
    const notificationSound = new Sound('order-notification.mp3', Sound.MAIN_BUNDLE, (error: any) => {
      if (error) {
        console.log('❌ Sound loading error in OrderNotification:', error);
      } else {
        console.log('✅ Sound loaded successfully in OrderNotification');
        notificationSound.play((success: any) => {
          if (success) {
            console.log('✅ Sound played successfully in OrderNotification');
          } else {
            console.log('❌ Sound playback failed in OrderNotification');
          }
        });
        
        // Release sound after playing
        setTimeout(() => {
          notificationSound.release();
        }, 2000);
      }
    });
  } catch (error: any) {
    console.log('❌ React-native-sound not available in OrderNotification:', error);
  }
};

interface OrderData {
  orderId: string;
  customerInfo: {
    name: string;
    address: string;
    phone?: string;
  };
  timerSeconds: number;
  items?: any[];
  totalAmount?: number;
}

interface OrderNotificationProps {
  onAcceptOrder?: (orderId: string) => void;
  onRejectOrder?: (orderId: string) => void;
}

const OrderNotification: React.FC<OrderNotificationProps> = ({
  onAcceptOrder,
  onRejectOrder,
}) => {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const slideAnim = useRef(new Animated.Value(-width)).current;
  const timerRef = useRef<any>(null);

  useEffect(() => {
    // Register callback for new orders
    socketService.onNewOrder((orderData: OrderData) => {
      setOrder(orderData);
      setTimeLeft(orderData.timerSeconds);
      playNotificationSound(); // Play sound when order arrives
      showNotification();
    });

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (order && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleReject();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      hideNotification();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [order, timeLeft]);

  const showNotification = () => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 8,
    }).start();
  };

  const hideNotification = () => {
    Animated.timing(slideAnim, {
      toValue: -width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setOrder(null);
      setTimeLeft(0);
    });
  };

  const handleAccept = () => {
    if (order) {
      socketService.acceptOrder(order.orderId);
      onAcceptOrder?.(order.orderId);
      hideNotification();
    }
  };

  const handleReject = () => {
    if (order) {
      socketService.rejectOrder(order.orderId);
      onRejectOrder?.(order.orderId);
      hideNotification();
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!order) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateX: slideAnim }],
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Icon name="notifications" size={24} color="#fff" />
        </View>
        <Text style={styles.title}>New Order Assigned!</Text>
        <TouchableOpacity onPress={hideNotification} style={styles.closeButton}>
          <Icon name="close" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>Order #{order.orderId}</Text>
          <Text style={styles.customerName}>{order.customerInfo.name}</Text>
          <Text style={styles.address} numberOfLines={2}>
            📍 {order.customerInfo.address}
          </Text>
          {order.customerInfo.phone && (
            <Text style={styles.phone}>📞 {order.customerInfo.phone}</Text>
          )}
          {order.totalAmount && (
            <Text style={styles.amount}>💰 ₹{order.totalAmount}</Text>
          )}
        </View>

        <View style={styles.timerContainer}>
          <Text style={styles.timerLabel}>Time to accept:</Text>
          <Text style={[
            styles.timer,
            timeLeft <= 10 && styles.timerUrgent
          ]}>
            ⏰ {formatTime(timeLeft)}
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.rejectButton]}
            onPress={handleReject}
          >
            <Icon name="close-circle" size={20} color="#fff" />
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.acceptButton]}
            onPress={handleAccept}
          >
            <Icon name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 16,
  },
  orderInfo: {
    marginBottom: 16,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  customerName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  phone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  timerContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  timerLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  timer: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  timerUrgent: {
    color: '#f44336',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default OrderNotification;
