import React from 'react';
import { Menu, X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import '../styles/header.css';

export function Header() {
  const { isMenuOpen, setIsMenuOpen } = useApp();

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-brand">
          <div className="logo">
            <img src="https://play-lh.googleusercontent.com/4v5A5q2BMi-IZt17S9VtbSfMPU2LD9pz4ci-Gv52ttWZJW3ep6t14wYbN-z5TI1BbZU" alt="icon" style={{ width: "80px", height: "auto" }}/>
          </div>
          <div className="brand-info">
            <h1 className="brand-title">Sindauto Ba</h1>
          </div>
        </div>
        
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="menu-button"
          aria-label="Menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
}