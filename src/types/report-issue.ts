export type IncidentType = 'road_accident' | 'customer_unresponsive' | 'package_damaged' | 'personal_injury' | 'others';

export interface ReportIssueRequest {
  incidentType: IncidentType;
  description: string;
  relatedOrder?: string;
  photos?: File[];
}

export interface ReportIssueData {
  _id: string;
  reporter: string;
  reporterType: string;
  reporterName: string;
  reporterMobile: string;
  incidentType: IncidentType;
  description: string;
  photos: string[];
  status: 'pending' | 'in_progress' | 'resolved' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  isEmergency: boolean;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  createdAt: string;
}

export interface ReportIssueResponse {
  success: boolean;
  message: string;
  data: ReportIssueData;
}
