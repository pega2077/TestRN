import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';

interface ContactRecord {
  id: string;
  customer: string;
  company: string;
  type: string;
  summary: string;
  date: string;
  duration?: string;
}

const TYPE_FILTERS = ['全部', '电话', '邮件', '会议', '拜访'];
const TYPE_ICONS: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
  电话: 'call',
  邮件: 'mail',
  会议: 'people',
  拜访: 'walk',
};
const TYPE_COLORS: Record<string, string> = {
  电话: '#4A90E2',
  邮件: '#34C759',
  会议: '#AF52DE',
  拜访: '#FF9500',
};

const mockContacts: ContactRecord[] = [
  { id: '1', customer: '张三', company: '阿里巴巴', type: '电话', summary: '讨论了Q1合同续签事宜，客户表示需要本月内完成签约', date: '2024-01-15', duration: '25分钟' },
  { id: '2', customer: '李四', company: '腾讯', type: '邮件', summary: '发送了产品报价单和技术规格说明，等待客户反馈', date: '2024-01-14', duration: undefined },
  { id: '3', customer: '王五', company: '字节跳动', type: '会议', summary: '线上演示新版本功能，客户对数据分析模块印象深刻', date: '2024-01-12', duration: '1小时' },
  { id: '4', customer: '赵六', company: '美团', type: '拜访', summary: '拜访客户公司，与技术团队确认了集成方案', date: '2024-01-10', duration: '2小时' },
  { id: '5', customer: '孙七', company: '京东', type: '电话', summary: '初步了解客户需求，安排下周产品演示', date: '2024-01-09', duration: '15分钟' },
  { id: '6', customer: '郑十', company: '百度', type: '会议', summary: '项目启动会，确认项目范围、时间表和关键联系人', date: '2024-01-08', duration: '3小时' },
  { id: '7', customer: '周八', company: '拼多多', type: '邮件', summary: '发送续约通知和优惠方案，对方未回复', date: '2024-01-05', duration: undefined },
];

export default function ContactScreen() {
  const [activeFilter, setActiveFilter] = useState('全部');

  const displayed =
    activeFilter === '全部'
      ? mockContacts
      : mockContacts.filter((c) => c.type === activeFilter);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="联系记录" rightIcon="add-outline" />

      {/* Filter Tabs */}
      <View style={styles.filterBar}>
        {TYPE_FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, activeFilter === f && styles.filterBtnActive]}
            onPress={() => setActiveFilter(f)}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        <Text style={styles.count}>共 {displayed.length} 条记录</Text>
        {displayed.map((item) => {
          const icon = TYPE_ICONS[item.type] ?? 'chatbubble';
          const color = TYPE_COLORS[item.type] ?? '#4A90E2';
          return (
            <TouchableOpacity key={item.id} style={styles.card} activeOpacity={0.75}>
              <View style={styles.cardLeft}>
                <View style={[styles.typeIcon, { backgroundColor: color + '20' }]}>
                  <Ionicons name={icon} size={18} color={color} />
                </View>
                <View style={styles.timeline}>
                  <View style={[styles.dot, { backgroundColor: color }]} />
                  <View style={styles.line} />
                </View>
              </View>
              <View style={styles.cardBody}>
                <View style={styles.cardHeader}>
                  <Text style={styles.customerName}>{item.customer}</Text>
                  <Text style={styles.company}>{item.company}</Text>
                  <View style={[styles.typeBadge, { backgroundColor: color + '20' }]}>
                    <Text style={[styles.typeText, { color }]}>{item.type}</Text>
                  </View>
                </View>
                <Text style={styles.summary} numberOfLines={2}>{item.summary}</Text>
                <View style={styles.meta}>
                  <Ionicons name="calendar-outline" size={12} color="#AAAAAA" />
                  <Text style={styles.metaText}>{item.date}</Text>
                  {item.duration && (
                    <>
                      <View style={styles.metaDot} />
                      <Ionicons name="time-outline" size={12} color="#AAAAAA" />
                      <Text style={styles.metaText}>{item.duration}</Text>
                    </>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <TouchableOpacity style={styles.fab} activeOpacity={0.85}>
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  filterBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    gap: 8,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  filterBtnActive: { backgroundColor: '#4A90E2' },
  filterText: { fontSize: 13, color: '#555', fontWeight: '500' },
  filterTextActive: { color: '#FFFFFF' },
  list: { paddingTop: 4, paddingHorizontal: 16, paddingBottom: 80 },
  count: { fontSize: 12, color: '#8E8E93', paddingVertical: 8 },
  card: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  cardLeft: {
    alignItems: 'center',
    marginRight: 12,
    paddingTop: 14,
  },
  typeIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeline: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginBottom: 4,
  },
  line: {
    width: 1,
    flex: 1,
    backgroundColor: '#E5E5EA',
  },
  cardBody: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  company: {
    flex: 1,
    fontSize: 12,
    color: '#888',
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  summary: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
    marginBottom: 8,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: { fontSize: 11, color: '#AAAAAA' },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#D0D0D0',
    marginHorizontal: 2,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
});
