import io from 'socket.io-client';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { playNotificationSound } from '../utils/notificationSound';

// Define Socket interface locally to avoid import issues
interface SocketInterface {
    on(event: string, callback: (data: any) => void): SocketInterface;
    emit(event: string, data?: any): SocketInterface;
    disconnect(): void;
    connected: boolean;
    id: string;
    io?: {
        opts: {
            transports: string[];
        };
        engine?: {
            transport?: {
                name: string;
            };
        };
    };
    connect?(): void;
}

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

class SocketService {
    private socket: SocketInterface | null = null;
    private driverId: string | null = null;
    private orderNotificationCallback: ((orderData: OrderData) => void) | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 3;
    private reconnectDelay = 1000;
    private isConnecting = false;
 
    connect(driverId: string) {
        this.driverId = driverId;
        
        this.socket = io('http://192.168.1.9:7006', {
            transports: ['websocket'], // Try websocket first
            timeout: 10000 // 10 seconds timeout
        });

        this.socket.on('connect', () => {
            console.log('✅ Socket connected:', this.socket?.id);
            this.socket?.emit('driver:register', driverId);
        });

        this.socket.on('connect_error', (error) => {
            console.error('❌ Connection error:', error.message);
            
            // Fallback to polling if websocket fails
            if (this.socket?.io?.engine?.transport?.name === 'websocket') {
                console.log('🔄 Switching to polling...');
                if (this.socket.io && this.socket.connect) {
                    this.socket.io.opts.transports = ['polling'];
                    this.socket.connect();
                }
            }
        });

        this.socket.on('driver:registered', (data) => {
            console.log('✅ Driver registered:', data);
        });

        this.socket.on('new:order', (data: any) => {
            this.handleNewOrder(data);
        });

        this.socket.on('disconnect', (reason) => {
            console.log('🔌 Socket disconnected:', reason);
        });
    }

    private handleReconnection() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('❌ Max reconnection attempts reached. Stopping reconnection.');
            this.isConnecting = false;
            return;
        }

        // Don't attempt reconnection if already connecting
        if (this.isConnecting) {
            console.log('🔄 Already connecting, skipping reconnection attempt');
            return;
        }

        this.reconnectAttempts++;
        const delay = Math.min(this.reconnectDelay * this.reconnectAttempts, 5000);
        
        console.log(`🔄 Attempting reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms...`);
        
        setTimeout(() => {
            // Only reconnect if we have a driver ID and socket is not connected
            if (this.driverId && !this.socket?.connected && !this.isConnecting) {
                console.log('🔄 Starting reconnection...');
                this.disconnect();
                this.connect(this.driverId);
            } else {
                console.log('🔄 Skipping reconnection - conditions not met');
                this.isConnecting = false;
            }
        }, delay);
    }
 
    private handleNewOrder(orderData: any) {
        console.log('🔔 New order received:', orderData);
        
        // Play sound (uses order_notification.mp3 from res/raw on Android)
        playNotificationSound();
        
        // Show notification
        this.showOrderNotification(orderData);
        
        // Haptic feedback
        this.triggerHapticFeedback();
    }
 
    private triggerHapticFeedback() {
        ReactNativeHapticFeedback.trigger('notificationSuccess', {
            enableVibrateFallback: true,
            ignoreAndroidSystemSettings: false,
        });
    }

    private showOrderNotification(orderData: any) {
        // Call the registered callback if exists
        if (this.orderNotificationCallback) {
            this.orderNotificationCallback(orderData);
        }
    }

    // Method to register a callback for order notifications
    onNewOrder(callback: (orderData: OrderData) => void) {
        this.orderNotificationCallback = callback;
    }

    // Method to accept an order
    acceptOrder(orderId: string) {
        if (this.socket) {
            this.socket.emit('order:accept', { orderId, driverId: this.driverId });
        }
    }

    // Method to reject an order
    rejectOrder(orderId: string) {
        if (this.socket) {
            this.socket.emit('order:reject', { orderId, driverId: this.driverId });
        }
    }

    // Method to update driver location
    updateLocation(location: { latitude: number; longitude: number }) {
        if (this.socket && this.driverId) {
            this.socket.emit('driver:location', {
                driverId: this.driverId,
                location,
                timestamp: new Date().toISOString(),
            });
        }
    }

    // Method to update order status
    updateOrderStatus(orderId: string, status: string) {
        if (this.socket) {
            this.socket.emit('order:status', {
                orderId,
                driverId: this.driverId,
                status,
                timestamp: new Date().toISOString(),
            });
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.driverId = null;
            this.reconnectAttempts = 0;
            this.isConnecting = false;
        }
    }

    // Get connection status
    isConnected(): boolean {
        return this.socket?.connected || false;
    }

    // Test connection method
    testConnection(): void {
        console.log('🔍 Testing socket connection...');
        console.log('Socket exists:', !!this.socket);
        console.log('Socket connected:', this.socket?.connected);
        console.log('Socket ID:', this.socket?.id);
        console.log('Driver ID:', this.driverId);
        console.log('Reconnect attempts:', this.reconnectAttempts);
        console.log('Is connecting:', this.isConnecting);
        
        if (this.socket && this.socket.connected) {
            this.socket.emit('ping', { timestamp: Date.now() });
            console.log('📡 Ping sent to server');
        } else {
            console.log('❌ Socket not connected, attempting reconnection...');
            if (this.driverId && !this.isConnecting) {
                this.handleReconnection();
            }
        }
    }

    // Get socket instance
    getSocket(): SocketInterface | null {
        return this.socket;
    }

    // Method to manually stop reconnection attempts
    stopReconnection(): void {
        console.log('🛑 Manually stopping reconnection attempts');
        this.reconnectAttempts = this.maxReconnectAttempts;
        this.isConnecting = false;
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    // Method to reset and try fresh connection
    resetConnection(): void {
        console.log('🔄 Resetting socket connection');
        this.stopReconnection();
        this.reconnectAttempts = 0;
        if (this.driverId) {
            setTimeout(() => {
                this.connect(this.driverId!);
            }, 1000);
        }
    }
}
 
export default new SocketService();
