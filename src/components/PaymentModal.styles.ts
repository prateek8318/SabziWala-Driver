import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const scaleSize = (size: number) => {
  const baseWidth = 375;
  return Math.round((size * width) / baseWidth);
};

const scaleFont = (fontSize: number) => {
  const baseWidth = 375;
  const scaled = Math.round((fontSize * width) / baseWidth);
  return Math.max(fontSize * 0.8, Math.min(scaled, fontSize * 1.2));
};

export default StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: scaleSize(16),
    padding: scaleSize(25),
    margin: scaleSize(20),
    maxHeight: '90%',
    width: '95%',
    maxWidth: scaleSize(450),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
  },
  orderInfo: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  orderLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  orderAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#086B48',
  },
  paymentOptions: {
    marginBottom: 20,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fafafa',
  },
  paymentOptionLeft: {
    flex: 1,
  },
  paymentOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  paymentOptionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  paymentOptionIcon: {
    width: 24,
    height: 24,
    tintColor: '#086B48',
  },
  qrDisplay: {
    alignItems: 'center',
    padding: scaleSize(25),
    backgroundColor: '#f8f9fa',
    borderRadius: scaleSize(12),
    marginBottom: scaleSize(20),
  },
  qrTitle: {
    fontSize: scaleFont(18),
    fontWeight: '700',
    color: '#333',
    marginBottom: scaleSize(8),
    textAlign: 'center',
  },
  qrSubtitle: {
    fontSize: scaleFont(14),
    color: '#666',
    marginBottom: scaleSize(5),
  },
  qrAmount: {
    fontSize: scaleFont(20),
    fontWeight: 'bold',
    color: '#086B48',
    marginBottom: scaleSize(20),
  },
  qrCodeWrapper: {
    width: scaleSize(250),
    height: scaleSize(250),
    backgroundColor: 'white',
    borderRadius: scaleSize(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scaleSize(20),
    borderWidth: 2,
    borderColor: '#086B48',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  qrCodeImage: {
    width: scaleSize(220),
    height: scaleSize(220),
  },
  qrInstruction: {
    fontSize: scaleFont(16),
    color: '#333',
    textAlign: 'center',
    marginBottom: scaleSize(8),
    fontWeight: '500',
  },
  qrExpiry: {
    fontSize: scaleFont(14),
    color: '#ff6b6b',
    textAlign: 'center',
    fontWeight: '600',
  },
  noteText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
