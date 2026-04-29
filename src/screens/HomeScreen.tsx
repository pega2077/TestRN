import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header';

const summaryCards = [
  { label: '总客户数', value: '128', icon: 'people' as const, color: '#4A90E2', bg: '#EBF4FF' },
  { label: '本月成交', value: '14', icon: 'checkmark-circle' as const, color: '#34C759', bg: '#E8F8EC' },
  { label: '待跟进', value: '23', icon: 'time' as const, color: '#FF9500', bg: '#FFF4E6' },
  { label: '销售额', value: '¥86K', icon: 'trending-up' as const, color: '#AF52DE', bg: '#F5EEFF' },
];

const recentContacts = [
  { id: '1', name: '张三', company: '阿里巴巴', action: '电话沟通', time: '10:30', type: 'call' },
  { id: '2', name: '李四', company: '腾讯', action: '邮件跟进', time: '09:15', type: 'email' },
  { id: '3', name: '王五', company: '字节跳动', action: '线下拜访', time: '昨天', type: 'visit' },
  { id: '4', name: '赵六', company: '美团', action: '微信沟通', time: '昨天', type: 'chat' },
];

const quickActions = [
  { label: '添加客户', icon: 'person-add' as const, color: '#4A90E2' },
  { label: '记录联系', icon: 'chatbubble' as const, color: '#34C759' },
  { label: '新增销售', icon: 'cart' as const, color: '#FF9500' },
  { label: '添加日程', icon: 'calendar' as const, color: '#AF52DE' },
];

const contactTypeIcon: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
  call: 'call',
  email: 'mail',
  visit: 'walk',
  chat: 'chatbubbles',
};
const contactTypeColor: Record<string, string> = {
  call: '#4A90E2',
  email: '#34C759',
  visit: '#FF9500',
  chat: '#AF52DE',
};

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="客户管理" rightIcon="notifications-outline" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Greeting */}
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>你好，销售经理 👋</Text>
          <Text style={styles.greetingDate}>2024年1月16日 星期二</Text>
        </View>

        {/* Summary Cards */}
        <View style={styles.cardsGrid}>
          {summaryCards.map((c) => (
            <View key={c.label} style={[styles.summaryCard, { shadowColor: c.color }]}>
              <View style={[styles.iconWrap, { backgroundColor: c.bg }]}>
                <Ionicons name={c.icon} size={22} color={c.color} />
              </View>
              <Text style={styles.summaryValue}>{c.value}</Text>
              <Text style={styles.summaryLabel}>{c.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>快捷操作</Text>
          <View style={styles.quickRow}>
            {quickActions.map((a) => (
              <TouchableOpacity key={a.label} style={styles.quickBtn} activeOpacity={0.7}>
                <View style={[styles.quickIcon, { backgroundColor: a.color + '20' }]}>
                  <Ionicons name={a.icon} size={22} color={a.color} />
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
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.viewAll}>查看全部</Text>
            </TouchableOpacity>
          </View>
          {recentContacts.map((item) => (
            <View key={item.id} style={styles.contactItem}>
              <View style={[styles.contactIcon, { backgroundColor: (contactTypeColor[item.type] ?? '#4A90E2') + '20' }]}>
                <Ionicons
                  name={contactTypeIcon[item.type] ?? 'ellipse'}
                  size={16}
                  color={contactTypeColor[item.type] ?? '#4A90E2'}
                />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{item.name}</Text>
                <Text style={styles.contactCompany}>{item.company} · {item.action}</Text>
              </View>
              <Text style={styles.contactTime}>{item.time}</Text>
            </View>
          ))}
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
});
