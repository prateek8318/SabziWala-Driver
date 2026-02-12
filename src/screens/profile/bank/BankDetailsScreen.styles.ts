import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  content: {
    padding: 20,
    paddingTop: 30,
  },

  input: {
    height: 54,
    borderWidth: 1.5,
    borderColor: '#0A8F5A',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000',
    marginBottom: 16,
    backgroundColor: '#fff',
  },
roundIconBtn: {
  width: 38,
  height: 38,
  borderRadius: 19,
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: 10,
},

editBtn: {
  backgroundColor: '#E8F7F1',
},

deleteBtn: {
 
},

editButton: {
  backgroundColor: '#E8F7F1',
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderRadius: 8,
  marginRight: 10,
},

editButtonText: {
  color: '#0A8F5A',
  fontSize: 14,
  fontWeight: '600',
},

deleteIconText: {
  fontSize: 16,
},

deleteIcon: {
  width: 28,
  height: 28,
},

  addButton: {
    backgroundColor: '#086B48',
    height: 54,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',

    alignSelf:'center',
    borderRadius: 12,
   
    marginTop: 5,
    
  },

  addButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },

  // New styles for enhanced functionality
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  detailsCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  detailsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },

  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },

  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  iconButtonWithLabel: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },

  iconLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
    fontWeight: '500',
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },

  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },

  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    flex: 1.5,
    textAlign: 'right',
  },

  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },

  cancelButton: {
    backgroundColor: '#F5F5F5',
    height: 54,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },

  updateButton: {
    backgroundColor: '#FFA500',
    flex: 1,
  },

  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },

  noDataText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },

  noDataSubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
