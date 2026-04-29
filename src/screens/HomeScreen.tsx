import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Icon from '../components/Icon';
import Header from '../components/Header';
import { useAppContext } from '../context/AppContext';
import { RootStackParamList } from '../navigation/types';

const summaryCards = [
  { label: '总客户数', dataKey: 'customers', icon: 'people', color: '#4A90E2', bg: '#EBF4FF' },
  { label: '本月成交', value: '14', icon: 'checkmark-circle', color: '#34C759', bg: '#E8F8EC' },
  { label: '待跟进', value: '23', icon: 'time', color: '#FF9500', bg: '#FFF4E6' },
  { label: '销售额', value: '¥86K', icon: 'trending-up', color: '#AF52DE', bg: '#F5EEFF' },
] as const;

const contactTypeIcon: Record<string, string> = {
  call: 'call', email: 'mail', visit: 'walk', chat: 'chatbubbles',
};
const contactTypeColor: Record<string, string> = {
  call: '#4A90E2', email: '#34C759', visit: '#FF9500', chat: '#AF52DE',
};

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { customers, contacts } = useAppContext();

  const quickActions = [
    { label: '添加客户', icon: 'person-add', color: '#4A90E2', onPress: () => navigation.navigate('CustomerForm', {}) },
    { label: '记录联系', icon: 'chatbubble', color: '#34C759', onPress: () => navigation.navigate('ContactForm', {}) },
    { label: '新增销售', icon: 'cart', color: '#FF9500', onPress: () => navigation.navigate('SalesForm', {}) },
    { label: '添加日程', icon: 'calendar', color: '#AF52DE', onPress: () => navigation.navigate('ScheduleForm', {}) },
  ];

  // Show most recent 4 contact records
  const recentContacts = contacts.slice(0, 4);

  const getSummaryValue = (card: typeof summaryCards[number]) => {
    if ('dataKey' in card && card.dataKey === 'customers') return String(customers.length);
    return 'value' in card ? card.value : '';
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="客户管理" rightIcon="notifications-outline" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Greeting */}
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>你好，销售经理 👋</Text>
          <Text style={styles.greetingDate}>{new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</Text>
        </View>

        {/* Summary Cards */}
        <View style={styles.cardsGrid}>
          {summaryCards.map((c) => (
            <View key={c.label} style={[styles.summaryCard, { shadowColor: c.color }]}>
              <View style={[styles.iconWrap, { backgroundColor: c.bg }]}>
                <Icon name={c.icon} size={20} color={c.color} />
              </View>
              <Text style={styles.summaryValue}>{getSummaryValue(c)}</Text>
              <Text style={styles.summaryLabel}>{c.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>快捷操作</Text>
          <View style={styles.quickRow}>
            {quickActions.map((a) => (
              <TouchableOpacity key={a.label} style={styles.quickBtn} activeOpacity={0.7} onPress={a.onPress}>
                <View style={[styles.quickIcon, { backgroundColor: a.color + '20' }]}>
                  <Icon name={a.icon} size={22} color={a.color} />
                </View>
                <Text style={styles.quickLabel}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Contacts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>今日联系记录</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('ContactForm', {})}>
              <Text style={styles.viewAll}>+ 新增</Text>
            </TouchableOpacity>
          </View>
          {recentContacts.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>暂无联系记录，点击右上角新增</Text>
            </View>
          ) : (
            recentContacts.map((item) => {
              const iconName = contactTypeIcon[item.type] ?? 'chatbubbles';
              const iconColor = contactTypeColor[item.type] ?? '#4A90E2';
              return (
                <View key={item.id} style={styles.contactItem}>
                  <View style={[styles.contactIcon, { backgroundColor: iconColor + '20' }]}>
                    <Icon name={iconName} size={16} color={iconColor} />
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactName}>{item.customer}</Text>
                    <Text style={styles.contactCompany}>{item.company} · {item.type}</Text>
                  </View>
                  <Text style={styles.contactTime}>{item.date}</Text>
                </View>
              );
            })
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  scroll: { paddingBottom: 24 },
  greeting: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  greetingText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  greetingDate: {
    fontSize: 13,
    color: '#888',
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    gap: 10,
    marginBottom: 4,
  },
  summaryCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#888',
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  viewAll: {
    fontSize: 13,
    color: '#4A90E2',
  },
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickBtn: {
    alignItems: 'center',
    width: '22%',
  },
  quickIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickLabel: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },
  contactItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  contactIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  contactCompany: {
    fontSize: 12,
    color: '#888',
  },
  contactTime: {
    fontSize: 12,
    color: '#C7C7CC',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  emptyText: { fontSize: 13, color: '#C7C7CC' },
});
