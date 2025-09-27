import React, { useState, useMemo } from 'react';
import { BarChart3, ArrowLeft, Calendar, TrendingUp, Users, FileText, LogOut } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export function AdminPanel() {
  const { setCurrentView, agendamentos, setIsAdminLoggedIn } = useApp();
  const [tipoRelatorio, setTipoRelatorio] = useState<'diario' | 'semanal' | 'mensal'>('diario');
  const [dataInicio, setDataInicio] = useState(new Date().toISOString().split('T')[0]);

  const relatorios = useMemo(() => {
    const hoje = new Date();
    const inicioData = new Date(dataInicio);
    
    let dataFim: Date;
    
    switch (tipoRelatorio) {
      case 'diario':
        dataFim = new Date(inicioData);
        dataFim.setDate(inicioData.getDate() + 1);
        break;
      case 'semanal':
        dataFim = new Date(inicioData);
        dataFim.setDate(inicioData.getDate() + 7);
        break;
      case 'mensal':
        dataFim = new Date(inicioData);
        dataFim.setMonth(inicioData.getMonth() + 1);
        break;
    }

    const agendamentosFiltrados = agendamentos.filter(agendamento => {
      const dataAgendamento = new Date(agendamento.data);
      return dataAgendamento >= inicioData && dataAgendamento < dataFim;
    });

    const porStatus = agendamentosFiltrados.reduce((acc, agendamento) => {
      acc[agendamento.status] = (acc[agendamento.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const porServico = agendamentosFiltrados.reduce((acc, agendamento) => {
      acc[agendamento.servico] = (acc[agendamento.servico] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: agendamentosFiltrados.length,
      agendamentos: agendamentosFiltrados,
      porStatus,
      porServico
    };
  }, [agendamentos, tipoRelatorio, dataInicio]);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'agendado': return 'Agendado';
      case 'confirmado': return 'Confirmado';
      case 'cancelado': return 'Cancelado';
      case 'concluido': return 'Concluído';
      default: return status;
    }
  };

  const exportarRelatorio = () => {
    const dados = relatorios.agendamentos.map(a => ({
      Nome: a.nome,
      Telefone: a.telefone,
      Email: a.email,
      Serviço: a.servico,
      Data: new Date(a.data).toLocaleDateString('pt-BR'),
      Horário: a.horario,
      Status: getStatusLabel(a.status),
      Observações: a.observacoes || ''
    }));

    const csv = [
      Object.keys(dados[0] || {}).join(','),
      ...dados.map(item => Object.values(item).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-${tipoRelatorio}-${dataInicio}.csv`;
    a.click();
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setCurrentView('home');
  };

  return (
    <>
      <div className="admin-container">
        <div className="admin-wrapper">
          <div className="admin-card">
            <div className="admin-header">
              <div className="admin-header-actions">
                <button
                  onClick={() => setCurrentView('home')}
                  className="back-button"
                >
                  <ArrowLeft size={20} />
                  <span>Voltar</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="logout-button"
                >
                  <LogOut size={20} />
                  <span>Sair</span>
                </button>
              </div>
              <h1 className="admin-title">Painel Administrativo</h1>
              <p className="admin-subtitle">Relatórios e estatísticas dos agendamentos</p>
            </div>

            <div className="admin-body">
              <div className="admin-filters">
                <div className="filter-group">
                  <label className="filter-label">
                    Tipo de Relatório
                  </label>
                  <select
                    value={tipoRelatorio}
                    onChange={(e) => setTipoRelatorio(e.target.value as any)}
                    className="filter-select"
                  >
                    <option value="diario">Diário</option>
                    <option value="semanal">Semanal</option>
                    <option value="mensal">Mensal</option>
                  </select>
                </div>
                
                <div className="filter-group">
                  <label className="filter-label">
                    Data de Início
                  </label>
                  <input
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                    className="filter-input"
                  />
                </div>

                <div className="export-group">
                  <button
                    onClick={exportarRelatorio}
                    disabled={relatorios.total === 0}
                    className="export-button"
                  >
                    Exportar CSV
                  </button>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stats-card stats-card-blue">
                  <div className="stats-content">
                    <Calendar className="stats-icon" />
                    <div className="stats-info">
                      <p className="stats-label">Total de Agendamentos</p>
                      <p className="stats-value">{relatorios.total}</p>
                    </div>
                  </div>
                </div>

                <div className="stats-card stats-card-green">
                  <div className="stats-content">
                    <TrendingUp className="stats-icon" />
                    <div className="stats-info">
                      <p className="stats-label">Confirmados</p>
                      <p className="stats-value">{relatorios.porStatus.confirmado || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="stats-card stats-card-yellow">
                  <div className="stats-content">
                    <Users className="stats-icon" />
                    <div className="stats-info">
                      <p className="stats-label">Agendados</p>
                      <p className="stats-value">{relatorios.porStatus.agendado || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="stats-card stats-card-purple">
                  <div className="stats-content">
                    <BarChart3 className="stats-icon" />
                    <div className="stats-info">
                      <p className="stats-label">Concluídos</p>
                      <p className="stats-value">{relatorios.porStatus.concluido || 0}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="charts-grid">
                <div className="chart-card">
                  <h3 className="chart-title">Por Status</h3>
                  {Object.keys(relatorios.porStatus).length === 0 ? (
                    <p className="chart-empty">Nenhum dado disponível</p>
                  ) : (
                    <div className="chart-content">
                      {Object.entries(relatorios.porStatus).map(([status, count]) => (
                        <div key={status} className="chart-item">
                          <div className="chart-item-info">
                            <div className={`chart-dot chart-dot-${status}`}></div>
                            <span className="chart-item-label">{getStatusLabel(status)}</span>
                          </div>
                          <span className="chart-item-value">{count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="chart-card">
                  <h3 className="chart-title">Por Serviço</h3>
                  {Object.keys(relatorios.porServico).length === 0 ? (
                    <p className="chart-empty">Nenhum dado disponível</p>
                  ) : (
                    <div className="chart-content">
                      {Object.entries(relatorios.porServico).map(([servico, count]) => (
                        <div key={servico} className="chart-item">
                          <span className="chart-item-label chart-item-truncate">{servico}</span>
                          <span className="chart-item-value">{count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {relatorios.agendamentos.length > 0 && (
                <div className="table-section">
                  <h3 className="table-title">Detalhes dos Agendamentos</h3>
                  <div className="table-container">
                    <div className="table-wrapper">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Cliente</th>
                            <th>Serviço</th>
                            <th>Data/Hora</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {relatorios.agendamentos.map((agendamento) => (
                            <tr key={agendamento.id}>
                              <td>
                                <div className="table-client">
                                  <div className="table-client-name">{agendamento.nome}</div>
                                  <div className="table-client-phone">{agendamento.telefone}</div>
                                </div>
                              </td>
                              <td>
                                <div className="table-service">{agendamento.servico}</div>
                              </td>
                              <td>
                                <div className="table-datetime">
                                  {new Date(agendamento.data).toLocaleDateString('pt-BR')} às {agendamento.horario}
                                </div>
                              </td>
                              <td>
                                <span className={`table-status table-status-${agendamento.status}`}>
                                  {getStatusLabel(agendamento.status)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .admin-container {
          min-height: 100vh;
          background-color: #f9fafb;
          padding: 2rem 0;
          background-image: url('https://frotas.localiza.com/wp-content/uploads/maos-no-volante-dirigindo-carro-na-estrada.jpg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          padding-top: 70px;
        }
        
        .admin-wrapper {
          max-width: 72rem;
          margin: 0 auto;
          padding: 0 1rem;
        }
        
        .admin-card {
          background-color: white;
          border-radius: 1rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        
        .admin-header {
          background-color: #dc2626;
          color: white;
          padding: 1.5rem;
          border-radius: 1rem 1rem 0 0;
        }
        
        .admin-header-actions {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        
        .back-button, .logout-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.8);
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.15s ease;
        }
        
        .back-button:hover, .logout-button:hover {
          color: white;
        }
        
        .admin-title {
          font-size: 1.875rem;
          font-weight: bold;
        }
        
        .admin-subtitle {
          color: #fee2e2;
          margin-top: 0.5rem;
        }
        
        .admin-body {
          padding: 1.5rem;
        }
        
        .admin-filters {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .filter-group {
          display: flex;
          flex-direction: column;
        }
        
        .filter-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.5rem;
        }
        
        .filter-select, .filter-input {
          padding: 0.5rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          background-color: white;
        }
        
        .filter-select {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0.5rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
          padding-right: 2.5rem;
        }
        
        .filter-select:focus, .filter-input:focus {
          outline: none;
          border-color: #ef4444;
          box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
        }
        
        .export-group {
          display: flex;
          align-items: flex-end;
        }
        
        .export-button {
          padding: 0.5rem 1rem;
          background-color: #16a34a;
          color: white;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }
        
        .export-button:hover:not(:disabled) {
          background-color: #15803d;
        }
        
        .export-button:disabled {
          background-color: #d1d5db;
          cursor: not-allowed;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .stats-card {
          border-radius: 0.5rem;
          padding: 1.5rem;
          color: white;
        }
        
        .stats-card-blue {
          background: linear-gradient(to right, #3b82f6, #2563eb);
        }
        
        .stats-card-green {
          background: linear-gradient(to right, #22c55e, #16a34a);
        }
        
        .stats-card-yellow {
          background: linear-gradient(to right, #eab308, #ca8a04);
        }
        
        .stats-card-purple {
          background: linear-gradient(to right, #a855f7, #9333ea);
        }
        
        .stats-content {
          display: flex;
          align-items: center;
        }
        
        .stats-icon {
          width: 2rem;
          height: 2rem;
        }
        
        .stats-info {
          margin-left: 1rem;
        }
        
        .stats-label {
          font-size: 0.875rem;
          font-weight: 500;
          opacity: 0.9;
        }
        
        .stats-value {
          font-size: 1.5rem;
          font-weight: bold;
        }
        
        .charts-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .chart-card {
          background-color: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 1.5rem;
        }
        
        .chart-title {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        
        .chart-empty {
          color: #6b7280;
          text-align: center;
          padding: 2rem 0;
        }
        
        .chart-content {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .chart-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .chart-item-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .chart-dot {
          width: 1rem;
          height: 1rem;
          border-radius: 50%;
        }
        
        .chart-dot-agendado {
          background-color: #3b82f6;
        }
        
        .chart-dot-confirmado {
          background-color: #22c55e;
        }
        
        .chart-dot-cancelado {
          background-color: #ef4444;
        }
        
        .chart-dot-concluido {
          background-color: #6b7280;
        }
        
        .chart-item-label {
          font-size: 0.875rem;
          font-weight: 500;
        }
        
        .chart-item-truncate {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-right: 0.5rem;
        }
        
        .chart-item-value {
          font-size: 1.125rem;
          font-weight: bold;
        }
        
        .table-section {
          margin-top: 2rem;
        }
        
        .table-title {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        
        .table-container {
          background-color: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          overflow: hidden;
        }
        
        .table-wrapper {
          overflow-x: auto;
        }
        
        .table {
          min-width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }
        
        .table th {
          padding: 0.75rem 1.5rem;
          text-align: left;
          font-size: 0.75rem;
          font-weight: 500;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          background-color: #f9fafb;
        }
        
        .table td {
          padding: 1rem 1.5rem;
          white-space: nowrap;
          border-top: 1px solid #e5e7eb;
        }
        
        .table tbody {
          background-color: white;
        }
        
        .table-client-name {
          font-size: 0.875rem;
          font-weight: 500;
          color: #111827;
        }
        
        .table-client-phone {
          font-size: 0.875rem;
          color: #6b7280;
        }
        
        .table-service {
          font-size: 0.875rem;
          color: #111827;
        }
        
        .table-datetime {
          font-size: 0.875rem;
          color: #111827;
        }
        
        .table-status {
          padding: 0.125rem 0.5rem;
          display: inline-flex;
          font-size: 0.75rem;
          line-height: 1.25rem;
          font-weight: 600;
          border-radius: 9999px;
        }
        
        .table-status-confirmado {
          background-color: #dcfce7;
          color: #166534;
        }
        
        .table-status-agendado {
          background-color: #dbeafe;
          color: #1e40af;
        }
        
        .table-status-cancelado {
          background-color: #fee2e2;
          color: #991b1b;
        }
        
        .table-status-concluido {
          background-color: #f3f4f6;
          color: #374151;
        }
        
        @media (min-width: 768px) {
          .admin-filters {
            flex-direction: row;
          }
          
          .stats-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        
        @media (min-width: 1024px) {
          .charts-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </>
  );
}