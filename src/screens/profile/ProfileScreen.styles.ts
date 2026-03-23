import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Responsive scaling functions
const scaleWidth = (size: number) => (size / 375) * width;
const scaleHeight = (size: number) => (size / 812) * height;
const scaleFont = (size: number) => {
  const scaleFactor = Math.min(width / 375, height / 812);
  return size * scaleFactor;
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  content: {
    padding: scaleWidth(20),
  },

  avatarContainer: {
    alignItems: 'center',
    marginVertical: scaleHeight(20),
  },

  avatar: {
    width: scaleWidth(80),
    height: scaleWidth(80),
    borderRadius: scaleWidth(45),
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarImg: {
    width: scaleWidth(80),
    height: scaleWidth(80),
    borderRadius: scaleWidth(40),
  },

  editText: {
    marginTop: scaleHeight(8),
    color: '#000',
    fontSize: scaleFont(18),
  },

  menu: {
    marginTop: scaleHeight(10),
  },

  menuItem: {
    height: scaleHeight(56),
    borderRadius: scaleWidth(10),
    borderWidth: 1,
    borderColor: '#EDEDED',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    
    justifyContent: 'center',
    paddingHorizontal: scaleWidth(16),
    marginBottom: scaleHeight(12),
  },

  menuText: {
    fontSize: scaleFont(18),
    color: '#000',
  },

  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scaleHeight(52),
    paddingHorizontal: scaleWidth(10),
    borderWidth: 1,
    borderColor: '#EDEDED',
    borderRadius: scaleWidth(10),
    paddingVertical: scaleHeight(12),
  },

  logoutIcon: {
    width: scaleWidth(32),
    height: scaleWidth(32),
    borderRadius: scaleWidth(16),
    
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scaleWidth(10),
   
  },

  logoutIconImg: {
    width: scaleWidth(22),
    height: scaleWidth(22),
    
  },

  logoutText: {
    color: '#000',
    fontSize: scaleFont(18),
    fontWeight: '500',
  },

  // Modal Styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },

  blurLayer1: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(200, 200, 200, 0.2)',
    opacity: 0.8,
  },

  blurLayer2: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
    opacity: 0.6,
  },

  modalContent: {
    backgroundColor: '#fff',
    borderRadius: scaleWidth(16),
    padding: scaleWidth(24),
    width: '95%',
    maxWidth: scaleWidth(340),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: scaleHeight(10),
    },
    shadowOpacity: 0.25,
    shadowRadius: scaleWidth(15),
    elevation: 20,
    zIndex: 1000,
  },

  modalTitle: {
    fontSize: scaleFont(20),
    fontWeight: '600',
    color: '#000',
    marginBottom: scaleHeight(12),
  },

  modalMessage: {
    fontSize: scaleFont(24),
    padding: scaleWidth(10),
    color: '#000',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: scaleHeight(28),
  },

  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    gap: scaleWidth(12),
  },

  modalButton: {
    flex: 1,
    paddingVertical: scaleHeight(16),
    borderRadius: scaleWidth(8),
    alignItems: 'center',
  },

  cancelButton: {
    backgroundColor: '#086B48',
    borderWidth: 2,
    borderColor: '#086B48',
    borderRadius: scaleWidth(30),
    
  },

  cancelButtonText: {
    fontSize: scaleFont(18),
    fontWeight: '500',
    color: '#fff',
  },

  confirmButton: {
    borderWidth: 2,
    borderColor: '#086B48',
    borderRadius: scaleWidth(30),
  },

  confirmButtonText: {
    fontSize: scaleFont(18),
    fontWeight: '500',
    color: '#086B48',
  },
});
