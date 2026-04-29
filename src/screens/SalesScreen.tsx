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

interface Opportunity {
  id: string;
  title: string;
  customer: string;
  amount: string;
  stage: string;
  probability: number;
  dueDate: string;
}

const STAGES = ['线索', '意向', '报价', '谈判', '成交'];
const STAGE_COLORS: Record<string, { bg: string; text: string }> = {
  线索: { bg: '#E9ECEF', text: '#495057' },
  意向: { bg: '#D1ECF1', text: '#0C5460' },
  报价: { bg: '#FFF3CD', text: '#856404' },
  谈判: { bg: '#FCE8D8', text: '#7D3C00' },
  成交: { bg: '#D4EDDA', text: '#155724' },
};

const mockOpportunities: Opportunity[] = [
  { id: '1', title: '云服务年度合同', customer: '阿里巴巴·张三', amount: '¥120,000', stage: '谈判', probability: 80, dueDate: '2024-01-31' },
  { id: '2', title: 'ERP系统实施', customer: '腾讯·李四', amount: '¥85,000', stage: '报价', probability: 60, dueDate: '2024-02-15' },
  { id: '3', title: '数据安全方案', customer: '字节跳动·王五', amount: '¥45,000', stage: '意向', probability: 40, dueDate: '2024-02-28' },
  { id: '4', title: 'SaaS平台授权', customer: '美团·赵六', amount: '¥200,000', stage: '成交', probability: 100, dueDate: '2024-01-10' },
  { id: '5', title: '网络安全审计', customer: '京东·孙七', amount: '¥30,000', stage: '线索', probability: 20, dueDate: '2024-03-10' },
  { id: '6', title: 'BI数据分析平台', customer: '百度·郑十', amount: '¥95,000', stage: '意向', probability: 45, dueDate: '2024-02-20' },
];

const stageSummary = STAGES.map((s) => ({
  stage: s,
  count: mockOpportunities.filter((o) => o.stage === s).length,
  total: mockOpportunities
    .filter((o) => o.stage === s)
    .reduce((sum, o) => sum + Number(o.amount.replace(/[¥,]/g, '')), 0),
}));

export default function SalesScreen() {
  const [activeStage, setActiveStage] = useState('全部');

  const displayed =
    activeStage === '全部'
      ? mockOpportunities
      : mockOpportunities.filter((o) => o.stage === activeStage);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="销售管理" rightIcon="add-circle-outline" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>¥575K</Text>
            <Text style={styles.statLabel}>管道总金额</Text>
          </View>
          <View style={[styles.statCard, styles.statCardMid]}>
            <Text style={styles.statValue}>6</Text>
            <Text style={styles.statLabel}>进行中商机</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>¥200K</Text>
            <Text style={styles.statLabel}>本月成交额</Text>
          </View>
        </View>

        {/* Funnel */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>销售漏斗</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.funnelRow}
          >
            <TouchableOpacity
              style={[styles.funnelStage, activeStage === '全部' && styles.funnelStageActive]}
              onPress={() => setActiveStage('全部')}
              activeOpacity={0.7}
            >
              <Text style={[styles.funnelStageName, activeStage === '全部' && styles.funnelStageNameActive]}>全部</Text>
              <Text style={[styles.funnelCount, activeStage === '全部' && styles.funnelCountActive]}>
                {mockOpportunities.length}
              </Text>
            </TouchableOpacity>
            {stageSummary.map(({ stage, count }) => (
              <TouchableOpacity
                key={stage}
                style={[styles.funnelStage, activeStage === stage && styles.funnelStageActive]}
                onPress={() => setActiveStage(stage)}
                activeOpacity={0.7}
              >
                <Text style={[styles.funnelStageName, activeStage === stage && styles.funnelStageNameActive]}>
                  {stage}
                </Text>
                <Text style={[styles.funnelCount, activeStage === stage && styles.funnelCountActive]}>
                  {count}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Opportunity List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>商机列表 ({displayed.length})</Text>
          {displayed.map((opp) => {
            const colors = STAGE_COLORS[opp.stage] ?? { bg: '#E9ECEF', text: '#495057' };
            return (
              <TouchableOpacity key={opp.id} style={styles.oppCard} activeOpacity={0.75}>
                <View style={styles.oppHeader}>
                  <Text style={styles.oppTitle} numberOfLines={1}>{opp.title}</Text>
                  <View style={[styles.stageBadge, { backgroundColor: colors.bg }]}>
                    <Text style={[styles.stageBadgeText, { color: colors.text }]}>{opp.stage}</Text>
                  </View>
                </View>

                <Text style={styles.oppCustomer}>
                  <Ionicons name="person-outline" size={12} color="#888" /> {opp.customer}
                </Text>

                <View style={styles.oppFooter}>
                  <Text style={styles.oppAmount}>{opp.amount}</Text>
                  <View style={styles.probWrap}>
                    <View style={styles.probBar}>
                      <View style={[styles.probFill, { width: `${opp.probability}%` as any }]} />
                    </View>
                    <Text style={styles.probText}>{opp.probability}%</Text>
                  </View>
                  <Text style={styles.oppDue}>截止 {opp.dueDate}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  scroll: { paddingBottom: 24 },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#4A90E2',
    padding: 16,
    gap: 1,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  statCardMid: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  funnelRow: {
    gap: 8,
    paddingBottom: 4,
  },
  funnelStage: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    minWidth: 64,
  },
  funnelStageActive: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  funnelStageName: {
    fontSize: 13,
    color: '#555',
    fontWeight: '500',
    marginBottom: 2,
  },
  funnelStageNameActive: { color: '#FFFFFF' },
  funnelCount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  funnelCountActive: { color: '#FFFFFF' },
  oppCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  oppHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  oppTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginRight: 8,
  },
  stageBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  stageBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  oppCustomer: {
    fontSize: 13,
    color: '#666',
    marginBottom: 10,
  },
  oppFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  oppAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4A90E2',
    marginRight: 4,
  },
  probWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  probBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#E5E5EA',
    borderRadius: 2,
    overflow: 'hidden',
  },
  probFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 2,
  },
  probText: {
    fontSize: 11,
    color: '#888',
    minWidth: 30,
  },
  oppDue: {
    fontSize: 11,
    color: '#AAAAAA',
  },
});
