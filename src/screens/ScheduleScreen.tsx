import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Icon from '../components/Icon';
import Header from '../components/Header';
import { useAppContext } from '../context/AppContext';
import { RootStackParamList } from '../navigation/types';
import { ScheduleTask } from '../types';

const PRIORITY_COLORS = {
  high: '#FF3B30', medium: '#FF9500', low: '#34C759',
};
const PRIORITY_LABELS = { high: '紧急', medium: '普通', low: '低优先' };

const WEEK_DAYS = ['一', '二', '三', '四', '五', '六', '日'];
const DATES = [14, 15, 16, 17, 18, 19, 20];

const TYPE_ICONS: Record<string, string> = {
  电话: 'call', 邮件: 'mail', 会议: 'people', 拜访: 'walk', 其他: 'ellipsis-horizontal-circle',
};

export default function ScheduleScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { schedules, toggleScheduleDone } = useAppContext();
  const [selectedDate, setSelectedDate] = useState(16);

  const todayTasks = schedules.filter((t) => {
    const d = parseInt(t.date.split('-')[2] ?? '0', 10);
    return d === selectedDate;
  });
  const upcoming = schedules.filter((t) => {
    const d = parseInt(t.date.split('-')[2] ?? '0', 10);
    return d > selectedDate && !t.done;
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="日程管理"
        rightIcon="add-circle-outline"
        onRightPress={() => navigation.navigate('ScheduleForm', {})}
      />

      {/* Mini Calendar */}
      <View style={styles.calendar}>
        <View style={styles.monthRow}>
          <TouchableOpacity activeOpacity={0.7}>
            <Icon name="chevron-back" size={20} color="#4A90E2" />
          </TouchableOpacity>
          <Text style={styles.monthLabel}>2024年 1月</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Icon name="chevron-forward" size={20} color="#4A90E2" />
          </TouchableOpacity>
        </View>
        <View style={styles.weekRow}>
          {WEEK_DAYS.map((d) => (
            <Text key={d} style={styles.weekDay}>{d}</Text>
          ))}
        </View>
        <View style={styles.datesRow}>
          {DATES.map((d, i) => {
            const hasTask = schedules.some((t) => parseInt(t.date.split('-')[2] ?? '0', 10) === d);
            const isSelected = d === selectedDate;
            return (
              <TouchableOpacity
                key={d}
                style={[styles.dateCell, isSelected && styles.dateCellActive]}
                onPress={() => setSelectedDate(d)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.dateText,
                  isSelected && styles.dateTextActive,
                  WEEK_DAYS[i] === '日' && styles.dateTextSun,
                ]}>
                  {d}
                </Text>
                {hasTask && <View style={[styles.dateDot, isSelected && styles.dateDotActive]} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Selected Day Tasks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            1月{selectedDate}日 · {todayTasks.length} 项日程
          </Text>
          {todayTasks.length === 0 && (
            <View style={styles.emptyDay}>
              <Icon name="calendar" size={36} color="#C7C7CC" />
              <Text style={styles.emptyText}>当天暂无日程，点击右上角新增</Text>
            </View>
          )}
          {todayTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={toggleScheduleDone}
              onEdit={() => navigation.navigate('ScheduleForm', { scheduleId: task.id })}
            />
          ))}
        </View>

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>即将到来</Text>
            {upcoming.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleScheduleDone}
                onEdit={() => navigation.navigate('ScheduleForm', { scheduleId: task.id })}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('ScheduleForm', {})}
      >
        <Icon name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function TaskItem({
  task, onToggle, onEdit,
}: { task: ScheduleTask; onToggle: (id: string) => void; onEdit: () => void }) {
  const icon = TYPE_ICONS[task.type] ?? 'ellipsis-horizontal-circle';
  return (
    <TouchableOpacity
      style={[styles.taskCard, task.done && styles.taskDone]}
      activeOpacity={0.85}
      onLongPress={onEdit}
    >
      <TouchableOpacity onPress={() => onToggle(task.id)} activeOpacity={0.7} style={styles.checkbox}>
        <Icon
          name={task.done ? 'checkmark-circle' : 'ellipse-outline'}
          size={22}
          color={task.done ? '#34C759' : '#C7C7CC'}
        />
      </TouchableOpacity>
      <View style={styles.taskInfo}>
        <Text style={[styles.taskTitle, task.done && styles.taskTitleDone]}>{task.title}</Text>
        <View style={styles.taskMeta}>
          <Icon name={icon} size={12} color="#888" />
          <Text style={styles.taskMetaText}>{task.type}</Text>
          <View style={styles.metaDot} />
          <Icon name="person-outline" size={12} color="#888" />
          <Text style={styles.taskMetaText} numberOfLines={1}>{task.customer}</Text>
        </View>
      </View>
      <View style={styles.taskRight}>
        <Text style={styles.taskTime}>{task.time}</Text>
        <View style={[styles.priority, { backgroundColor: PRIORITY_COLORS[task.priority] + '20' }]}>
          <Text style={[styles.priorityText, { color: PRIORITY_COLORS[task.priority] }]}>
            {PRIORITY_LABELS[task.priority]}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  calendar: {
    backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: '#E5E5EA',
  },
  monthRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingVertical: 10,
  },
  monthLabel: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  weekRow: { flexDirection: 'row', marginBottom: 8 },
  weekDay: { flex: 1, textAlign: 'center', fontSize: 12, color: '#888', fontWeight: '500' },
  datesRow: { flexDirection: 'row' },
  dateCell: { flex: 1, alignItems: 'center', paddingVertical: 6, borderRadius: 10 },
  dateCellActive: { backgroundColor: '#4A90E2' },
  dateText: { fontSize: 15, fontWeight: '600', color: '#1A1A1A', marginBottom: 3 },
  dateTextActive: { color: '#FFFFFF' },
  dateTextSun: { color: '#FF3B30' },
  dateDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#4A90E2' },
  dateDotActive: { backgroundColor: '#FFFFFF' },
  scroll: { paddingBottom: 80 },
  section: { marginTop: 16, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginBottom: 12 },
  emptyDay: {
    alignItems: 'center', paddingVertical: 24,
    backgroundColor: '#FFFFFF', borderRadius: 12, gap: 8,
  },
  emptyText: { fontSize: 13, color: '#C7C7CC' },
  taskCard: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, marginBottom: 8,
    flexDirection: 'row', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 3, elevation: 1,
  },
  taskDone: { opacity: 0.6 },
  checkbox: { marginRight: 10 },
  taskInfo: { flex: 1 },
  taskTitle: { fontSize: 14, fontWeight: '600', color: '#1A1A1A', marginBottom: 3 },
  taskTitleDone: { textDecorationLine: 'line-through', color: '#888' },
  taskMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  taskMetaText: { fontSize: 11, color: '#888' },
  metaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#D0D0D0', marginHorizontal: 2 },
  taskRight: { alignItems: 'flex-end', gap: 4 },
  taskTime: { fontSize: 13, fontWeight: '600', color: '#4A90E2' },
  priority: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  priorityText: { fontSize: 10, fontWeight: '600' },
  fab: {
    position: 'absolute', right: 20, bottom: 20,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#4A90E2',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#4A90E2', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 8, elevation: 6,
  },
});
