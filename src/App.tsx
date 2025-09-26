import React from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { Header } from './pages/Header';
import { Menu } from './pages/Menu';
import { Home } from './pages/Home';
import { AgendarForm } from './pages/Agendar';
import { ConsultarAgendamentos } from './pages/Consultar';
import { AdminLogin } from './pages/AdminLogin';
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