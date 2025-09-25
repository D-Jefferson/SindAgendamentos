import React, { useMemo, useState } from "react";
import { Search, ArrowLeft, Calendar, Clock, User, Phone, Mail, FileText, ShieldCheck, Loader2 } from "lucide-react";
import { useApp } from "../contexts/AppContext";
import "../styles/consulta.css";

function somenteDigitos(v: string) {
  return v.replace(/\D/g, "");
}

function formatarCpf(v: string) {
  const d = somenteDigitos(v).slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9, 11)}`;
}

function validarCpf(cpf: string) {
  const s = somenteDigitos(cpf);
  if (s.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(s)) return false;
  const calcDV = (base: string, fator: number) => {
    let total = 0;
    for (let i = 0; i < base.length; i++) total += parseInt(base[i], 10) * (fator - i);
    const resto = total % 11;
    return resto < 2 ? 0 : 11 - resto;
  };
  const dv1 = calcDV(s.slice(0, 9), 10);
  const dv2 = calcDV(s.slice(0, 10), 11);
  return dv1 === parseInt(s[9], 10) && dv2 === parseInt(s[10], 10);
}

interface Agendamento {
  id: string | number;
  nome: string;
  servico: string;
  data: string;
  horario: string;
  telefone: string;
  email: string;
  observacoes?: string;
  status: "agendado" | "confirmado" | "cancelado" | "concluido" | string;
  cpf?: string;
}

export function ConsultarAgendamentos() {
  const { setCurrentView, agendamentos } = useApp();

  const [cpf, setCpf] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<Agendamento | null>(null);

  const cpfValido = useMemo(() => validarCpf(cpf), [cpf]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "agendado":
        return "status-agendado";
      case "confirmado":
        return "status-confirmado";
      case "cancelado":
        return "status-cancelado";
      case "concluido":
        return "status-concluido";
      default:
        return "status-concluido";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "agendado":
        return "Agendado";
      case "confirmado":
        return "Confirmado";
      case "cancelado":
        return "Cancelado";
      case "concluido":
        return "Concluído";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  async function consultarAgendamento(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setResultado(null);

    if (!cpfValido) {
      setErro("CPF inválido. Verifique os dígitos.");
      return;
    }

    setLoading(true);
    try {
      const sCpf = somenteDigitos(cpf);
      const local = (agendamentos as Agendamento[]).find(
        (a) => a.cpf && somenteDigitos(a.cpf) === sCpf
      );

      if (local) {
        setResultado(local);
        return;
      }
      const res = await fetch("/api/agendamentos/consultar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cpf: sCpf }),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Não foi possível localizar o agendamento ou ocorreu um erro.");
      }

      const data: { agendamento?: Agendamento } = await res.json();

      if (!data?.agendamento) {
        setErro("Nenhum agendamento encontrado para este CPF.");
      } else {
        setResultado(data.agendamento);
      }
    } catch (err: any) {
      setErro(err?.message ?? "Erro ao consultar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="consultar-container">
      <div className="consultar-wrapper">
        <div className="consultar-card">
          <div className="consultar-header">
            <button onClick={() => setCurrentView("home")} className="back-button">
              <ArrowLeft size={20} />
              <span>Voltar</span>
            </button>
            <h1 className="consultar-title">Consultar Agendamento</h1>
            <p className="consultar-subtitle">Informe seu CPF para verificar o status</p>
          </div>

          <div className="consultar-body">
            <form className="filters" onSubmit={consultarAgendamento} autoComplete="off" noValidate>
              <div className="search-container">
                <div className={`search-wrapper ${cpfValido ? "ok" : ""}`}>
                  <ShieldCheck className="search-icon" size={20} />
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="new-password"
                    placeholder="Digite seu CPF"
                    value={formatarCpf(cpf)}
                    onChange={(e) => setCpf(e.target.value)}
                    className="search-input"
                    aria-label="CPF"
                    maxLength={14}
                  />
                </div>
              </div>

              <div className="filter-container">
                <button
                  type="submit"
                  className="consultar-button"
                  disabled={!cpfValido || loading}
                  aria-disabled={!cpfValido || loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="spin" size={18} /> Consultando...
                    </>
                  ) : (
                    <>
                      <Search size={18} /> Consultar
                    </>
                  )}
                </button>
              </div>
            </form>

            {erro && (
              <div className="error-state" role="alert">
                <p>{erro}</p>
              </div>
            )}

            {!erro && !loading && resultado && (
              <div className="agendamentos-list">
                <div className="agendamento-card">
                  <div className="agendamento-header">
                    <div className="agendamento-info">
                      <div className="agendamento-avatar">
                        <User size={20} />
                      </div>
                      <div className="agendamento-details">
                        <h3 className="agendamento-nome">{resultado.nome}</h3>
                        <p className="agendamento-servico">{resultado.servico}</p>
                      </div>
                    </div>
                    <span className={`status-badge ${getStatusColor(resultado.status)}`}>
                      {getStatusLabel(resultado.status)}
                    </span>
                  </div>

                  <div className="agendamento-meta">
                    <div className="meta-item">
                      <Calendar size={16} />
                      <span>{formatDate(resultado.data)}</span>
                    </div>
                    <div className="meta-item">
                      <Clock size={16} />
                      <span>{resultado.horario}</span>
                    </div>
                    <div className="meta-item">
                      <Phone size={16} />
                      <span>{resultado.telefone}</span>
                    </div>
                    <div className="meta-item">
                      <Mail size={16} />
                      <span className="meta-email">{resultado.email}</span>
                    </div>
                  </div>

                  {resultado.observacoes && (
                    <div className="agendamento-observacoes">
                      <div className="observacoes-content">
                        <FileText size={16} />
                        <div className="observacoes-text">
                          <p className="observacoes-label">Observações:</p>
                          <p className="observacoes-value">{resultado.observacoes}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {!erro && !loading && !resultado && (
              <div className="empty-state">
                <Calendar className="empty-icon" />
                <h3 className="empty-title">Digite o CPF e clique em Consultar</h3>
                <p className="empty-message">A consulta é individual e segura. Seus dados não ficam salvos no navegador.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
