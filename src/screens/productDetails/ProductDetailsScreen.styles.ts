import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  }, 
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  mainCard: {
    backgroundColor: '#E0FFF4',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  statusChip: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#333',
  },
  orderDate: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
  },
  addressSection: {
    marginBottom: 10,
  },
  addressRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginRight: 8,
    minWidth: 80,
  },
  addressText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 15,
  },
  productItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    resizeMode: 'cover',
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  productQuantity: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  productPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  productUnitPrice: {
    fontSize: 12,
    color: '#999',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#086B48',
  },
  productOriginalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  billLabel: {
    fontSize: 16,
    color: '#333',
  },
  billValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  billTotalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  billTotalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  statusBadge: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 16,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111',
    textTransform: 'capitalize',
  },
});
