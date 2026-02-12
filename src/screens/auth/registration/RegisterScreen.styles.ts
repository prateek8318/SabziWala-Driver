import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Responsive scaling factors
const scaleWidth = (size: number) => (size / 375) * width; // Base width: 375 (iPhone X)
const scaleHeight = (size: number) => (size / 812) * height; // Base height: 812 (iPhone X)
const scaleFont = (size: number) => {
  const scaleFactor = Math.min(width / 375, height / 812);
  return size * scaleFactor;
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  /* WHITE HEADER */
  header: {
    height: scaleHeight(65),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: scaleFont(24),
    fontFamily: 'Poppins_semibold',
    fontWeight: '700',
    color: '#000',
  },

  /* SCROLL VIEW */
  scrollView: {
    flex: 1,
  },
  formTitle: {
    fontSize: scaleFont(22),
    fontWeight: '500',
    fontFamily: 'Poppins_regular',
    color: '#00000080',
    marginBottom: scaleHeight(20),
    textAlign: 'center',
    paddingHorizontal: scaleWidth(20),
    lineHeight: scaleFont(28),
  },
  formContainer: {
    paddingHorizontal: scaleWidth(24),
    paddingTop: scaleHeight(10),
    paddingBottom: scaleHeight(40),
  },

  label: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: '#000',
    marginBottom: scaleHeight(8),
    marginTop: scaleHeight(12),
  },

  input: {
    width: '100%',
    height: scaleHeight(48),
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: scaleWidth(8),
    paddingHorizontal: scaleWidth(12),
    fontSize: scaleFont(16),
    marginBottom: scaleHeight(12),
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: scaleHeight(48),
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: scaleWidth(8),
    marginBottom: scaleHeight(12),
    backgroundColor: '#fff',
  },

  passwordInput: {
    flex: 1,
    height: '100%',
    color: '#000',
    paddingHorizontal: scaleWidth(12),
    fontSize: scaleFont(16),
  },

  eyeIcon: {
    paddingHorizontal: scaleWidth(12),
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },

  eyeIconText: {
    fontSize: scaleFont(18),
  },

  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: scaleHeight(48),
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: scaleWidth(8),
    marginBottom: scaleHeight(12),
    backgroundColor: '#f9f9f9',
  },

  inputText: {
    flex: 1,
    paddingHorizontal: scaleWidth(12),
    fontSize: scaleFont(16),
  },

  paperclipIcon: {
    fontSize: scaleFont(20),
    paddingHorizontal: scaleWidth(12),
    color: '#000',
  },

  dropdownIcon: {
    fontSize: scaleFont(18),
    paddingHorizontal: scaleWidth(12),
    color: '#666',
    transform: [{ rotate: '0deg' }],
  },

  dropdownIconRotated: {
    transform: [{ rotate: '180deg' }],
  },

  /* 🔹 DROPDOWN STYLES */
  dropdownContainer: {
    marginBottom: scaleHeight(12),
  },

  dropdownOptions: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderTopWidth: 0,
    marginTop: -scaleHeight(8),
    borderRadius: scaleWidth(8),
    backgroundColor: '#fff',
  },

  dropdownOption: {
    paddingVertical: scaleHeight(12),
    paddingHorizontal: scaleWidth(12),
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0f0f0',
  },

  dropdownOptionText: {
    fontSize: scaleFont(16),
    color: '#333',
  },

  textArea: {
    height: scaleHeight(80),
    textAlignVertical: 'top',
    paddingTop: scaleHeight(16),
  },

  /* PHOTO SECTION */
  photoSection: {
    alignItems: 'center',
    marginBottom: scaleHeight(24),
  },

  profileImageContainer: {
    width: scaleWidth(100),
    height: scaleWidth(100),
    borderRadius: scaleWidth(50),
    marginBottom: scaleHeight(8),
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },

  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  photoLabel: {
    fontSize: scaleFont(15),
    fontFamily: 'Poppins_regular',
    color: '#000',
    fontWeight: '500',
  },

  carRcLabel: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: '#000',
    marginBottom: scaleHeight(8),
    marginTop: scaleHeight(12),
  },

  /* IMAGE UPLOAD BUTTONS */
  imageUploadButton: {
    width: '100%',
    height: scaleHeight(80),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scaleHeight(8),
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: scaleWidth(8),
    backgroundColor: '#f9f9f9',
  },

  imageUploadContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cloudIcon: {
    fontSize: scaleFont(24),
    marginRight: scaleWidth(8),
    color: '#666',
  },

  imageUploadText: {
    fontSize: scaleFont(16),
    color: '#666',
  },

  /* 🔹 IMAGE ROW STYLES */
  imageRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scaleHeight(12),
    alignItems: 'flex-start',
  },

  imageColumn: {
    flex: 1,
    marginHorizontal: scaleWidth(4),
    maxWidth: scaleWidth(150),
  },

  uploadIcon: {
    width: scaleWidth(60),
    height: scaleHeight(60),
    resizeMode: 'contain',
    margin: scaleWidth(8),
  },

  /* BUTTONS */
  submitButton: {
    width: '100%',
    height: scaleHeight(48),
    backgroundColor: '#086B48',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scaleWidth(24),
    marginTop: scaleHeight(24),
    marginBottom: scaleHeight(24),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  submitButtonText: {
    color: '#ffffff',
    fontSize: scaleFont(18),
    fontWeight: '600',
  },

  /* LOGIN LINK */
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scaleHeight(8),
  },

  loginText: {
    fontSize: scaleFont(16),
    color: '#00000080',
  },

  loginLink: {
    fontSize: scaleFont(16),
    color: '#086B48',
    fontWeight: '600',
  },

  /* MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    backgroundColor: '#fff',
    borderRadius: scaleWidth(16),
    padding: scaleWidth(24),
    width: Math.min(scaleWidth(300), width * 0.8),
    alignItems: 'center',
  },

  modalTitle: {
    fontSize: scaleFont(20),
    fontWeight: '600',
    marginBottom: scaleHeight(24),
    color: '#000',
  },

  modalButton: {
    width: '100%',
    height: scaleHeight(48),
    backgroundColor: '#086B48',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scaleWidth(8),
    marginBottom: scaleHeight(16),
  },

  modalButtonText: {
    color: '#fff',
    fontSize: scaleFont(16),
    fontWeight: '500',
  },

  modalCancelButton: {
    width: '100%',
    height: scaleHeight(48),
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scaleWidth(8),
  },

  modalCancelButtonText: {
    color: '#fff',
    fontSize: scaleFont(16),
    fontWeight: '500',
  },

  /* BOTTOM SHEET STYLES */
  bottomSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },

  bottomSheetContent: {
    backgroundColor: '#fff',
    padding: scaleWidth(16),
    width: '100%',
    alignItems: 'center',
  },

  bottomSheetHandle: {
    width: scaleWidth(40),
    height: 3,
    backgroundColor: '#ddd',
    borderRadius: 2,
    marginBottom: scaleHeight(12),
  },

  disabledButton: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },

  /* REGISTRATION SUBMITTED MODAL STYLES */
  submittedModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  submittedModalContent: {
    backgroundColor: '#fff',
    borderRadius: scaleWidth(20),
    padding: scaleWidth(32),
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },

  submittedModalTitle: {
    fontSize: scaleFont(22),
    fontWeight: '700',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: scaleHeight(16),
  },

  submittedModalMessage: {
    fontSize: scaleFont(14),
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: scaleHeight(20),
    marginBottom: scaleHeight(24),
  },

  truckImage: {
    width: scaleWidth(120),
    height: scaleHeight(120),
    marginBottom: scaleHeight(24),
  },

  submittedModalButton: {
    backgroundColor: '#0A8F5A',
    paddingHorizontal: scaleWidth(32),
    paddingVertical: scaleHeight(12),
    borderRadius: scaleWidth(12),
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: scaleWidth(120),
  },

  submittedModalButtonText: {
    color: '#fff',
    fontSize: scaleFont(16),
    fontWeight: '600',
  },

  /* HORIZONTAL ICON PICKER STYLES */
  horizontalPickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: scaleHeight(16),
    width: '100%',
  },

  pickerOption: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },

  pickerIcon: {
    fontSize: scaleFont(28),
    marginBottom: scaleHeight(6),
  },

  pickerLabel: {
    fontSize: scaleFont(12),
    color: '#666',
    textAlign: 'center',
  },
});
