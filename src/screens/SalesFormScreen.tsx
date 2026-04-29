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

type RouteProps = RouteProp<RootStackParamList, 'SalesForm'>;

const STAGES = ['线索', '意向', '报价', '谈判', '成交'];
const STAGE_COLORS: Record<string, { bg: string; text: string }> = {
  线索: { bg: '#E9ECEF', text: '#495057' },
  意向: { bg: '#D1ECF1', text: '#0C5460' },
  报价: { bg: '#FFF3CD', text: '#856404' },
  谈判: { bg: '#FCE8D8', text: '#7D3C00' },
  成交: { bg: '#D4EDDA', text: '#155724' },
};

export default function SalesFormScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProps>();
  const salesId = route.params?.salesId;
  const { opportunities, addOpportunity, updateOpportunity, deleteOpportunity } = useAppContext();

  const existing = salesId ? opportunities.find(o => o.id === salesId) : null;
  const isEdit = !!existing;

  const [title, setTitle] = useState(existing?.title ?? '');
  const [customer, setCustomer] = useState(existing?.customer ?? '');
  const [amount, setAmount] = useState(existing?.amount ?? '');
  const [stage, setStage] = useState(existing?.stage ?? '线索');
  const [probability, setProbability] = useState(String(existing?.probability ?? '20'));
  const [dueDate, setDueDate] = useState(existing?.dueDate ?? '');
  const [notes, setNotes] = useState(existing?.notes ?? '');

  const handleSave = () => {
    if (!title.trim()) { Alert.alert('提示', '请填写商机名称'); return; }
    if (!customer.trim()) { Alert.alert('提示', '请填写客户名称'); return; }

    const prob = Math.min(100, Math.max(0, Number(probability) || 0));

    if (isEdit && salesId) {
      updateOpportunity(salesId, {
        title, customer, amount, stage, probability: prob,
        dueDate, notes: notes.trim() || undefined,
      });
    } else {
      addOpportunity({
        title, customer, amount, stage, probability: prob,
        dueDate, notes: notes.trim() || undefined,
      });
    }
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert('删除商机', `确定要删除"${title}"吗？`, [
      { text: '取消', style: 'cancel' },
      {
        text: '删除', style: 'destructive',
        onPress: () => { deleteOpportunity(salesId!); navigation.goBack(); },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={isEdit ? '编辑商机' : '新增销售'}
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
            <FormRow label="商机名称 *" value={title} onChangeText={setTitle} placeholder="请输入商机名称" />
            <FormRow label="客户 *" value={customer} onChangeText={setCustomer} placeholder="客户名称" />
            <FormRow label="金额" value={amount} onChangeText={setAmount} placeholder="如：¥100,000" />
            <FormRow label="截止日期" value={dueDate} onChangeText={setDueDate} placeholder="YYYY-MM-DD" isLast />
          </View>

          {/* Stage */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>销售阶段</Text>
            <View style={styles.optionRow}>
              {STAGES.map(s => {
                const active = stage === s;
                const c = STAGE_COLORS[s] ?? { bg: '#E9ECEF', text: '#495057' };
                return (
                  <TouchableOpacity
                    key={s}
                    style={[styles.optionBtn, active && { backgroundColor: c.bg, borderColor: c.text }]}
                    onPress={() => setStage(s)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.optionText, active && { color: c.text, fontWeight: '700' }]}>{s}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Probability */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>成交概率（%）</Text>
            <View style={styles.card}>
              <TextInput
                style={styles.probInput}
                value={probability}
                onChangeText={setProbability}
                placeholder="0–100"
                placeholderTextColor="#C7C7CC"
                keyboardType="number-pad"
              />
            </View>
          </View>

          {/* Notes */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>备注</Text>
            <TextInput
              style={styles.notesInput}
              value={notes}
              onChangeText={setNotes}
              placeholder="备注（选填）"
              placeholderTextColor="#C7C7CC"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
            <Text style={styles.saveBtnText}>{isEdit ? '保存修改' : '新增商机'}</Text>
          </TouchableOpacity>

          {isEdit ? (
            <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete} activeOpacity={0.8}>
              <Text style={styles.deleteBtnText}>删除此商机</Text>
            </TouchableOpacity>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function FormRow({
  label, value, onChangeText, placeholder, keyboardType, isLast = false,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'phone-pad' | 'email-address';
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
        keyboardType={keyboardType ?? 'default'}
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
  formLabel: { width: 80, fontSize: 13, color: '#333', fontWeight: '500' },
  formInput: { flex: 1, fontSize: 14, color: '#1A1A1A', paddingVertical: 0 },
  section: { marginHorizontal: 16, marginTop: 20 },
  sectionLabel: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 10 },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionBtn: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 8, backgroundColor: '#F5F7FA',
    borderWidth: 1, borderColor: '#E5E5EA',
  },
  optionText: { fontSize: 13, color: '#555' },
  probInput: {
    paddingVertical: 13, fontSize: 14, color: '#1A1A1A',
  },
  notesInput: {
    backgroundColor: '#FFFFFF', borderRadius: 10, padding: 12,
    fontSize: 14, color: '#1A1A1A', minHeight: 90,
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
  deleteBtn: {
    marginHorizontal: 16, marginTop: 14,
    paddingVertical: 14, borderRadius: 12,
    borderWidth: 1, borderColor: '#FF3B30', alignItems: 'center',
  },
  deleteBtnText: { color: '#FF3B30', fontSize: 15, fontWeight: '600' },
});
