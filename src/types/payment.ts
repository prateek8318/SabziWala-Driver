// Payment API Types

// QR Code Generation Request
export interface QRGenerateRequest {
  orderId: string;
  amount: number;
}

// QR Code Generation Response
export interface QRGenerateResponse {
  success: boolean;
  message: string;
  data?: {
    qrId: string;
    qrImageUrl: string;
    orderId: string;
    amount: number;
    expiresAt: string;
  };
}

// Cash Collection Request
export interface CashCollectionRequest {
  orderId: string;
  amount: number;
}

// Cash Collection Response
export interface CashCollectionResponse {
  success: boolean;
  message: string;
  data?: {
    orderId: string;
    amount: number;
    collectedAt: string;
    driverCashBalance: number;
  };
}

// Razorpay Webhook Payload
export interface RazorpayWebhookPayload {
  entity: string;
  event: string;
  payload: {
    payment: {
      entity: {
        id: string;
        amount: number;
        currency: string;
        status: string;
        order_id: string;
        invoice_id?: string;
        international: boolean;
        method: string;
        amount_refunded: number;
        refund_status?: string;
        captured: boolean;
        description: string;
        card_id?: string;
        bank?: string;
        wallet?: string;
        vpa?: string;
        email?: string;
        contact?: string;
        notes?: {
          orderId: string;
          driverId: string;
        };
        fee: number;
        tax: number;
        error_code?: string;
        error_description?: string;
        created_at: number;
      };
    };
  };
}

// Webhook Response
export interface WebhookResponse {
  success: boolean;
  message: string;
}

// Payment Status
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'expired';

// Payment Method
export type PaymentMethod = 'cash' | 'upi_qr' | 'online';

// Order Payment Info
export interface OrderPaymentInfo {
  paymentStatus: PaymentStatus;
  paymentMethodUsed?: PaymentMethod;
  razorpayQrId?: string;
  razorpayQrImageUrl?: string;
  razorpayQrCreatedAt?: string;
  amount?: number;
}
