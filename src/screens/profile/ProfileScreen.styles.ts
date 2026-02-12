import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  content: {
    padding: 20,
  },

  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarImg: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },

  editText: {
    marginTop: 8,
    color: '#000',
    fontSize: 18,
  },

  menu: {
    marginTop: 10,
  },

  menuItem: {
    height: 56,
    borderRadius: 10,
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
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  menuText: {
    fontSize: 18,
    color: '#000',
  },

  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 52,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#EDEDED',
    borderRadius: 10,
    paddingVertical: 12,
  },

  logoutIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
   
  },

  logoutIconImg: {
    width: 22,
    height: 22,
    
  },

  logoutText: {
    color: '#000',
    fontSize: 18,
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
    borderRadius: 16,
    padding: 24,
    width: '95%',
    maxWidth: 340,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 20,
    zIndex: 1000,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },

  modalMessage: {
    fontSize: 24,
    padding: 10,
    color: '#000',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 28,
  },

  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },

  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },

  cancelButton: {
    backgroundColor: '#086B48',
    borderWidth: 2,
    borderColor: '#086B48',
    borderRadius: 30,
    
  },

  cancelButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
  },

  confirmButton: {
    borderWidth: 2,
    borderColor: '#086B48',
    borderRadius: 30,
  },

  confirmButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#086B48',
  },
});
