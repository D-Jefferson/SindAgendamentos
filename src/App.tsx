import React from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { Header } from './components/Header';
import { Menu } from './components/Menu';
import { Home } from './components/Home';
import { AgendarForm } from './components/AgendarForm';
import { ConsultarAgendamentos } from './components/ConsultarAgendamentos';
import { AdminLogin } from './components/AdminLogin';
//import { AdminPanel } from './components/AdminPanel';

function AppContent() {
  const { currentView, isAdminLoggedIn } = useApp();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <Home />;
      case 'agendar':
        return <AgendarForm />;
      case 'consultar':
        return <ConsultarAgendamentos />;
      case 'admin':
        return /*isAdminLoggedIn ? <AdminPanel /> : */<AdminLogin />;
      default:
        return <Home />;
    }
  };

  return (
    <>
      <div className="app-container">
        <Header />
        <Menu />
        <main>
          {renderCurrentView()}
        </main>
      </div>
      
      <style>{`
        .app-container {
          min-height: 100vh;
          background-color: #f3f4f6;
        }
      `}</style>
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;