import React, { useState, useMemo } from 'react';
import { BarChart3, ArrowLeft, Calendar, TrendingUp, Users, FileText } from 'lucide-react';
import { useApp } from '../contexts/AppContext'; 
import '../styles/admin.css';

export function AdminPanel() {
  const { setCurrentView, agendamentos } = useApp();
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

  return (
    <>
      <div className="admin-container">
        <div className="admin-wrapper">
          <div className="admin-card">
            <div className="admin-header">
              <button
                onClick={() => setCurrentView('home')}
                className="back-button"
              >
                <ArrowLeft size={20} />
                <span>Voltar</span>
              </button>
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

    </>
  );
}