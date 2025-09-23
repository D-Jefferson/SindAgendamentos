import React, { useState } from 'react';
import { Search, ArrowLeft, Calendar, Clock, User, Phone, Mail, FileText } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import '../styles/consulta.css';

export function ConsultarAgendamentos() {
  const { setCurrentView, agendamentos } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');

  const agendamentosFiltrados = agendamentos.filter((agendamento) => {
    const matchesSearch = agendamento.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agendamento.telefone.includes(searchTerm) ||
                         agendamento.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filtroStatus === 'todos' || agendamento.status === filtroStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendado': return 'status-agendado';
      case 'confirmado': return 'status-confirmado';
      case 'cancelado': return 'status-cancelado';
      case 'concluido': return 'status-concluido';
      default: return 'status-concluido';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'agendado': return 'Agendado';
      case 'confirmado': return 'Confirmado';
      case 'cancelado': return 'Cancelado';
      case 'concluido': return 'Concluído';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <>
      <div className="consultar-container">
        <div className="consultar-wrapper">
          <div className="consultar-card">
            <div className="consultar-header">
              <button
                onClick={() => setCurrentView('home')}
                className="back-button"
              >
                <ArrowLeft size={20} />
                <span>Voltar</span>
              </button>
              <h1 className="consultar-title">Consultar Agendamentos</h1>
              <p className="consultar-subtitle">Visualize e gerencie seus agendamentos</p>
            </div>

            <div className="consultar-body">
              <div className="filters">
                <div className="search-container">
                  <div className="search-wrapper">
                    <Search className="search-icon" size={20} />
                    <input
                      type="text"
                      placeholder="Buscar por nome, telefone ou e-mail..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input"
                    />
                  </div>
                </div>
                
                <div className="filter-container">
                  <select
                    value={filtroStatus}
                    onChange={(e) => setFiltroStatus(e.target.value)}
                    className="filter-select"
                  >
                    <option value="todos">Todos os Status</option>
                    <option value="agendado">Agendado</option>
                    <option value="confirmado">Confirmado</option>
                    <option value="cancelado">Cancelado</option>
                    <option value="concluido">Concluído</option>
                  </select>
                </div>
              </div>

              {agendamentosFiltrados.length === 0 ? (
                <div className="empty-state">
                  <Calendar className="empty-icon" />
                  <h3 className="empty-title">
                    {searchTerm || filtroStatus !== 'todos' ? 'Nenhum agendamento encontrado' : 'Nenhum agendamento ainda'}
                  </h3>
                  <p className="empty-message">
                    {searchTerm || filtroStatus !== 'todos' 
                      ? 'Tente ajustar os filtros de busca' 
                      : 'Quando você fizer um agendamento, ele aparecerá aqui'}
                  </p>
                </div>
              ) : (
                <div className="agendamentos-list">
                  {agendamentosFiltrados.map((agendamento) => (
                    <div key={agendamento.id} className="agendamento-card">
                      <div className="agendamento-header">
                        <div className="agendamento-info">
                          <div className="agendamento-avatar">
                            <User size={20} />
                          </div>
                          <div className="agendamento-details">
                            <h3 className="agendamento-nome">{agendamento.nome}</h3>
                            <p className="agendamento-servico">{agendamento.servico}</p>
                          </div>
                        </div>
                        <span className={`status-badge ${getStatusColor(agendamento.status)}`}>
                          {getStatusLabel(agendamento.status)}
                        </span>
                      </div>

                      <div className="agendamento-meta">
                        <div className="meta-item">
                          <Calendar size={16} />
                          <span>{formatDate(agendamento.data)}</span>
                        </div>
                        <div className="meta-item">
                          <Clock size={16} />
                          <span>{agendamento.horario}</span>
                        </div>
                        <div className="meta-item">
                          <Phone size={16} />
                          <span>{agendamento.telefone}</span>
                        </div>
                        <div className="meta-item">
                          <Mail size={16} />
                          <span className="meta-email">{agendamento.email}</span>
                        </div>
                      </div>

                      {agendamento.observacoes && (
                        <div className="agendamento-observacoes">
                          <div className="observacoes-content">
                            <FileText size={16} />
                            <div className="observacoes-text">
                              <p className="observacoes-label">Observações:</p>
                              <p className="observacoes-value">{agendamento.observacoes}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}