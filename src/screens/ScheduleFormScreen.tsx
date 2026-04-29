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

type RouteProps = RouteProp<RootStackParamList, 'ScheduleForm'>;

const TYPES = ['电话', '邮件', '会议', '拜访', '其他'];
const TYPE_COLORS: Record<string, string> = {
  电话: '#4A90E2', 邮件: '#34C759', 会议: '#AF52DE', 拜访: '#FF9500', 其他: '#8E8E93',
};

const PRIORITIES: Array<{ key: 'high' | 'medium' | 'low'; label: string; color: string }> = [
  { key: 'high', label: '紧急', color: '#FF3B30' },
  { key: 'medium', label: '普通', color: '#FF9500' },
  { key: 'low', label: '低优先', color: '#34C759' },
];

export default function ScheduleFormScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProps>();
  const scheduleId = route.params?.scheduleId;
  const { schedules, addSchedule, updateSchedule, deleteSchedule } = useAppContext();

  const existing = scheduleId ? schedules.find(s => s.id === scheduleId) : null;
  const isEdit = !!existing;

  const today = new Date().toISOString().slice(0, 10);

  const [title, setTitle] = useState(existing?.title ?? '');
  const [customer, setCustomer] = useState(existing?.customer ?? '');
  const [type, setType] = useState(existing?.type ?? '电话');
  const [date, setDate] = useState(existing?.date ?? today);
  const [time, setTime] = useState(existing?.time ?? '09:00');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>(existing?.priority ?? 'medium');

  const handleSave = () => {
    if (!title.trim()) { Alert.alert('提示', '请填写日程标题'); return; }

    if (isEdit && scheduleId) {
      updateSchedule(scheduleId, { title, customer, type, date, time, priority });
    } else {
      addSchedule({ title, customer, type, date, time, priority, done: false });
    }
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert('删除日程', `确定要删除"${title}"吗？`, [
      { text: '取消', style: 'cancel' },
      {
        text: '删除', style: 'destructive',
        onPress: () => { deleteSchedule(scheduleId!); navigation.goBack(); },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={isEdit ? '编辑日程' : '添加日程'}
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
            <FormRow label="标题 *" value={title} onChangeText={setTitle} placeholder="日程标题" />
            <FormRow label="客户" value={customer} onChangeText={setCustomer} placeholder="关联客户（选填）" />
            <FormRow label="日期" value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" />
            <FormRow label="时间" value={time} onChangeText={setTime} placeholder="HH:MM" isLast />
          </View>

          {/* Type */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>类型</Text>
            <View style={styles.optionRow}>
              {TYPES.map(t => {
                const active = type === t;
                const color = TYPE_COLORS[t] ?? '#8E8E93';
                return (
                  <TouchableOpacity
                    key={t}
                    style={[
                      styles.optionBtn,
                      active && { backgroundColor: color + '20', borderColor: color },
                    ]}
                    onPress={() => setType(t)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.optionText, active && { color, fontWeight: '700' }]}>{t}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Priority */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>优先级</Text>
            <View style={styles.optionRow}>
              {PRIORITIES.map(p => {
                const active = priority === p.key;
                return (
                  <TouchableOpacity
                    key={p.key}
                    style={[
                      styles.optionBtn,
                      active && { backgroundColor: p.color + '20', borderColor: p.color },
                    ]}
                    onPress={() => setPriority(p.key)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.optionText, active && { color: p.color, fontWeight: '700' }]}>
                      {p.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
            <Text style={styles.saveBtnText}>{isEdit ? '保存修改' : '添加日程'}</Text>
          </TouchableOpacity>

          {isEdit ? (
            <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete} activeOpacity={0.8}>
              <Text style={styles.deleteBtnText}>删除此日程</Text>
            </TouchableOpacity>
          ) : null}
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
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionBtn: {
    paddingHorizontal: 16, paddingVertical: 9,
    borderRadius: 8, backgroundColor: '#F5F7FA',
    borderWidth: 1, borderColor: '#E5E5EA',
  },
  optionText: { fontSize: 13, color: '#555' },
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
