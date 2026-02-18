import { StyleSheet , Dimensions} from 'react-native';
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
 
 
  
  distanceText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#000',
  },
  mainCard: {
    backgroundColor: '#E0FFF4',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  locationSection: {
    marginBottom: 12,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#111',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
 
  actionIcon: {
    width: 18,
    height: 18,
    
  },
  

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    fontWeight: '600',
    color: '#000',
  },
  infoValue: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '700',
    color: '#000',
  },
  paymentScannerButton: {
    backgroundColor: '#086B48',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,

    alignSelf: 'flex-end', // ✅ button right side
    marginTop: 8,
    marginBottom: 12,
  },

  paymentScannerText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  productDetailsLink: {
    alignItems: 'center',
    marginBottom: 12,
  },
  productDetailsText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '700',
    color: '#000',
    textDecorationLine: 'underline',
  },
  statusBadge: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 8,
  },
  statusText: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: '#111',
    textTransform: 'capitalize',
  },
  locationWrapper: {
  flexDirection: 'row',
  justifyContent: 'space-between',
},



actionButton: {
  width: 36,
  height: 36,
  borderRadius: 18,
 
  justifyContent: 'center',
  alignItems: 'center',
},

orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: scaleSize(10),
  },
  orderNumber: {
    fontSize: scaleFont(16),
    fontWeight: '800',
    color: '#333',
    flex: 1,
    flexWrap: 'wrap',
    marginRight: scaleSize(10),
    maxWidth: width * 0.5,
  },
  orderDistance: {
    fontSize: scaleFont(16),
    color: '#000',
    fontWeight: '700',
    flexShrink: 0,
    textAlign: 'right',
    minWidth: scaleSize(50),
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
    marginBottom: scaleSize(8),
  },
  addressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: scaleSize(8),
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
    width: scaleSize(14),
    height: scaleSize(14),
    resizeMode: 'contain',
  },
  phoneIcon: {
    width: scaleSize(14),
    height: scaleSize(14),
    resizeMode: 'contain',
  },
  addressLabel: {
    fontSize: scaleFont(14),
    fontWeight: '700',
    color: '#000',
    marginRight: scaleSize(8),
    minWidth: scaleSize(45),
  },
  addressText: {
    fontSize: scaleFont(12),
    color: '#333',
    marginBottom: scaleSize(2),
    flex: 1,
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
    marginBottom: scaleSize(8),
  },
  customerLabel: {
    fontSize: scaleFont(14),
    fontWeight: '600',
    color: '#333',
  },
  customerName: {
    fontSize: scaleFont(14),
    fontWeight: '600',
    color: '#333',
  },
  orderValueSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scaleSize(8),
  },
  orderValueLabel: {
    fontSize: scaleFont(14),
    fontWeight: '600',
    color: '#333',
  },
  orderValueAmount: {
    fontSize: scaleFont(14),
    fontWeight: '600',
    color: '#333',
  },
    swipeContainer: {
    height: scaleSize(50),
    borderRadius: scaleSize(25),
    marginTop: scaleSize(8),
    overflow: 'hidden',
    backgroundColor: '#d0e8d8',
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
    width: scaleSize(40),
    height: scaleSize(40),
    marginRight: scaleSize(10),
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
    fontSize: scaleFont(18),
    marginLeft: scaleSize(15),
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  timerCenterSection: {
    alignItems: 'center',
    marginVertical: scaleSize(8),
  },
  timerCircle: {
    width: scaleSize(45),
    height: scaleSize(45),
    borderRadius: scaleSize(22.5),
    borderColor: '#086B48',
    borderWidth: 3,
    backgroundColor: '#E0FFF4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerCircleAccepted: {
    width: scaleSize(50),
    height: scaleSize(50),
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
    fontSize: scaleFont(16),
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
    fontSize: scaleFont(11),
    marginBottom: scaleSize(6),
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
  alignContent:'center',
  textAlign:'center',

  
},

metaValue: {
  fontSize: scaleFont(14),
  fontWeight: '600',
  color: '#000',
},

locationRight: {
  flex: 1,
  alignItems: 'flex-end',
  gap: scaleSize(10),
},

circleIcon: {
  width: scaleSize(28),
  height: scaleSize(28),
  resizeMode: 'contain',
},
  ongoingActions: {
    flexDirection: 'row',
    gap: scaleSize(10),
    marginBottom: scaleSize(20),
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
  color: '#000',
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
  qrModalContent: {
    backgroundColor: '#fff',
    borderRadius: scaleSize(16),
    padding: scaleSize(24),
    width: width * 0.85,
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },

  qrModalTitle: {
    fontSize: scaleFont(20),
    fontWeight: '700',
    color: '#086B48',
    marginBottom: scaleSize(8),
    textAlign: 'center',
  },

  qrModalSubtitle: {
    fontSize: scaleFont(14),
    color: '#666',
    marginBottom: scaleSize(4),
    textAlign: 'center',
  },

  qrModalAmount: {
    fontSize: scaleFont(18),
    fontWeight: '600',
    color: '#000',
    marginBottom: scaleSize(20),
    textAlign: 'center',
  },

  qrCodeContainer: {
    width: width * 0.5,
    height: width * 0.5,
    maxWidth: 200,
    maxHeight: 200,
    backgroundColor: '#f8f8f8',
    borderRadius: scaleSize(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scaleSize(16),
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },

  qrCodeImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },

  qrInstructionText: {
    fontSize: scaleFont(14),
    color: '#666',
    textAlign: 'center',
    marginBottom: scaleSize(20),
    lineHeight: scaleSize(20),
  },

  qrCloseButton: {
    backgroundColor: '#086B48',
    paddingVertical: scaleSize(12),
    paddingHorizontal: scaleSize(32),
    borderRadius: scaleSize(25),
    alignItems: 'center',
  },

  qrCloseButtonText: {
    color: '#fff',
    fontSize: scaleFont(16),
    fontWeight: '600',
  },

  // Inline QR Code Display Styles
  qrCodeDisplay: {
    backgroundColor: '#f8f9fa',
    borderRadius: scaleSize(12),
    padding: scaleSize(16),
    marginTop: scaleSize(12),
    marginBottom: scaleSize(12),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },

  qrCodeTitle: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: '#086B48',
    marginBottom: scaleSize(4),
    textAlign: 'center',
  },

  qrCodeSubtitle: {
    fontSize: scaleFont(12),
    color: '#666',
    marginBottom: scaleSize(8),
    textAlign: 'center',
  },

  qrCodeAmount: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: '#000',
    marginBottom: scaleSize(16),
    textAlign: 'center',
  },

  qrCodeWrapper: {
    alignItems: 'center',
    marginBottom: scaleSize(12),
  },

  qrCodePlaceholder: {
    width: scaleSize(150),
    height: scaleSize(150),
    backgroundColor: '#fff',
    borderRadius: scaleSize(8),
    borderWidth: 2,
    borderColor: '#086B48',
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
  },

  qrCodePlaceholderText: {
    fontSize: scaleFont(14),
    fontWeight: '700',
    color: '#086B48',
    marginBottom: scaleSize(4),
  },

  qrCodePlaceholderSubtext: {
    fontSize: scaleFont(10),
    color: '#666',
    textAlign: 'center',
  },

  qrCodeInstruction: {
    fontSize: scaleFont(12),
    color: '#666',
    textAlign: 'center',
    marginBottom: scaleSize(12),
    lineHeight: scaleSize(16),
  },

  qrCodeHideButton: {
    backgroundColor: '#6c757d',
    paddingVertical: scaleSize(8),
    paddingHorizontal: scaleSize(20),
    borderRadius: scaleSize(20),
    alignItems: 'center',
  },

  qrCodeHideButtonText: {
    color: '#fff',
    fontSize: scaleFont(12),
    fontWeight: '500',
  },

});
