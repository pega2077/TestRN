import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Icon from '../components/Icon';
import Header from '../components/Header';
import { useAppContext } from '../context/AppContext';
import { RootStackParamList } from '../navigation/types';
import { ContactRecord } from '../types';

const TYPE_FILTERS = ['全部', '电话', '邮件', '会议', '拜访'];
const TYPE_ICONS: Record<string, string> = {
  电话: 'call', 邮件: 'mail', 会议: 'people', 拜访: 'walk',
};
const TYPE_COLORS: Record<string, string> = {
  电话: '#4A90E2', 邮件: '#34C759', 会议: '#AF52DE', 拜访: '#FF9500',
};

export default function ContactScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { contacts, deleteContact } = useAppContext();
  const [activeFilter, setActiveFilter] = useState('全部');

  const displayed =
    activeFilter === '全部'
      ? contacts
      : contacts.filter((c) => c.type === activeFilter);

  const handleLongPress = (item: ContactRecord) => {
    Alert.alert(item.customer, `${item.type} · ${item.date}`, [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: () => deleteContact(item.id),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="联系记录"
        rightIcon="add-outline"
        onRightPress={() => navigation.navigate('ContactForm', {})}
      />

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
        <Text style={styles.count}>共 {displayed.length} 条记录（长按删除）</Text>
        {displayed.length === 0 && (
          <View style={styles.empty}>
            <Icon name="chatbubbles" size={40} color="#C7C7CC" />
            <Text style={styles.emptyText}>暂无联系记录</Text>
          </View>
        )}
        {displayed.map((item) => {
          const icon = TYPE_ICONS[item.type] ?? 'chatbubble';
          const color = TYPE_COLORS[item.type] ?? '#4A90E2';
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              activeOpacity={0.75}
              onLongPress={() => handleLongPress(item)}
            >
              <View style={styles.cardLeft}>
                <View style={[styles.typeIcon, { backgroundColor: color + '20' }]}>
                  <Icon name={icon} size={18} color={color} />
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
                  <Icon name="calendar-outline" size={12} color="#AAAAAA" />
                  <Text style={styles.metaText}>{item.date}</Text>
                  {item.duration ? (
                    <>
                      <View style={styles.metaDot} />
                      <Icon name="time-outline" size={12} color="#AAAAAA" />
                      <Text style={styles.metaText}>{item.duration}</Text>
                    </>
                  ) : null}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('ContactForm', {})}
      >
        <Icon name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  filterBar: {
    flexDirection: 'row', backgroundColor: '#FFFFFF',
    paddingHorizontal: 12, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: '#E5E5EA',
  },
  filterBtn: {
    flex: 1, paddingVertical: 7, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#F5F7FA',
  },
  filterBtnActive: { backgroundColor: '#4A90E2' },
  filterText: { fontSize: 13, color: '#555', fontWeight: '500' },
  filterTextActive: { color: '#FFFFFF' },
  list: { paddingTop: 4, paddingHorizontal: 16, paddingBottom: 80 },
  count: { fontSize: 12, color: '#8E8E93', paddingVertical: 8 },
  empty: { alignItems: 'center', paddingVertical: 48, gap: 10 },
  emptyText: { fontSize: 14, color: '#C7C7CC' },
  card: { flexDirection: 'row', marginBottom: 10 },
  cardLeft: { alignItems: 'center', marginRight: 12, paddingTop: 14 },
  typeIcon: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  timeline: { flex: 1, alignItems: 'center', paddingTop: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, marginBottom: 4 },
  line: { width: 1, flex: 1, backgroundColor: '#E5E5EA' },
  cardBody: {
    flex: 1, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, marginBottom: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 3, elevation: 1,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 6 },
  customerName: { fontSize: 14, fontWeight: '600', color: '#1A1A1A' },
  company: { flex: 1, fontSize: 12, color: '#888' },
  typeBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  typeText: { fontSize: 11, fontWeight: '600' },
  summary: { fontSize: 13, color: '#555', lineHeight: 18, marginBottom: 8 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 11, color: '#AAAAAA' },
  metaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#D0D0D0', marginHorizontal: 2 },
  fab: {
    position: 'absolute', right: 20, bottom: 20,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#4A90E2',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#4A90E2', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 8, elevation: 6,
  },
});
