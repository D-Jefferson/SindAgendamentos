import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, Mail, FileText, ArrowLeft, Check } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Agendamento } from '../types';
import '../styles/agendar.css';

export function AgendarForm() {
  const { setCurrentView, agendamentos, setAgendamentos } = useApp();
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    servico: '',
    data: '',
    horario: '',
    observacoes: ''
  });

  const horarios = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const novoAgendamento: Agendamento = {
      id: Date.now().toString(),
      ...formData,
      status: 'agendado',
      criadoEm: new Date().toISOString()
    };

    setAgendamentos([...agendamentos, novoAgendamento]);
    
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setCurrentView('home');
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (showSuccess) {
    return (
      <>
        <div className="success-container">
          <div className="success-card">
            <div className="success-icon">
              <Check className="check-icon" />
            </div>
            <h2 className="success-title">Agendamento Confirmado!</h2>
            <p className="success-message">
              Seu agendamento foi realizado com sucesso. Você receberá uma confirmação em breve.
            </p>
            <p className="success-redirect">Redirecionando...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="form-container">
        <div className="form-wrapper">
          <div className="form-card">
            <div className="form-header">
              <button
                onClick={() => setCurrentView('home')}
                className="back-button"
              >
                <ArrowLeft size={20} />
                <span>Voltar</span>
              </button>
              <h1 className="form-title">Novo Agendamento</h1>
              <p className="form-subtitle">Preencha os dados abaixo para agendar seu serviço</p>
            </div>

            <form onSubmit={handleSubmit} className="form-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <User size={16} />
                    <span>Nome completo</span>
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="Seu nome completo"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Phone size={16} />
                    <span>Telefone</span>
                  </label>
                  <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <Mail size={16} />
                  <span>E-mail</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="seu@email.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FileText size={16} />
                  <span>CPF</span>
                </label>
                <input
                  type="cpf"
                  name="cpf"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="000.000.000-00"
                />
              </div>
            </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <Calendar size={16} />
                    <span>Data</span>
                  </label>
                  <input
                    type="date"
                    name="data"
                    value={formData.data}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Clock size={16} />
                    <span>Horário</span>
                  </label>
                  <select
                    name="horario"
                    value={formData.horario}
                    onChange={handleChange}
                    required
                    className="form-select"
                  >
                    <option value="">Selecione um horário</option>
                    {horarios.map((horario) => (
                      <option key={horario} value={horario}>{horario}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FileText size={16} />
                  <span>Observações (opcional)</span>
                </label>
                <textarea
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleChange}
                  rows={4}
                  className="form-textarea"
                  placeholder="Informações adicionais..."
                />
              </div>

              <button
                type="submit"
                className="submit-button"
              >
                Confirmar Agendamento
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}