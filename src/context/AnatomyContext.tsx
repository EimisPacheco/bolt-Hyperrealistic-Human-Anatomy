import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { AnatomyState, OrganSystem } from '../types';

interface AnatomyContextValue extends AnatomyState {
  setSelectedOrgan: (id: string | null) => void;
  setHoveredOrgan: (id: string | null) => void;
  toggleSystem: (system: OrganSystem) => void;
  toggleBody: () => void;
  toggleSkeleton: () => void;
  toggleXray: () => void;
  toggleAutoRotate: () => void;
  resetView: () => void;
}

const allSystems: OrganSystem[] = [
  'cardiovascular',
  'respiratory',
  'digestive',
  'nervous',
  'urinary',
  'lymphatic',
  'skeletal',
];

const AnatomyContext = createContext<AnatomyContextValue | null>(null);

export function AnatomyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AnatomyState>({
    selectedOrgan: null,
    hoveredOrgan: null,
    visibleSystems: [...allSystems],
    showBody: true,
    showSkeleton: true,
    xrayMode: false,
    autoRotate: true,
  });

  const setSelectedOrgan = useCallback((id: string | null) => {
    setState((s) => ({ ...s, selectedOrgan: s.selectedOrgan === id ? null : id }));
  }, []);

  const setHoveredOrgan = useCallback((id: string | null) => {
    setState((s) => ({ ...s, hoveredOrgan: id }));
  }, []);

  const toggleSystem = useCallback((system: OrganSystem) => {
    setState((s) => ({
      ...s,
      visibleSystems: s.visibleSystems.includes(system)
        ? s.visibleSystems.filter((sys) => sys !== system)
        : [...s.visibleSystems, system],
    }));
  }, []);

  const toggleBody = useCallback(() => {
    setState((s) => ({ ...s, showBody: !s.showBody }));
  }, []);

  const toggleSkeleton = useCallback(() => {
    setState((s) => ({ ...s, showSkeleton: !s.showSkeleton }));
  }, []);

  const toggleXray = useCallback(() => {
    setState((s) => ({ ...s, xrayMode: !s.xrayMode }));
  }, []);

  const toggleAutoRotate = useCallback(() => {
    setState((s) => ({ ...s, autoRotate: !s.autoRotate }));
  }, []);

  const resetView = useCallback(() => {
    setState({
      selectedOrgan: null,
      hoveredOrgan: null,
      visibleSystems: [...allSystems],
      showBody: true,
      showSkeleton: true,
      xrayMode: false,
      autoRotate: true,
    });
  }, []);

  return (
    <AnatomyContext.Provider
      value={{
        ...state,
        setSelectedOrgan,
        setHoveredOrgan,
        toggleSystem,
        toggleBody,
        toggleSkeleton,
        toggleXray,
        toggleAutoRotate,
        resetView,
      }}
    >
      {children}
    </AnatomyContext.Provider>
  );
}

export function useAnatomy() {
  const ctx = useContext(AnatomyContext);
  if (!ctx) throw new Error('useAnatomy must be used within AnatomyProvider');
  return ctx;
}
