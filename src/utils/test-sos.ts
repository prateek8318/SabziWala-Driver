import ApiService from '../services/api';
import { SOSRequest } from '../types/sos';

// Test function to demonstrate SOS API usage
export const testSOSRequest = async () => {
  try {
    // Example SOS request data
    const sosData: SOSRequest = {
      remarks: "Vehicle breakdown on highway, need immediate assistance",
      sosType: "breakdown",
      emergencyContact: {
        name: "Emergency Contact Name",
        mobile: "9876543210"
      }
    };

    console.log('Submitting SOS request:', sosData);
    
    // Call the SOS API
    const response = await ApiService.submitSOSRequest(sosData);
    
    console.log('SOS request submitted successfully:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('Error submitting SOS request:', error);
    throw error;
  }
};

// Example usage scenarios
export const sosExamples = {
  breakdown: {
    remarks: "Vehicle breakdown on highway, need immediate assistance",
    sosType: "breakdown" as const,
    emergencyContact: {
      name: "Emergency Contact Name",
      mobile: "9876543210"
    }
  },
  accident: {
    remarks: "Minor accident with another vehicle, no injuries",
    sosType: "accident" as const,
    emergencyContact: {
      name: "Family Contact",
      mobile: "9123456789"
    }
  },
  medical: {
    remarks: "Driver feeling unwell, need medical assistance",
    sosType: "medical" as const,
    emergencyContact: {
      name: "Medical Emergency Contact",
      mobile: "9988776655"
    }
  },
  theft: {
    remarks: "Attempted theft of delivery items",
    sosType: "theft" as const,
    emergencyContact: {
      name: "Police Contact",
      mobile: "100"
    }
  },
  emergency: {
    remarks: "Fire in vehicle engine compartment",
    sosType: "emergency" as const,
    emergencyContact: {
      name: "Fire Emergency",
      mobile: "101"
    }
  }
};
