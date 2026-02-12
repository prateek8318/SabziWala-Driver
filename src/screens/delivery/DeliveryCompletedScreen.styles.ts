import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Poppins-SemiBold',
    color: '#086B48',
    marginBottom: 28,
  },
  illustrationWrap: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  box: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  checkBadge: {
    position: 'absolute',
    right: 18,
    bottom: 18,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMark: {
    color: '#fff',
    fontSize: 26,
    fontFamily: 'Poppins-Bold',
  },
  backBtn: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#086B48',
    borderRadius: 28,
    paddingVertical: 14,
    alignItems: 'center',
  },
  backBtnText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
});

