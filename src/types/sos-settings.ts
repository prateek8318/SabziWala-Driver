export interface EmergencyCall {
  name: string;
  mobile: string;
  isActive: boolean;
}

export interface WhatsappSupport {
  name: string;
  mobile: string;
  message: string;
  isActive: boolean;
}

export interface QuickDialButton {
  name: string;
  mobile: string;
  icon: string;
  color: string;
  order: number;
}

export interface EmergencyContact {
  name: string;
  mobile: string;
  type: string;
}

export interface FormSettings {
  showEmergencyContact: boolean;
  showLocation: boolean;
  requireRemarks: boolean;
  autoFillDriverDetails: boolean;
}

export interface SOSSettingsData {
  emergencyCall: EmergencyCall;
  whatsappSupport: WhatsappSupport;
  quickDialButtons: QuickDialButton[];
  emergencyContacts: EmergencyContact[];
  formSettings: FormSettings;
}

export interface SOSSettingsResponse {
  success: boolean;
  message: string;
  data: SOSSettingsData;
}
