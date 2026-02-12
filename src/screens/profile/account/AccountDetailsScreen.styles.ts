import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  content: {
    padding: 20,
  },

  // Profile Section
  profileSection: {
    alignItems: 'center',
    marginVertical: 30,
  },

  avatarContainer: {
    marginBottom: 15,
  },

  avatarImg: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },

  userRole: {
    fontSize: 16,
    color: '#666',
  },

  // Section
  section: {
    marginBottom: 25,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },

  // Info Rows
  infoRow: {
    marginBottom: 15,
  },

  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 5,
  },

  infoInput: {
    borderWidth: 1,
    borderColor: '#EDEDED',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },

  disabledInput: {
    backgroundColor: '#f8f8f8',
    color: '#999',
  },

  // Action Buttons
  actionBtn: {
    backgroundColor: '#0A8F5A',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },

  actionBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  deactivateBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E53935',
  },

  deactivateBtnText: {
    color: '#E53935',
  },
});
