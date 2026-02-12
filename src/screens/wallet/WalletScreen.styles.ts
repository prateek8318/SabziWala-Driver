import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },

  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 70, 
  },

  // Balance Card
  balanceCard: {
    backgroundColor: '#086B48',
    borderRadius: 12,
    padding: 28,

    paddingVertical: 40,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  walletTitle: {
    fontSize: 22,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontWeight: '600',
    color: '#fff',
    marginBottom: 22,
  },

  availableBalanceLabel: {
    fontSize: 14,
    color: '#fff',
    
    opacity: 0.9,
    marginBottom: 4,
  },

  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    color: '#fff',
  },

  // Amount Input Section
  inputSection: {
    marginBottom: 20,
  },

  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },

  amountInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#C6C9C8',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 18,
    fontSize: 16,
    marginBottom: 8,
  },

  errorMessage: {
    fontSize: 14,
    color: '#f44336',
    marginBottom: 8,
  },

  // Redeem Button
  redeemButton: {
    backgroundColor: '#9B9B9B',
    borderRadius: 30,
    paddingVertical: 22,
    alignItems: 'center',
    marginBottom: 24,
  },

  redeemButtonActive: {
    backgroundColor: '#086B48',
  },

  redeemButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },

  // Tabs
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },

  tabButton: {
    flex: 1,
    paddingVertical: 22,
    alignItems: 'center',
    borderRadius: 8,
  },

  tabButtonActive: {
    backgroundColor: '#086B48',
  },

  tabButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#086B48',
  },

  tabButtonTextActive: {
    color: '#fff',

  },

  // Transaction List
  transactionList: {
    marginBottom: 20,
    flex: 1,
  },

  transactionItem: {
    backgroundColor: '#46A27F80',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    
  },

  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  transactionType: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },

  transactionAmount: {
    fontSize: 20,
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
    gap: 16,
  },

  transactionOrderId: {
    fontSize: 16,
    color: '#2D302F',
    flex: 1,
    textAlign: 'left',
  },

  transactionId: {
    fontSize: 16,
    color: '#2D302F',
    flex: 1,
    textAlign: 'left',
  },

  transactionDate: {
    fontSize: 16,
    color: '#2D302F',
    textAlign: 'right',
    flex: 1,
  },

  // Settlement History Table
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },

  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderRadius: 12,
    backgroundColor: '#46A27F80',
    borderBottomColor: '#eee',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },

  tableHeaderText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },

  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderRadius: 12,
    borderBottomColor: '#f5f5f5',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },

  tableCell: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'center',
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
    fontSize: 14,
    fontWeight: '500',
  },

  // Loading and Empty states
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },

  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});
