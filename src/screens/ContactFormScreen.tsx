import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import Header from '../components/Header';
import { useAppContext } from '../context/AppContext';

type RouteProps = RouteProp<RootStackParamList, 'ContactForm'>;

const TYPES = ['电话', '邮件', '会议', '拜访'];
const TYPE_COLORS: Record<string, string> = {
  电话: '#4A90E2', 邮件: '#34C759', 会议: '#AF52DE', 拜访: '#FF9500',
};

export default function ContactFormScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProps>();
  const prefilledCustomerId = route.params?.customerId;
  const { customers, addContact } = useAppContext();

  const prefilledCustomer = prefilledCustomerId
    ? customers.find(c => c.id === prefilledCustomerId)
    : null;

  const today = new Date().toISOString().slice(0, 10);

  const [customerName, setCustomerName] = useState(prefilledCustomer?.name ?? '');
  const [company, setCompany] = useState(prefilledCustomer?.company ?? '');
  const [type, setType] = useState('电话');
  const [summary, setSummary] = useState('');
  const [date, setDate] = useState(today);
  const [duration, setDuration] = useState('');

  const handleSave = () => {
    if (!customerName.trim()) { Alert.alert('提示', '请填写客户姓名'); return; }
    if (!summary.trim()) { Alert.alert('提示', '请填写联系摘要'); return; }

    addContact({
      customer: customerName.trim(),
      company: company.trim(),
      type,
      summary: summary.trim(),
      date,
      duration: duration.trim() || undefined,
    });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="记录联系"
        showBack
        onBack={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <FormRow label="客户 *" value={customerName} onChangeText={setCustomerName} placeholder="客户姓名" />
            <FormRow label="公司" value={company} onChangeText={setCompany} placeholder="公司名称（选填）" />
            <FormRow label="日期" value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" />
            <FormRow label="时长" value={duration} onChangeText={setDuration} placeholder="如：30分钟（选填）" isLast />
          </View>

          {/* Contact type */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>联系方式 *</Text>
            <View style={styles.typeRow}>
              {TYPES.map(t => {
                const active = type === t;
                const color = TYPE_COLORS[t] ?? '#4A90E2';
                return (
                  <TouchableOpacity
                    key={t}
                    style={[
                      styles.typeBtn,
                      active && { backgroundColor: color + '20', borderColor: color },
                    ]}
                    onPress={() => setType(t)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.typeText, active && { color, fontWeight: '700' }]}>{t}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>联系摘要 *</Text>
            <TextInput
              style={styles.summaryInput}
              value={summary}
              onChangeText={setSummary}
              placeholder="请描述本次联系的内容、结果和后续计划..."
              placeholderTextColor="#C7C7CC"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
            <Text style={styles.saveBtnText}>保存记录</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function FormRow({
  label, value, onChangeText, placeholder, isLast = false,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  isLast?: boolean;
}) {
  return (
    <View style={[styles.formRow, !isLast && styles.formRowBorder]}>
      <Text style={styles.formLabel}>{label}</Text>
      <TextInput
        style={styles.formInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#C7C7CC"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  scroll: { paddingVertical: 20, paddingBottom: 48 },
  card: {
    backgroundColor: '#FFFFFF', marginHorizontal: 16, borderRadius: 12, paddingHorizontal: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 3, elevation: 1,
  },
  formRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13 },
  formRowBorder: { borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  formLabel: { width: 56, fontSize: 14, color: '#333', fontWeight: '500' },
  formInput: { flex: 1, fontSize: 14, color: '#1A1A1A', paddingVertical: 0 },
  section: { marginHorizontal: 16, marginTop: 20 },
  sectionLabel: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 10 },
  typeRow: { flexDirection: 'row', gap: 8 },
  typeBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 8,
    backgroundColor: '#F5F7FA', borderWidth: 1, borderColor: '#E5E5EA',
    alignItems: 'center',
  },
  typeText: { fontSize: 13, color: '#555' },
  summaryInput: {
    backgroundColor: '#FFFFFF', borderRadius: 10, padding: 12,
    fontSize: 14, color: '#1A1A1A', minHeight: 110,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 3, elevation: 1,
  },
  saveBtn: {
    marginHorizontal: 16, marginTop: 28,
    backgroundColor: '#4A90E2', borderRadius: 12,
    paddingVertical: 16, alignItems: 'center',
    shadowColor: '#4A90E2', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  saveBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
