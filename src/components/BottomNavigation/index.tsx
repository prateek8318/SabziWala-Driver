import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';

interface BottomNavigationProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabPress }) => {
  const tabs = [
    { 
      id: 'home', 
      label: 'Home', 
      icon: require('../../images/home.png'),
      activeIcon: require('../../images/ic-home.png')
    },
    { 
      id: 'wallet', 
      label: 'Wallet', 
      icon: require('../../images/wallet.png'),
      activeIcon: require('../../images/ic-wallet.png')
    },
    { 
      id: 'history', 
      label: 'Order History', 
      icon: require('../../images/order.png'),
      activeIcon: require('../../images/ic-order.png')
    },
    { 
      id: 'earning', 
      label: 'My Earning', 
      icon: require('../../images/earning.png'),
      activeIcon: require('../../images/earning.png') 
    },
    { 
      id: 'sos', 
      label: 'SOS', 
      icon: require('../../images/sos.png'),
      activeIcon: require('../../images/sos.png') // No active icon specified
    },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabItem}
            onPress={() => {
              console.log(`Tab clicked: ${tab.id} - ${tab.label}`);
              onTabPress(tab.id);
            }}
          >
            {typeof tab.icon === 'string' ? (
              <Text style={[styles.tabIcon, { color: isActive ? '#fff' : '#ccc' }]}>
                {tab.icon}
              </Text>
            ) : (
              <Image 
                source={isActive && tab.activeIcon ? tab.activeIcon : tab.icon} 
                style={[styles.tabImage]} 
              />
            )}
            <Text style={[styles.tabLabel, { color: isActive ? '#fff' : '#ccc' }]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#086B48',
    paddingBottom: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#086B48',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    minHeight: 50,
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 2,
  },
  tabImage: {
    width: 38,
    height: 28,
    marginBottom: 2,
    resizeMode: 'contain',
  },
  tabLabel: {
    fontSize: 10,
    fontFamily: 'Roboto-Medium',
  },
});

export default BottomNavigation;
