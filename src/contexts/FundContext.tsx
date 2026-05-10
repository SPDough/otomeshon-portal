import { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';

export interface Fund {
  id: string;
  name: string;
  currency: string;
  navDate: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'EXCEPTION';
}

// Demo funds for asset management context
const DEMO_FUNDS: Fund[] = [
  { id: 'F001', name: 'Acme Global Equity Fund', currency: 'USD', navDate: '2026-05-10', status: 'IN_PROGRESS' },
  { id: 'F002', name: 'Acme Emerging Markets', currency: 'USD', navDate: '2026-05-10', status: 'PENDING' },
  { id: 'F003', name: 'Acme Fixed Income Plus', currency: 'EUR', navDate: '2026-05-10', status: 'COMPLETED' },
  { id: 'F004', name: 'Acme European Growth', currency: 'EUR', navDate: '2026-05-10', status: 'EXCEPTION' },
  { id: 'F005', name: 'Acme Asia Pacific', currency: 'USD', navDate: '2026-05-10', status: 'PENDING' },
  { id: 'F006', name: 'Acme Multi-Strategy', currency: 'GBP', navDate: '2026-05-10', status: 'IN_PROGRESS' },
];

interface FundContextType {
  funds: Fund[];
  selectedFund: Fund | null;
  setSelectedFund: (fund: Fund | null) => void;
  selectFundById: (id: string) => void;
}

const FundContext = createContext<FundContextType>({
  funds: DEMO_FUNDS,
  selectedFund: DEMO_FUNDS[0],
  setSelectedFund: () => {},
  selectFundById: () => {},
});

export const useFund = () => useContext(FundContext);

export const FundProvider = ({ children }: { children: ReactNode }) => {
  const [funds] = useState<Fund[]>(DEMO_FUNDS);
  const [selectedFund, setSelectedFund] = useState<Fund | null>(DEMO_FUNDS[0]);

  const selectFundById = useCallback((id: string) => {
    const fund = funds.find(f => f.id === id);
    if (fund) setSelectedFund(fund);
  }, [funds]);

  const value = useMemo(() => ({
    funds,
    selectedFund,
    setSelectedFund,
    selectFundById,
  }), [funds, selectedFund, selectFundById]);

  return (
    <FundContext.Provider value={value}>
      {children}
    </FundContext.Provider>
  );
};
