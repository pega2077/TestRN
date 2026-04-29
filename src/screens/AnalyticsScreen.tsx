import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';

const { width } = Dimensions.get('window');

const PERIODS = ['本周', '本月', '本季度', '今年'];

const kpiData = [
  { label: '新增客户', value: '18', change: '+12%', up: true, icon: 'person-add' as const, color: '#4A90E2' },
  { label: '成交率', value: '34%', change: '+5%', up: true, icon: 'checkmark-done' as const, color: '#34C759' },
  { label: '平均成交周期', value: '21天', change: '-3天', up: true, icon: 'timer' as const, color: '#FF9500' },
  { label: '客户流失率', value: '8%', change: '-2%', up: true, icon: 'trending-down' as const, color: '#FF3B30' },
];

const barData = [
  { label: '1月', value: 86 },
  { label: '2月', value: 64 },
  { label: '3月', value: 110 },
  { label: '4月', value: 75 },
  { label: '5月', value: 95 },
  { label: '6月', value: 130 },
];
const maxBar = Math.max(...barData.map((d) => d.value));

const sourceData = [
  { label: '线上推广', value: 38, color: '#4A90E2' },
  { label: '客户转介', value: 27, color: '#34C759' },
  { label: '展会活动', value: 19, color: '#FF9500' },
  { label: '冷拜访', value: 16, color: '#AF52DE' },
];

const topCustomers = [
  { name: '阿里巴巴', amount: '¥200,000', deals: 5 },
  { name: '腾讯', amount: '¥150,000', deals: 4 },
  { name: '字节跳动', amount: '¥95,000', deals: 3 },
  { name: '美团', amount: '¥80,000', deals: 3 },
  { name: '百度', amount: '¥65,000', deals: 2 },
];

export default function AnalyticsScreen() {
  const [period, setPeriod] = useState('本月');

  return (
    <SafeAreaView style={styles.container}>
      <Header title="数据分析" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Period Selector */}
        <View style={styles.periodBar}>
          {PERIODS.map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.periodBtn, period === p && styles.periodBtnActive]}
              onPress={() => setPeriod(p)}
              activeOpacity={0.7}
            >
              <Text style={[styles.periodText, period === p && styles.periodTextActive]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* KPI Cards */}
        <View style={styles.kpiGrid}>
          {kpiData.map((k) => (
            <View key={k.label} style={styles.kpiCard}>
              <View style={[styles.kpiIcon, { backgroundColor: k.color + '20' }]}>
                <Ionicons name={k.icon} size={18} color={k.color} />
              </View>
              <Text style={styles.kpiValue}>{k.value}</Text>
              <Text style={styles.kpiLabel}>{k.label}</Text>
              <View style={styles.kpiChange}>
                <Ionicons
                  name={k.up ? 'arrow-up' : 'arrow-down'}
                  size={10}
                  color={k.up ? '#34C759' : '#FF3B30'}
                />
                <Text style={[styles.kpiChangeText, { color: k.up ? '#34C759' : '#FF3B30' }]}>
                  {k.change}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Bar Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>销售额趋势（万元）</Text>
          <View style={styles.barChart}>
            {barData.map((d) => (
              <View key={d.label} style={styles.barWrap}>
                <Text style={styles.barValue}>{d.value}</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { height: `${(d.value / maxBar) * 100}%` as any }]} />
                </View>
                <Text style={styles.barLabel}>{d.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Source Pie-like */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>客户来源分布</Text>
          <View style={styles.sourceList}>
            {sourceData.map((s) => (
              <View key={s.label} style={styles.sourceItem}>
                <View style={styles.sourceLeft}>
                  <View style={[styles.sourceDot, { backgroundColor: s.color }]} />
                  <Text style={styles.sourceLabel}>{s.label}</Text>
                </View>
                <View style={styles.sourceBarWrap}>
                  <View style={[styles.sourceBarFill, { width: `${s.value}%` as any, backgroundColor: s.color }]} />
                </View>
                <Text style={styles.sourcePercent}>{s.value}%</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Top Customers */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>客户贡献排行</Text>
          {topCustomers.map((c, i) => (
            <View key={c.name} style={styles.rankRow}>
              <Text style={[styles.rankNum, i < 3 && styles.rankNumTop]}>{i + 1}</Text>
              <Text style={styles.rankName}>{c.name}</Text>
              <Text style={styles.rankDeals}>{c.deals} 笔</Text>
              <Text style={styles.rankAmount}>{c.amount}</Text>
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
  periodBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    gap: 8,
  },
  periodBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  periodBtnActive: { backgroundColor: '#4A90E2' },
  periodText: { fontSize: 13, color: '#555', fontWeight: '500' },
  periodTextActive: { color: '#FFFFFF' },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    paddingTop: 16,
    gap: 10,
  },
  kpiCard: {
    width: (width - 40) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  kpiIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  kpiLabel: { fontSize: 12, color: '#888', marginBottom: 4 },
  kpiChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  kpiChangeText: { fontSize: 11, fontWeight: '600' },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 140,
    gap: 8,
  },
  barWrap: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barValue: { fontSize: 10, color: '#888', marginBottom: 4 },
  barTrack: {
    width: '60%',
    height: 100,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 4,
  },
  barLabel: { fontSize: 10, color: '#888', marginTop: 4 },
  sourceList: { gap: 12 },
  sourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sourceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
    gap: 6,
  },
  sourceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sourceLabel: { fontSize: 13, color: '#555' },
  sourceBarWrap: {
    flex: 1,
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  sourceBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  sourcePercent: { fontSize: 12, color: '#888', width: 32, textAlign: 'right' },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    gap: 10,
  },
  rankNum: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E9ECEF',
    textAlign: 'center',
    lineHeight: 22,
    fontSize: 12,
    fontWeight: '700',
    color: '#666',
  },
  rankNumTop: {
    backgroundColor: '#4A90E2',
    color: '#FFFFFF',
  },
  rankName: { flex: 1, fontSize: 14, fontWeight: '600', color: '#1A1A1A' },
  rankDeals: { fontSize: 12, color: '#888' },
  rankAmount: { fontSize: 14, fontWeight: '700', color: '#4A90E2', marginLeft: 8 },
});
