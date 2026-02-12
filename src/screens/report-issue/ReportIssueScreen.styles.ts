import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  content: {
    padding: 20,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 12,
    color: '#000',
  },

  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 4,
    marginRight: 12,
  },

  checkboxActive: {
    backgroundColor: '#0A8F5A',
    borderColor: '#0A8F5A',
  },

  checkboxText: {
    fontSize: 18,
    color: '#000',
    fontWeight: '600',
  },

  // Incident Type Selection Styles
  incidentContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },

  incidentButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    minWidth: 120,
    alignItems: 'center',
  },

  incidentButtonActive: {
    backgroundColor: '#086B48',
    borderColor: '#086B48',
  },

  incidentButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },

  incidentButtonTextActive: {
    color: '#fff',
  },

  // Input Styles
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },

  // Photo Preview Styles
  photoPreview: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },

  photoCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },

  // Photo Grid Styles
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 8,
  },

  photoItem: {
    position: 'relative',
    marginBottom: 8,
  },

  photoThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    resizeMode: 'cover',
  },

  removePhotoBtn: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  removePhotoText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  addMorePhotoBtn: {
    backgroundColor: '#086B48',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 8,
  },

  addMorePhotoText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },

  initialPhotoBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#7ED1B2',
    borderRadius: 12,
    padding: 20,
    backgroundColor: '#fff',
  },

  textArea: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    height: 180,
    padding: 12,
    marginTop: 10,
    textAlignVertical: 'top',
  },

  attachTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 20,
  },

  attachBox: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#7ED1B2',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  attachImg: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 12,
  },
  Img: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 8,
  },
  attachBtn: {
    backgroundColor: '#086B48',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
  },

  attachBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  attachBtnText: {
    color: '#fff',
    fontWeight: '600',
  },

  submitBtn: {
    backgroundColor: '#086B48',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 65,
    bottom:0,
  },

  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalCard: {
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },

  // Success Modal Styles
  successIconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },

  successCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#086B48',
    justifyContent: 'center',
    alignItems: 'center',
  },

  successCheck: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },

  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 16,
  },

  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },

  modalBtn: {
    backgroundColor: '#086B48',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },

  modalBtnText: {
    color: '#fff',
    fontWeight: '600',
  },

  // Custom Alert Styles
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  alertCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    minWidth: 200,
    maxWidth: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  alertCardError: {
    borderLeftWidth: 4,
    borderLeftColor: '#ff4444',
  },

  alertCardSuccess: {
    borderLeftWidth: 4,
    borderLeftColor: '#086B48',
  },

  alertCardInfo: {
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },

  alertText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20,
  },

  alertTextError: {
    color: '#ff4444',
  },

  alertTextSuccess: {
    color: '#086B48',
  },

  alertTextInfo: {
    color: '#2196F3',
  },
});
