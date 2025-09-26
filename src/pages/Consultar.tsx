import React, { useState } from 'react';
import { 
  Search, ArrowLeft, Calendar, Clock, User, Phone, Mail, FileText 
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import '../styles/consulta.css';

export function ConsultarAgendamentos() {
  const { setCurrentView, agendamentos } = useApp();
  const [cpf, setCpf] = useState('');
  const [agendamentosEncontrados, setAgendamentosEncontrados] = useState<any[]>([]);
  const [consultaRealizada, setConsultaRealizada] = useState(false);

  const handleConsultar = (e: React.FormEvent) => {
    e.preventDefault();
    const resultados = agendamentos.filter(agendamento =>
      agendamento.telefone.includes(cpf.replace(/\D/g, '')) ||
      agendamento.nome.toLowerCase().includes(cpf.toLowerCase())
    );
    setAgendamentosEncontrados(resultados);
    setConsultaRealizada(true);
  };

  const formatarCpf = (valor: string) => {
    const numeros = valor.replace(/\D/g, '');
    return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    const cpfFormatado = formatarCpf(valor);
    setCpf(cpfFormatado);
  };

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

  const novaConsulta = () => {
    setCpf('');
    setAgendamentosEncontrados([]);
    setConsultaRealizada(false);
  };

  return (
    <div className="consultar-container">
      <div className="consultar-left">
        <h1 className="consultar-highlight">
          Aqui você pode <br />
          <span>consultar seus agendamentos</span>
        </h1>
      </div>

      <div className="consultar-right">
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
              <p className="consultar-subtitle">
                Digite seu CPF para consultar seus agendamentos
              </p>
            </div>

            <div className="consultar-body">
              {!consultaRealizada ? (
                <div className="consulta-form">
                  <form onSubmit={handleConsultar} className="form-consulta">
                    <div className="form-group-consulta">
                      <label className="form-label-consulta">
                        <User size={20} />
                        <span>CPF</span>
                      </label>
                      <input
                        type="text"
                        value={cpf}
                        onChange={handleCpfChange}
                        required
                        maxLength={14}
                        className="form-input-consulta"
                        placeholder="000.000.000-00"
                      />
                    </div>
                    <button
                      type="submit"
                      className="consultar-button"
                      disabled={cpf.length < 14}
                    >
                      <Search size={20} />
                      <span>Consultar</span>
                    </button>
                  </form>
                </div>
              ) : (
                <div className="resultados-container">
                  <div className="resultados-header">
                    <h2 className="resultados-title">
                      {agendamentosEncontrados.length > 0
                        ? `${agendamentosEncontrados.length} agendamento(s) encontrado(s)`
                        : 'Nenhum agendamento encontrado'}
                    </h2>
                    <button 
                      onClick={novaConsulta} 
                      className="nova-consulta-button"
                    >
                      Nova Consulta
                    </button>
                  </div>

                  {agendamentosEncontrados.length === 0 ? (
                    <div className="empty-state">
                      <Calendar className="empty-icon" />
                      <h3 className="empty-title">Nenhum agendamento encontrado</h3>
                      <p className="empty-message">
                        Verifique se o CPF está correto ou se você possui agendamentos cadastrados.
                      </p>
                    </div>
                  ) : (
                    <div className="agendamentos-list">
                      {agendamentosEncontrados.map((agendamento) => (
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
                            <span 
                              className={`status-badge ${getStatusColor(agendamento.status)}`}
                            >
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
