import React, { createContext, useCallback, useContext, useState } from 'react';
import { Customer, ContactRecord, Opportunity, ScheduleTask } from '../types';

// ─── Initial mock data ───────────────────────────────────────────────────────

const INITIAL_CUSTOMERS: Customer[] = [
  { id: '1', name: '张三', company: '阿里巴巴', tags: ['VIP客户'], lastContact: '2024-01-15', phone: '138****1234', createdAt: '2023-06-01' },
  { id: '2', name: '李四', company: '腾讯', tags: ['潜在客户'], lastContact: '2024-01-10', phone: '139****5678', createdAt: '2023-07-15' },
  { id: '3', name: '王五', company: '字节跳动', tags: ['合作中'], lastContact: '2024-01-08', phone: '137****9012', createdAt: '2023-08-20' },
  { id: '4', name: '赵六', company: '美团', tags: ['VIP客户', '合作中'], lastContact: '2024-01-05', phone: '136****3456', createdAt: '2023-05-10' },
  { id: '5', name: '孙七', company: '京东', tags: ['潜在客户'], lastContact: '2024-01-03', phone: '135****7890', createdAt: '2023-09-01' },
  { id: '6', name: '周八', company: '拼多多', tags: ['已流失'], lastContact: '2023-12-28', phone: '134****2345', createdAt: '2023-04-15' },
  { id: '7', name: '吴九', company: '网易', tags: ['合作中'], lastContact: '2023-12-20', phone: '133****6789', createdAt: '2023-10-05' },
  { id: '8', name: '郑十', company: '百度', tags: ['VIP客户'], lastContact: '2023-12-18', phone: '132****1122', createdAt: '2023-11-20' },
];

const INITIAL_CONTACTS: ContactRecord[] = [
  { id: '1', customer: '张三', company: '阿里巴巴', type: '电话', summary: '讨论了Q1合同续签事宜，客户表示需要本月内完成签约', date: '2024-01-15', duration: '25分钟' },
  { id: '2', customer: '李四', company: '腾讯', type: '邮件', summary: '发送了产品报价单和技术规格说明，等待客户反馈', date: '2024-01-14' },
  { id: '3', customer: '王五', company: '字节跳动', type: '会议', summary: '线上演示新版本功能，客户对数据分析模块印象深刻', date: '2024-01-12', duration: '1小时' },
  { id: '4', customer: '赵六', company: '美团', type: '拜访', summary: '拜访客户公司，与技术团队确认了集成方案', date: '2024-01-10', duration: '2小时' },
  { id: '5', customer: '孙七', company: '京东', type: '电话', summary: '初步了解客户需求，安排下周产品演示', date: '2024-01-09', duration: '15分钟' },
  { id: '6', customer: '郑十', company: '百度', type: '会议', summary: '项目启动会，确认项目范围、时间表和关键联系人', date: '2024-01-08', duration: '3小时' },
  { id: '7', customer: '周八', company: '拼多多', type: '邮件', summary: '发送续约通知和优惠方案，对方未回复', date: '2024-01-05' },
];

const INITIAL_OPPORTUNITIES: Opportunity[] = [
  { id: '1', title: '云服务年度合同', customer: '阿里巴巴·张三', amount: '¥120,000', stage: '谈判', probability: 80, dueDate: '2024-01-31' },
  { id: '2', title: 'ERP系统实施', customer: '腾讯·李四', amount: '¥85,000', stage: '报价', probability: 60, dueDate: '2024-02-15' },
  { id: '3', title: '数据安全方案', customer: '字节跳动·王五', amount: '¥45,000', stage: '意向', probability: 40, dueDate: '2024-02-28' },
  { id: '4', title: 'SaaS平台授权', customer: '美团·赵六', amount: '¥200,000', stage: '成交', probability: 100, dueDate: '2024-01-10' },
  { id: '5', title: '网络安全审计', customer: '京东·孙七', amount: '¥30,000', stage: '线索', probability: 20, dueDate: '2024-03-10' },
  { id: '6', title: 'BI数据分析平台', customer: '百度·郑十', amount: '¥95,000', stage: '意向', probability: 45, dueDate: '2024-02-20' },
];

const INITIAL_SCHEDULES: ScheduleTask[] = [
  { id: '1', title: '与张三确认合同细节', customer: '张三 / 阿里巴巴', type: '电话', date: '2024-01-16', time: '14:00', done: false, priority: 'high' },
  { id: '2', title: '发送报价单给李四', customer: '李四 / 腾讯', type: '邮件', date: '2024-01-16', time: '16:30', done: false, priority: 'medium' },
  { id: '3', title: '拜访字节跳动技术团队', customer: '王五 / 字节跳动', type: '拜访', date: '2024-01-17', time: '10:00', done: false, priority: 'high' },
  { id: '4', title: '跟进孙七需求调研', customer: '孙七 / 京东', type: '会议', date: '2024-01-17', time: '15:00', done: false, priority: 'medium' },
  { id: '5', title: '整理本周销售报告', customer: '内部', type: '其他', date: '2024-01-19', time: '09:00', done: false, priority: 'low' },
  { id: '6', title: '月度客户回访电话', customer: '赵六 / 美团', type: '电话', date: '2024-01-19', time: '11:00', done: true, priority: 'low' },
];

// ─── Context definition ───────────────────────────────────────────────────────

interface AppContextType {
  customers: Customer[];
  contacts: ContactRecord[];
  opportunities: Opportunity[];
  schedules: ScheduleTask[];

  addCustomer: (data: Omit<Customer, 'id' | 'createdAt'>) => void;
  updateCustomer: (id: string, data: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  addContact: (data: Omit<ContactRecord, 'id'>) => void;
  deleteContact: (id: string) => void;

  addOpportunity: (data: Omit<Opportunity, 'id'>) => void;
  updateOpportunity: (id: string, data: Partial<Opportunity>) => void;
  deleteOpportunity: (id: string) => void;

  addSchedule: (data: Omit<ScheduleTask, 'id'>) => void;
  updateSchedule: (id: string, data: Partial<ScheduleTask>) => void;
  deleteSchedule: (id: string) => void;
  toggleScheduleDone: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

let _id = 200;
function genId() { return String(++_id); }

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [contacts, setContacts] = useState(INITIAL_CONTACTS);
  const [opportunities, setOpportunities] = useState(INITIAL_OPPORTUNITIES);
  const [schedules, setSchedules] = useState(INITIAL_SCHEDULES);

  const addCustomer = useCallback((data: Omit<Customer, 'id' | 'createdAt'>) => {
    const today = new Date().toISOString().slice(0, 10);
    setCustomers(prev => [{ ...data, id: genId(), createdAt: today }, ...prev]);
  }, []);
  const updateCustomer = useCallback((id: string, data: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  }, []);
  const deleteCustomer = useCallback((id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  }, []);

  const addContact = useCallback((data: Omit<ContactRecord, 'id'>) => {
    setContacts(prev => [{ ...data, id: genId() }, ...prev]);
  }, []);
  const deleteContact = useCallback((id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  }, []);

  const addOpportunity = useCallback((data: Omit<Opportunity, 'id'>) => {
    setOpportunities(prev => [{ ...data, id: genId() }, ...prev]);
  }, []);
  const updateOpportunity = useCallback((id: string, data: Partial<Opportunity>) => {
    setOpportunities(prev => prev.map(o => o.id === id ? { ...o, ...data } : o));
  }, []);
  const deleteOpportunity = useCallback((id: string) => {
    setOpportunities(prev => prev.filter(o => o.id !== id));
  }, []);

  const addSchedule = useCallback((data: Omit<ScheduleTask, 'id'>) => {
    setSchedules(prev => [{ ...data, id: genId() }, ...prev]);
  }, []);
  const updateSchedule = useCallback((id: string, data: Partial<ScheduleTask>) => {
    setSchedules(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
  }, []);
  const deleteSchedule = useCallback((id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
  }, []);
  const toggleScheduleDone = useCallback((id: string) => {
    setSchedules(prev => prev.map(s => s.id === id ? { ...s, done: !s.done } : s));
  }, []);

  return (
    <AppContext.Provider value={{
      customers, contacts, opportunities, schedules,
      addCustomer, updateCustomer, deleteCustomer,
      addContact, deleteContact,
      addOpportunity, updateOpportunity, deleteOpportunity,
      addSchedule, updateSchedule, deleteSchedule, toggleScheduleDone,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
