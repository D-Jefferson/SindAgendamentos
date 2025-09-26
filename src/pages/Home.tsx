import React from 'react';
import { Calendar, Search } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import '../styles/home.css';
import titulo from "../assets/titulo.png";

export function Home() {
  const { setCurrentView } = useApp();

  return (
    <>
      <div className="home-container">
        <div className="home-overlay"></div>
        
        <div className="home-content">
          <div className="home-text">
            <h1 className="home-title">
              <img src={titulo} alt="test" style={{ width: "350px", height: "auto" }}/>
            </h1>
          </div>

          <div className="home-buttons">
            <button
              onClick={() => setCurrentView('agendar')}
              className="button-primary"
            >
              <Calendar size={24} />
              <span>Agendar</span>
            </button>

            <button
              onClick={() => setCurrentView('consultar')}
              className="button-secondary"
            >
              <Search size={24} />
              <span>Consultar</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}