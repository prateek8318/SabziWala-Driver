import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  
  // Loading States
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
  
  // Content
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  
  periodRow: {
    alignItems: 'flex-end',
    marginHorizontal: 20,
    marginTop: 10,
  },

  periodDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#086B48',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
  },

  periodText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#fff',
    fontWeight: '700',
    marginRight: 6,
  },

  periodArrow: {
    fontSize: 12,
    color: '#fff',
  },

  summaryCard: {
    backgroundColor: '#E9FFF6',
    borderRadius: 12,
    padding: 16,
    paddingBottom: 20,
    marginHorizontal: 8,
    marginTop: 12,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  label: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#000',
    fontWeight: '600',
  },

  value: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#000',
    fontWeight: '700',
  },

  // Dropdown Styles
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    
    zIndex: 1000,
  },

  dropdownMenu: {
    position: 'absolute',
    top: 43,
    right: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 140,
  },

  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    
  },

  selectedDropdownItem: {
    backgroundColor: '#E9FFF6',
  },

  dropdownItemText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#00000080',
  },

  selectedDropdownItemText: {
    fontFamily: 'Poppins-Medium',
    color: '#086B48',
  },
});
