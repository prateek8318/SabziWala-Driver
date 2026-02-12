import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  avatarWrapper: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
  width: 110,
  height: 110,
  borderRadius: 55,
  resizeMode: 'cover',
  
},


  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#CFCFCF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarIcon: {
    fontSize: 42,
    color: '#fff',
  },

  editText: {
    marginTop: 10,
    fontSize: 16,
    color: '#000',
  },

  inputWrapper: {
    marginBottom: 14,
    position: 'relative',
  },

  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 2,
  },

  rightIcon: {
    position: 'absolute',
    right: 16,
    top: 18,
    fontSize: 18,
  },

  inputWithIcon: {
    marginBottom: 14,
    position: 'relative',
  },

  clip: {
    position: 'absolute',
    color: '#000',
    right: 16,
    top: 18,
    fontSize: 18,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginVertical: 10,
  },

  uploadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  uploadBox: {
    width: '48%',
    height: 120,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },

  uploadImage: {
    width: 120,
    height: 110,
    marginBottom: 6,
  },

  cloud: {
    fontSize: 30,
    marginBottom: 6,
  },

  saveBtn: {
    backgroundColor: '#0A8F5A',
    paddingVertical: 18,
    borderRadius: 30,
    marginTop: 20,
  },

  saveText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
});
