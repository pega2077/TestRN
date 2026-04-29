import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import CustomerCard, { Customer } from '../components/CustomerCard';

const mockCustomers: Customer[] = [
  { id: '1', name: '张三', company: '阿里巴巴', tags: ['VIP客户'], lastContact: '2024-01-15', phone: '138****1234' },
  { id: '2', name: '李四', company: '腾讯', tags: ['潜在客户'], lastContact: '2024-01-10', phone: '139****5678' },
  { id: '3', name: '王五', company: '字节跳动', tags: ['合作中'], lastContact: '2024-01-08', phone: '137****9012' },
  { id: '4', name: '赵六', company: '美团', tags: ['VIP客户', '合作中'], lastContact: '2024-01-05', phone: '136****3456' },
  { id: '5', name: '孙七', company: '京东', tags: ['潜在客户'], lastContact: '2024-01-03', phone: '135****7890' },
  { id: '6', name: '周八', company: '拼多多', tags: ['已流失'], lastContact: '2023-12-28', phone: '134****2345' },
  { id: '7', name: '吴九', company: '网易', tags: ['合作中'], lastContact: '2023-12-20', phone: '133****6789' },
  { id: '8', name: '郑十', company: '百度', tags: ['VIP客户'], lastContact: '2023-12-18', phone: '132****1122' },
];

const FILTERS = ['全部', 'VIP客户', '潜在客户', '合作中', '已流失'];

export default function CustomerScreen() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('全部');

  const filtered = mockCustomers.filter((c) => {
    const matchFilter = activeFilter === '全部' || c.tags.includes(activeFilter);
    const matchSearch =
      search === '' ||
      c.name.includes(search) ||
      c.company.includes(search) ||
      c.phone.includes(search);
    return matchFilter && matchSearch;
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header title="客户管理" rightIcon="person-add-outline" />

      {/* Search Bar */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color="#8E8E93" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="搜索客户姓名、公司、电话"
            placeholderTextColor="#C7C7CC"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} activeOpacity={0.7}>
              <Ionicons name="close-circle" size={18} color="#C7C7CC" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterBar}
        contentContainerStyle={styles.filterContent}
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, activeFilter === f && styles.filterBtnActive]}
            onPress={() => setActiveFilter(f)}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Count */}
      <Text style={styles.count}>共 {filtered.length} 位客户</Text>

      {/* List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {filtered.map((c) => (
          <CustomerCard key={c.id} customer={c} />
        ))}
        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="people-outline" size={48} color="#C7C7CC" />
            <Text style={styles.emptyText}>暂无匹配客户</Text>
          </View>
        )}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.85}>
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  searchWrap: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
  },
  searchIcon: { marginRight: 6 },
  searchInput: { flex: 1, fontSize: 14, color: '#1A1A1A' },
  filterBar: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    flexGrow: 0,
  },
  filterContent: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F5F7FA',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  filterBtnActive: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  filterText: {
    fontSize: 13,
    color: '#555',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  count: {
    fontSize: 12,
    color: '#8E8E93',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  list: {
    paddingTop: 4,
    paddingBottom: 80,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 14,
    color: '#C7C7CC',
    marginTop: 12,
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
