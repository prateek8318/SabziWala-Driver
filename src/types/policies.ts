export interface PolicyData {
  _id: string;
  type: 'driver' | 'customer';
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PolicyResponse {
  success: boolean;
  message?: string;
  data: PolicyData;
}
