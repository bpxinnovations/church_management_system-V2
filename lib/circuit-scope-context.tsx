'use client';

import { createContext, useContext } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getCircuits, getCircuitById, type Circuit } from '@/lib/diocese-circuit-storage';
import { SYSTEM_ROLE_IDS } from '@/lib/rbac-types';

/** For circuit module: effective circuit id (assigned for circuit_admin, first circuit for head_pastor) */
const CircuitScopeContext = createContext<string | null>(null);

export function CircuitScopeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  let effectiveCircuitId: string | null = null;
  if (user?.roleId === SYSTEM_ROLE_IDS.CIRCUIT_ADMIN && user.scopeCircuitId) {
    effectiveCircuitId = user.scopeCircuitId;
  } else if (user?.roleId === SYSTEM_ROLE_IDS.HEAD_PASTOR) {
    const first = getCircuits()[0];
    effectiveCircuitId = first?.id ?? null;
  }
  return (
    <CircuitScopeContext.Provider value={effectiveCircuitId}>
      {children}
    </CircuitScopeContext.Provider>
  );
}

export function useCircuitScope(): { circuitId: string | null; circuit: Circuit | null } {
  const circuitId = useContext(CircuitScopeContext);
  const circuit = circuitId ? getCircuitById(circuitId) : null;
  return { circuitId: circuitId ?? null, circuit: circuit ?? null };
}
