import React, { useState, useEffect  } from 'react';
import { MapPin, Calendar, Clock, User, Phone, Mail, FileText, ArrowLeft, Check } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import '../styles/agendar.css';
import InfoPopup from "../components/Popup/InfoPopup";
import TermsPopup from "../components/Popup/TermosPopup"; 
import ConfirmPopup from "../components/Popup/ConfirmPopup"; 

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
  const { setCurrentView } = useApp();
  const [confirmationData, setConfirmationData] = useState<any | null>(null);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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

  const cidadefill = (formData.cidade || "").trim();
  const servicePoints: Record<string, number> = {
    "Salvador - BA": 1,
    "Feira de Santana - BA": 2,
    "Vitória da Conquista - BA": 3,
    "XiqueXique - BA": 4,
    "Lauro de Freitas - BA": 5
  };
  

  const [horarios, setHorarios] = useState<{ slotId: number; time: string }[]>([]);

  useEffect(() => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const cidade = (formData.cidade || "").trim();
    const servicePointId = servicePoints[cidade];

    if (!formData.data || !servicePointId) return;

    const buscarHorarios = async () => {
      try {
        const resp = await fetch(
          `${API_BASE_URL}/api/available-slots?date=${formData.data}&servicePointId=${servicePointId}`
        );
        if (!resp.ok) {
          setHorarios([]);
          return;
        }
        const data = await resp.json();
        setHorarios(data);
      } catch (err) {
        console.error("Erro ao carregar horários:", err);
        setHorarios([]);
      }
    };

    buscarHorarios();
  }, [formData.data, formData.cidade]);


  React.useEffect(() => {
    if (showInfoPopup) {
      const timer = setTimeout(() => {
        setCanClosePopup(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showInfoPopup]);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validarCpf(formData.cpf)) {
    alert("CPF inválido. Verifique os dados.");
    return;
  }

  const payload = {
    citizenName: formData.nome,
    citizenCpf: formData.cpf.replace(/\D/g, ""),
    citizenEmail: formData.email,
    citizenTelePhone: formData.telefone,
    citizenCep: cep.replace(/\D/g, ""),
    citizenCity: formData.cidade,
    desiredDateTime: `${formData.data}T${formData.horario}:00Z`,
    servicePointId: servicePoints[cidadefill]
  };
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 

  try {
      const resp = await fetch(
        `${API_BASE_URL}/api/appointments/by-date`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    if (!resp.ok) {
      const errorData = await resp.json();
      const message = errorData.message || "Erro desconhecido. Tente novamente.";
      setErrorMessage(message);
      setShowErrorPopup(true);
    return;
    }

  const data = await resp.json();
  console.log("Agendamento criado:", data);
  setConfirmationData(payload);



  } catch (error: any) {
  console.error(error);
  const message =
    error?.response?.data?.message ||
    error?.message ||
    "Erro desconhecido. Tente novamente.";
  setErrorMessage(message);
  setShowErrorPopup(true);
  }
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
          const label = (`${cidade} - BA`) || "Cidade não detectada";
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

  if (confirmationData) {
    return (
      <ConfirmPopup
        data={confirmationData}
        onClose={() => setConfirmationData(null)}
      />
    );
  }


  if (showErrorPopup) {
    return (
      <div className="popup-overlay">
        <div className="popup-container">
          <div className="popup-content">
            <h2 className="popup-title">Falha no agendamento</h2>
            <p className="popup-text">
              {errorMessage || "Não foi possível concluir o agendamento. Tente novamente."}
            </p>
            <button
              onClick={() => setShowErrorPopup(false)}
              className="popup-button popup-button-enabled"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    );
  }


if (showInfoPopup) {
  return (
    <InfoPopup
      canClose={canClosePopup}
      onClose={handleClosePopup}
    />
  );
}

if (showTermsPopup) {
  return <TermsPopup onClose={() => setShowTermsPopup(false)} />;
}
const cidadeValida = formData.cidade && !statusLoc;
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
                    maxLength={11}
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
                      disabled={!cidadeValida}
                      className={`form-input ${
                        !cidadeValida ? "bg-gray-200 text-gray-500 cursor-not-allowed" : ""
                      }`}
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
                      disabled={!cidadeValida}
                      className={`form-select ${
                        !cidadeValida ? "bg-gray-200 text-gray-500 cursor-not-allowed" : ""
                      }`}
                    >
                      <option value="">Selecione um horário</option>
                      {horarios.length > 0 ? (
                        horarios.map((h) => (
                          <option key={h.slotId} value={h.time}>
                            {h.time}
                          </option>
                        ))
                      ) : (
                        <option disabled>Nenhum horário disponível</option>
                      )}
                    </select>
                </div>
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
                      Termos e Condições
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