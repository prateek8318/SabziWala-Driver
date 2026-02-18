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
    position: 'relative',
  },

  content: {
    flex: 1,
    paddingHorizontal: responsiveSize(16),
    paddingTop: responsiveVerticalSize(16),
    marginBottom: responsiveVerticalSize(70), 
  },

  // Balance Card
  balanceCard: {
    backgroundColor: '#086B48',
    borderRadius: responsiveSize(12),
    padding: responsiveSize(28),
    paddingVertical: responsiveVerticalSize(40),
    marginBottom: responsiveVerticalSize(20),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  walletTitle: {
    fontSize: responsiveSize(22),
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontWeight: '600',
    color: '#fff',
    marginBottom: responsiveVerticalSize(22),
  },

  availableBalanceLabel: {
    fontSize: responsiveSize(14),
    color: '#fff',
    opacity: 0.9,
    marginBottom: responsiveVerticalSize(4),
  },

  balanceAmount: {
    fontSize: responsiveSize(32),
    fontWeight: '700',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    color: '#fff',
  },

  // Amount Input Section
  inputSection: {
    marginBottom: responsiveVerticalSize(20),
  },

  inputLabel: {
    fontSize: responsiveSize(16),
    fontWeight: '500',
    color: '#333',
    marginBottom: responsiveVerticalSize(8),
  },

  amountInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#C6C9C8',
    borderRadius: responsiveSize(8),
    paddingHorizontal: responsiveSize(16),
    paddingVertical: responsiveVerticalSize(18),
    fontSize: responsiveSize(16),
    marginBottom: responsiveVerticalSize(8),
  },

  errorMessage: {
    fontSize: responsiveSize(14),
    color: '#f44336',
    marginBottom: responsiveVerticalSize(8),
  },

  // Redeem Button
  redeemButton: {
    backgroundColor: '#9B9B9B',
    borderRadius: responsiveSize(30),
    paddingVertical: responsiveVerticalSize(22),
    alignItems: 'center',
    marginBottom: responsiveVerticalSize(24),
  },

  redeemButtonActive: {
    backgroundColor: '#086B48',
  },

  redeemButtonText: {
    fontSize: responsiveSize(16),
    fontWeight: '600',
    color: '#fff',
  },

  // Tabs
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: responsiveSize(8),
    marginBottom: responsiveVerticalSize(16),
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },

  tabButton: {
    flex: 1,
    paddingVertical: responsiveVerticalSize(22),
    alignItems: 'center',
    borderRadius: responsiveSize(8),
  },

  tabButtonActive: {
    backgroundColor: '#086B48',
  },

  tabButtonText: {
    fontSize: responsiveSize(16),
    fontWeight: '500',
    color: '#086B48',
    paddingHorizontal: responsiveSize(8),
    textAlign: 'center',
  },

  tabButtonTextActive: {
    color: '#fff',
  },

  // Transaction List
  transactionList: {
    marginBottom: responsiveVerticalSize(20),
    flex: 1,
  },

  transactionItem: {
    backgroundColor: '#46A27F80',
    borderRadius: responsiveSize(16),
    padding: responsiveSize(16),
    marginBottom: responsiveVerticalSize(12),
  },

  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveVerticalSize(12),
  },

  transactionType: {
    fontSize: responsiveSize(16),
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },

  transactionAmount: {
    fontSize: responsiveSize(18),
    fontWeight: '700',
    textAlign: 'right',
    flex: 1,
  },

  creditAmount: {
    color: '#015304',
  },

  debitAmount: {
    color: '#E82728',
  },

  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: responsiveSize(16),
  },

  transactionOrderId: {
    fontSize: responsiveSize(14),
    color: '#2D302F',
    flex: 1,
    textAlign: 'left',
  },

  transactionId: {
    fontSize: responsiveSize(12),
    color: '#2D302F',
    flex: 1,
    textAlign: 'left',
  },

  transactionDate: {
    fontSize: responsiveSize(12),
    color: '#2D302F',
    textAlign: 'right',
    flex: 1,
  },

  // Settlement History Table
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: responsiveSize(8),
    elevation: 1,
    marginBottom: responsiveVerticalSize(60),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },

  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderRadius: responsiveSize(12),
    backgroundColor: '#46A27F80',
    borderBottomColor: '#eee',
    paddingVertical: responsiveVerticalSize(12),
    paddingHorizontal: responsiveSize(8),
  },

  tableHeaderText: {
    fontSize: responsiveSize(12),
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },

  tableHeaderTextDate: {
    flex: 1.5,
    fontSize: responsiveSize(12),
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },

  tableHeaderTextAmount: {
    flex: 1,
    fontSize: responsiveSize(12),
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },

  tableHeaderTextStatus: {
    flex: 1,
    fontSize: responsiveSize(12),
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },

  tableHeaderTextNotes: {
    flex: 0.8,
    fontSize: responsiveSize(12),
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },

  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderRadius: responsiveSize(12),
    borderBottomColor: '#f5f5f5',
    paddingVertical: responsiveVerticalSize(12),
    paddingHorizontal: responsiveSize(8),
    alignItems: 'center',
  },

  tableCell: {
    fontSize: responsiveSize(11),
    color: '#666',
    textAlign: 'center',
  },

  tableCellDate: {
    flex: 1.5,
    fontSize: responsiveSize(11),
    color: '#666',
    textAlign: 'center',
  },

  tableCellAmount: {
    flex: 1,
    fontSize: responsiveSize(11),
    color: '#666',
    textAlign: 'center',
  },

  tableCellStatus: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tableCellNotes: {
    flex: 0.8,
    fontSize: responsiveSize(10),
    color: '#666',
    textAlign: 'center',
  },

  statusBadge: {
    paddingHorizontal: responsiveSize(6),
    paddingVertical: responsiveVerticalSize(3),
    borderRadius: responsiveSize(10),
    alignSelf: 'center',
    minWidth: responsiveSize(60),
  },

  statusSettled: {
    backgroundColor: '#E8F5E8',
    color: '#086B48',
  },

  statusPending: {
    backgroundColor: '#FFF3E0',
    color: '#CFA201',
  },

  statusRejected: {
    backgroundColor: '#FFEBEE',
    color: '#E82728',
  },

  statusText: {
    fontSize: responsiveSize(10),
    fontWeight: '500',
    textAlign: 'center',
  },

  // Loading and Empty states
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    fontSize: responsiveSize(16),
    color: '#666',
    marginTop: responsiveVerticalSize(8),
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: responsiveVerticalSize(40),
  },

  emptyText: {
    fontSize: responsiveSize(16),
    color: '#999',
    textAlign: 'center',
  },
});
