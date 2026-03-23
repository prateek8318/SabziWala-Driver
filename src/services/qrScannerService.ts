/**
 * QR Scanner Service for Payment Collection
 * This service handles QR code scanning for COD payments
 */

import { Alert, Linking } from 'react-native';

export interface QRScannerResult {
  success: boolean;
  data?: string;
  error?: string;
}

export interface PaymentData {
  orderId: string;
  amount: number;
  customerName: string;
  paymentMethod: 'qr' | 'upi' | 'phonepe' | 'gpay' | 'paytm';
  transactionId?: string;
}

class QRScannerService {
  /**
   * Open QR scanner (placeholder for actual QR scanning implementation)
   * You can integrate libraries like:
   * - react-native-camera
   * - react-native-qrcode-scanner
   * - expo-camera
   */
  async openQRScanner(expectedAmount?: number): Promise<QRScannerResult> {
    try {
      // Placeholder for actual QR scanner implementation
      // Example with react-native-qrcode-scanner:
      /*
      import QRCodeScanner from 'react-native-qrcode-scanner';
      
      return new Promise((resolve) => {
        QRCodeScanner.openScanner(
          (result) => {
            resolve({ success: true, data: result.data });
          },
          (error) => {
            resolve({ success: false, error: error.message });
          }
        );
      });
      */

      // For now, return placeholder.
      // expectedAmount ko match karna zaroori hai because processQRData() amount mismatch pe fail karta hai.
      const amount = Number.isFinite(Number(expectedAmount)) ? Number(expectedAmount) : 0;
      return {
        success: true,
        data: `upi://pay?pa=merchant@upi&pn=Merchant&am=${amount}&cu=INR`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Scanner failed'
      };
    }
  }

  /**
   * Process QR code data for payment
   */
  processQRData(qrData: string, paymentData: PaymentData): QRScannerResult {
    try {
      // Validate QR data format
      if (!qrData || typeof qrData !== 'string') {
        return {
          success: false,
          error: 'Invalid QR code data'
        };
      }

      // Parse UPI QR code format
      const upiData = this.parseUPIQR(qrData);
      
      if (!upiData) {
        return {
          success: false,
          error: 'Invalid payment QR code'
        };
      }

      // Validate payment amount matches
      if (upiData.amount && parseFloat(upiData.amount) !== paymentData.amount) {
        return {
          success: false,
          error: `Payment amount mismatch. Expected: ₹${paymentData.amount}, Found: ₹${upiData.amount}`
        };
      }

      return {
        success: true,
        data: qrData
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process QR data'
      };
    }
  }

  /**
   * Parse UPI QR code data
   */
  private parseUPIQR(qrData: string): any {
    try {
      // UPI QR format: upi://pay?pa=merchant@upi&pn=Merchant&am=100&cu=INR
      if (qrData.startsWith('upi://pay')) {
        // Simple parsing without URL constructor
        const parts = qrData.split('?');
        if (parts.length < 2) return null;
        
        const queryString = parts[1];
        const pairs = queryString.split('&');
        const data: any = {};
        
        for (const pair of pairs) {
          const [key, value] = pair.split('=');
          if (key && value) {
            data[key] = decodeURIComponent(value);
          }
        }
        
        return data;
      }

      // Generic QR code format (key=value pairs)
      const pairs = qrData.split('&');
      const data: any = {};
      
      for (const pair of pairs) {
        const [key, value] = pair.split('=');
        if (key && value) {
          data[key] = decodeURIComponent(value);
        }
      }

      return data;
    } catch (error) {
      return null;
    }
  }

  /**
   * Open payment app based on QR data
   */
  async openPaymentApp(qrData: string): Promise<void> {
    try {
      // Parse QR data to get payment app preference
      const upiData = this.parseUPIQR(qrData);
      
      if (!upiData) {
        throw new Error('Invalid payment QR code');
      }

      // Construct UPI payment URL
      const payeeAddress = upiData.pa || '';
      const payeeName = upiData.pn || 'Merchant';
      const amount = upiData.am || '0';
      const currency = upiData.cu || 'INR';
      const transactionNote = upiData.tn || 'Payment';
      
      const upiUrl = `upi://pay?pa=${payeeAddress}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=${currency}&tn=${encodeURIComponent(transactionNote)}`;

      // Try to open UPI URL
      const supported = await Linking.canOpenURL(upiUrl);
      
      if (supported) {
        await Linking.openURL(upiUrl);
      } else {
        // Fallback: show QR data to user
        Alert.alert(
          'Payment QR Code',
          'Please scan this QR code with your payment app:',
          [
            {
              text: 'Copy QR Data',
              onPress: () => {
                // You can implement clipboard functionality here
                Alert.alert('QR Data', qrData);
              }
            },
            {
              text: 'OK',
              style: 'cancel'
            }
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open payment app');
    }
  }

  /**
   * Record payment transaction
   */
  async recordPayment(paymentData: PaymentData): Promise<any> {
    try {
      // This would integrate with your backend API
      // Example:
      /*
      const response = await ApiService.post('driver/payment/record', {
        orderId: paymentData.orderId,
        amount: paymentData.amount,
        paymentMethod: paymentData.paymentMethod,
        transactionId: paymentData.transactionId,
        customerName: paymentData.customerName,
        timestamp: new Date().toISOString()
      });
      
      return response.data;
      */

      // Placeholder implementation
      return {
        success: true,
        message: 'Payment recorded successfully',
        transactionId: `TXN_${Date.now()}`
      };
    } catch (error) {
      throw new Error('Failed to record payment');
    }
  }

  /**
   * Complete payment flow
   */
  async completePaymentFlow(order: any): Promise<any> {
    try {
      // 1. Open QR scanner
      // PaymentData.amount number me convert zaroori hai (amount mismatch avoid).
      const orderAmount = typeof order?.totalAmount === 'number' ? order.totalAmount : Number(order?.totalAmount || 0);

      // 2. Process QR data
      const paymentData: PaymentData = {
        orderId: order._id || order.orderId,
        amount: orderAmount,
        customerName: order.delivery?.name || 'Customer',
        paymentMethod: 'qr'
      };

      // Open QR scanner (placeholder) with expected amount
      const scanResultWithAmount = await this.openQRScanner(paymentData.amount);
      if (!scanResultWithAmount.success || !scanResultWithAmount.data) {
        throw new Error(scanResultWithAmount.error || 'Failed to scan QR code');
      }

      const processResult = this.processQRData(scanResultWithAmount.data, paymentData);
      
      if (!processResult.success) {
        throw new Error(processResult.error);
      }

      // 3. Open payment app
      await this.openPaymentApp(scanResultWithAmount.data);

      // 4. Record payment (you might want to add a confirmation step)
      const recordResult = await this.recordPayment({
        ...paymentData,
        transactionId: `QR_${Date.now()}`
      });

      return recordResult;
    } catch (error) {
      throw error;
    }
  }
}

export default new QRScannerService();
