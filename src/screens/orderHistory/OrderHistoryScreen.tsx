import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image, TextInput, Modal } from 'react-native';
import GlobalHeader from '../../components/GlobalHeader';
import BottomNavigation from '../../components/BottomNavigation';
import PaymentModal from '../../components/PaymentModal';
import styles from './OrderHistoryScreen.styles';
import { ApiService } from '../../services/api';

interface OrderHistoryScreenProps {
  onLogout?: () => void;
  onNavigate?: (screen: string) => void;
}

const OrderHistoryScreen: React.FC<OrderHistoryScreenProps> = ({ onLogout, onNavigate }) => {
  const [activeTab, setActiveTab] = React.useState('orderHistory');

  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // FIX: Single calendar state instead of two separate booleans
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [calendarType, setCalendarType] = useState<'start' | 'end'>('start');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setFilteredOrders(orders);
      return;
    }
    setFilteredOrders(
      orders.filter((o: any) => {
        const id = (o.orderId || o.bookingId || o._id || '').toString().toLowerCase();
        return id.includes(q);
      })
    );
  }, [searchQuery, orders]);

  const normalizeStatus = (order: any) =>
    (order?.status || order?.orderStatus || order?.state || '').toString().toLowerCase();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let response;
      try {
        response = await ApiService.getDriverOrders('history');
      } catch (historyError: any) {
        if (historyError.response?.status === 404 || historyError.response?.status === 500) {
          try {
            response = await ApiService.getDriverOrders('all');
          } catch (allError: any) {
            try {
              response = await ApiService.getDriverOrders();
            } catch (finalError: any) {
              response = null;
            }
          }
        } else {
          throw historyError;
        }
      }

      if (response && response.data && response.data.success) {
        let orderList = response.data.orderList || [];
        if (orderList.length > 0) {
          const completedOrders = orderList.filter((order: any) =>
            ['delivered', 'completed', 'cancelled', 'shipped'].includes(normalizeStatus(order))
          );
          if (completedOrders.length < orderList.length) {
            orderList = completedOrders;
          }
        }
        setOrders(orderList);
        setFilteredOrders(orderList);
      } else {
        setOrders([]);
        setFilteredOrders([]);
      }
    } catch (error: any) {
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    if (tab !== 'orderHistory' && onNavigate) {
      onNavigate(tab);
    }
  };

  const applyFilter = (filterType: string) => {
    setSelectedFilter(filterType);
    if (filterType !== 'custom') {
      setShowFilterDropdown(false);
    }

    const today = new Date();
    let filtered = [...orders];

    switch (filterType) {
      case 'last7days':
        const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = orders.filter(order => new Date(order.createdAt) >= sevenDaysAgo);
        break;
      case 'last30days':
        const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        filtered = orders.filter(order => new Date(order.createdAt) >= thirtyDaysAgo);
        break;
      case 'custom':
        // Don't filter yet — wait for user to pick dates
        return;
      case 'all':
      default:
        filtered = [...orders];
        break;
    }

    setFilteredOrders(filtered);
  };

  const applyCustomFilter = () => {
    if (customStartDate && customEndDate) {
      const filtered = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        const start = new Date(customStartDate);
        const end = new Date(customEndDate);
        end.setHours(23, 59, 59, 999);
        return orderDate >= start && orderDate <= end;
      });
      setFilteredOrders(filtered);
    }
    setShowFilterDropdown(false);
  };

  // FIX: Simplified openCalendar — sets type and opens single modal
  const openCalendar = (type: 'start' | 'end') => {
    setCalendarType(type);
    if (type === 'start' && customStartDate) {
      setCalendarDate(new Date(customStartDate));
    } else if (type === 'end' && customEndDate) {
      setCalendarDate(new Date(customEndDate));
    } else {
      setCalendarDate(new Date());
    }
    setShowCalendar(true);
  };

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const generateCalendarDays = (date: Date) => {
    const daysInMonth = getDaysInMonth(date);
    const firstDay = getFirstDayOfMonth(date);
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // FIX: renderCalendar uses single `showCalendar` state
  const renderCalendar = () => {
    const days = generateCalendarDays(calendarDate);
    const today = new Date();

    return (
      <Modal
        visible={showCalendar}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCalendar(false)}
      >
        <TouchableOpacity
          style={styles.calendarOverlay}
          activeOpacity={1}
          onPress={() => setShowCalendar(false)}
        >
          <TouchableOpacity activeOpacity={1} onPress={() => {}}>
            <View style={styles.calendarContent}>
              {/* Calendar Title */}
              <Text style={styles.calendarPickingLabel}>
                {calendarType === 'start' ? 'Select Start Date' : 'Select End Date'}
              </Text>

              {/* Calendar Header */}
              <View style={styles.calendarHeader}>
                <TouchableOpacity
                  style={styles.calendarNavButton}
                  onPress={() => {
                    const newDate = new Date(calendarDate);
                    newDate.setMonth(newDate.getMonth() - 1);
                    setCalendarDate(newDate);
                  }}
                >
                  <Text style={styles.calendarNavButtonText}>‹</Text>
                </TouchableOpacity>

                <Text style={styles.calendarTitle}>
                  {months[calendarDate.getMonth()]} {calendarDate.getFullYear()}
                </Text>

                <TouchableOpacity
                  style={styles.calendarNavButton}
                  onPress={() => {
                    const newDate = new Date(calendarDate);
                    newDate.setMonth(newDate.getMonth() + 1);
                    setCalendarDate(newDate);
                  }}
                >
                  <Text style={styles.calendarNavButtonText}>›</Text>
                </TouchableOpacity>
              </View>

              {/* Days of Week */}
              <View style={styles.daysOfWeek}>
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, index) => (
                  <Text key={index} style={styles.dayOfWeekText}>{day}</Text>
                ))}
              </View>

              {/* Calendar Days */}
              <View style={styles.calendarDays}>
                {days.map((day, index) => {
                  if (!day) {
                    return <View key={index} style={styles.calendarDay} />;
                  }

                  const thisDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day);
                  const isToday = thisDate.toDateString() === today.toDateString();
                  const selectedStr = thisDate.toISOString().split('T')[0];
                  const isSelected =
                    (calendarType === 'start' && selectedStr === customStartDate) ||
                    (calendarType === 'end' && selectedStr === customEndDate);

                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.calendarDay,
                        isToday && !isSelected && styles.calendarToday,
                        isSelected && styles.calendarSelected,
                      ]}
                      onPress={() => {
                        const formattedDate = thisDate.toISOString().split('T')[0];
                        if (calendarType === 'start') {
                          setCustomStartDate(formattedDate);
                        } else {
                          setCustomEndDate(formattedDate);
                        }
                        setShowCalendar(false);
                      }}
                    >
                      <Text style={[
                        styles.calendarDayText,
                        isToday && !isSelected && styles.calendarTodayText,
                        isSelected && styles.calendarSelectedText,
                      ]}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Footer */}
              <View style={styles.calendarFooter}>
                <TouchableOpacity
                  style={styles.calendarCancelButton}
                  onPress={() => setShowCalendar(false)}
                >
                  <Text style={styles.calendarCancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.calendarTodayButton}
                  onPress={() => {
                    const t = new Date();
                    setCalendarDate(t);
                    const formattedDate = t.toISOString().split('T')[0];
                    if (calendarType === 'start') {
                      setCustomStartDate(formattedDate);
                    } else {
                      setCustomEndDate(formattedDate);
                    }
                    setShowCalendar(false);
                  }}
                >
                  <Text style={styles.calendarTodayButtonText}>Today</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    );
  };

  const handleBack = () => onNavigate?.('home');

  const handleOrderDetailsPress = (orderId: string) => {
    if (onNavigate) onNavigate(`orderDetails:${orderId}`);
  };

  const handlePaymentScanner = (order: any) => {
    setSelectedOrder(order);
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = (method: 'qr' | 'cash') => {
    setShowPaymentModal(false);
    setSelectedOrder(null);
    fetchOrders();
  };

  const isCODPayment = (order: any) => {
    const rawMode = order?.paymentMode ?? order?.payment_type ?? order?.paymentMethod ?? order?.payment;
    const modeLower = (rawMode ?? '').toString().toLowerCase().trim();
    return (
      modeLower === 'cod' ||
      modeLower === 'cash on delivery' ||
      modeLower === 'cash_on_delivery' ||
      (modeLower.includes('cash') && modeLower.includes('delivery'))
    );
  };

  const getOrderField = (order: any, field: string, fallback: any = 'N/A') =>
    order[field] || fallback;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return '#086B48';
      case 'shipped': return '#3B82F6';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getFilterLabel = () => {
    switch (selectedFilter) {
      case 'last7days': return 'Last 7 days';
      case 'last30days': return 'Last 30 days';
      case 'custom':
        if (customStartDate && customEndDate) {
          return `${customStartDate} → ${customEndDate}`;
        }
        return 'Custom Range';
      default: return 'All Orders';
    }
  };

  return (
    <View style={styles.container}>
      <GlobalHeader title="Order History" onBack={handleBack} showBackButton />

      {/* Search + Filter Row */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Image source={require('../../images/search.png')} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for Order"
            placeholderTextColor="#086B48"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <TouchableOpacity
          style={[styles.filterBtn, showFilterDropdown && styles.filterBtnActive]}
          onPress={() => setShowFilterDropdown(!showFilterDropdown)}
        >
          <Image source={require('../../images/filter.png')} style={styles.filterIcon} />
        </TouchableOpacity>
      </View>

      {/* Active filter chip */}
      {selectedFilter !== 'all' && (
        <View style={styles.activeFilterRow}>
          <View style={styles.activeFilterChip}>
            <Text style={styles.activeFilterText}>{getFilterLabel()}</Text>
            <TouchableOpacity onPress={() => { setSelectedFilter('all'); setFilteredOrders(orders); setCustomStartDate(''); setCustomEndDate(''); }}>
              <Text style={styles.activeFilterClear}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Filter Dropdown */}
      {showFilterDropdown && (
        <View style={styles.filterDropdown}>
          {['last7days', 'last30days', 'custom', 'all'].map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[styles.filterOption, selectedFilter === opt && styles.filterOptionActive]}
              onPress={() => applyFilter(opt)}
            >
              <Text style={[styles.filterOptionText, selectedFilter === opt && styles.filterOptionTextActive]}>
                {opt === 'last7days' ? 'Last 7 days' :
                  opt === 'last30days' ? 'Last 30 days' :
                  opt === 'custom' ? 'Custom Range' : 'All Orders'}
              </Text>
              {selectedFilter === opt && <Text style={styles.filterCheckmark}>✓</Text>}
            </TouchableOpacity>
          ))}

          {/* Custom Date Picker */}
          {selectedFilter === 'custom' && (
            <View style={styles.customDateContainer}>
              <Text style={styles.customDateLabel}>Select Date Range</Text>

              <View style={styles.datePickerRow}>
                <TouchableOpacity
                  style={[styles.dateInputButton, customStartDate ? styles.dateInputButtonFilled : null]}
                  onPress={() => openCalendar('start')}
                >
                  <Text style={styles.dateInputLabel}>From</Text>
                  <Text style={[styles.dateInputText, customStartDate ? styles.dateInputTextFilled : null]}>
                    {customStartDate ? new Date(customStartDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Start Date'}
                  </Text>
                </TouchableOpacity>

                <View style={styles.dateArrow}>
                  <Text style={styles.dateArrowText}>→</Text>
                </View>

                <TouchableOpacity
                  style={[styles.dateInputButton, customEndDate ? styles.dateInputButtonFilled : null]}
                  onPress={() => openCalendar('end')}
                >
                  <Text style={styles.dateInputLabel}>To</Text>
                  <Text style={[styles.dateInputText, customEndDate ? styles.dateInputTextFilled : null]}>
                    {customEndDate ? new Date(customEndDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'End Date'}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.applyCustomFilterBtn, (!customStartDate || !customEndDate) && styles.applyCustomFilterBtnDisabled]}
                onPress={applyCustomFilter}
                disabled={!customStartDate || !customEndDate}
              >
                <Text style={styles.applyCustomFilterText}>Apply Filter</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* Orders List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#086B48" />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      ) : filteredOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No orders found</Text>
        </View>
      ) : (
        <ScrollView style={styles.ordersList} showsVerticalScrollIndicator={false}>
          {filteredOrders.map((order) => (
            <View key={order._id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View style={styles.orderInfoContainer}>
                  <Text style={styles.orderId}>Order #{order.orderId || order.bookingId || order._id}</Text>
                  <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(normalizeStatus(order)) }]}>
                  <Text style={styles.statusText}>{normalizeStatus(order)}</Text>
                </View>
              </View>

              <View style={styles.summaryRow}>
                <View>
                  <Text style={styles.label}>Order Value</Text>
                  <Text style={styles.value}>₹{getOrderField(order, 'totalAmount') || getOrderField(order, 'grandTotal') || 0}</Text>

                  <Text style={styles.label}>Payment Mode</Text>
                  <Text style={styles.value}>
                    {getOrderField(order, 'paymentMode', '').toString().toUpperCase() || 'N/A'}
                  </Text>

                  <Text style={styles.label}>Total Items</Text>
                  <Text style={styles.value}>
                    {order.products?.length || getOrderField(order, 'totalItems') || 0}
                  </Text>
                </View>

                <View style={styles.chevronWrap}>
                  <TouchableOpacity
                    onPress={() => handleOrderDetailsPress(order._id || order.orderId || order.bookingId)}
                  >
                    <Image source={require('../../images/drop.png')} style={styles.chevron} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />

      {/* Calendar Modal */}
      {renderCalendar()}

      {/* Payment Modal */}
      {selectedOrder && (
        <PaymentModal
          visible={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedOrder(null);
          }}
          orderId={selectedOrder._id || selectedOrder.orderId || selectedOrder.bookingId}
          orderAmount={selectedOrder.totalAmount || selectedOrder.grandTotal || 0}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </View>
  );
};

export default OrderHistoryScreen;