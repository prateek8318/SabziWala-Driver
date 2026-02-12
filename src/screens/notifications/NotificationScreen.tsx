import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import GlobalHeader from '../../components/GlobalHeader';
import { ApiService } from '../../services/api';

type IconType = 'delivery' | 'cancel' | 'complete';

interface NotificationItem {
  id: string;
  iconType: IconType;
  message: string;
  time: string;
  isRead?: boolean;
  raw?: any;
}

const NotificationScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);

  const getIconTypeFromNotification = (n: any): IconType => {
    const t = (n?.type || n?.title || n?.category || '').toString().toLowerCase();
    if (t.includes('deliver')) return 'complete';
    if (t.includes('cancel')) return 'cancel';
    if (t.includes('accept')) return 'delivery';
    // Fallback: treat as general delivery-type
    return 'delivery';
  };

  const formatTimeAgo = (dateValue?: string | number | Date) => {
    if (!dateValue) return '';
    const d = new Date(dateValue);
    if (Number.isNaN(d.getTime())) return '';
    const diffMs = Date.now() - d.getTime();
    const mins = Math.max(0, Math.floor(diffMs / 60000));
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const loadNotifications = useCallback(async () => {
    try {
      const res = await ApiService.getDriverNotifications();
      // Backend shape: { success, data: { notifications: [...], pagination: {...} } }
      const list = (
        res?.data?.data?.notifications ||
        res?.data?.notifications ||
        res?.data?.data ||
        res?.data ||
        []
      ) as any[];
      const normalized: NotificationItem[] = (Array.isArray(list) ? list : []).map((n: any) => ({
        id: (n?._id || n?.id || `${Math.random()}`).toString(),
        iconType: getIconTypeFromNotification(n),
        message: (n?.message || n?.body || n?.text || n?.title || '').toString(),
        time: formatTimeAgo(n?.createdAt || n?.created_at || n?.time || n?.date),
        isRead: !!(n?.read || n?.isRead),
        raw: n,
      }));
      setItems(normalized);
    } catch (e) {
      setItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadNotifications();
  }, [loadNotifications]);

  const markRead = useCallback(async (item: NotificationItem) => {
    if (!item?.id || item.isRead) return;
    setItems(prev => prev.map(x => (x.id === item.id ? { ...x, isRead: true } : x)));
    try {
      await ApiService.markDriverNotificationRead(item.id);
    } catch {
      // revert if API fails
      setItems(prev => prev.map(x => (x.id === item.id ? { ...x, isRead: false } : x)));
    }
  }, []);

  const { today, yesterday, older } = useMemo(() => {
    const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const todayStart = startOfDay(new Date());
    const yesterdayStart = todayStart - 24 * 60 * 60 * 1000;

    const buckets = { today: [] as NotificationItem[], yesterday: [] as NotificationItem[], older: [] as NotificationItem[] };

    for (const it of items) {
      const rawDate = it?.raw?.createdAt || it?.raw?.created_at || it?.raw?.time || it?.raw?.date;
      const t = rawDate ? new Date(rawDate).getTime() : NaN;
      if (!Number.isNaN(t)) {
        const day = startOfDay(new Date(t));
        if (day === todayStart) buckets.today.push(it);
        else if (day === yesterdayStart) buckets.yesterday.push(it);
        else buckets.older.push(it);
      } else {
        buckets.older.push(it);
      }
    }

    return buckets;
  }, [items]);

  const renderNotificationItem = (item: NotificationItem) => {
    const getIconColor = () => {
      switch (item.iconType) {
        case 'delivery': return '#086B48';
        case 'cancel': return '#ff4444';
        case 'complete': return '#4CAF50';
        default: return '#666';
      }
    };

    const getIconText = () => {
      switch (item.iconType) {
        case 'delivery': return '📦';
        case 'cancel': return '❌';
        case 'complete': return '✅';
        default: return '📢';
      }
    };

    return (
      <TouchableOpacity
        key={item.id}
        style={styles.notificationItem}
        activeOpacity={0.75}
        onPress={() => markRead(item)}
      >
        <View style={[styles.notificationIcon, { backgroundColor: getIconColor() }]}>
          <Text style={styles.iconText}>{getIconText()}</Text>
        </View>
        <View style={styles.notificationContent}>
          <Text style={[styles.notificationMessage, item.isRead && { opacity: 0.65 }]}>{item.message}</Text>
          <Text style={styles.notificationTime}>{item.time}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <GlobalHeader 
        screenName="Notification" 
        onBack={onBack}
        backgroundColor="#FFFFFF"
        titleColor="#000000"
      />
      
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {loading ? (
          <View style={styles.section}>
            
            <Text style={styles.notificationTime}>Loading...</Text>
          </View>
        ) : items.length === 0 ? (
          <View style={styles.section}>
            
            <Text style={styles.notificationTime}>No notifications</Text>
          </View>
        ) : (
          <>
            {today.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Today</Text>
                {today.map(renderNotificationItem)}
              </View>
            )}

            {yesterday.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Yesterday</Text>
                {yesterday.map(renderNotificationItem)}
              </View>
            )}

            {older.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Earlier</Text>
                {older.map(renderNotificationItem)}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    zIndex: 1000,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 15,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 20,
  },
  notificationContent: {
    flex: 1,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 5,
  },
  notificationTime: {
    fontSize: 12,
    color: '#666',
  },
});

export default NotificationScreen;
