import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Agendamento } from '../types';

interface AppContextType {
  agendamentos: Agendamento[];
  setAgendamentos: (agendamentos: Agendamento[] | ((prev: Agendamento[]) => Agendamento[])) => void;
  currentView: string;
  setCurrentView: (view: string) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (loggedIn: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [agendamentos, setAgendamentos] = useLocalStorage<Agendamento[]>('agendamentos', []);
  const [currentView, setCurrentView] = useLocalStorage('currentView', 'home');
  const [isMenuOpen, setIsMenuOpen] = useLocalStorage('isMenuOpen', false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useLocalStorage('isAdminLoggedIn', false);

  return (
    <AppContext.Provider
      value={{
        agendamentos,
        setAgendamentos,
        currentView,
        setCurrentView,
        isMenuOpen,
        setIsMenuOpen,
        isAdminLoggedIn,
        setIsAdminLoggedIn,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}