import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');



// Responsive base values

const isSmallScreen = width < 360;

const isMediumScreen = width >= 360 && width < 480;

const isLargeScreen = width >= 480;



// Responsive scaling functions

const scaleSize = (size: number) => {

  const baseWidth = 375; // iPhone X base width

  return Math.round((size * width) / baseWidth);

};



const scaleFont = (fontSize: number) => {

  const baseWidth = 375;

  const scaled = Math.round((fontSize * width) / baseWidth);

  return Math.max(fontSize * 0.8, Math.min(scaled, fontSize * 1.2));

};



export default StyleSheet.create({

  container: {

    flex: 1,

    backgroundColor: '#fff',

  },

  headerSection: {

    backgroundColor: '#fff',

    paddingHorizontal: scaleSize(20),

    paddingTop: scaleSize(20),

    paddingBottom: scaleSize(30),

  },

  headerTop: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    marginBottom: scaleSize(20),

  },

  userInfo: {

    flexDirection: 'row',

    alignItems: 'center',

  },

  userTextContainer: {

    marginLeft: scaleSize(12),

  },

  greetingText: {

    color: '#086B48',

    fontSize: scaleFont(20),

    fontWeight: '400',

  },

  userName: {

    color: '#086B48',

    fontSize: scaleFont(22),



    fontWeight: '500',

  },

  profileImage: {

    width: scaleSize(45),

    height: scaleSize(45),

    borderRadius: scaleSize(24),

  },

  headerActions: {

    flexDirection: 'row',

    alignItems: 'center',

    gap: scaleSize(2),

  },

  bellIcon: {

    padding: 6,

  },

  notificationIcon: {

    width: scaleSize(45),

    height: scaleSize(45),

  },

  earningsContainer: {

    flexDirection: isSmallScreen ? 'column' : 'row',

    justifyContent: 'space-between',

    gap: scaleSize(12),

  },



  earningCard: {

    flex: 1,

    borderRadius: scaleSize(22),

    paddingVertical: scaleSize(18),

    paddingHorizontal: scaleSize(12),

    alignItems: 'center',

    minWidth: isSmallScreen ? width - scaleSize(40) : scaleSize(100),

  },



  earningTitle: {

    color: '#FFFFFF',

    fontSize: scaleFont(13),

    fontFamily: 'Poppins-Medium',

    marginBottom: scaleSize(5),

    textAlign: 'center',

  },



  earningAmount: {

    color: '#FFFFFF',

    fontSize: scaleFont(22),

    fontFamily: 'Poppins-Bold',

    marginBottom: scaleSize(9),

  },
  orderLabel: {

    color: '#FFFFFF',
    fontSize: scaleFont(12),
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    opacity: 0.9,
    marginBottom: scaleSize(4),

  },



  orderValue: {

    color: '#FFFFFF',

    fontSize: scaleFont(16),

    fontFamily: 'Poppins-SemiBold',

  },



  orderTabs: {

    flexDirection: 'row',

    backgroundColor: '#E4E4E4',

    marginHorizontal: scaleSize(20),

    marginTop: -15,

    borderRadius: 35,

    marginBottom: scaleSize(10),

    shadowColor: '#000',

    shadowOffset: { width: 0, height: 2 },

    shadowOpacity: 0.1,

    shadowRadius: 4,

    elevation: 3,

  },

  tabButton: {

    flex: 1,

    paddingVertical: scaleSize(18),

    borderRadius: scaleSize(35),

    alignItems: 'center',

  },

  activeTab: {

    backgroundColor: '#086B48',

  },

  tabText: {

    fontSize: scaleFont(16),

    fontWeight: '600',

    color: '#666',

  },

  activeTabText: {

    color: '#fff',

  },

  content: {

    flex: 1,

    paddingHorizontal: scaleSize(20),

    paddingTop: scaleSize(20),

  },

  contentContainer: {

    flex: 1,

  },

  scrollContent: {

    paddingBottom: scaleSize(30),

    flexGrow: 1,

  },

  orderCard: {

    backgroundColor: '#E0FFF4',

    borderRadius: scaleSize(10),

    padding: isSmallScreen ? scaleSize(12) : scaleSize(15),

    marginBottom: isSmallScreen ? scaleSize(20) : scaleSize(70),

    shadowColor: '#000',

    shadowOffset: { width: 0, height: 2 },

    shadowOpacity: 0.1,

    shadowRadius: 4,

    elevation: 3,

    overflow: 'hidden', // Prevents content from spilling outside

  },

  ongoingOrderCard: {

    backgroundColor: '#E0FFF4',

    borderRadius: scaleSize(10),

    padding: isSmallScreen ? scaleSize(12) : scaleSize(15),

    marginBottom: isSmallScreen ? scaleSize(20) : scaleSize(70),

    shadowColor: '#000',

    shadowOffset: { width: 0, height: 2 },

    shadowOpacity: 0.1,

    shadowRadius: 4,

    elevation: 3,

    overflow: 'hidden', // Prevents content from spilling outside

  },

  orderHeader: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'flex-start',

    marginBottom: scaleSize(10),

  },

  orderNumber: {

    fontSize: scaleFont(18),

    fontWeight: '800',

    color: '#333',

    flex: 1,

    flexWrap: 'wrap',

    marginRight: scaleSize(10),

    maxWidth: width * 0.6, // Prevents overflow on small screens

  },

  orderDistance: {

    fontSize: scaleFont(18),

    color: '#000',

    fontWeight: '700',

    flexShrink: 0,

    textAlign: 'right',

    minWidth: scaleSize(60),

  },

  orderDate: {

    fontSize: scaleFont(14),

    color: '#000',

    fontWeight: '600',

    flexShrink: 0,

    textAlign: 'right',

    minWidth: scaleSize(80),

  },

  addressSection: {

    marginBottom: scaleSize(10),

  },

  addressRow: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'flex-start',

    marginBottom: scaleSize(12),

    paddingHorizontal: scaleSize(5),

  },

  addressLeftSection: {

    flex: 1,

  },

  addressHeaderRow: {

    flexDirection: 'row',

    alignItems: 'center',

    marginBottom: scaleSize(4),

  },

  addressTimeRow: {

    flexDirection: 'row',

    alignItems: 'flex-start',

    gap: scaleSize(20),

  },

  timeRow: {

    flexDirection: 'row',

    alignItems: 'center',

    marginBottom: scaleSize(4),

  },

  dateRow: {

    flexDirection: 'row',

    alignItems: 'center',

    marginBottom: scaleSize(4),

  },

  addressDateRow: {

    flexDirection: 'row',

    alignItems: 'flex-start',

  },

  timeLabel: {

    fontSize: scaleFont(11),

    fontWeight: '500',

    color: '#666',

    marginBottom: scaleSize(2),

  },

  dateLabel: {

    fontSize: scaleFont(11),

    fontWeight: '500',

    color: '#666',

    marginBottom: scaleSize(2),

  },

  addressCenterSection: {

    alignItems: 'center',

    minWidth: scaleSize(80),

  },

  addressRightSection: {

    alignItems: 'flex-end',

    minWidth: scaleSize(60),

  },

  addressIcons: {

    flexDirection: 'row',

    gap: scaleSize(12),

    marginTop: scaleSize(8),

  },

  addressIcon: {

    width: scaleSize(18),

    height: scaleSize(18),

    resizeMode: 'contain',

  },

  phoneIcon: {

    width: scaleSize(18),

    height: scaleSize(18),

    resizeMode: 'contain',

  },

  addressLabel: {

    fontSize: scaleFont(16),

    fontWeight: '700',

    color: '#000',

    marginRight: scaleSize(10),

    minWidth: scaleSize(50),

  },

  addressText: {

    fontSize: scaleFont(14),

    color: '#333',

    marginBottom: scaleSize(2),

  },

  addressTimeHeading: {

    fontSize: scaleFont(13),

    fontWeight: '600',

    color: '#086B48',

  },

  addressDateHeading: {

    fontSize: scaleFont(11),

    fontWeight: '500',

    color: '#666',

  },

  addressTime: {

    fontSize: scaleFont(12),

    color: '#666',

    marginRight: scaleSize(10),

  },

  callIcon: {

    fontSize: scaleFont(16),

  },

  orderDetails: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    marginBottom: scaleSize(10),

  },

  detailLeftColumn: {

    flex: 1,

  },

  detailRightColumn: {

    flex: 1,

  },

  detailText: {

    fontSize: scaleFont(14),

    color: '#666',

    marginBottom: scaleSize(2),

  },

  detailLabel: {

    fontSize: scaleFont(14),

    fontWeight: '600',

    color: '#333',

    marginBottom: scaleSize(2),

  },

  detailValue: {

    fontSize: scaleFont(14),

    fontWeight: '400',

    color: '#666',

    marginBottom: scaleSize(2),

  },

  divider: {

    height: 1,

    backgroundColor: '#E0E0E0',

    marginVertical: scaleSize(12),

    alignSelf: 'stretch',

    width: '100%',

  },

  customerSection: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    marginBottom: scaleSize(10),

  },

  customerLabel: {

    fontSize: scaleFont(16),

    fontWeight: '600',

    color: '#333',

  },

  customerName: {

    fontSize: scaleFont(16),

    fontWeight: '600',

    color: '#333',

  },

  orderValueSection: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    marginBottom: scaleSize(10),

  },

  orderValueLabel: {

    fontSize: scaleFont(16),

    fontWeight: '600',

    color: '#333',

  },

  orderValueAmount: {

    fontSize: scaleFont(16),

    fontWeight: '600',

    color: '#333',

  },

  swipeContainer: {

    height: scaleSize(56),

    borderRadius: scaleSize(28),

    marginTop: scaleSize(12),

    overflow: 'hidden',

    backgroundColor: '#d0e8d8', // light bg visible after swipe

  },

  swipeButton: {

    flex: 1,

    borderRadius: scaleSize(28),

    justifyContent: 'center',

  },

  swipeContent: {

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'flex-start',

    gap: scaleSize(12),

  },

  swipeIcon: {

    flexDirection: 'row',

    gap: scaleSize(4),

  },

  swipeLeftContent: {

    flexDirection: 'row',

    alignItems: 'center',

  },

  swipeImage: {

    width: scaleSize(48),

    height: scaleSize(48),

    marginRight: scaleSize(12),

    marginLeft: scaleSize(4),

  },

  swipeArrow: {

    width: scaleSize(4),

    height: scaleSize(14),

    backgroundColor: '#fff',

    borderRadius: scaleSize(2),

  },

  swipeButtonText: {

    color: '#fff',

    fontSize: scaleFont(22),

    marginLeft: scaleSize(18),

    fontWeight: '600',

    letterSpacing: 0.5,

  },

  timerCenterSection: {

    alignItems: 'center',

    marginVertical: scaleSize(12),

  },

  timerCircle: {

    width: scaleSize(50),

    height: scaleSize(50),

    borderRadius: scaleSize(25),

    borderColor: '#086B48',

    borderWidth: 3,

    backgroundColor: '#E0FFF4',

    justifyContent: 'center',

    alignItems: 'center',

  },

  timerCircleAccepted: {

    width: scaleSize(55),

    height: scaleSize(55),

    borderRadius: scaleSize(25),

    backgroundColor: '#086B48',

    justifyContent: 'center',

    alignItems: 'center',

    shadowColor: '#086B48',

    shadowOffset: { width: 0, height: 2 },

    shadowOpacity: 0.3,

    shadowRadius: 4,

    elevation: 5,

  },

  timerText: {

    color: '#086B48',

    fontSize: scaleFont(18),

    fontWeight: 'bold',

    textAlign: 'center',

  },

  timerTextAccepted: {

    color: '#fff',

    fontSize: scaleFont(12),

    fontWeight: '700',

    textAlign: 'center',

  },

  timerWarningCenter: {

    textAlign: 'center',

    color: '#ff4444',

    fontSize: scaleFont(13),

    marginBottom: scaleSize(8),

  },



  cancelNewOrderBtn: {

    marginTop: scaleSize(10),

    borderWidth: 1,

    borderColor: '#EF4444',

    borderRadius: scaleSize(22),

    paddingVertical: scaleSize(10),

    alignItems: 'center',

    backgroundColor: '#FFFFFF',

  },

  cancelNewOrderText: {

    color: '#EF4444',

    fontSize: scaleFont(14),

    fontWeight: '700',

  },



  notesTitle: {

    fontSize: scaleFont(14),

    fontWeight: '600',

    color: '#333',

    marginBottom: scaleSize(5),

  },

  locationRow: {

    flexDirection: 'row',

    alignItems: 'flex-start',

    paddingVertical: scaleSize(8),

  },



  locationLeft: {

    flex: 3,

  },



  locationTitleRow: {

    flexDirection: 'row',

    flexWrap: 'wrap',

  },



  locationLabel: {

    fontSize: scaleFont(18),

    fontWeight: '700',

    color: '#000',

    marginRight: scaleSize(6),

  },



  locationAddress: {

    fontSize: scaleFont(16),

    fontWeight: '500',

    color: '#000',

    flexShrink: 1,

  },



  locationCenter: {

    flex: 2,

    alignItems: 'center',

  },



  metaText: {

    fontSize: scaleFont(14),

    color: '#000',

  },



  metaValue: {

    fontSize: scaleFont(14),

    fontWeight: '600',

    color: '#000',

  },



  locationRight: {

    flex: 1,

    alignItems: 'flex-end',

    gap: scaleSize(14),

  },



  circleIcon: {

    width: scaleSize(36),

    height: scaleSize(36),

    resizeMode: 'contain',

  },

  ongoingActions: {

    flexDirection: 'row',

    gap: scaleSize(10),

    marginBottom: scaleSize(15),

  },

  productButton: {

    flex: 1,

    backgroundColor: '#e3f2fd',

    borderRadius: scaleSize(8),

    padding: scaleSize(12),

    alignItems: 'center',

  },

  productButtonText: {

    color: '#1976d2',

    fontSize: scaleFont(14),

    fontWeight: '600',

  },

  updateButton: {

    flex: 1,

    backgroundColor: '#086B48',

    borderRadius: scaleSize(8),

    padding: scaleSize(12),

    alignItems: 'center',

  },

  updateButtonText: {

    color: '#fff',

    fontSize: scaleFont(18),

    fontWeight: '600',

  },

  reportLink: {

    alignItems: 'center',

  },

  reportText: {

    color: '#000',

    justifyContent: 'flex-end',

    alignSelf: 'flex-end',

    fontSize: scaleFont(18),

    fontWeight: '700',

    textDecorationLine: 'underline',

  },

  metaRow: {

    flexDirection: 'row',

    gap: scaleSize(8),

    marginTop: scaleSize(2),

  },

  metaLabel: {

    fontSize: scaleFont(12),

    color: '#666',

  },



  iconColumn: {

    gap: scaleSize(12),

    marginTop: scaleSize(10),

  },



  detailRow: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    marginBottom: scaleSize(6),

  },

  deliveryNotes: {

    backgroundColor: '#9E9E5E',

    padding: scaleSize(12),

    borderRadius: scaleSize(8),

    marginVertical: scaleSize(12),

  },

  notesText: {

    fontSize: scaleFont(13),

    color: '#fff',

  },

  productLink: {

    textAlign: 'center',

    fontSize: scaleFont(20),

    fontWeight: '700',

    textDecorationLine: 'underline',

    marginBottom: scaleSize(12),

  },

  codSection: {

    alignItems: 'center',

    marginBottom: scaleSize(12),

  },

  codButton: {

    backgroundColor: '#086B48',

    paddingVertical: scaleSize(10),

    paddingHorizontal: scaleSize(24),

    borderRadius: scaleSize(25),

  },

  codButtonText: {

    color: '#fff',

    fontSize: scaleFont(16),

    fontWeight: '600',

  },

  qrInlineContainer: {

    marginTop: scaleSize(12),

    alignItems: 'center',

    justifyContent: 'center',

  },

  qrInlineImage: {

    width: width * 0.5,

    height: width * 0.5,

    resizeMode: 'contain',

  },

  updateButtonFull: {

    backgroundColor: '#086B48',

    paddingVertical: scaleSize(18),

    width: '65%',

    alignSelf: 'center',

    borderRadius: scaleSize(30),

    alignItems: 'center',

    marginBottom: scaleSize(10),

  },



  // Loading and Empty States

  loadingContainer: {

    flex: 1,

    justifyContent: 'center',

    alignItems: 'center',

    paddingVertical: scaleSize(40),

  },



  loadingText: {

    fontSize: scaleFont(16),

    color: '#666',

    fontFamily: 'Poppins-Regular',

  },



  emptyContainer: {

    flex: 1,

    justifyContent: 'center',

    alignItems: 'center',

    paddingVertical: scaleSize(40),

  },



  emptyText: {

    fontSize: scaleFont(16),

    color: '#666',

    fontFamily: 'Poppins-Regular',

    textAlign: 'center',

  },



  // Status Modal Styles

  modalOverlay: {

    flex: 1,

    backgroundColor: 'rgba(0, 0, 0, 0.5)',

    justifyContent: 'center',

    alignItems: 'center',

  },



  statusModalContent: {

    backgroundColor: '#fff',

    borderRadius: scaleSize(12),

    padding: scaleSize(20),

    width: width * 0.85,

    maxWidth: 400,

    shadowColor: '#000',

    shadowOffset: { width: 0, height: 2 },

    shadowOpacity: 0.25,

    shadowRadius: 3.84,

    elevation: 5,

  },



  statusModalTitle: {

    fontSize: scaleFont(18),

    fontWeight: '700',

    color: '#000',

    marginBottom: scaleSize(20),

    textAlign: 'center',

  },



  statusOption: {

    paddingVertical: scaleSize(14),

    paddingHorizontal: scaleSize(16),

    borderRadius: scaleSize(8),

    marginBottom: scaleSize(10),

    backgroundColor: '#f5f5f5',

  },



  statusOptionActive: {

    backgroundColor: '#E0FFF4',

  },



  statusOptionText: {

    fontSize: scaleFont(16),

    color: '#333',

    fontWeight: '500',

  },

  statusOptionTextActive: {

    color: '#086B48',

    fontWeight: '600',

  },



  statusModalCancel: {

    marginTop: scaleSize(10),

    paddingVertical: scaleSize(12),

    alignItems: 'center',

  },



  statusModalCancelText: {

    fontSize: scaleFont(16),

    color: '#666',

    fontWeight: '500',

  },



  // QR Modal Styles

  qrModalOverlay: {

    flex: 1,

    backgroundColor: 'rgba(0, 0, 0, 0.8)',

    justifyContent: 'center',

    alignItems: 'center',

  },

  qrModalContent: {

    backgroundColor: '#fff',

    borderRadius: scaleSize(20),

    padding: scaleSize(30),

    width: width * 0.9,

    maxWidth: 400,

    alignItems: 'center',

    shadowColor: '#000',

    shadowOffset: { width: 0, height: 4 },

    shadowOpacity: 0.3,

    shadowRadius: 8,

    elevation: 10,

  },

  qrModalTitle: {

    fontSize: scaleFont(20),

    fontWeight: '700',

    color: '#000',

    marginBottom: scaleSize(20),

    textAlign: 'center',

  },

  qrCodeContainer: {

    width: scaleSize(200),

    height: scaleSize(200),

    backgroundColor: '#f8f8f8',

    borderRadius: scaleSize(10),

    justifyContent: 'center',

    alignItems: 'center',

    marginBottom: scaleSize(20),

    borderWidth: 2,

    borderColor: '#ddd',

  },

  qrCodePlaceholder: {

    fontSize: scaleFont(14),

    color: '#666',

    textAlign: 'center',

  },

  qrOrderInfo: {

    marginBottom: scaleSize(20),

  },

  qrOrderText: {

    fontSize: scaleFont(16),

    color: '#333',

    fontWeight: '600',

    marginBottom: scaleSize(5),

  },

  qrAmountText: {

    fontSize: scaleFont(18),

    color: '#086B48',

    fontWeight: '700',

  },

  qrCloseButton: {

    backgroundColor: '#086B48',

    borderRadius: scaleSize(25),

    paddingVertical: scaleSize(15),

    paddingHorizontal: scaleSize(40),

    alignItems: 'center',

  },

  qrCloseButtonText: {

    color: '#fff',

    fontSize: scaleFont(16),

    fontWeight: '600',

  },



  // Toggle Button Styles

  toggleButton: {

    padding: scaleSize(8),

    borderRadius: scaleSize(20),

    backgroundColor: 'transparent',

  },



  toggleImage: {

    width: scaleSize(51),

    height: scaleSize(31),

    resizeMode: 'contain',

  },



});

