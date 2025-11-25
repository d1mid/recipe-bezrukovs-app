import React, { createContext, useContext, ReactNode } from 'react';
import { RootStore } from './RootStore';

const rootStore = new RootStore();
const StoreContext = createContext<RootStore>(rootStore);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <StoreContext.Provider value={rootStore}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStores = (): RootStore => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStores должен использоваться внутри StoreProvider');
  }
  return context;
};
