export interface Customer {
  id: string;
  name: string;
  company: string;
  phone: string;
  email?: string;
  tags: string[];
  lastContact: string;
  createdAt: string;
  notes?: string;
}

export interface ContactRecord {
  id: string;
  customer: string;
  company: string;
  type: string;
  summary: string;
  date: string;
  duration?: string;
}

export interface Opportunity {
  id: string;
  title: string;
  customer: string;
  amount: string;
  stage: string;
  probability: number;
  dueDate: string;
  notes?: string;
}

export interface ScheduleTask {
  id: string;
  title: string;
  customer: string;
  type: string;
  date: string;
  time: string;
  done: boolean;
  priority: 'high' | 'medium' | 'low';
}
