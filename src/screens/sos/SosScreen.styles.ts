import { StyleSheet, Dimensions } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  content: {
    padding: 16,
    paddingBottom: 36,
  },

  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EDEDED',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    borderRadius: 10,
    padding: 14,
    paddingVertical: 22,
    marginBottom: 12,
  },

  actionIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },

  actionText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },

  formContainer: {
    backgroundColor: '#D1F6DB',
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
  },

  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#000',
    paddingLeft: 8,
  },

  input: {
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingLeft:18,
    paddingHorizontal: 14,
    paddingVertical: 24,
    fontSize: 14,
    marginBottom: 12,
  },

  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },

  submitBtn: {
    backgroundColor: '#086B48',
    paddingVertical: 20,
    borderRadius: 35,
    alignItems: 'center',
    marginTop: 8,
  },

  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  emergencyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 8,
  },

  emergencyItem: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#EDEDED',
    borderRadius: 12,
    padding: 12,
  },

  emergencyIcon: {
    width: 48,
    height: 48,
    marginBottom: 8,
  },

  emergencyText: {
    fontSize: 11,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 14,
  },

  // Inline SOS Type Selection Styles
  sosTypeContainer: {
    marginBottom: 12,
  },

  sosTypeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginBottom: 8,
  },

  sosOptionsContainer: {
    flexDirection: 'row',
  },

  sosOptionButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#EDEDED',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    minWidth: 80,
    alignItems: 'center',
  },

  sosOptionButtonActive: {
    backgroundColor: '#086B48',
    borderColor: '#086B48',
  },

  sosOptionText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },

  sosOptionTextActive: {
    color: '#fff',
  },

  // Dropdown Styles (keeping for potential future use)
  dropdownInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#EDEDED',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  dropdownText: {
    fontSize: 14,
    color: '#000',
    flex: 1,
  },

  dropdownArrow: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: Dimensions.get('window').width * 0.8,
    maxHeight: Dimensions.get('window').height * 0.6,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
  },

  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },

  modalClose: {
    fontSize: 20,
    color: '#666',
    fontWeight: 'bold',
  },

  modalOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },

  modalOptionActive: {
    backgroundColor: '#E8F5E8',
  },

  modalOptionText: {
    fontSize: 14,
    color: '#000',
  },

  modalOptionTextActive: {
    color: '#086B48',
    fontWeight: '600',
  },

  // Loading Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
});
