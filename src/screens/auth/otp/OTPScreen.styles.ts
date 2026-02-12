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
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: scaleHeight(20),
  },

  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  /* HEADER */
  header: {
    height: scaleHeight(240),
    alignItems: 'center',
    justifyContent: 'center',
  },

  backButton: {
    position: 'absolute',
    left: scaleWidth(20),
    top: scaleHeight(60),
    zIndex: 1,
  },

  backButtonText: {
    fontSize: scaleFont(32),
    color: '#fff',
    fontWeight: 'bold',
  },

  headerVector: {
    position: 'absolute',
    width: '100%',
    height: scaleHeight(320),
    resizeMode: 'stretch',
  },

  headerContent: {
    alignItems: 'center',
    marginTop: scaleHeight(60),
  },

  headerText: {
    width: scaleWidth(260),
    height: scaleWidth(75),
    resizeMode: 'contain',
  },

  headerTitle: {
    fontSize: scaleFont(24),
    fontFamily: 'Poppins_regular',
    fontWeight: '700',
    color: '#fff',
    marginBottom: scaleHeight(8),
  },

  headerSubtitle: {
    fontSize: scaleFont(16),
    color: '#fff',
    opacity: 0.9,
  },

  /* CONTENT */
  scrollView: {
    flex: 0.7,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: scaleHeight(30),
  },

  content: {
    flex: 0.7,
    alignItems: 'center',
    paddingTop: scaleHeight(50),
    paddingBottom: scaleHeight(60),
  },

  instructionText: {
    fontSize: scaleFont(16),
    color: '#666',
    textAlign: 'center',
    marginBottom: scaleHeight(8),
  },

  phoneNumberText: {
    fontSize: scaleFont(20),
    fontWeight: '600',
    color: '#000',
    marginBottom: scaleHeight(30),
  },

  /* OTP INPUTS */
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: Math.min(scaleWidth(280), width * 0.8),
    marginBottom: scaleHeight(40),
  },

  otpInput: {
    width: scaleWidth(56),
    height: scaleWidth(56),
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: scaleWidth(8),
    fontSize: scaleFont(24),
    fontWeight: '600',
    color: '#000',
    backgroundColor: '#f9f9f9',
  },

  resendText: {
    fontSize: scaleFont(16),
    color: '#666',
    textAlign: 'center',
  },

  resendLink: {
    fontSize: scaleFont(16),
    color: '#086B48',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },

  /* VERIFY BUTTON */
  verifyButton: {
    width: Math.min(scaleWidth(280), width * 0.85),
    height: scaleHeight(50),
    backgroundColor: '#086B48',
    borderRadius: scaleWidth(25),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scaleHeight(30),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  disabledButton: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },

  verifyButtonText: {
    color: '#fff',
    fontSize: scaleFont(18),
    fontFamily: 'Poppins_semibold',
    fontWeight: '700',
  },

  /* RESEND SECTION */
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scaleHeight(15),
  },

  /* REGISTER SECTION */
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scaleHeight(30),
  },

  registerText: {
    fontSize: scaleFont(16),
    color: '#666',
  },

  registerLink: {
    fontSize: scaleFont(16),
    color: '#086B48',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});