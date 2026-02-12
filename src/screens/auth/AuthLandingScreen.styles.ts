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
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scaleWidth(32),
  },
  deliveryImage: {
    width: scaleWidth(320),
    height: scaleHeight(300),
    marginBottom: scaleHeight(30),
    maxWidth: '90%',
    maxHeight: '40%',
  },
  title: {
    fontSize: scaleFont(32),
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: scaleHeight(60),
    lineHeight: scaleFont(38),
  },
  
  loginButton: {
    width: Math.min(scaleWidth(280), width * 0.8),
    height: scaleHeight(50),
    backgroundColor: '#086B48',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scaleWidth(25),
    marginBottom: scaleHeight(15),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: scaleFont(18),
    fontWeight: '600',
  },
  registerButton: {
    width: Math.min(scaleWidth(280), width * 0.8),
    height: scaleHeight(50),
    backgroundColor: '#C3FFEA',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scaleWidth(25),
    borderWidth: 1,
    borderColor: '#086B48',
  },
  registerButtonText: {
    color: '#086B48',
    fontSize: scaleFont(18),
    fontWeight: '600',
  },
});
