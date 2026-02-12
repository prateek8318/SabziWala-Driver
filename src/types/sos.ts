export interface EmergencyContact {
  name: string;
  mobile: string;
}

export interface Location {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface SOSRequest {
  remarks: string;
  sosType?: 'emergency' | 'accident' | 'breakdown' | 'theft' | 'medical' | 'other';
  emergencyContact?: EmergencyContact;
}

export interface SOSResponse {
  _id: string;
  driver: string;
  driverName: string;
  driverMobile: string;
  remarks: string;
  sosType: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'cancelled';
  emergencyContact?: EmergencyContact;
  location: Location;
  adminNotes: string;
  handledBy: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface SOSApiResponse {
  success: boolean;
  message: string;
  data: SOSResponse;
}
