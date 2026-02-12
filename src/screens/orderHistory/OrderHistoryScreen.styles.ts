import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginHorizontal: 20,
  marginTop: 12,
  marginBottom: 12,
},
searchBox: {
  flex: 1,
  height: 44,
  flexDirection: 'row', 
  alignItems: 'center',
  backgroundColor: '#FFFFFF',
  borderRadius: 10,
  borderWidth: 1,
  borderColor: '#086B48',
  paddingHorizontal: 12,
},
searchIcon: {
  width: 28,
  height: 28,
  marginLeft: 12,
  marginRight: 8,
  tintColor: '#086B48',
},

searchInput: {
  flex: 1,
  fontSize: 13,
  fontFamily: 'Poppins-Regular',
  color: '#111',
  paddingVertical: 0,
},

searchPlaceholder: {
  fontSize: 24,
  fontFamily: 'Poppins-Regular',
  color: '#086B48',
},

filterBtn: {
  width: 44,
  height: 44,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: '#086B48',
  marginLeft: 10,
  justifyContent: 'center',
  alignItems: 'center',
},

filterIcon: {
  width: 20,
  height: 20,
  tintColor: '#086B48',
},


  // Order Tabs
  orderTabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 25,
    padding: 4,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  
  activeTab: {
    backgroundColor: '#086B48',
  },
  
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  
  activeTabText: {
    color: '#fff',
  },
  
  // Loading & Empty States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  
  // Orders List
  ordersList: {
    flex: 1,
    paddingHorizontal: 20,
    marginBottom: 70,
  },
  
  orderCard: {
  backgroundColor: '#E9FFF6',
  borderRadius: 14,
  padding: 16,
  marginBottom: 14,
},

  
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  
  orderId: {
  fontSize: 14,
  fontFamily: 'Poppins-SemiBold',
  color: '#111',
},

  
  orderDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  
  statusBadge: {
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 20,
},

  
 statusText: {
  fontSize: 11,
  fontFamily: 'Poppins-Medium',
  color: '#FFFFFF',
  textTransform: 'capitalize',
},
expandedSection: {
  marginTop: 14,
  paddingTop: 12,
  borderTopWidth: 1,
  borderTopColor: '#D1FAE5',
},

label: {
  fontSize: 12,
  color: '#555',
  marginTop: 6,
  fontFamily: 'Poppins-Regular',
},

value: {
  fontSize: 13,
  color: '#111',
  fontFamily: 'Poppins-SemiBold',
},

sectionTitle: {
  fontSize: 13,
  fontFamily: 'Poppins-SemiBold',
  marginBottom: 4,
},

locationText: {
  fontSize: 12,
  color: '#111',
},

locationSection: {
  marginBottom: 12,
},

subText: {
  fontSize: 11,
  color: '#666',
},

divider: {
  height: 1,
  backgroundColor: '#E5E7EB',
  marginVertical: 10,
},

infoRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 6,
},

statusButton: {
  marginTop: 14,
  backgroundColor: '#E5E7EB',
  paddingVertical: 10,
  borderRadius: 20,
  alignItems: 'center',
},

statusButtonText: {
  fontSize: 13,
  fontFamily: 'Poppins-Medium',
  textTransform: 'capitalize',
},

  
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  summaryLeft: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#333',
    marginTop: 6,
  },
  summaryValue: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#111',
    marginTop: 2,
  },
  chevronWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  chevron: {
    width: 20,
    height: 20,
  },
  
  
  detailRow: {
    marginBottom: 8,
  },
  
  detailLabel: {
    fontSize: 12,
    color: '#555',
    fontFamily: 'Poppins-Regular',
  },
  
  detailValue: {
    fontSize: 13,
    color: '#111',
    fontFamily: 'Poppins-SemiBold',
  },
  
  orderStatusPill: {
    marginTop: 12,
    backgroundColor: '#E5E7EB',
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  
  orderStatusText: {
    fontSize: 13,
    color: '#111',
    fontFamily: 'Poppins-Medium',
    textTransform: 'capitalize',
  },
  

  // Filter Dropdown
  filterDropdown: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  filterOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  filterOptionText: {
    fontSize: 14,
    color: '#333',
  },

  customDateContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },

  dateInput: {
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    fontSize: 14,
    color: '#333',
  },

  applyCustomFilterBtn: {
    backgroundColor: '#086B48',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },

  applyCustomFilterText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
