import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getSpaObject, setSpaObject } from '@/api/spa-object';

const SpaObjectContext = createContext(null);

export function SpaObjectProvider({ children }) {
  const queryClient = useQueryClient();
  
  const [spaObject, setSpaObjectState] = useState(() => getSpaObject());

  const changeSpaObject = useCallback(
    (value) => {
      if (value === spaObject) return;
      
      setSpaObjectState(value);
      
      setSpaObject(value);
      
      queryClient.invalidateQueries();
      
    },
    [spaObject, queryClient],
  );

  const value = useMemo(
    () => ({ spaObject, changeSpaObject }),
    [spaObject, changeSpaObject],
  );

  return (
    <SpaObjectContext.Provider value={value}>
      {children}
    </SpaObjectContext.Provider>
  );
}

export function useSpaObject() {
  const ctx = useContext(SpaObjectContext);
  if (!ctx) throw new Error('useSpaObject must be used inside SpaObjectProvider');
  return ctx;
}