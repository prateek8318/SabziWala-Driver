import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Responsive scaling factors
const scale = width / 375; // Base width (iPhone 11)
const verticalScale = height / 812; // Base height (iPhone 11)

const responsiveSize = (size: number) => size * scale;
const responsiveVerticalSize = (size: number) => size * verticalScale;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: responsiveSize(20),
    marginTop: responsiveVerticalSize(12),
    marginBottom: responsiveVerticalSize(12),
  },
  searchBox: {
    flex: 1,
    height: responsiveVerticalSize(44),
    flexDirection: 'row', 
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: responsiveSize(10),
    borderWidth: 1,
    borderColor: '#086B48',
    paddingHorizontal: responsiveSize(12),
  },
  searchIcon: {
    width: responsiveSize(28),
    height: responsiveSize(28),
    marginLeft: responsiveSize(12),
    marginRight: responsiveSize(8),
    tintColor: '#086B48',
  },

  searchInput: {
    flex: 1,
    fontSize: responsiveSize(13),
    fontFamily: 'Poppins-Regular',
    color: '#111',
    paddingVertical: 0,
  },

  searchPlaceholder: {
    fontSize: responsiveSize(14),
    fontFamily: 'Poppins-Regular',
    color: '#086B48',
  },

  filterBtn: {
    width: responsiveSize(44),
    height: responsiveSize(44),
    borderRadius: responsiveSize(10),
    borderWidth: 1,
    borderColor: '#086B48',
    marginLeft: responsiveSize(10),
    justifyContent: 'center',
    alignItems: 'center',
  },

  filterIcon: {
    width: responsiveSize(20),
    height: responsiveSize(20),
    tintColor: '#086B48',
  },


  // Order Tabs
  orderTabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: responsiveSize(20),
    marginTop: responsiveVerticalSize(15),
    borderRadius: responsiveSize(25),
    padding: responsiveSize(4),
    marginBottom: responsiveVerticalSize(15),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  tabButton: {
    flex: 1,
    paddingVertical: responsiveVerticalSize(12),
    borderRadius: responsiveSize(20),
    alignItems: 'center',
  },
  
  activeTab: {
    backgroundColor: '#086B48',
  },
  
  tabText: {
    fontSize: responsiveSize(14),
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
    marginTop: responsiveVerticalSize(10),
    fontSize: responsiveSize(16),
    color: '#666',
  },
  
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  emptyText: {
    fontSize: responsiveSize(16),
    color: '#666',
  },
  
  // Orders List
  ordersList: {
    flex: 1,
    paddingHorizontal: responsiveSize(20),
    marginBottom: responsiveVerticalSize(70),
  },
  
  orderCard: {
    backgroundColor: '#E9FFF6',
    borderRadius: responsiveSize(14),
    padding: responsiveSize(16),
    marginBottom: responsiveVerticalSize(14),
  },

  
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: responsiveVerticalSize(12),
    gap: responsiveSize(8),
  },

  orderInfoContainer: {
    flex: 1,
    marginRight: responsiveSize(8),
  },
  
  orderId: {
    fontSize: responsiveSize(14),
    fontFamily: 'Poppins-SemiBold',
    color: '#111',
  },

  
  orderDate: {
    fontSize: responsiveSize(12),
    color: '#666',
    marginTop: responsiveVerticalSize(2),
  },
  
  statusBadge: {
    paddingHorizontal: responsiveSize(10),
    paddingVertical: responsiveVerticalSize(4),
    borderRadius: responsiveSize(20),
    alignSelf: 'flex-start',
    minWidth: responsiveSize(80),
    maxWidth: responsiveSize(120),
  },

  
  statusText: {
    fontSize: responsiveSize(11),
    fontFamily: 'Poppins-Medium',
    color: '#FFFFFF',
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  expandedSection: {
    marginTop: responsiveVerticalSize(14),
    paddingTop: responsiveVerticalSize(12),
    borderTopWidth: 1,
    borderTopColor: '#D1FAE5',
  },

  label: {
    fontSize: responsiveSize(12),
    color: '#555',
    marginTop: responsiveVerticalSize(6),
    fontFamily: 'Poppins-Regular',
  },

  value: {
    fontSize: responsiveSize(13),
    color: '#111',
    fontFamily: 'Poppins-SemiBold',
  },

  sectionTitle: {
    fontSize: responsiveSize(13),
    fontFamily: 'Poppins-SemiBold',
    marginBottom: responsiveVerticalSize(4),
  },

  locationText: {
    fontSize: responsiveSize(12),
    color: '#111',
  },

  locationSection: {
    marginBottom: responsiveVerticalSize(12),
  },

  subText: {
    fontSize: responsiveSize(11),
    color: '#666',
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: responsiveVerticalSize(10),
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: responsiveVerticalSize(6),
  },

  statusButton: {
    marginTop: responsiveVerticalSize(14),
    backgroundColor: '#E5E7EB',
    paddingVertical: responsiveVerticalSize(10),
    borderRadius: responsiveSize(20),
    alignItems: 'center',
  },

  statusButtonText: {
    fontSize: responsiveSize(13),
    fontFamily: 'Poppins-Medium',
    textTransform: 'capitalize',
  },

  
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: responsiveVerticalSize(6),
  },
  summaryLeft: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: responsiveSize(12),
    fontFamily: 'Poppins-Regular',
    color: '#333',
    marginTop: responsiveVerticalSize(6),
  },
  summaryValue: {
    fontSize: responsiveSize(12),
    fontFamily: 'Poppins-SemiBold',
    color: '#111',
    marginTop: responsiveVerticalSize(2),
  },
  chevronWrap: {
    width: responsiveSize(28),
    height: responsiveSize(28),
    borderRadius: responsiveSize(14),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: responsiveSize(10),
  },
  chevron: {
    width: responsiveSize(20),
    height: responsiveSize(20),
  },
  
  
  detailRow: {
    marginBottom: responsiveVerticalSize(8),
  },
  
  detailLabel: {
    fontSize: responsiveSize(12),
    color: '#555',
    fontFamily: 'Poppins-Regular',
  },
  
  detailValue: {
    fontSize: responsiveSize(13),
    color: '#111',
    fontFamily: 'Poppins-SemiBold',
  },
  
  orderStatusPill: {
    marginTop: responsiveVerticalSize(12),
    backgroundColor: '#E5E7EB',
    paddingVertical: responsiveVerticalSize(8),
    borderRadius: responsiveSize(20),
    alignItems: 'center',
  },
  
  orderStatusText: {
    fontSize: responsiveSize(13),
    color: '#111',
    fontFamily: 'Poppins-Medium',
    textTransform: 'capitalize',
  },
  

  // Filter Dropdown
  filterDropdown: {
    backgroundColor: '#fff',
    marginHorizontal: responsiveSize(20),
    marginBottom: responsiveVerticalSize(15),
    borderRadius: responsiveSize(10),
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  filterOption: {
    paddingVertical: responsiveVerticalSize(12),
    paddingHorizontal: responsiveSize(16),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  filterOptionText: {
    fontSize: responsiveSize(14),
    color: '#333',
  },

  customDateContainer: {
    padding: responsiveSize(16),
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },

  dateInput: {
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: responsiveSize(8),
    paddingHorizontal: responsiveSize(12),
    paddingVertical: responsiveVerticalSize(10),
    marginBottom: responsiveVerticalSize(10),
    fontSize: responsiveSize(14),
    color: '#333',
  },

  applyCustomFilterBtn: {
    backgroundColor: '#086B48',
    borderRadius: responsiveSize(8),
    paddingVertical: responsiveVerticalSize(10),
    alignItems: 'center',
  },

  applyCustomFilterText: {
    color: '#fff',
    fontSize: responsiveSize(14),
    fontWeight: '600',
  },

  // Date Input Button Styles
  dateInputButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#086B48',
    borderRadius: responsiveSize(8),
    paddingHorizontal: responsiveSize(16),
    paddingVertical: responsiveVerticalSize(12),
    marginBottom: responsiveVerticalSize(10),
    alignItems: 'center',
  },

  dateInputText: {
    fontSize: responsiveSize(14),
    color: '#333',
    fontWeight: '500',
  },

  // Calendar Modal Styles
  calendarOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  calendarContent: {
    backgroundColor: '#fff',
    borderRadius: responsiveSize(16),
    padding: responsiveSize(20),
    width: '90%',
    maxWidth: 350,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },

  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: responsiveVerticalSize(16),
  },

  calendarNavButton: {
    width: responsiveSize(40),
    height: responsiveSize(40),
    borderRadius: responsiveSize(20),
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  calendarNavButtonText: {
    fontSize: responsiveSize(18),
    fontWeight: '600',
    color: '#333',
  },

  calendarTitle: {
    fontSize: responsiveSize(18),
    fontWeight: '700',
    color: '#086B48',
  },

  daysOfWeek: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: responsiveVerticalSize(8),
  },

  dayOfWeekText: {
    flex: 1,
    textAlign: 'center',
    fontSize: responsiveSize(12),
    fontWeight: '600',
    color: '#666',
  },

  calendarDays: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    marginBottom: responsiveVerticalSize(16),
  },

  calendarDay: {
    width: responsiveSize(40),
    height: responsiveSize(40),
    borderRadius: responsiveSize(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: responsiveSize(2),
    marginVertical: responsiveVerticalSize(2),
    backgroundColor: '#f8f9fa',
  },

  calendarToday: {
    backgroundColor: '#086B48',
  },

  calendarEmptyDay: {
    backgroundColor: 'transparent',
  },

  calendarDayText: {
    fontSize: responsiveSize(14),
    fontWeight: '500',
    color: '#333',
  },

  calendarTodayText: {
    color: '#fff',
    fontWeight: '700',
  },

  calendarEmptyDayText: {
    color: 'transparent',
  },

  calendarFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: responsiveVerticalSize(16),
  },

  calendarCancelButton: {
    backgroundColor: '#6c757d',
    paddingVertical: responsiveVerticalSize(8),
    paddingHorizontal: responsiveSize(20),
    borderRadius: responsiveSize(8),
  },

  calendarCancelButtonText: {
    color: '#fff',
    fontSize: responsiveSize(14),
    fontWeight: '500',
  },

  calendarTodayButton: {
    backgroundColor: '#086B48',
    paddingVertical: responsiveVerticalSize(8),
    paddingHorizontal: responsiveSize(20),
    borderRadius: responsiveSize(8),
  },

  calendarTodayButtonText: {
    color: '#fff',
    fontSize: responsiveSize(14),
    fontWeight: '600',
  },
});
