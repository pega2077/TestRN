export type RootStackParamList = {
  MainTabs: undefined;
  CustomerDetail: { customerId: string };
  CustomerForm: { customerId?: string } | undefined;
  SalesForm: { salesId?: string } | undefined;
  ContactForm: { customerId?: string } | undefined;
  ScheduleForm: { scheduleId?: string } | undefined;
};
