export interface SalesOpportunity {
  id: string;
  title: string;
  customerId: string;
  customerName: string;
  amount: number;
  stage: 'lead' | 'interest' | 'quote' | 'negotiation' | 'closed';
  probability: number;
  dueDate: string;
  createdAt: string;
  notes?: string;
}

export interface SalesSummary {
  totalPipelineValue: number;
  closedThisMonth: number;
  openOpportunities: number;
  avgDealCycle: number;
}

// Stub service – business logic not yet implemented
export const SalesService = {
  getOpportunities: async (_stage?: string): Promise<SalesOpportunity[]> => {
    return [];
  },

  getById: async (_id: string): Promise<SalesOpportunity | null> => {
    return null;
  },

  create: async (
    _opp: Omit<SalesOpportunity, 'id' | 'createdAt'>,
  ): Promise<SalesOpportunity> => {
    throw new Error('Not implemented');
  },

  update: async (
    _id: string,
    _partial: Partial<SalesOpportunity>,
  ): Promise<SalesOpportunity> => {
    throw new Error('Not implemented');
  },

  delete: async (_id: string): Promise<void> => {
    // not implemented
  },

  getSummary: async (): Promise<SalesSummary> => {
    return {
      totalPipelineValue: 0,
      closedThisMonth: 0,
      openOpportunities: 0,
      avgDealCycle: 0,
    };
  },
};
