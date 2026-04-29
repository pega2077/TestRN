import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import Header from '../components/Header';
import Icon from '../components/Icon';
import { useAppContext } from '../context/AppContext';

type RouteProps = RouteProp<RootStackParamList, 'CustomerDetail'>;

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  VIP客户: { bg: '#FFF3CD', text: '#856404' },
  潜在客户: { bg: '#D1ECF1', text: '#0C5460' },
  合作中: { bg: '#D4EDDA', text: '#155724' },
  已流失: { bg: '#F8D7DA', text: '#721C24' },
};

const TYPE_COLORS: Record<string, string> = {
  电话: '#4A90E2', 邮件: '#34C759', 会议: '#AF52DE', 拜访: '#FF9500',
};

export default function CustomerDetailScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProps>();
  const { customerId } = route.params;
  const { customers, contacts, deleteCustomer } = useAppContext();

  const customer = customers.find(c => c.id === customerId);

  if (!customer) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="客户详情" showBack onBack={() => navigation.goBack()} />
        <View style={styles.centered}>
          <Text style={styles.emptyText}>客户不存在</Text>
        </View>
      </SafeAreaView>
    );
  }

  const customerContacts = contacts.filter(c => c.customer === customer.name);

  const handleEdit = () => {
    navigation.navigate('CustomerForm', { customerId: customer.id });
  };

  const handleDelete = () => {
    Alert.alert(
      '删除客户',
      `确定要删除"${customer.name}"吗？此操作不可撤销。`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: () => {
            deleteCustomer(customer.id);
            navigation.goBack();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="客户详情"
        showBack
        onBack={() => navigation.goBack()}
        rightIcon="create-outline"
        onRightPress={handleEdit}
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Profile card */}
        <View style={styles.profile}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{customer.name.slice(0, 2)}</Text>
          </View>
          <Text style={styles.name}>{customer.name}</Text>
          <Text style={styles.company}>{customer.company}</Text>
          <View style={styles.tagsRow}>
            {customer.tags.map(tag => {
              const c = TAG_COLORS[tag] ?? { bg: '#E9ECEF', text: '#495057' };
              return (
                <View key={tag} style={[styles.tag, { backgroundColor: c.bg }]}>
                  <Text style={[styles.tagText, { color: c.text }]}>{tag}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Contact info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>联系信息</Text>
          <View style={styles.infoCard}>
            <InfoRow icon="call" label="电话" value={customer.phone} />
            {customer.email ? <InfoRow icon="mail" label="邮箱" value={customer.email} /> : null}
            <InfoRow icon="business-outline" label="公司" value={customer.company} />
            <InfoRow icon="time-outline" label="最近联系" value={customer.lastContact} isLast />
          </View>
        </View>

        {/* Notes */}
        {customer.notes ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>备注</Text>
            <View style={styles.notesCard}>
              <Text style={styles.notesText}>{customer.notes}</Text>
            </View>
          </View>
        ) : null}

        {/* Contact history */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>联系记录（{customerContacts.length}）</Text>
          {customerContacts.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>暂无联系记录</Text>
            </View>
          ) : (
            customerContacts.map(item => {
              const color = TYPE_COLORS[item.type] ?? '#4A90E2';
              return (
                <View key={item.id} style={styles.contactItem}>
                  <View style={styles.contactMeta}>
                    <View style={[styles.typeBadge, { backgroundColor: color + '20' }]}>
                      <Text style={[styles.typeText, { color }]}>{item.type}</Text>
                    </View>
                    <Text style={styles.contactDate}>{item.date}</Text>
                    {item.duration ? (
                      <Text style={styles.duration}>{item.duration}</Text>
                    ) : null}
                  </View>
                  <Text style={styles.summary}>{item.summary}</Text>
                </View>
              );
            })
          )}
        </View>

        {/* Delete button */}
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete} activeOpacity={0.8}>
          <Icon name="trash-outline" size={16} color="#FF3B30" />
          <Text style={styles.deleteBtnText}>删除客户</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({
  icon, label, value, isLast = false,
}: { icon: string; label: string; value: string; isLast?: boolean }) {
  return (
    <View style={[styles.infoRow, !isLast && styles.infoRowBorder]}>
      <Icon name={icon} size={15} color="#888" style={styles.infoIcon} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={1}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  scroll: { paddingBottom: 36 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  profile: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  avatar: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#4A90E2',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { color: '#FFFFFF', fontSize: 26, fontWeight: '700' },
  name: { fontSize: 22, fontWeight: '700', color: '#1A1A1A', marginBottom: 4 },
  company: { fontSize: 14, color: '#666', marginBottom: 14 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center' },
  tag: { borderRadius: 4, paddingHorizontal: 8, paddingVertical: 4 },
  tagText: { fontSize: 12, fontWeight: '600' },
  section: { marginTop: 20, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A1A', marginBottom: 10 },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13 },
  infoRowBorder: { borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  infoIcon: { marginRight: 10, width: 22 },
  infoLabel: { fontSize: 13, color: '#888', width: 56 },
  infoValue: { flex: 1, fontSize: 14, color: '#1A1A1A', fontWeight: '500' },
  notesCard: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 3, elevation: 1,
  },
  notesText: { fontSize: 14, color: '#444', lineHeight: 22 },
  emptyCard: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 20, alignItems: 'center',
  },
  emptyText: { color: '#C7C7CC', fontSize: 13 },
  contactItem: {
    backgroundColor: '#FFFFFF', borderRadius: 10, padding: 12, marginBottom: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 2, elevation: 1,
  },
  contactMeta: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6,
  },
  typeBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  typeText: { fontSize: 11, fontWeight: '600' },
  contactDate: { fontSize: 12, color: '#888' },
  duration: { fontSize: 12, color: '#AAAAAA' },
  summary: { fontSize: 13, color: '#555', lineHeight: 18 },
  deleteBtn: {
    marginHorizontal: 16, marginTop: 24,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, borderRadius: 10,
    borderWidth: 1, borderColor: '#FF3B30', gap: 6,
  },
  deleteBtnText: { color: '#FF3B30', fontSize: 15, fontWeight: '600' },
});
