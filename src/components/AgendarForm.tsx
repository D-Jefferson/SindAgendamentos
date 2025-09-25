import React, { useState, useEffect  } from 'react';
import { MapPin, Calendar, Clock, User, Phone, Mail, FileText, ArrowLeft, Check } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Agendamento } from '../types';
import '../styles/agendar.css';

const somenteDigitos = (v: string) => v.replace(/\D/g, "");

export const formatarCpf = (v: string) => {
  const d = somenteDigitos(v).slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0,3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6)}`;
  return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6,9)}-${d.slice(9,11)}`;
};

export const validarCpf = (cpf: string) => {
  const s = somenteDigitos(cpf);
  if (s.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(s)) return false;
  const dv = (base: string, fator: number) => {
    let t = 0;
    for (let i = 0; i < base.length; i++) t += +base[i] * (fator - i);
    const r = t % 11;
    return r < 2 ? 0 : 11 - r;
  };
  return dv(s.slice(0,9),10) === +s[9] && dv(s.slice(0,10),11) === +s[10];
};


export function AgendarForm() {
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const { setCurrentView, agendamentos, setAgendamentos } = useApp();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showInfoPopup, setShowInfoPopup] = useState(true);
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [canClosePopup, setCanClosePopup] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    cpf: '',
    data: '',
    horario: '',
    cidade: ''
  });

  const horarios = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ];

  React.useEffect(() => {
    if (showInfoPopup) {
      const timer = setTimeout(() => {
        setCanClosePopup(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showInfoPopup]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarCpf(formData.cpf)) {
      alert("CPF inválido. Verifique os dados.");
      return;
    }

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
      const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "cpf" ? formatarCpf(value) : value,
    }));
  };

  const handleClosePopup = () => {
    if (canClosePopup) {
      setShowInfoPopup(false);
    }
  };

const [statusLoc, setStatusLoc] = useState<string | null>(null);
const [permLoc, setPermLoc] = useState(true);
const [cep, setCep] = useState("");

useEffect(() => {
    if (!("geolocation" in navigator)) {
      setPermLoc(false);
      setStatusLoc("Geolocalização indisponível");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const resp = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const data = await resp.json();
          const a = data.address || {};
          const cidade = a.city || a.town || a.village || a.municipality || "";
          const uf = a.state || "";
          const label = [cidade, uf].filter(Boolean).join(" - ") || "Cidade não detectada";
          setPermLoc(true);
          setStatusLoc(null);
          setFormData((p) => ({ ...p, cidade: label }));
        } catch {
          setPermLoc(true);
          setStatusLoc("Cidade não detectada");
        }
      },
      (err) => {
        setPermLoc(false);
        setStatusLoc(
          err.code === err.PERMISSION_DENIED ? "Permissão de localização negada" : "Erro ao obter localização"
        );
      },
      { timeout: 8000 }
    );
  }, [setFormData]);

  const maskCep = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 8);
    if (d.length > 5) return `${d.slice(0,5)}-${d.slice(5)}`;
    return d;
  };

  useEffect(() => {
    const d = cep.replace(/\D/g, "");
    if (d.length !== 8) return;

    (async () => {
      try {
        const r = await fetch(`https://viacep.com.br/ws/${d}/json/`);
        const j = await r.json();
        if (j.erro) {
          setStatusLoc("CEP inválido");
          return;
        }
        const cidade = j.localidade || "";
        const uf = j.uf || "";
        const label = [cidade, uf].filter(Boolean).join(" - ");
        setStatusLoc(null);
        setFormData((p) => ({ ...p, cidade: label }));
      } catch {
        setStatusLoc("Falha ao consultar CEP");
      }
    })();
  }, [cep, setFormData]);

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

  if (showInfoPopup) {
    return (
      <>
        <div className="popup-overlay">
          <div className="popup-container">
            <div className="popup-content">
              <div className="popup-icon">
                <FileText size={32} />
              </div>
              <h2 className="popup-title">Informações Importantes</h2>
              <div className="popup-message">
                <p className="popup-text">
                  Para realizar seu agendamento, é necessário preencher <strong>todas as informações corretamente</strong>.
                </p>
                <p className="popup-text popup-highlight">
                  O <strong>e-mail é de suma importância</strong> para confirmação e comunicação sobre seu agendamento.
                </p>
                <p className="popup-text">
                  Permita a <strong>localização do seu dispositivo</strong> para facilitar o preenchimento da cidade.
                </p>
                <p className="popup-text">
                  Certifique-se de que todos os dados estão corretos antes de confirmar.
                </p>
              </div>
              <button
                onClick={handleClosePopup}
                disabled={!canClosePopup}
                className={`popup-button ${canClosePopup ? 'popup-button-enabled' : 'popup-button-disabled'}`}
              >
                {canClosePopup ? 'OK, Entendi' : `Aguarde...`}
              </button>
              {!canClosePopup && (
                <div className="popup-timer">
                  <div className="timer-bar"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
  
  if (showTermsPopup) {
    return (
      <div className="popup-overlay">
        <div className="popup-container">
          <div className="popup-content">
            <div className="popup-icon">
              <FileText size={32} />
            </div>
            <h2 className="popup-title">Termos e Condições & LGPD</h2>

            <div className="popup-message termos-texto">
              <p>
                Ao utilizar este sistema, você concorda com os{" "}
                <strong>Termos e Condições</strong> de uso, que definem as regras
                para utilização da plataforma, responsabilidades e limitações.
              </p>
              <p>
                Em conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD)</strong>,
                seus dados pessoais serão coletados e tratados apenas para fins
                relacionados ao agendamento de serviços, respeitando a
                confidencialidade e segurança.
              </p>
              <p>
                Você tem o direito de solicitar a correção, exclusão ou acesso aos
                seus dados pessoais a qualquer momento, conforme previsto na lei.
              </p>
            </div>

            <button
              onClick={() => setShowTermsPopup(false)}
              className="popup-button popup-button-enabled"
            >
              Li e Concordo
            </button>
          </div>
        </div>
      </div>
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

              <div className="form-row">
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

                  <div className="form-group">
                    <label className="form-label" htmlFor="cpf">
                      <FileText size={16} />
                      <span>CPF</span>
                    </label>

                    <input
                      id="cpf"
                      type="text"
                      name="cpf"
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="000.000.000-00"
                      value={formData.cpf}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, cpf: formatarCpf(e.target.value) }))
                      }
                      maxLength={14}
                      required
                      className={`form-input ${formData.cpf && !validarCpf(formData.cpf) ? "input-error" : ""}`}
                    />

                    {formData.cpf && !validarCpf(formData.cpf) && (
                      <small className="error-text" style={{ color: "red" }}>CPF inválido!</small>
                    )}
                  </div>
                </div>

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
                <label className="form-label" htmlFor="cidade">
                  <MapPin size={16} />
                  <span>Cidade</span>
                </label>

                <input
                  id="cidade"
                  type="text"
                  name="cidade"
                  value={formData.cidade || statusLoc || "Detectando cidade..."}
                  readOnly
                  className="form-input"
                />

                {!permLoc && (
                  <small className="form-hint">
                    Localização bloqueada pelo navegador. Informe seu CEP abaixo para detectarmos a cidade.
                  </small>
                )}

                {!permLoc && (
                  <input
                    type="text"
                    name="cep"
                    placeholder="Digite seu CEP (somente números)"
                    value={cep}
                    onChange={(e) => setCep(maskCep(e.target.value))}
                    maxLength={9}  
                    className="form-input"
                  />
                )}
              </div>

              <div className="form-group checkbox-termos">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={aceitouTermos}
                    onChange={(e) => setAceitouTermos(e.target.checked)}
                    required
                  />
                  <span style={{ marginLeft: '8px' }}>
                    Li e aceito os{" "}
                    <button
                      type="button"
                      className="termos-link"
                      onClick={() => setShowTermsPopup(true)}
                    >
                      termos e condições
                    </button>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={!aceitouTermos}
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