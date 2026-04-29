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

export interface CustomerFilter {
  tag?: string;
  search?: string;
}

// Stub service – business logic not yet implemented
export const CustomerService = {
  getAll: async (_filter?: CustomerFilter): Promise<Customer[]> => {
    return [];
  },

  getById: async (_id: string): Promise<Customer | null> => {
    return null;
  },

  create: async (_customer: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer> => {
    throw new Error('Not implemented');
  },

  update: async (_id: string, _partial: Partial<Customer>): Promise<Customer> => {
    throw new Error('Not implemented');
  },

  delete: async (_id: string): Promise<void> => {
    // not implemented
  },
};
