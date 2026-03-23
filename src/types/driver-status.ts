// Driver Status API Types

// Driver Account Status
export type DriverAccountStatus = 'active' | 'inactive';

// Order Status Values
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

// Location Update Status Values
export type LocationStatus = 'picked_up' | 'out_for_delivery' | 'delivered';

// API Response Types
export interface DriverStatusResponse {
  success: boolean;
  message: string;
  driver?: {
    _id: string;
    name: string;
    status: DriverAccountStatus;
  };
}

export interface OrderStatusResponse {
  status: boolean;
  message: string;
}

export interface LocationUpdateResponse {
  success: boolean;
  message: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

// API Request Payload Types
export interface DriverStatusRequest {
  status: boolean; // true for active, false for inactive
}

export interface DriverBlockStatusRequest {
  status: boolean; // true for blocked, false for unblocked
}

export interface OrderStatusRequest {
  status: 'accepted' | 'delivered' | 'cancelled' | 'running';
}

export interface OrderLocationUpdateRequest {
  latitude: number;
  longitude: number;
  status: LocationStatus;
}

// Complete Status Flow Types
export interface OrderStatusFlow {
  // Step 1: Accept Order
  acceptOrder: {
    endpoint: `PATCH /api/driver/order/${string}`;
    body: OrderStatusRequest;
    databaseStatus: 'processing';
  };
  
  // Step 2: On The Way
  markOnTheWay: {
    endpoint: `PATCH /api/driver/order/${string}/timer`;
    body: {};
    databaseStatus: 'shipped';
  };
  
  // Step 3: Pickup Confirmed
  confirmPickup: {
    endpoint: `PATCH /api/driver/order/${string}/location`;
    body: OrderLocationUpdateRequest;
    databaseStatus: 'shipped';
  };
  
  // Step 4: Delivered
  markDelivered: {
    endpoint: `PATCH /api/driver/order/${string}`;
    body: OrderStatusRequest;
    databaseStatus: 'delivered';
  };
}

// Driver Management Types
export interface DriverManagementFlow {
  // Toggle Driver Status
  toggleDriverStatus: {
    endpoint: `PATCH /api/driver/status/${string}`;
    body: DriverStatusRequest;
    databaseStatus: DriverAccountStatus;
  };
  
  // Block/Unblock Driver
  toggleBlockStatus: {
    endpoint: `PATCH /api/driver/block/status/${string}`;
    body: DriverBlockStatusRequest;
    databaseField: 'isBlocked';
  };
}

// Payment Status Filter
export interface PaymentStatusFilter {
  showPaymentStatus: boolean; // false for COD orders
  paymentMethod: 'cod' | 'wallet' | 'online';
}
