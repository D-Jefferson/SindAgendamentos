import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import '../styles/adminLogin.css';
import { Route, Router } from 'react-router-dom';

export function AdminLogin() {
  const { setCurrentView, setIsAdminLoggedIn } = useApp();
  const [formData, setFormData] = useState({
    usuario: '',
    senha: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const ADMIN_CREDENTIALS = {
    usuario: 'admin',
    senha: 'sindauto2024'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (formData.usuario === ADMIN_CREDENTIALS.usuario && 
        formData.senha === ADMIN_CREDENTIALS.senha) {
      setIsAdminLoggedIn(true);
      setCurrentView('admin');
    } else {
      setError('Usuário ou senha incorretos');
    }

    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  return (
    <>
      <div className="login-container">
        <div className="login-wrapper">
          <div className="login-card">
            <div className="login-header">
              <div className="login-icon">
                <Lock size={32} />
              </div>
              <h1 className="login-title">Acesso Administrativo</h1>
              <p className="login-subtitle">Digite suas credenciais para acessar o painel</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label className="form-label">
                  <User size={16} />
                  <span>Usuário</span>
                </label>
                <input
                  type="text"
                  name="usuario"
                  value={formData.usuario}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Digite seu usuário"
                  autoComplete="username"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Lock size={16} />
                  <span>Senha</span>
                </label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="senha"
                    value={formData.senha}
                    onChange={handleChange}
                    required
                    className="form-input password-input"
                    placeholder="Digite sua senha"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="error-message">
                  <p>{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="login-button"
              >
                {isLoading ? (
                  <>
                    <div className="loading-spinner"></div>
                    <span>Entrando...</span>
                  </>
                ) : (
                  <>
                    <Lock size={20} />
                    <span>Entrar</span>
                  </>
                )}
              </button>
            </form>

            <div className="login-info">
              <p className="info-text">
                <strong>@SindautoBahia2025</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}