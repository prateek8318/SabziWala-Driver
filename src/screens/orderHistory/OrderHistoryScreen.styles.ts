import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const scale = width / 375;
const verticalScale = height / 812;

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
    width: responsiveSize(20),
    height: responsiveSize(20),
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
  filterBtn: {
    width: responsiveSize(44),
    height: responsiveSize(44),
    borderRadius: responsiveSize(10),
    borderWidth: 1,
    borderColor: '#086B48',
    marginLeft: responsiveSize(10),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  filterBtnActive: {
    backgroundColor: '#086B48',
  },
  filterIcon: {
    width: responsiveSize(20),
    height: responsiveSize(20),
    tintColor: '#086B48',
  },

  // Active filter chip
  activeFilterRow: {
    flexDirection: 'row',
    paddingHorizontal: responsiveSize(20),
    marginBottom: responsiveVerticalSize(8),
  },
  activeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E9FFF6',
    borderRadius: responsiveSize(20),
    paddingHorizontal: responsiveSize(12),
    paddingVertical: responsiveVerticalSize(5),
    borderWidth: 1,
    borderColor: '#086B48',
    gap: responsiveSize(8),
  },
  activeFilterText: {
    fontSize: responsiveSize(12),
    fontFamily: 'Poppins-Medium',
    color: '#086B48',
  },
  activeFilterClear: {
    fontSize: responsiveSize(12),
    color: '#086B48',
    fontWeight: '700',
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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: responsiveVerticalSize(6),
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

  // Filter Dropdown
  filterDropdown: {
    backgroundColor: '#fff',
    marginHorizontal: responsiveSize(20),
    marginBottom: responsiveVerticalSize(10),
    borderRadius: responsiveSize(12),
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: responsiveVerticalSize(13),
    paddingHorizontal: responsiveSize(16),
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  filterOptionActive: {
    backgroundColor: '#F0FFF8',
  },
  filterOptionText: {
    fontSize: responsiveSize(14),
    color: '#333',
    fontFamily: 'Poppins-Regular',
  },
  filterOptionTextActive: {
    color: '#086B48',
    fontFamily: 'Poppins-SemiBold',
  },
  filterCheckmark: {
    color: '#086B48',
    fontSize: responsiveSize(14),
    fontWeight: '700',
  },

  // Custom Date Range
  customDateContainer: {
    padding: responsiveSize(16),
    backgroundColor: '#FAFFFE',
  },
  customDateLabel: {
    fontSize: responsiveSize(13),
    fontFamily: 'Poppins-SemiBold',
    color: '#086B48',
    marginBottom: responsiveVerticalSize(12),
    textAlign: 'center',
  },
  datePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveVerticalSize(12),
    gap: responsiveSize(6),
  },
  dateArrow: {
    paddingHorizontal: responsiveSize(4),
  },
  dateArrowText: {
    fontSize: responsiveSize(16),
    color: '#086B48',
    fontWeight: '600',
  },
  dateInputButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#086B48',
    borderRadius: responsiveSize(10),
    paddingHorizontal: responsiveSize(12),
    paddingVertical: responsiveVerticalSize(10),
    alignItems: 'center',
  },
  dateInputButtonFilled: {
    backgroundColor: '#E9FFF6',
    borderColor: '#086B48',
  },
  dateInputLabel: {
    fontSize: responsiveSize(10),
    color: '#086B48',
    fontFamily: 'Poppins-Medium',
    marginBottom: responsiveVerticalSize(2),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dateInputText: {
    fontSize: responsiveSize(12),
    color: '#999',
    fontFamily: 'Poppins-Regular',
  },
  dateInputTextFilled: {
    color: '#111',
    fontFamily: 'Poppins-SemiBold',
  },
  applyCustomFilterBtn: {
    backgroundColor: '#086B48',
    borderRadius: responsiveSize(10),
    paddingVertical: responsiveVerticalSize(12),
    alignItems: 'center',
  },
  applyCustomFilterBtnDisabled: {
    backgroundColor: '#9FC9B8',
  },
  applyCustomFilterText: {
    color: '#fff',
    fontSize: responsiveSize(14),
    fontFamily: 'Poppins-SemiBold',
  },

  // Calendar Modal
  calendarOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarContent: {
    backgroundColor: '#fff',
    borderRadius: responsiveSize(20),
    padding: responsiveSize(20),
    width: width * 0.88,
    maxWidth: 360,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  calendarPickingLabel: {
    fontSize: responsiveSize(13),
    fontFamily: 'Poppins-Medium',
    color: '#086B48',
    marginBottom: responsiveVerticalSize(12),
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: responsiveVerticalSize(16),
  },
  calendarNavButton: {
    width: responsiveSize(36),
    height: responsiveSize(36),
    borderRadius: responsiveSize(18),
    backgroundColor: '#E9FFF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarNavButtonText: {
    fontSize: responsiveSize(20),
    fontWeight: '700',
    color: '#086B48',
    lineHeight: responsiveSize(24),
  },
  calendarTitle: {
    fontSize: responsiveSize(16),
    fontWeight: '700',
    color: '#111',
    fontFamily: 'Poppins-SemiBold',
  },
  daysOfWeek: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: responsiveVerticalSize(6),
  },
  dayOfWeekText: {
    flex: 1,
    textAlign: 'center',
    fontSize: responsiveSize(11),
    fontWeight: '600',
    color: '#086B48',
    fontFamily: 'Poppins-Medium',
  },
  calendarDays: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    marginBottom: responsiveVerticalSize(16),
  },
  calendarDay: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: responsiveVerticalSize(1),
  },
  calendarToday: {
    borderWidth: 1.5,
    borderColor: '#086B48',
    borderRadius: responsiveSize(20),
  },
  calendarSelected: {
    backgroundColor: '#086B48',
    borderRadius: responsiveSize(20),
  },
  calendarEmptyDay: {
    backgroundColor: 'transparent',
  },
  calendarDayText: {
    fontSize: responsiveSize(13),
    fontWeight: '500',
    color: '#333',
  },
  calendarTodayText: {
    color: '#086B48',
    fontWeight: '700',
  },
  calendarSelectedText: {
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
    borderTopColor: '#f0f0f0',
    paddingTop: responsiveVerticalSize(14),
    gap: responsiveSize(10),
  },
  calendarCancelButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: responsiveVerticalSize(10),
    borderRadius: responsiveSize(10),
    alignItems: 'center',
  },
  calendarCancelButtonText: {
    color: '#555',
    fontSize: responsiveSize(13),
    fontFamily: 'Poppins-Medium',
  },
  calendarTodayButton: {
    flex: 1,
    backgroundColor: '#086B48',
    paddingVertical: responsiveVerticalSize(10),
    borderRadius: responsiveSize(10),
    alignItems: 'center',
  },
  calendarTodayButtonText: {
    color: '#fff',
    fontSize: responsiveSize(13),
    fontFamily: 'Poppins-SemiBold',
  },

  // Legacy / unused but kept for safety
  expandedSection: {
    marginTop: responsiveVerticalSize(14),
    paddingTop: responsiveVerticalSize(12),
    borderTopWidth: 1,
    borderTopColor: '#D1FAE5',
  },
  sectionTitle: {
    fontSize: responsiveSize(13),
    fontFamily: 'Poppins-SemiBold',
    marginBottom: responsiveVerticalSize(4),
  },
  locationText: { fontSize: responsiveSize(12), color: '#111' },
  locationSection: { marginBottom: responsiveVerticalSize(12) },
  subText: { fontSize: responsiveSize(11), color: '#666' },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: responsiveVerticalSize(10) },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: responsiveVerticalSize(6) },
  statusButton: { marginTop: responsiveVerticalSize(14), backgroundColor: '#E5E7EB', paddingVertical: responsiveVerticalSize(10), borderRadius: responsiveSize(20), alignItems: 'center' },
  statusButtonText: { fontSize: responsiveSize(13), fontFamily: 'Poppins-Medium', textTransform: 'capitalize' },
  summaryLeft: { flex: 1 },
  summaryLabel: { fontSize: responsiveSize(12), fontFamily: 'Poppins-Regular', color: '#333', marginTop: responsiveVerticalSize(6) },
  summaryValue: { fontSize: responsiveSize(12), fontFamily: 'Poppins-SemiBold', color: '#111', marginTop: responsiveVerticalSize(2) },
  detailRow: { marginBottom: responsiveVerticalSize(8) },
  detailLabel: { fontSize: responsiveSize(12), color: '#555', fontFamily: 'Poppins-Regular' },
  detailValue: { fontSize: responsiveSize(13), color: '#111', fontFamily: 'Poppins-SemiBold' },
  orderStatusPill: { marginTop: responsiveVerticalSize(12), backgroundColor: '#E5E7EB', paddingVertical: responsiveVerticalSize(8), borderRadius: responsiveSize(20), alignItems: 'center' },
  orderStatusText: { fontSize: responsiveSize(13), color: '#111', fontFamily: 'Poppins-Medium', textTransform: 'capitalize' },
  orderTabs: { flexDirection: 'row', backgroundColor: '#fff', marginHorizontal: responsiveSize(20), marginTop: responsiveVerticalSize(15), borderRadius: responsiveSize(25), padding: responsiveSize(4), marginBottom: responsiveVerticalSize(15) },
  tabButton: { flex: 1, paddingVertical: responsiveVerticalSize(12), borderRadius: responsiveSize(20), alignItems: 'center' },
  activeTab: { backgroundColor: '#086B48' },
  tabText: { fontSize: responsiveSize(14), fontWeight: '600', color: '#666' },
  activeTabText: { color: '#fff' },
  searchPlaceholder: { fontSize: responsiveSize(14), fontFamily: 'Poppins-Regular', color: '#086B48' },
  dateInput: { backgroundColor: '#f8f8f8', borderWidth: 1, borderColor: '#e0e0e0', borderRadius: responsiveSize(8), paddingHorizontal: responsiveSize(12), paddingVertical: responsiveVerticalSize(10), marginBottom: responsiveVerticalSize(10), fontSize: responsiveSize(14), color: '#333' },
});