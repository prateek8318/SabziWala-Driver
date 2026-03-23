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
    paddingBottom: scaleHeight(40),
  },

  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
  },

  /* 🔹 HEADER */
  header: {
    height: scaleHeight(240),
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: scaleHeight(50),
  },

  headerVector: {
    position: 'absolute',
    width: '100%',
    height: scaleHeight(370),
    resizeMode: 'stretch',
    top: -scaleHeight(80),
  },

  headerText: {
    width: scaleWidth(260),
    height: scaleWidth(75),
    resizeMode: 'contain',
    marginTop: scaleHeight(60),
  },

  /* 🔹 CONTENT */
  content: {
    flex: 0.7,
    alignItems: 'center',
    paddingTop: scaleHeight(10),
    paddingBottom: scaleHeight(60),
  },

  title: {
    fontSize: scaleFont(24),
    fontFamily: 'Poppins_regular',
    fontWeight: '700',
    marginTop: scaleHeight(90),
    marginBottom: scaleHeight(15),
    textAlign: 'center',
    paddingHorizontal: scaleWidth(20),
    lineHeight: scaleFont(30),
  },

  phoneInputContainer: {
    flexDirection: 'row',
    width: Math.min(scaleWidth(320), width * 0.9),
    height: scaleHeight(50),
    borderWidth: 1,
    borderRadius: scaleWidth(10),
    marginBottom: scaleHeight(30),
    borderColor: '#ddd',
  },

  divider: {
    width: 1,
    height: scaleHeight(30),
    backgroundColor: '#A8A8A8',
    marginTop: scaleHeight(10),
  },

  countryCode: {
    paddingHorizontal: scaleWidth(12),
    fontSize: scaleFont(16),
    justifyContent: 'center',
    color: '#00000080',
    textAlignVertical: 'center',
  },

  phoneInput: {
    flex: 1,
    paddingHorizontal: scaleWidth(10),
    fontSize: scaleFont(16),
  },

  checkboxContainer: {
    flexDirection: 'row',
    width: Math.min(scaleWidth(320), width * 0.9),
    marginTop: -scaleHeight(20),
    marginBottom: scaleHeight(15),
    alignItems: 'flex-start',
  },

  textContainer: {
    flex: 1,
    marginLeft: scaleWidth(5),
  },

  checkbox: {
    width: scaleWidth(20),
    height: scaleWidth(20),
    borderWidth: 1,
    marginRight: scaleWidth(10),
    borderRadius: scaleWidth(4),
    borderColor: '#ddd',
    marginTop: scaleHeight(2),
  },

  checkboxChecked: {
    backgroundColor: '#086B48',
    borderColor: '#086B48',
  },

  checkmark: {
    color: '#fff',
    textAlign: 'center',
    fontSize: scaleFont(14),
    fontWeight: 'bold',
  },

  checkboxText: {
    fontSize: scaleFont(14),
    lineHeight: scaleFont(18),
    color: '#666',
    flexWrap: 'wrap',
  },

  linkText: {
    color: '#086B48',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },

  loadingText: {
    color: '#999',
    fontStyle: 'italic',
  },

  sendOTPButton: {
    width: Math.min(scaleWidth(280), width * 0.85),
    height: scaleHeight(50),
    backgroundColor: '#086B48',
    borderRadius: scaleWidth(25),
    justifyContent: 'center',
    alignItems: 'center',
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

  sendOTPButtonText: {
    color: '#fff',
    fontSize: scaleFont(18),
    fontFamily: 'Poppins_semibold',
    fontWeight: '700',
  },

  /* 🔹 REGISTER SECTION */
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scaleHeight(60),
  },

  registerText: {
    fontSize: scaleFont(16),
    fontFamily: 'Poppins_regular',
    fontWeight: '400',
    color: '#00000080',
  },

  registerLink: {
    fontSize: scaleFont(16),
    color: '#086B48',
    fontWeight: '600',
  },
});
