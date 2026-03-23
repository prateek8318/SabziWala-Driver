export interface CMSData {
  _id: string;
  contentType: string;
  title: string;
  description: string;
  type: 'driver' | 'customer';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CMSResponse {
  status: boolean;
  message: string;
  data: CMSData[];
}

export interface PolicyData {
  _id: string;
  contentType: string;
  title: string;
  description: string;
  type: 'driver' | 'customer';
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PolicyResponse {
  status: boolean;
  message: string;
  data: PolicyData;
}
