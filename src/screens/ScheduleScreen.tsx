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

interface Task {
  id: string;
  title: string;
  customer: string;
  type: string;
  date: string;
  time: string;
  done: boolean;
  priority: 'high' | 'medium' | 'low';
}

const PRIORITY_COLORS = {
  high: '#FF3B30',
  medium: '#FF9500',
  low: '#34C759',
};
const PRIORITY_LABELS = { high: '紧急', medium: '普通', low: '低优先' };

const mockTasks: Task[] = [
  { id: '1', title: '与张三确认合同细节', customer: '张三 / 阿里巴巴', type: '电话', date: '2024-01-16', time: '14:00', done: false, priority: 'high' },
  { id: '2', title: '发送报价单给李四', customer: '李四 / 腾讯', type: '邮件', date: '2024-01-16', time: '16:30', done: false, priority: 'medium' },
  { id: '3', title: '拜访字节跳动技术团队', customer: '王五 / 字节跳动', type: '拜访', date: '2024-01-17', time: '10:00', done: false, priority: 'high' },
  { id: '4', title: '跟进孙七需求调研', customer: '孙七 / 京东', type: '会议', date: '2024-01-17', time: '15:00', done: false, priority: 'medium' },
  { id: '5', title: '整理本周销售报告', customer: '内部', type: '其他', date: '2024-01-19', time: '09:00', done: false, priority: 'low' },
  { id: '6', title: '月度客户回访电话', customer: '赵六 / 美团', type: '电话', date: '2024-01-19', time: '11:00', done: true, priority: 'low' },
];

const WEEK_DAYS = ['一', '二', '三', '四', '五', '六', '日'];
const DATES = [14, 15, 16, 17, 18, 19, 20];

const TYPE_ICONS: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
  电话: 'call',
  邮件: 'mail',
  会议: 'people',
  拜访: 'walk',
  其他: 'ellipsis-horizontal-circle',
};

export default function ScheduleScreen() {
  const [selectedDate, setSelectedDate] = useState(16);
  const [tasks, setTasks] = useState(mockTasks);

  const todayTasks = tasks.filter((t) => {
    const d = parseInt(t.date.split('-')[2] ?? '0', 10);
    return d === selectedDate;
  });
  const upcoming = tasks.filter((t) => {
    const d = parseInt(t.date.split('-')[2] ?? '0', 10);
    return d > selectedDate;
  });

  const toggleDone = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="日程管理" rightIcon="add-circle-outline" />

      {/* Mini Calendar */}
      <View style={styles.calendar}>
        <View style={styles.monthRow}>
          <TouchableOpacity activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={20} color="#4A90E2" />
          </TouchableOpacity>
          <Text style={styles.monthLabel}>2024年 1月</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Ionicons name="chevron-forward" size={20} color="#4A90E2" />
          </TouchableOpacity>
        </View>
        <View style={styles.weekRow}>
          {WEEK_DAYS.map((d) => (
            <Text key={d} style={styles.weekDay}>{d}</Text>
          ))}
        </View>
        <View style={styles.datesRow}>
          {DATES.map((d, i) => {
            const hasTask = tasks.some((t) => parseInt(t.date.split('-')[2] ?? '0', 10) === d);
            const isSelected = d === selectedDate;
            return (
              <TouchableOpacity
                key={d}
                style={[styles.dateCell, isSelected && styles.dateCellActive]}
                onPress={() => setSelectedDate(d)}
                activeOpacity={0.7}
              >
                <Text style={[styles.dateText, isSelected && styles.dateTextActive, WEEK_DAYS[i] === '日' && styles.dateTextSun]}>
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
              <Ionicons name="calendar-outline" size={36} color="#C7C7CC" />
              <Text style={styles.emptyText}>当天暂无日程</Text>
            </View>
          )}
          {todayTasks.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={toggleDone} />
          ))}
        </View>

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>即将到来</Text>
            {upcoming.map((task) => (
              <TaskItem key={task.id} task={task} onToggle={toggleDone} />
            ))}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} activeOpacity={0.85}>
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function TaskItem({ task, onToggle }: { task: Task; onToggle: (id: string) => void }) {
  const icon = TYPE_ICONS[task.type] ?? 'ellipsis-horizontal-circle';
  return (
    <View style={[styles.taskCard, task.done && styles.taskDone]}>
      <TouchableOpacity onPress={() => onToggle(task.id)} activeOpacity={0.7} style={styles.checkbox}>
        <Ionicons
          name={task.done ? 'checkmark-circle' : 'ellipse-outline'}
          size={22}
          color={task.done ? '#34C759' : '#C7C7CC'}
        />
      </TouchableOpacity>
      <View style={styles.taskInfo}>
        <Text style={[styles.taskTitle, task.done && styles.taskTitleDone]}>{task.title}</Text>
        <View style={styles.taskMeta}>
          <Ionicons name={icon} size={12} color="#888" />
          <Text style={styles.taskMetaText}>{task.type}</Text>
          <View style={styles.metaDot} />
          <Ionicons name="person-outline" size={12} color="#888" />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  calendar: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  monthLabel: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },
  datesRow: {
    flexDirection: 'row',
  },
  dateCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 10,
  },
  dateCellActive: {
    backgroundColor: '#4A90E2',
  },
  dateText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 3,
  },
  dateTextActive: { color: '#FFFFFF' },
  dateTextSun: { color: '#FF3B30' },
  dateDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4A90E2',
  },
  dateDotActive: { backgroundColor: '#FFFFFF' },
  scroll: { paddingBottom: 80 },
  section: { marginTop: 16, paddingHorizontal: 16 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  emptyDay: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  emptyText: { fontSize: 13, color: '#C7C7CC', marginTop: 8 },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  taskDone: { opacity: 0.6 },
  checkbox: { marginRight: 10 },
  taskInfo: { flex: 1 },
  taskTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 3,
  },
  taskTitleDone: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  taskMetaText: { fontSize: 11, color: '#888' },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#D0D0D0',
    marginHorizontal: 2,
  },
  taskRight: { alignItems: 'flex-end', gap: 4 },
  taskTime: { fontSize: 13, fontWeight: '600', color: '#4A90E2' },
  priority: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityText: { fontSize: 10, fontWeight: '600' },
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
