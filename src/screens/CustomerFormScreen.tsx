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

type RouteProps = RouteProp<RootStackParamList, 'CustomerForm'>;

const ALL_TAGS = ['VIP客户', '潜在客户', '合作中', '已流失'];
const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  VIP客户: { bg: '#FFF3CD', text: '#856404' },
  潜在客户: { bg: '#D1ECF1', text: '#0C5460' },
  合作中: { bg: '#D4EDDA', text: '#155724' },
  已流失: { bg: '#F8D7DA', text: '#721C24' },
};

export default function CustomerFormScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProps>();
  const customerId = route.params?.customerId;
  const { customers, addCustomer, updateCustomer } = useAppContext();

  const existing = customerId ? customers.find(c => c.id === customerId) : null;
  const isEdit = !!existing;

  const [name, setName] = useState(existing?.name ?? '');
  const [company, setCompany] = useState(existing?.company ?? '');
  const [phone, setPhone] = useState(existing?.phone ?? '');
  const [email, setEmail] = useState(existing?.email ?? '');
  const [tags, setTags] = useState<string[]>(existing?.tags ?? []);
  const [notes, setNotes] = useState(existing?.notes ?? '');

  const toggleTag = (tag: string) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleSave = () => {
    if (!name.trim()) { Alert.alert('提示', '请填写客户姓名'); return; }
    if (!company.trim()) { Alert.alert('提示', '请填写公司名称'); return; }
    if (!phone.trim()) { Alert.alert('提示', '请填写联系电话'); return; }

    const today = new Date().toISOString().slice(0, 10);

    if (isEdit && customerId) {
      updateCustomer(customerId, {
        name, company, phone,
        email: email.trim() || undefined,
        tags,
        notes: notes.trim() || undefined,
      });
    } else {
      addCustomer({
        name, company, phone,
        email: email.trim() || undefined,
        tags,
        lastContact: today,
        notes: notes.trim() || undefined,
      });
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={isEdit ? '编辑客户' : '添加客户'}
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
          {/* Basic info */}
          <View style={styles.card}>
            <FormRow label="姓名 *" value={name} onChangeText={setName} placeholder="请输入客户姓名" />
            <FormRow label="公司 *" value={company} onChangeText={setCompany} placeholder="请输入公司名称" />
            <FormRow label="电话 *" value={phone} onChangeText={setPhone} placeholder="请输入联系电话" keyboardType="phone-pad" />
            <FormRow label="邮箱" value={email} onChangeText={setEmail} placeholder="邮箱（选填）" keyboardType="email-address" isLast />
          </View>

          {/* Tags */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>客户标签</Text>
            <View style={styles.tagsWrap}>
              {ALL_TAGS.map(tag => {
                const active = tags.includes(tag);
                const c = TAG_COLORS[tag] ?? { bg: '#E9ECEF', text: '#495057' };
                return (
                  <TouchableOpacity
                    key={tag}
                    style={[
                      styles.tagBtn,
                      active && { backgroundColor: c.bg, borderColor: c.text },
                    ]}
                    onPress={() => toggleTag(tag)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.tagBtnText, active && { color: c.text }]}>{tag}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Notes */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>备注</Text>
            <TextInput
              style={styles.notesInput}
              value={notes}
              onChangeText={setNotes}
              placeholder="备注信息（选填）"
              placeholderTextColor="#C7C7CC"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
            <Text style={styles.saveBtnText}>{isEdit ? '保存修改' : '添加客户'}</Text>
          </TouchableOpacity>
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
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  formRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13 },
  formRowBorder: { borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  formLabel: { width: 56, fontSize: 14, color: '#333', fontWeight: '500' },
  formInput: { flex: 1, fontSize: 14, color: '#1A1A1A', paddingVertical: 0 },
  section: { marginHorizontal: 16, marginTop: 20 },
  sectionLabel: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 10 },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagBtn: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, backgroundColor: '#F5F7FA',
    borderWidth: 1, borderColor: '#E5E5EA',
  },
  tagBtnText: { fontSize: 13, color: '#555', fontWeight: '500' },
  notesInput: {
    backgroundColor: '#FFFFFF', borderRadius: 10, padding: 12,
    fontSize: 14, color: '#1A1A1A', minHeight: 100,
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
