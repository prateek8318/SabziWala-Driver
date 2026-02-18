///6.11.25
// src/services/api.ts
import axios, { AxiosResponse } from 'axios';
import storage from './storage';
import { SOSRequest, SOSApiResponse } from '../types/sos';
import { SOSSettingsResponse } from '../types/sos-settings';
import { ReportIssueResponse } from '../types/report-issue';
import { PolicyResponse } from '../types/policies';



// -------------------------------------------------
// 1. Base URL (Driver API - Production)
// const BASE_URL = 'http://192.168.1.21:7006/api/';
 const BASE_URL = 'http://159.89.146.245:5010/api/';
// export const IMAGE_BASE_URL = 'http://192.168.1.21:7006/public/';
 export const IMAGE_BASE_URL = 'http://159.89.146.245:5010/public/';

// -------------------------------------------------
// 2. Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

// -------------------------------------------------
// 3. Pretty-print & time helpers
const pretty = (obj: any) => JSON.stringify(obj, null, 2);
const now = () => new Date().toISOString().replace('T', ' ').substr(0, 19);

// -------------------------------------------------
// 4. REQUEST INTERCEPTOR – token + full log
api.interceptors.request.use(
  async (config) => { 
    const token = await storage.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log('\nAPI REQUEST');
    console.log(`Time: ${now()}`);
    console.log(`TOKEN:::: ${token}`);
    console.log(`URL: ${config.baseURL}${config.url}`);
    console.log(`Method: ${config.method?.toUpperCase()}`);
    console.log(`Headers:`, pretty(config.headers || {}));
    if (config.data) console.log(`Payload:`, pretty(config.data));
    if (config.params) console.log(`Params:`, pretty(config.params));
    console.log('─────────────────────────────────');
    return config;
  },
  (error) => {
    console.log('REQUEST SETUP ERROR:', error);
    return Promise.reject(error);
  }
);

// -------------------------------------------------
// 5. RESPONSE INTERCEPTOR – full log + 401 logout
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('\nAPI RESPONSE');
    console.log(`Time: ${now()}`);
    console.log(`URL: ${response.config.url}`);
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log(`Data:`, pretty(response.data));
    console.log('─────────────────────────────────');
    return response;
  },
  (error) => {
    console.log('\nAPI ERROR');
    console.log(`Time: ${now()}`);
    console.log(`URL: ${error.config?.url}`);
    console.log(`Status: ${error.response?.status || 'Network Error'}`);
    console.log(`Message: ${error.message}`);
    if (error.response?.data) {
      console.log(`Error Data:`, pretty(error.response.data));
    }

    // Auto-logout on 401
    if (error.response?.status === 401) {
      storage.removeToken();
      console.log('Token expired → Logged out');
    }

    console.log('─────────────────────────────────');
    return Promise.reject(error);
  }
);

// -------------------------------------------------
// 6. API SERVICE (all CRUD + helpers)
export const ApiService = {
  // ---- CRUD ----

  getImage: (image: string) => `${IMAGE_BASE_URL}${image}`,
  get: (endpoint: string, params?: any) => api.get(endpoint, { params }),
  post: (endpoint: string, data: any) => api.post(endpoint, data),
  put: (endpoint: string, data: any) => api.put(endpoint, data),
  patch: (endpoint: string, data: any) => api.patch(endpoint, data),
  delete: (endpoint: string) => api.delete(endpoint),

  // ---- Multipart Upload ----
  upload: (endpoint: string, fileUri: string, fieldName = 'file') => {
    const formData = new FormData();
    formData.append(fieldName, {
      uri: fileUri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    } as any);

    return api.post(endpoint, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },



  // ---- DRIVER AUTHENTICATION ----
  // Send OTP
  sendOtp: async (phone: string) => {
    const response = await api.post('driver/sendOtp', { mobile: phone });
    return response;
  },

  // Login with OTP
  driverLogin: async (phone: string, otp: string) => {
    const response = await api.post('driver/login', { mobileNo: phone, otp });
    const token = response.data.token || response.data.access_token;
    if (token) await storage.saveToken(token);
    return response;
  },

  // Register Driver (multipart/form-data)
  registerDriver: async (formData: FormData) => {
    const response = await api.post('driver/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const token = response.data.token || response.data.access_token;
    if (token) await storage.saveToken(token);
    return response;
  },

  // ---- DRIVER PROFILE ----
  getDriverProfile: async () => {
    return await api.get('driver/profile');
  },

  updateDriverProfile: async (formData: FormData) => {
    return await api.patch('driver/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // ---- DRIVER HOME & ORDERS ----
  getDriverHome: async () => {
    return await api.get('driver/home');
  },

  getDriverOrders: async (type?: 'all' | 'new' | 'ongoing' | 'history') => {
    const url = type ? `driver/orders?type=${type}` : 'driver/orders';
    return await api.get(url);
  },

  getDriverOrderDetails: async (orderId: string) => {
    return await api.get(`driver/order/${orderId}`);
  },

  updateOrderStatus: async (
    orderId: string,
    status: 'cancelled' | 'accepted' | 'delivered' | 'shipped'
  ) => {
    return await api.patch(`driver/order/${orderId}`, { status });
  },

  // ---- ORDER TIMER ----
  // GET /api/driver/order/:orderId/timer
  getOrderTimer: async (orderId: string) => {
    return await api.get(`driver/order/${orderId}/timer`);
  },

  // ---- DRIVER LOCATION ----
  updateDriverLocation: async (driverId: string, latitude: number, longitude: number) => {
    return await api.patch(`driver/update-location/${driverId}`, { latitude, longitude });
  },

  // ---- DRIVER WALLET ----
  getDriverWallet: async () => {
    return await api.get('driver/wallet');
  },

  createWalletRequest: async (amount_requested: number, message: string) => {
    return await api.post('driver/wallet/request', { amount_requested, message });
  },

  getWalletRequests: async () => {
    return await api.get('driver/wallet/request');
  },

  addEarningsToWallet: async (orderId: string, amount: number) => {
    return await api.post('driver/wallet/add-earnings', { orderId, amount });
  },

  // ---- DRIVER STATUS MANAGEMENT ----
  toggleDriverStatus: async (driverId: string, status: 'active' | 'inactive') => {
    return await api.patch(`driver/status/${driverId}`, { status });
  },

  // ---- DRIVER FORGOT PASSWORD ----
  driverForgotPassword: async (phone: string) => {
    return await api.post('driver/forgot-password', { phone });
  },

  driverResetPassword: async (phone: string, otp: string, newPassword: string) => {
    return await api.post('driver/reset-password', { phone, otp, newPassword });
  },

  // ---- Logout (client-side token removal) ----
  logout: async () => {
    // Driver API doesn't have logout endpoint, so just remove token client-side
    await storage.removeToken();
    return Promise.resolve({ data: { message: 'Logged out successfully' } });
  },

  // ---- DRIVER NOTIFICATIONS ----
  // GET /api/driver/notifications
  getDriverNotifications: async () => {
    return await api.get('driver/notifications');
  },

  // POST /api/driver/notifications
  createDriverNotification: async (payload: {
    title: string;
    message: string;
    type?: string;
    orderId?: string;
    amount?: number;
    meta?: any;
  }) => {
    return await api.post('driver/notifications', payload);
  },

  // PATCH /api/driver/notifications/:id/read
  markDriverNotificationRead: async (id: string) => {
    return await api.patch(`driver/notifications/${id}/read`, {});
  },

  // PATCH /api/driver/notifications/read-all
  markAllDriverNotificationsRead: async () => {
    return await api.patch('driver/notifications/read-all', {});
  },

  // DELETE /api/driver/notifications/:id
  deleteDriverNotification: async (id: string) => {
    return await api.delete(`driver/notifications/${id}`);
  },

  // ---- DRIVER BANK DETAILS ----
  // GET /api/driver/bank-details
  getDriverBankDetails: async () => {
    return await api.get('driver/bank-details');
  },

  // PATCH /api/driver/bank-details
  updateDriverBankDetails: async (bankData: {
    bankName: string;
    branchName: string;
    beneficiaryName: string;
    accountNo: string;
    ifsc: string;
    upiId?: string;
  }) => {
    return await api.patch('driver/bank-details', bankData);
  },

  // DELETE /api/driver/bank-details
  deleteDriverBankDetails: async () => {
    return await api.delete('driver/bank-details');
  },

  // ---- DRIVER SOS REQUEST ----
  // POST /api/driver/sos
  submitSOSRequest: async (sosData: SOSRequest): Promise<AxiosResponse<SOSApiResponse>> => {
    return await api.post('driver/sos', sosData);
  },

  // ---- DRIVER SOS SETTINGS ----
  // GET /api/driver/sos-settings
  getSOSSettings: async (): Promise<AxiosResponse<SOSSettingsResponse>> => {
    return await api.get('driver/sos-settings');
  },

  // ---- DRIVER REPORT ISSUE ----
  // POST /api/driver/report-issue
  submitReportIssue: async (formData: FormData): Promise<AxiosResponse<ReportIssueResponse>> => {
    return await api.post('driver/report-issue', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // ---- DRIVER POLICIES ----
  // GET /api/driver/terms-conditions
  getTermsConditions: async (): Promise<AxiosResponse<PolicyResponse>> => {
    return await api.get('driver/terms-conditions');
  },

  // GET /api/driver/privacy-policy
  getPrivacyPolicy: async (): Promise<AxiosResponse<PolicyResponse>> => {
    return await api.get('driver/privacy-policy');
  },

  // GET /api/driver/refund-policy
  getRefundPolicy: async (): Promise<AxiosResponse<PolicyResponse>> => {
    return await api.get('driver/refund-policy');
  },

  // GET /api/driver/about-us
  getAboutUs: async (): Promise<AxiosResponse<PolicyResponse>> => {
    return await api.get('driver/about-us');
  },
};

export default ApiService;
