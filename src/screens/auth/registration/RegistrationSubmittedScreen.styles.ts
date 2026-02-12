import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.08,
  },
  checkmarkContainer: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: width * 0.1,
    backgroundColor: '#27ae60',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.04,
  },
  checkmark: {
    fontSize: width * 0.12,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: width * 0.055,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: height * 0.03,
  },
  subtitle: {
    fontSize: width * 0.04,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: height * 0.03,
    marginBottom: height * 0.06,
    paddingHorizontal: width * 0.05,
  },
  okayButton: {
    width: width * 0.6,
    height: height * 0.07,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: width * 0.02,
  },
  okayButtonText: {
    color: '#ffffff',
    fontSize: width * 0.045,
    fontWeight: '600',
  },
});
