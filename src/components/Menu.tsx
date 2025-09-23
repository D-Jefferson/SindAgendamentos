import React from 'react';
import { Home, Calendar, Search, BarChart3 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import '../styles/menu.css';

export function Menu() {
  const { isMenuOpen, setIsMenuOpen, currentView, setCurrentView } = useApp();

  const menuItems = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'agendar', label: 'Agendar', icon: Calendar },
    { id: 'consultar', label: 'Consultar', icon: Search },
    { id: 'admin', label: 'Admin', icon: BarChart3 },
  ];

  const handleNavigation = (viewId: string) => {
    setCurrentView(viewId);
    setIsMenuOpen(false);
  };

  if (!isMenuOpen) return null;

  return (
    <>
      <div className="menu-overlay" onClick={() => setIsMenuOpen(false)}>
        <div 
          className="menu-panel"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="menu-header">
            <h2 className="menu-title">Menu</h2>
          </div>
          
          <nav className="menu-nav">
            <ul className="menu-list">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigation(item.id)}
                    className={`menu-item ${currentView === item.id ? 'active' : ''}`}
                  >
                    <item.icon size={20} />
                    <span className="menu-item-label">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}