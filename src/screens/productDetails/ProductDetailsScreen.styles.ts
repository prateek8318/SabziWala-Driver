import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

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

const scaleVertical = (size: number) => {
  const baseHeight = 812; // iPhone X base height
  return Math.round((size * height) / baseHeight);
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: scaleSize(20),
    paddingTop: scaleVertical(20),
  },
  scrollContent: {
    paddingBottom: scaleVertical(24),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: scaleVertical(40),
  }, 
  loadingText: {
    fontSize: scaleFont(16),
    color: '#666',
    marginTop: scaleVertical(10),
  },
  mainCard: {
    backgroundColor: '#E0FFF4',
    borderRadius: scaleSize(10),
    padding: scaleSize(15),
    marginBottom: scaleVertical(20),
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scaleVertical(15),
    paddingHorizontal: scaleSize(5), // Add padding to prevent overflow
  },
  statusChip: {
    backgroundColor: '#22C55E',
    paddingHorizontal: scaleSize(12),
    paddingVertical: scaleVertical(6),
    borderRadius: scaleSize(12),
    alignSelf: 'flex-start',
    width: scaleSize(80), // Fixed width to prevent being pushed out
    alignItems: 'center',
  },
  statusChipText: {
    fontSize: scaleFont(13),
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  orderNumber: {
    fontSize: scaleFont(18),
    fontWeight: '800',
    color: '#333',
    maxWidth: scaleSize(180), // Increased to show more characters
    marginRight: scaleSize(10),
  },
  orderDate: {
    fontSize: scaleFont(14),
    color: '#000',
    fontWeight: '600',
  },
  addressSection: {
    marginBottom: scaleVertical(10),
  },
  addressRow: {
    flexDirection: 'row',
    marginBottom: scaleVertical(8),
  },
  addressLabel: {
    fontSize: scaleFont(16),
    fontWeight: '700',
    color: '#000',
    marginRight: scaleSize(8),
    minWidth: scaleSize(80),
  },
  addressText: {
    fontSize: scaleFont(16),
    fontWeight: '500',
    color: '#000',
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    gap: scaleSize(20),
    marginTop: scaleVertical(4),
  },
  metaText: {
    fontSize: scaleFont(12),
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: scaleVertical(12),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scaleVertical(10),
  },
  infoLabel: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: '#333',
    flex: 1,
    flexWrap: 'wrap',
    marginRight: scaleSize(10),
  },
  infoValue: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: scaleFont(18),
    fontWeight: '700',
    color: '#000',
    marginBottom: scaleVertical(15),
  },
  productItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: scaleSize(8),
    padding: scaleSize(12),
    marginBottom: scaleVertical(12),
  },
  productImage: {
    width: scaleSize(80),
    height: scaleSize(80),
    borderRadius: scaleSize(8),
    marginRight: scaleSize(12),
    resizeMode: 'cover',
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: '#000',
    marginBottom: scaleVertical(4),
  },
  productDescription: {
    fontSize: scaleFont(12),
    color: '#666',
    marginBottom: scaleVertical(4),
  },
  productQuantity: {
    fontSize: scaleFont(14),
    color: '#666',
    marginBottom: scaleVertical(8),
  },
  productPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scaleSize(8),
    flexWrap: 'wrap',
  },
  productUnitPrice: {
    fontSize: scaleFont(12),
    color: '#999',
  },
  productPrice: {
    fontSize: scaleFont(16),
    fontWeight: '700',
    color: '#086B48',
  },
  productOriginalPrice: {
    fontSize: scaleFont(14),
    color: '#999',
    textDecorationLine: 'line-through',
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scaleVertical(10),
  },
  billLabel: {
    fontSize: scaleFont(16),
    color: '#333',
    flex: 1,
    flexWrap: 'wrap',
    marginRight: scaleSize(10),
  },
  billValue: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  billTotalLabel: {
    fontSize: scaleFont(18),
    fontWeight: '700',
    color: '#000',
    flex: 1,
    flexWrap: 'wrap',
    marginRight: scaleSize(10),
  },
  billTotalValue: {
    fontSize: scaleFont(18),
    fontWeight: '700',
    color: '#000',
    flex: 1,
    textAlign: 'right',
  },
  statusBadge: {
    backgroundColor: '#E5E7EB',
    paddingVertical: scaleVertical(12),
    paddingHorizontal: scaleSize(24),
    borderRadius: scaleSize(20),
    alignSelf: 'center',
    marginTop: scaleVertical(16),
    minWidth: scaleSize(120),
    alignItems: 'center',
  },
  statusText: {
    fontSize: scaleFont(14),
    fontWeight: '600',
    color: '#111',
    textTransform: 'capitalize',
    textAlign: 'center',
  },
});
