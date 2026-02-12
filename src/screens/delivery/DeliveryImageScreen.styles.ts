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
});

