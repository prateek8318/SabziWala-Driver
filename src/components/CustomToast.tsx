import React, { useEffect, useState } from 'react';
import { View, Text, Animated, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface ToastProps {
  visible: boolean;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onHide: () => void;
  showIcon?: boolean;
}

const { width } = Dimensions.get('window');

const CustomToast: React.FC<ToastProps> = ({ visible, message, type, onHide, showIcon = true }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-100));

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after 3 seconds
      const timer = setTimeout(() => {
        hideToast();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  if (!visible) return null;

  const getToastStyle = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: '#0A8F5A',
          iconName: 'check-circle',
          iconColor: '#fff',
        };
      case 'error':
        return {
          backgroundColor: '#FF3B30',
          iconName: 'error',
          iconColor: '#fff',
        };
      case 'warning':
        return {
          backgroundColor: '#FF9500',
          iconName: 'warning',
          iconColor: '#fff',
        };
      case 'info':
      default:
        return {
          backgroundColor: '#007AFF',
          iconName: 'info',
          iconColor: '#fff',
        };
    }
  };

  const toastStyle = getToastStyle();

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: 50,
          left: 20,
          right: 20,
          zIndex: 9999,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View
        style={{
          backgroundColor: toastStyle.backgroundColor,
          borderRadius: 12,
          padding: 16,
          flexDirection: 'row',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        {showIcon && (
          <Icon
            name={toastStyle.iconName}
            size={24}
            color={toastStyle.iconColor}
            style={{ marginRight: 12 }}
          />
        )}
        <Text
          style={{
            color: '#fff',
            fontSize: 16,
            fontWeight: '600',
            flex: 1,
            lineHeight: 22,
          }}
        >
          {message}
        </Text>
      </View>
    </Animated.View>
  );
};

export default CustomToast;
