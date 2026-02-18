import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#111',
    marginBottom: 16,
  },
  imagePlaceholder: {
    width: 120,
    height: 90,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  placeholderIcon: {
    width: 56,
    height: 56,
    resizeMode: 'contain',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    resizeMode: 'cover',
  },
  placeholderText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  uploadBtn: {
    width: '100%',
    backgroundColor: '#086B48',
    borderRadius: 26,
    paddingVertical: 12,
    alignItems: 'center',
  },
  uploadBtnDisabled: {
    opacity: 0.7,
  },
  uploadBtnText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
  },
  
  // Image Picker Options Modal
  optionsModalCard: {
    width: '100%',
    maxWidth: 300,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
  },
  
  optionsTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#111',
    marginBottom: 20,
  },
  
  optionButton: {
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  
  optionButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#333',
  },
  
  cancelButton: {
    backgroundColor: '#ff4444',
  },
  
  cancelButtonText: {
    color: '#fff',
  },
});

