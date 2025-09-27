import React from "react";
import { CheckCircle } from "lucide-react";
import "../../styles/agendar.css";


interface ConfirmacaoPopupProps {
  onClose: () => void;
  data: {
    citizenCep: string;
    citizenCity: string;
    citizenCpf: string;
    citizenEmail: string;
    citizenName: string;
    citizenTelePhone: string;
    desiredDateTime: string;
    servicePointId: number;
  };
}

export default function ConfirmPopup({ onClose, data }: ConfirmacaoPopupProps) {
  const {
    citizenName,
    desiredDateTime,
    servicePointId,
    citizenCpf,
  } = data;

  const dateFormatted = new Date(desiredDateTime).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  const address =
    servicePointId === 1
      ? {
          local:
            "Av. Tancredo Neves, 969 - Caminho das Árvores, Salvador - BA, 41820-021",
          complemento: "Edifício Metropolitan Center, 8º andar",
          telefone: "(71) 3995-0185",
        }
      : null;

  return (
    <div className="popup-overlay">
      <div className="popup-container-sucess popup-success">
        <div className="popup-content">

          <div className="popup-icon success-icon">
            <CheckCircle size={42} />
          </div>

          <h2 className="popup-title success-title">
            Agendamento Confirmado!
          </h2>

          <div className="popup-message">
            <p className="popup-text">
              Seu agendamento foi registrado com sucesso. Confira os detalhes abaixo:
            </p>
            <p><strong>Nome:</strong> {citizenName}</p>
              <p><strong>CPF:</strong> {citizenCpf}</p>
              <div className="popup-text popup-oth">
                <p><strong>Data e horário:</strong> {dateFormatted}</p>
                </div>
            {address && (  
              <div className="popup-text popup-highlight">
                <p className="popup-text">
                  <strong>Endereço:</strong> {address.local} {address.complemento}
                  <p></p><strong>Telefone:</strong> {address.telefone}
                </p>
              </div>
            )}

            <p className="popup-text">
              <strong>Documentos necessários:</strong>
            </p>
            <ul className="popup-list">
              <li>Certidão de nascimento ou casamento</li>
              <li>CPF</li>
              <li>É necessário saber o CEP</li>
            </ul>

            <p className="popup-text">
              <strong>Documentos opcionais:</strong>
            </p>
            <ul className="popup-info-grid">
              <li>Título de eleitor</li>
              <li>CNH</li>
              <li>PIS</li>
              <li>Identidade Profissional</li>
              <li>Reservista (para homens)</li>
              <li>Exame do fator RH</li>
            </ul>

            <p className="popup-text popup-highlight">
              <strong>Políticas de cancelamento e atrasos:</strong> Em caso de imprevistos, solicitamos que comunique com antecedência para liberar o horário para outro cidadão.
            </p>
          </div>

          <button onClick={onClose} className="popup-button popup-button-enabled success-button">
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
}
